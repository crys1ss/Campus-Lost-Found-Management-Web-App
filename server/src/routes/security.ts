import { Router, Response } from 'express';
import { db } from '../db/database.js';
import { authenticateToken, requireRole, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// Restrict all security endpoints to Security Personnel or Administrator
router.use(authenticateToken);
router.use(requireRole('security_personnel', 'administrator'));

// Security Dashboard Overview Stats & Worklists
router.get('/dashboard', (_req: AuthenticatedRequest, res: Response) => {
  const pendingClaims = db.query<any>(`
    SELECT c.*, 
           fi.title as item_title, fi.location as found_location, fi.date_found, fi.storage_location,
           fi.secret_identifying_details,
           cat.name as category_name,
           u.name as claimant_name, u.email as claimant_email, u.identifier as claimant_roll,
           u.phone as claimant_phone, u.department as claimant_dept
    FROM claims c
    JOIN found_items fi ON c.found_item_id = fi.id
    JOIN categories cat ON fi.category_id = cat.id
    JOIN users u ON c.claimant_id = u.id
    WHERE c.status IN ('PENDING', 'UNDER_REVIEW')
    ORDER BY c.created_at ASC
  `);

  const approvedPendingHandover = db.query<any>(`
    SELECT c.*, 
           fi.title as item_title, fi.storage_location, fi.photo_url,
           u.name as claimant_name, u.identifier as claimant_roll, u.phone as claimant_phone
    FROM claims c
    JOIN found_items fi ON c.found_item_id = fi.id
    JOIN users u ON c.claimant_id = u.id
    WHERE c.status = 'APPROVED' AND fi.status != 'RETURNED'
    ORDER BY c.reviewed_at DESC
  `);

  const custodyItems = db.query<any>(`
    SELECT fi.*, cat.name as category_name, cat.icon as category_icon, u.name as finder_name
    FROM found_items fi
    JOIN categories cat ON fi.category_id = cat.id
    LEFT JOIN users u ON fi.finder_id = u.id
    WHERE fi.status != 'RETURNED'
    ORDER BY fi.date_found DESC
  `);

  const recentReturns = db.query<any>(`
    SELECT rr.*, 
           fi.title as item_title, 
           u.name as receiver_name, u.identifier as receiver_roll,
           officer.name as officer_name
    FROM return_records rr
    JOIN found_items fi ON rr.found_item_id = fi.id
    JOIN users u ON rr.receiver_id = u.id
    JOIN users officer ON rr.handed_over_by = officer.id
    ORDER BY rr.return_date DESC
    LIMIT 10
  `);

  res.json({
    pendingClaims,
    approvedPendingHandover,
    custodyItems,
    recentReturns,
  });
});

// Review Claim (Approve or Reject with remarks)
router.put('/claims/:id/review', (req: AuthenticatedRequest, res: Response) => {
  const claimId = Number(req.params.id);
  const { status, remarks } = req.body;

  if (!['APPROVED', 'REJECTED', 'UNDER_REVIEW'].includes(status)) {
    return res.status(400).json({ error: 'Status must be APPROVED, REJECTED, or UNDER_REVIEW' });
  }

  const claim = db.get<any>('SELECT * FROM claims WHERE id = ?', [claimId]);
  if (!claim) {
    return res.status(404).json({ error: 'Claim record not found' });
  }

  const officerId = req.user!.id;

  db.transaction(() => {
    db.run(
      `UPDATE claims 
       SET status = ?, reviewer_id = ?, reviewer_remarks = ?, reviewed_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [status, officerId, remarks ? remarks.trim() : null, claimId]
    );

    if (status === 'APPROVED') {
      // Mark other pending claims on this item as REJECTED
      db.run(
        `UPDATE claims 
         SET status = 'REJECTED', reviewer_id = ?, reviewer_remarks = 'Another claim was verified and approved.', reviewed_at = CURRENT_TIMESTAMP
         WHERE found_item_id = ? AND id != ? AND status = 'PENDING'`,
        [officerId, claim.found_item_id, claimId]
      );
    } else if (status === 'REJECTED') {
      // If no other claims pending, revert item status to UNCLAIMED
      const otherClaims = db.get<{ count: number }>(
        "SELECT count(*) as count FROM claims WHERE found_item_id = ? AND status IN ('PENDING', 'APPROVED')",
        [claim.found_item_id]
      )?.count || 0;

      if (otherClaims === 0) {
        db.run("UPDATE found_items SET status = 'UNCLAIMED' WHERE id = ?", [claim.found_item_id]);
      }
    }

    db.run(
      'INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)',
      [officerId, `CLAIM_${status}`, 'claims', claimId, `Officer ${req.user!.name} marked claim #${claimId} as ${status}`]
    );
  });

  res.json({
    message: `Claim successfully updated to ${status}`,
    claimId,
    status,
  });
});

// Update Custody Storage Location & Notes
router.post('/custody/update', (req: AuthenticatedRequest, res: Response) => {
  const { found_item_id, storage_location, custody_status, notes } = req.body;

  if (!found_item_id || !storage_location) {
    return res.status(400).json({ error: 'Found item ID and storage location are required' });
  }

  const officerId = req.user!.id;

  db.transaction(() => {
    db.run(
      `UPDATE found_items 
       SET storage_location = ?, custody_status = COALESCE(?, custody_status), updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [storage_location.trim(), custody_status || null, Number(found_item_id)]
    );

    db.run(
      `INSERT INTO custody_records (found_item_id, officer_id, storage_location, action, notes)
       VALUES (?, ?, ?, 'LOCATION_UPDATED', ?)`,
      [Number(found_item_id), officerId, storage_location.trim(), notes ? notes.trim() : 'Relocated by security officer']
    );

    db.run(
      'INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)',
      [officerId, 'UPDATE_CUSTODY', 'found_items', Number(found_item_id), `Storage updated to ${storage_location}`]
    );
  });

  res.json({
    message: 'Custody details updated successfully',
    found_item_id,
    storage_location,
  });
});

// Process Formal Handover and Generate Return Record (TCL ACID Transaction)
router.post('/handover', (req: AuthenticatedRequest, res: Response) => {
  const { claim_id, receiver_id_proof, remarks } = req.body;

  if (!claim_id || !receiver_id_proof) {
    return res.status(400).json({ error: 'Claim ID and Receiver ID proof details are required for handover.' });
  }

  const claim = db.get<any>('SELECT * FROM claims WHERE id = ?', [Number(claim_id)]);
  if (!claim) {
    return res.status(404).json({ error: 'Claim record not found' });
  }

  if (claim.status !== 'APPROVED') {
    return res.status(400).json({ error: 'Cannot handover an item without an APPROVED claim.' });
  }

  const officerId = req.user!.id;
  const receiptNo = `REC-2026-NMIMS-${String(Math.floor(1000 + Math.random() * 9000))}`;

  try {
    const returnRecordId = db.transaction(() => {
      // 1. Mark found item as RETURNED
      db.run(
        "UPDATE found_items SET status = 'RETURNED', custody_status = 'RETURNED', updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [claim.found_item_id]
      );

      // 2. If claim had an associated lost item, mark it as RESOLVED
      if (claim.lost_item_id) {
        db.run(
          "UPDATE lost_items SET status = 'RESOLVED', updated_at = CURRENT_TIMESTAMP WHERE id = ?",
          [claim.lost_item_id]
        );
      }

      // 3. Mark any potential matches on this found item as CONFIRMED
      db.run(
        "UPDATE potential_matches SET status = 'CONFIRMED' WHERE found_item_id = ?",
        [claim.found_item_id]
      );

      // 4. Create formal return audit record
      const result = db.run(
        `INSERT INTO return_records (claim_id, found_item_id, receiver_id, handed_over_by, receiver_id_proof, receipt_no, remarks)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          claim.id,
          claim.found_item_id,
          claim.claimant_id,
          officerId,
          receiver_id_proof.trim(),
          receiptNo,
          remarks ? remarks.trim() : 'Item physically handed over and acknowledged by owner.',
        ]
      );

      // 5. Custody record
      db.run(
        `INSERT INTO custody_records (found_item_id, officer_id, storage_location, action, notes)
         VALUES (?, ?, 'HANDED_OVER_TO_STUDENT', 'HANDOVER_COMPLETE', ?)`,
        [claim.found_item_id, officerId, `Handed over under receipt ${receiptNo}`]
      );

      // 6. Activity log
      db.run(
        'INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)',
        [officerId, 'COMPLETE_HANDOVER', 'return_records', result.lastInsertRowid, `Handover receipt ${receiptNo} issued`]
      );

      return result.lastInsertRowid;
    });

    res.status(201).json({
      message: 'Item handover executed and return record generated successfully!',
      returnRecordId,
      receiptNo,
      returnDate: new Date().toISOString(),
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Handover transaction failed: ' + err.message });
  }
});

// Get Return Records Audit History
router.get('/returns', (_req: AuthenticatedRequest, res: Response) => {
  const returns = db.query<any>(`
    SELECT rr.*,
           fi.title as item_title, fi.color as item_color, fi.brand as item_brand,
           cat.name as category_name,
           claimant.name as receiver_name, claimant.email as receiver_email, claimant.identifier as receiver_roll,
           claimant.phone as receiver_phone,
           officer.name as officer_name, officer.identifier as officer_badge
    FROM return_records rr
    JOIN found_items fi ON rr.found_item_id = fi.id
    JOIN categories cat ON fi.category_id = cat.id
    JOIN users claimant ON rr.receiver_id = claimant.id
    JOIN users officer ON rr.handed_over_by = officer.id
    ORDER BY rr.return_date DESC
  `);

  res.json({ returns });
});

export default router;
