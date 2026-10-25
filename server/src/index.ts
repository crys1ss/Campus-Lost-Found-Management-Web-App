import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import itemsRoutes from './routes/items.js';
import matchingRoutes from './routes/matching.js';
import claimsRoutes from './routes/claims.js';
import securityRoutes from './routes/security.js';
import adminRoutes from './routes/admin.js';
import experimentsRoutes from './routes/experiments.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    app: 'Campus Lost & Found Management System (CampusFind)',
    institution: 'NMIMS MPSTME',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/claims', claimsRoutes);
app.use('/api/security', securityRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/experiments', experimentsRoutes);

// Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Server Error]', err);
  res.status(err.status || 500).json({
    error: err.message || 'An unexpected internal server error occurred',
  });
});

app.listen(PORT, () => {
  console.log(`================================================================`);
  console.log(`  CampusFind Backend Server Running on http://localhost:${PORT}`);
  console.log(`  Software Engineering Lab Experiments 1-10 API Activated         `);
  console.log(`================================================================`);
});
