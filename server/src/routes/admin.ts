import { Router, Response } from 'express';
import { db } from '../db/database.js';
import { authenticateToken, requireRole, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// Restrict all routes to Administrator
router.use(authenticateToken);
router.use(requireRole('administrator'));

// Get all users with filters
router.get('/users', (req: AuthenticatedRequest, res: Response) => {
  const { role, search } = req.query;

  let sql = 'SELECT id, name, email, role, user_type, identifier, phone, department, created_at FROM users WHERE 1=1';
  const params: any[] = [];

  if (role) {
    sql += ' AND role = ?';
    params.push(String(role));
  }

  if (search) {
    const s = `%${String(search).toLowerCase()}%`;
    sql += ' AND (LOWER(name) LIKE ? OR LOWER(email) LIKE ? OR LOWER(identifier) LIKE ?)';
    params.push(s, s, s);
  }

  sql += ' ORDER BY id ASC';
  const users = db.query(sql, params);
  res.json({ users });
});

// Update user role
router.put('/users/:id/role', (req: AuthenticatedRequest, res: Response) => {
  const userId = Number(req.params.id);
  const { role } = req.body;

  if (!['campus_user', 'security_personnel', 'administrator'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role specified' });
  }

  // Prevent admin from demoting themselves accidentally
  if (userId === req.user!.id && role !== 'administrator') {
    return res.status(400).json({ error: 'You cannot change your own administrator role.' });
  }

  db.run('UPDATE users SET role = ? WHERE id = ?', [role, userId]);

  db.run(
    'INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)',
    [req.user!.id, 'CHANGE_USER_ROLE', 'users', userId, `Admin changed role of user #${userId} to ${role}`]
  );

  res.json({ message: 'User role updated successfully', userId, role });
});

// Add Category
router.post('/categories', (req: AuthenticatedRequest, res: Response) => {
  const { name, description, icon = 'Tag', retention_period_days = 90 } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Category name is required' });
  }

  try {
    const result = db.run(
      'INSERT INTO categories (name, description, icon, retention_period_days) VALUES (?, ?, ?, ?)',
      [name.trim(), description ? description.trim() : null, icon, Number(retention_period_days)]
    );
    res.status(201).json({ message: 'Category created', id: result.lastInsertRowid });
  } catch (err: any) {
    res.status(409).json({ error: 'Category already exists or error: ' + err.message });
  }
});

// Audit Activity Logs
router.get('/audit-logs', (_req: AuthenticatedRequest, res: Response) => {
  const logs = db.query<any>(`
    SELECT al.*, u.name as user_name, u.role as user_role, u.email as user_email
    FROM activity_logs al
    LEFT JOIN users u ON al.user_id = u.id
    ORDER BY al.created_at DESC
    LIMIT 100
  `);
  res.json({ logs });
});

// System Overview Executive Report
router.get('/system-report', (_req: AuthenticatedRequest, res: Response) => {
  const totals = {
    users: db.get<{ c: number }>('SELECT count(*) as c FROM users')?.c || 0,
    lostItems: db.get<{ c: number }>('SELECT count(*) as c FROM lost_items')?.c || 0,
    foundItems: db.get<{ c: number }>('SELECT count(*) as c FROM found_items')?.c || 0,
    matchedItems: db.get<{ c: number }>('SELECT count(*) as c FROM potential_matches')?.c || 0,
    claims: db.get<{ c: number }>('SELECT count(*) as c FROM claims')?.c || 0,
    returns: db.get<{ c: number }>('SELECT count(*) as c FROM return_records')?.c || 0,
    unclaimed: db.get<{ c: number }>("SELECT count(*) as c FROM found_items WHERE status = 'UNCLAIMED'")?.c || 0,
  };

  const statusBreakdown = db.query(`
    SELECT status, count(*) as count FROM found_items GROUP BY status
  `);

  const categoryDistribution = db.query(`
    SELECT c.name, 
           (SELECT count(*) FROM lost_items l WHERE l.category_id = c.id) as lost_count,
           (SELECT count(*) FROM found_items f WHERE f.category_id = c.id) as found_count
    FROM categories c
  `);

  res.json({
    totals,
    statusBreakdown,
    categoryDistribution,
    generatedAt: new Date().toISOString(),
  });
});

export default router;
