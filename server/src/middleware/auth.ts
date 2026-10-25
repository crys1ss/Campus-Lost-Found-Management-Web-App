import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'campusfind-super-secret-key-2026';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'campus_user' | 'security_personnel' | 'administrator';
  user_type?: string;
  identifier?: string;
  phone?: string;
  department?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied: No authentication token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired session token' });
  }
}

export function optionalAuthenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
      req.user = decoded;
    } catch (err) {
      // Ignore token error for optional auth
    }
  }
  next();
}

export function requireRole(...allowedRoles: Array<'campus_user' | 'security_personnel' | 'administrator'>) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Forbidden: This action requires one of the following roles: ${allowedRoles.join(', ')}`,
        currentRole: req.user.role,
      });
    }

    next();
  };
}
