import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/database.js';
import { JWT_SECRET, authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// Login
router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = db.get<{
    id: number;
    name: string;
    email: string;
    password_hash: string;
    role: 'campus_user' | 'security_personnel' | 'administrator';
    user_type: string;
    identifier: string;
    phone: string;
    department: string;
  }>('SELECT * FROM users WHERE LOWER(email) = LOWER(?)', [email.trim()]);

  if (!user) {
    return res.status(401).json({ error: 'Invalid email address or credentials' });
  }

  const isMatch = bcrypt.compareSync(password, user.password_hash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    user_type: user.user_type,
    identifier: user.identifier,
    phone: user.phone,
    department: user.department,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

  // Log activity
  try {
    db.run(
      'INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)',
      [user.id, 'USER_LOGIN', 'users', user.id, `User logged in from ${req.ip || 'localhost'}`]
    );
  } catch (e) {
    // Non-blocking log
  }

  res.json({
    token,
    user: payload,
    message: `Welcome back, ${user.name}!`,
  });
});

// Demo Instant Login (for presentations)
router.post('/demo-login', (req: Request, res: Response) => {
  const { role } = req.body; // 'student' | 'security' | 'admin'

  let email = 'tanay@nmims.edu';
  if (role === 'security') email = 'security@nmims.edu';
  if (role === 'admin') email = 'admin@nmims.edu';

  const user = db.get<any>('SELECT * FROM users WHERE email = ?', [email]);
  if (!user) {
    return res.status(404).json({ error: 'Demo user account not found' });
  }

  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    user_type: user.user_type,
    identifier: user.identifier,
    phone: user.phone,
    department: user.department,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

  res.json({
    token,
    user: payload,
    message: `Switched session to ${user.name} (${user.role})`,
  });
});

// Register
router.post('/register', (req: Request, res: Response) => {
  const { name, email, password, role = 'campus_user', user_type = 'student', identifier = '', phone = '', department = '' } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  const existing = db.get('SELECT id FROM users WHERE LOWER(email) = LOWER(?)', [email.trim()]);
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  const passwordHash = bcrypt.hashSync(password, 10);

  const result = db.run(
    `INSERT INTO users (name, email, password_hash, role, user_type, identifier, phone, department)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [name.trim(), email.trim(), passwordHash, role, user_type, identifier.trim(), phone.trim(), department.trim()]
  );

  const newUser = {
    id: result.lastInsertRowid,
    name: name.trim(),
    email: email.trim(),
    role,
    user_type,
    identifier: identifier.trim(),
    phone: phone.trim(),
    department: department.trim(),
  };

  const token = jwt.sign(newUser, JWT_SECRET, { expiresIn: '24h' });

  res.status(201).json({
    token,
    user: newUser,
    message: 'Account successfully registered!',
  });
});

// Get Current User Profile
router.get('/me', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const user = db.get(
    'SELECT id, name, email, role, user_type, identifier, phone, department, created_at FROM users WHERE id = ?',
    [req.user!.id]
  );
  if (!user) {
    return res.status(404).json({ error: 'User profile not found' });
  }
  res.json({ user });
});

// Demo accounts metadata
router.get('/demo-users', (_req: Request, res: Response) => {
  const users = db.query(
    'SELECT id, name, email, role, user_type, identifier, department FROM users WHERE email IN (?, ?, ?)',
    ['tanay@nmims.edu', 'security@nmims.edu', 'admin@nmims.edu']
  );
  res.json({
    demoAccounts: users.map(u => ({
      ...u,
      defaultPassword: 'password123',
    })),
  });
});

export default router;
