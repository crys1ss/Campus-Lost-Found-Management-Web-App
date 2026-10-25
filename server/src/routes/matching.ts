import { Router, Response } from 'express';
import { db } from '../db/database.js';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';
import { calculateMatchScore } from '../utils/matcher.js';

const router = Router();

// Get potential matches for the currently authenticated user's lost items
router.get('/my', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;

  const matches = db.query<any>(
    `SELECT pm.*, 
            li.title as lost_title, li.location as lost_location, li.date_lost,
            fi.title as found_title, fi.location as found_location, fi.date_found, fi.photo_url as found_photo,
            fi.storage_location, fi.status as found_status,
            c.name as category_name
     FROM potential_matches pm
     JOIN lost_items li ON pm.lost_item_id = li.id
     JOIN found_items fi ON pm.found_item_id = fi.id
     JOIN categories c ON li.category_id = c.id
     WHERE li.user_id = ?
     ORDER BY pm.score DESC, pm.created_at DESC`,
    [userId]
  );

  const formatted = matches.map(m => ({
    ...m,
    match_reasons: typeof m.match_reasons === 'string' ? JSON.parse(m.match_reasons) : m.match_reasons,
  }));

  res.json({ matches: formatted });
});

// Get potential matches for a specific lost item
router.get('/lost/:lostId', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const lostId = Number(req.params.lostId);

  const matches = db.query<any>(
    `SELECT pm.*, 
            fi.title as found_title, fi.description as found_description, fi.location as found_location,
            fi.date_found, fi.photo_url as found_photo, fi.storage_location, fi.status as found_status,
            c.name as category_name
     FROM potential_matches pm
     JOIN found_items fi ON pm.found_item_id = fi.id
     JOIN categories c ON fi.category_id = c.id
     WHERE pm.lost_item_id = ?
     ORDER BY pm.score DESC`,
    [lostId]
  );

  res.json({
    matches: matches.map(m => ({
      ...m,
      match_reasons: typeof m.match_reasons === 'string' ? JSON.parse(m.match_reasons) : m.match_reasons,
    })),
  });
});

// Interactive Match Testing & Simulation (for live demo)
router.post('/simulate', (req, res) => {
  const { lost, found } = req.body;
  if (!lost || !found) {
    return res.status(400).json({ error: 'Both lost and found item definitions are required.' });
  }

  const result = calculateMatchScore(lost, found);
  res.json({ simulation: result });
});

export default router;
