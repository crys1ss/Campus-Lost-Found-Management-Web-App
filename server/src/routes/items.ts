import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';
import { authenticateToken, optionalAuthenticate, AuthenticatedRequest } from '../middleware/auth.js';
import { calculateMatchScore } from '../utils/matcher.js';

const router = Router();

// Get Categories
router.get('/categories', (_req: Request, res: Response) => {
  const categories = db.query('SELECT * FROM categories ORDER BY name ASC');
  res.json({ categories });
});

// Overall Statistics
router.get('/stats', (_req: Request, res: Response) => {
  const lostCount = db.get<{ count: number }>('SELECT count(*) as count FROM lost_items')?.count || 0;
  const foundCount = db.get<{ count: number }>('SELECT count(*) as count FROM found_items')?.count || 0;
  const returnedCount = db.get<{ count: number }>("SELECT count(*) as count FROM found_items WHERE status = 'RETURNED'")?.count || 0;
  const pendingClaimsCount = db.get<{ count: number }>("SELECT count(*) as count FROM claims WHERE status IN ('PENDING', 'UNDER_REVIEW')")?.count || 0;
  const inCustodyCount = db.get<{ count: number }>("SELECT count(*) as count FROM found_items WHERE custody_status = 'IN_CUSTODY'")?.count || 0;

  const categoryStats = db.query(`
    SELECT c.name, count(f.id) as found_count
    FROM categories c
    LEFT JOIN found_items f ON f.category_id = c.id
    GROUP BY c.id, c.name
  `);

  res.json({
    lostCount,
    foundCount,
    returnedCount,
    pendingClaimsCount,
    inCustodyCount,
    recoveryRate: foundCount > 0 ? Math.round((returnedCount / foundCount) * 100) : 0,
    categoryStats,
  });
});

// Search & Browse Found Items (Public catalogue with privacy protection)
router.get('/found', optionalAuthenticate, (req: AuthenticatedRequest, res: Response) => {
  const { category, search, status, location } = req.query;

  let sql = `
    SELECT f.*, c.name as category_name, c.icon as category_icon, u.name as finder_name
    FROM found_items f
    JOIN categories c ON f.category_id = c.id
    LEFT JOIN users u ON f.finder_id = u.id
    WHERE 1=1
  `;
  const params: any[] = [];

  if (category) {
    sql += ' AND f.category_id = ?';
    params.push(Number(category));
  }

  if (status) {
    sql += ' AND f.status = ?';
    params.push(String(status));
  }

  if (location) {
    sql += ' AND LOWER(f.location) LIKE ?';
    params.push(`%${String(location).toLowerCase()}%`);
  }

  if (search) {
    const s = `%${String(search).toLowerCase()}%`;
    sql += ' AND (LOWER(f.title) LIKE ? OR LOWER(f.description) LIKE ? OR LOWER(f.brand) LIKE ? OR LOWER(f.color) LIKE ? OR LOWER(f.location) LIKE ?)';
    params.push(s, s, s, s, s);
  }

  sql += ' ORDER BY f.created_at DESC';

  const items = db.query<any>(sql, params);

  const isStaff = req.user && (req.user.role === 'security_personnel' || req.user.role === 'administrator');

  // Strip sensitive details for regular public users to prevent fraudulent claims
  const sanitized = items.map(item => {
    if (!isStaff) {
      const { secret_identifying_details, ...rest } = item;
      return rest;
    }
    return item;
  });

  res.json({ items: sanitized });
});

// Get Single Found Item
router.get('/found/:id', optionalAuthenticate, (req: AuthenticatedRequest, res: Response) => {
  const id = Number(req.params.id);
  const item = db.get<any>(
    `SELECT f.*, c.name as category_name, c.icon as category_icon, u.name as finder_name
     FROM found_items f
     JOIN categories c ON f.category_id = c.id
     LEFT JOIN users u ON f.finder_id = u.id
     WHERE f.id = ?`,
    [id]
  );

  if (!item) {
    return res.status(404).json({ error: 'Found item not found' });
  }

  const isStaff = req.user && (req.user.role === 'security_personnel' || req.user.role === 'administrator');
  if (!isStaff) {
    delete item.secret_identifying_details;
  }

  res.json({ item });
});

// Search & Browse Lost Items
router.get('/lost', optionalAuthenticate, (req: AuthenticatedRequest, res: Response) => {
  const { category, search, status, myOnly } = req.query;

  let sql = `
    SELECT l.*, c.name as category_name, c.icon as category_icon, u.name as reporter_name
    FROM lost_items l
    JOIN categories c ON l.category_id = c.id
    JOIN users u ON l.user_id = u.id
    WHERE 1=1
  `;
  const params: any[] = [];

  if (myOnly === 'true' && req.user) {
    sql += ' AND l.user_id = ?';
    params.push(req.user.id);
  }

  if (category) {
    sql += ' AND l.category_id = ?';
    params.push(Number(category));
  }

  if (status) {
    sql += ' AND l.status = ?';
    params.push(String(status));
  }

  if (search) {
    const s = `%${String(search).toLowerCase()}%`;
    sql += ' AND (LOWER(l.title) LIKE ? OR LOWER(l.description) LIKE ? OR LOWER(l.brand) LIKE ? OR LOWER(l.color) LIKE ? OR LOWER(l.location) LIKE ?)';
    params.push(s, s, s, s, s);
  }

  sql += ' ORDER BY l.created_at DESC';

  const items = db.query(sql, params);
  res.json({ items });
});

// Report a Lost Item (with automated potential match evaluation)
router.post('/lost', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { title, category_id, description, color, brand, location, date_lost, photo_url, contact_info } = req.body;

  if (!title || !category_id || !description || !location || !date_lost) {
    return res.status(400).json({ error: 'Title, category, description, location, and date lost are required.' });
  }

  const user_id = req.user!.id;

  const result = db.run(
    `INSERT INTO lost_items (user_id, category_id, title, description, color, brand, location, date_lost, photo_url, contact_info, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'OPEN')`,
    [
      user_id,
      Number(category_id),
      title.trim(),
      description.trim(),
      color ? color.trim() : null,
      brand ? brand.trim() : null,
      location.trim(),
      date_lost,
      photo_url ? photo_url.trim() : null,
      contact_info ? contact_info.trim() : null,
    ]
  );

  const lostItemId = result.lastInsertRowid;

  // Run Match Engine against all unclaimed found items
  const foundItems = db.query<any>(
    "SELECT * FROM found_items WHERE status IN ('UNCLAIMED', 'CLAIM_PENDING')"
  );

  let highMatchesCount = 0;
  for (const found of foundItems) {
    const match = calculateMatchScore(
      {
        category_id: Number(category_id),
        title,
        description,
        color,
        brand,
        location,
        date_lost,
      },
      found
    );

    if (match.score >= 50) {
      db.run(
        `INSERT INTO potential_matches (lost_item_id, found_item_id, score, match_reasons, status)
         VALUES (?, ?, ?, ?, 'PENDING')`,
        [lostItemId, found.id, match.score, JSON.stringify(match.reasons)]
      );
      highMatchesCount++;
    }
  }

  if (highMatchesCount > 0) {
    db.run("UPDATE lost_items SET status = 'MATCH_PENDING' WHERE id = ?", [lostItemId]);
  }

  // Audit log
  db.run(
    'INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)',
    [user_id, 'REPORT_LOST_ITEM', 'lost_items', lostItemId, `Reported lost item: "${title}"`]
  );

  res.status(201).json({
    message: 'Lost item report submitted successfully!',
    id: lostItemId,
    potentialMatchesFound: highMatchesCount,
  });
});

// Report a Found Item
router.post('/found', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const {
    title,
    category_id,
    description,
    color,
    brand,
    location,
    date_found,
    photo_url,
    storage_location = 'Security Lost & Found Desk',
    secret_identifying_details,
  } = req.body;

  if (!title || !category_id || !description || !location || !date_found) {
    return res.status(400).json({ error: 'Title, category, description, location, and date found are required.' });
  }

  const finder_id = req.user!.id;
  const isSecurity = req.user!.role === 'security_personnel' || req.user!.role === 'administrator';

  const result = db.run(
    `INSERT INTO found_items (finder_id, category_id, title, description, color, brand, location, date_found, photo_url, storage_location, custody_status, is_verified, verified_by, secret_identifying_details, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'IN_CUSTODY', ?, ?, ?, 'UNCLAIMED')`,
    [
      finder_id,
      Number(category_id),
      title.trim(),
      description.trim(),
      color ? color.trim() : null,
      brand ? brand.trim() : null,
      location.trim(),
      date_found,
      photo_url ? photo_url.trim() : null,
      storage_location.trim(),
      isSecurity ? 1 : 0,
      isSecurity ? finder_id : null,
      secret_identifying_details ? secret_identifying_details.trim() : null,
    ]
  );

  const foundItemId = result.lastInsertRowid;

  // Add initial custody record
  db.run(
    `INSERT INTO custody_records (found_item_id, officer_id, storage_location, action, notes)
     VALUES (?, ?, ?, 'ITEM_RECEIVED', 'Item logged and stored at location')`,
    [foundItemId, finder_id, storage_location.trim()]
  );

  // Match against open lost items
  const openLostItems = db.query<any>("SELECT * FROM lost_items WHERE status IN ('OPEN', 'MATCH_PENDING')");
  let matchesCount = 0;

  for (const lost of openLostItems) {
    const match = calculateMatchScore(
      lost,
      {
        category_id: Number(category_id),
        title,
        description,
        color,
        brand,
        location,
        date_found,
      }
    );

    if (match.score >= 50) {
      db.run(
        `INSERT OR REPLACE INTO potential_matches (lost_item_id, found_item_id, score, match_reasons, status)
         VALUES (?, ?, ?, ?, 'PENDING')`,
        [lost.id, foundItemId, match.score, JSON.stringify(match.reasons)]
      );
      matchesCount++;
      db.run("UPDATE lost_items SET status = 'MATCH_PENDING' WHERE id = ?", [lost.id]);
    }
  }

  db.run(
    'INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)',
    [finder_id, 'REPORT_FOUND_ITEM', 'found_items', foundItemId, `Reported found item: "${title}"`]
  );

  res.status(201).json({
    message: 'Found item report registered successfully!',
    id: foundItemId,
    matchesCount,
  });
});

export default router;
