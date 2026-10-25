import { Router, Response } from 'express';
import { db } from '../db/database.js';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// Submit an ownership claim
router.post('/', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { found_item_id, lost_item_id, proof_description, contact_phone } = req.body;

  if (!found_item_id || !proof_description || proof_description.trim().length < 10) {
    return res.status(400).json({
      error: 'Found item ID and detailed proof of ownership (at least 10 characters) are required.',
    });
  }

  const claimantId = req.user!.id;

  // Check found item existence and status
  const foundItem = db.get<any>('SELECT * FROM found_items WHERE id = ?', [Number(found_item_id)]);
  if (!foundItem) {
    return res.status(404).json({ error: 'Found item not found in system register' });
  }

  if (foundItem.status === 'RETURNED') {
    return res.status(400).json({ error: 'This item has already been verified and returned to its owner.' });
  }

  // Check if claimant already has an open claim on this item
  const existingClaim = db.get<any>(
    "SELECT id, status FROM claims WHERE found_item_id = ? AND claimant_id = ? AND status IN ('PENDING', 'UNDER_REVIEW')",
    [Number(found_item_id), claimantId]
  );

  if (existingClaim) {
    return res.status(409).json({
      error: 'You already have an active claim under review for this item.',
      claimId: existingClaim.id,
      status: existingClaim.status,
    });
  }

  const result = db.run(
    `INSERT INTO claims (found_item_id, lost_item_id, claimant_id, proof_description, contact_phone, status)
     VALUES (?, ?, ?, ?, ?, 'PENDING')`,
    [
      Number(found_item_id),
      lost_item_id ? Number(lost_item_id) : null,
      claimantId,
      proof_description.trim(),
      contact_phone ? contact_phone.trim() : req.user!.phone || null,
    ]
  );

  const claimId = result.lastInsertRowid;

  // Update item status to CLAIM_PENDING
  db.run("UPDATE found_items SET status = 'CLAIM_PENDING' WHERE id = ? AND status = 'UNCLAIMED'", [Number(found_item_id)]);

  // Activity log
  db.run(
    'INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)',
    [claimantId, 'SUBMIT_CLAIM', 'claims', claimId, `Submitted claim #${claimId} on found item #${found_item_id}`]
  );

  res.status(201).json({
    message: 'Ownership claim submitted successfully. Security personnel will review your proof.',
    claimId,
  });
});

// Get all claims made by current logged in user
router.get('/my', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;

  const claims = db.query<any>(
    `SELECT c.*, 
            fi.title as item_title, fi.location as found_location, fi.date_found, fi.photo_url,
            fi.storage_location, fi.status as item_status,
            cat.name as category_name,
            u.name as reviewer_name
     FROM claims c
     JOIN found_items fi ON c.found_item_id = fi.id
     JOIN categories cat ON fi.category_id = cat.id
     LEFT JOIN users u ON c.reviewer_id = u.id
     WHERE c.claimant_id = ?
     ORDER BY c.created_at DESC`,
    [userId]
  );

  res.json({ claims });
});

// Get claim details by ID
router.get('/:id', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const claimId = Number(req.params.id);
  const claim = db.get<any>(
    `SELECT c.*, 
            fi.title as item_title, fi.description as item_description, fi.location as found_location,
            fi.date_found, fi.photo_url, fi.storage_location, fi.status as item_status,
            fi.secret_identifying_details,
            cat.name as category_name,
            claimant.name as claimant_name, claimant.email as claimant_email, claimant.identifier as claimant_roll,
            claimant.department as claimant_dept,
            reviewer.name as reviewer_name
     FROM claims c
     JOIN found_items fi ON c.found_item_id = fi.id
     JOIN categories cat ON fi.category_id = cat.id
     JOIN users claimant ON c.claimant_id = claimant.id
     LEFT JOIN users reviewer ON c.reviewer_id = reviewer.id
     WHERE c.id = ?`,
    [claimId]
  );

  if (!claim) {
    return res.status(404).json({ error: 'Claim not found' });
  }

  const isStaff = req.user!.role === 'security_personnel' || req.user!.role === 'administrator';
  const isOwner = req.user!.id === claim.claimant_id;

  if (!isStaff && !isOwner) {
    return res.status(403).json({ error: 'Access denied: You cannot view claims submitted by other users' });
  }

  if (!isStaff) {
    delete claim.secret_identifying_details;
  }

  res.json({ claim });
});

export default router;
