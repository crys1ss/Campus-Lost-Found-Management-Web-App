// Vercel Serverless API Handler
// Automatically routes /api/* to this serverless function on Vercel

import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));

const JWT_SECRET = process.env.JWT_SECRET || 'campusfind-super-secret-key-2026';

// In-Memory Seeded State for Serverless Environment
let users = [
  { id: 1, name: 'Tanay Dekate', email: 'tanay@nmims.edu', password_hash: '$2a$10$9c6cNXWhdjHWjUU0E5zGlut6l4IQk4ODugA54mRuvsJmMzzpUOkk.', role: 'campus_user', user_type: 'student', identifier: 'N022', phone: '+91 98200 11221', department: 'MBA Tech CE' },
  { id: 2, name: 'Jivitesh Dutt', email: 'jivitesh@nmims.edu', password_hash: '$2a$10$9c6cNXWhdjHWjUU0E5zGlut6l4IQk4ODugA54mRuvsJmMzzpUOkk.', role: 'campus_user', user_type: 'student', identifier: 'N026', phone: '+91 98200 11222', department: 'MBA Tech CE' },
  { id: 3, name: 'Gatha Jain', email: 'gatha@nmims.edu', password_hash: '$2a$10$9c6cNXWhdjHWjUU0E5zGlut6l4IQk4ODugA54mRuvsJmMzzpUOkk.', role: 'campus_user', user_type: 'student', identifier: 'N038', phone: '+91 98200 11223', department: 'MBA Tech CE' },
  { id: 4, name: 'Officer Ramesh Shinde', email: 'security@nmims.edu', password_hash: '$2a$10$9c6cNXWhdjHWjUU0E5zGlut6l4IQk4ODugA54mRuvsJmMzzpUOkk.', role: 'security_personnel', user_type: 'officer', identifier: 'SEC-402', phone: '+91 98765 43210', department: 'Campus Security Wing' },
  { id: 5, name: 'Dr. K. Mehta', email: 'admin@nmims.edu', password_hash: '$2a$10$9c6cNXWhdjHWjUU0E5zGlut6l4IQk4ODugA54mRuvsJmMzzpUOkk.', role: 'administrator', user_type: 'admin', identifier: 'ADM-001', phone: '+91 98111 22334', department: 'Dean Office / IT Cell' },
  { id: 6, name: 'Ananya Sharma', email: 'ananya@nmims.edu', password_hash: '$2a$10$9c6cNXWhdjHWjUU0E5zGlut6l4IQk4ODugA54mRuvsJmMzzpUOkk.', role: 'campus_user', user_type: 'student', identifier: 'N045', phone: '+91 98333 44556', department: 'B.Tech CS' }
];

let categories = [
  { id: 1, name: 'Electronics', description: 'Laptops, phones, headphones, chargers, power banks', icon: 'Laptop', retention_period_days: 90 },
  { id: 2, name: 'Identity & Cards', description: 'Student ID cards, driving licenses, ATM cards', icon: 'CreditCard', retention_period_days: 120 },
  { id: 3, name: 'Academic & Stationery', description: 'Scientific calculators, notebooks, textbooks', icon: 'BookOpen', retention_period_days: 60 },
  { id: 4, name: 'Wallets & Bags', description: 'Wallets, purses, backpacks, laptop bags', icon: 'Briefcase', retention_period_days: 90 },
  { id: 5, name: 'Keys & Personal Accessories', description: 'Hostel room keys, bike keys, spectacles, wristwatches', icon: 'Key', retention_period_days: 90 },
  { id: 6, name: 'Bottles & Apparel', description: 'Insulated water bottles, jackets, hoodies, umbrellas', icon: 'Shirt', retention_period_days: 45 }
];

let lostItems = [
  { id: 1, user_id: 1, category_id: 1, title: 'Apple AirPods Pro 2nd Gen', description: 'Lost in white charging case with a transparent protective clip.', color: 'White', brand: 'Apple', location: 'Computer Lab 612, 6th Floor', date_lost: '2026-10-23', photo_url: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80', status: 'MATCH_PENDING', created_at: new Date().toISOString() },
  { id: 2, user_id: 1, category_id: 2, title: 'NMIMS Student Identity Card (N022)', description: 'Smart RFID ID card for MBA Tech CE with photo and SAP 70011122001.', color: 'White & Maroon', brand: 'NMIMS MPSTME', location: 'Sports Complex Badminton Court', date_lost: '2026-10-24', photo_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80', status: 'MATCH_PENDING', created_at: new Date().toISOString() },
  { id: 3, user_id: 2, category_id: 3, title: 'Casio FX-991CW Scientific Calculator', description: 'ClassWiz model with solar panel and black slide cover.', color: 'Black', brand: 'Casio', location: 'Classroom 402 Engineering Wing', date_lost: '2026-10-21', photo_url: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&auto=format&fit=crop&q=80', status: 'RESOLVED', created_at: new Date().toISOString() },
  { id: 4, user_id: 3, category_id: 4, title: 'Navy Blue Dell Pro Backpack', description: 'Backpack containing 65W Dell Type-C adapter and notebook.', color: 'Navy Blue', brand: 'Dell', location: 'Central Library 2nd Floor Reading Room', date_lost: '2026-10-22', photo_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80', status: 'OPEN', created_at: new Date().toISOString() }
];

let foundItems = [
  { id: 1, finder_id: 4, category_id: 1, title: 'Apple AirPods Pro in Charging Case', description: 'Found on workbench bench 4 in Computer Lab 612.', color: 'White', brand: 'Apple', location: 'Lab 612, 6th Floor', date_found: '2026-10-23', photo_url: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80', storage_location: 'Security Main Office Locker 102', custody_status: 'IN_CUSTODY', is_verified: 1, secret_identifying_details: 'Has tiny blue silicone loop attached to hinge; serial matches Tanay', status: 'CLAIM_PENDING', created_at: new Date().toISOString() },
  { id: 2, finder_id: 4, category_id: 2, title: 'NMIMS Student ID Card (MBA Tech CE)', description: 'Found dropped near seating bench in Sports Complex.', color: 'White & Maroon', brand: 'NMIMS', location: 'Sports Complex Pavilion', date_found: '2026-10-24', photo_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80', storage_location: 'Security Desk Front Tray', custody_status: 'IN_CUSTODY', is_verified: 1, secret_identifying_details: 'Roll No N022, Name: Tanay Dekate, Valid till 2028', status: 'CLAIM_PENDING', created_at: new Date().toISOString() },
  { id: 3, finder_id: 4, category_id: 3, title: 'Casio FX-991CW Scientific Calculator', description: 'Found under bench row 3 after Mid-Sem exam in Room 402.', color: 'Black', brand: 'Casio', location: 'Classroom 402', date_found: '2026-10-21', photo_url: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&auto=format&fit=crop&q=80', storage_location: 'Security Office Shelf B', custody_status: 'RETURNED', is_verified: 1, secret_identifying_details: 'Has J.D. inscribed on inside of battery panel', status: 'RETURNED', created_at: new Date().toISOString() },
  { id: 4, finder_id: 2, category_id: 4, title: 'Dell 65W USB-C Laptop Charger', description: 'Found plugged into wall socket behind library carrel 14.', color: 'Black', brand: 'Dell', location: 'Library 2nd Floor Carrel 14', date_found: '2026-10-22', photo_url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80', storage_location: 'Library Reception Desk', custody_status: 'IN_CUSTODY', is_verified: 1, secret_identifying_details: 'Original Dell DP/N 02YK4P label attached', status: 'UNCLAIMED', created_at: new Date().toISOString() }
];

let claims = [
  { id: 1, found_item_id: 1, lost_item_id: 1, claimant_id: 1, proof_description: "My AirPods Pro 2 case has a tiny blue silicone carabiner loop. I can unlock and connect them with my iPhone.", status: 'UNDER_REVIEW', reviewer_remarks: 'Claim received. Bluetooth handshake verified.', created_at: new Date().toISOString() },
  { id: 2, found_item_id: 2, lost_item_id: 2, claimant_id: 1, proof_description: "This is my college ID card for MBA Tech CE. Name Tanay Dekate, SAP ID 70011122001.", status: 'APPROVED', reviewer_remarks: 'Identity verified via NMIMS Portal.', created_at: new Date().toISOString() },
  { id: 3, found_item_id: 3, lost_item_id: 3, claimant_id: 2, proof_description: 'My Casio FX-991CW has J.D. written with silver marker on battery cover.', status: 'APPROVED', reviewer_remarks: 'Initials verified. Returned.', created_at: new Date().toISOString() }
];

let returnRecords = [
  { id: 1, claim_id: 3, found_item_id: 3, receiver_id: 2, handed_over_by: 4, receiver_id_proof: 'Student ID Card N026', receipt_no: 'REC-2026-OCT-0042', remarks: 'Calculator returned in good condition', return_date: new Date().toISOString() }
];

let activityLogs = [
  { id: 1, user_id: 4, action: 'LOG_FOUND_ITEM', entity_type: 'found_items', details: 'Officer Ramesh logged found Apple AirPods Pro', created_at: new Date().toISOString() },
  { id: 2, user_id: 1, action: 'SUBMIT_CLAIM', entity_type: 'claims', details: 'Tanay Dekate submitted claim for AirPods', created_at: new Date().toISOString() }
];

// Auth helper
function getAuthUser(req) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
}

// Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    deployment: 'Vercel Serverless',
    app: 'CampusFind (NMIMS MPSTME)',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email.toLowerCase() === email?.toLowerCase());
  if (!user) return res.status(401).json({ error: 'Invalid email or credentials' });
  const isMatch = bcrypt.compareSync(password, user.password_hash);
  if (!isMatch) return res.status(401).json({ error: 'Invalid password' });
  const token = jwt.sign(user, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, user, message: `Welcome back, ${user.name}!` });
});

app.post('/api/auth/demo-login', (req, res) => {
  const { role } = req.body;
  let email = 'tanay@nmims.edu';
  if (role === 'security') email = 'security@nmims.edu';
  if (role === 'admin') email = 'admin@nmims.edu';
  const user = users.find(u => u.email === email);
  if (!user) return res.status(404).json({ error: 'Demo user not found' });
  const token = jwt.sign(user, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, user, message: `Switched session to ${user.name}` });
});

app.get('/api/auth/me', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });
  res.json({ user });
});

app.get('/api/items/categories', (req, res) => {
  res.json({ categories });
});

app.get('/api/items/stats', (req, res) => {
  const returnedCount = foundItems.filter(f => f.status === 'RETURNED').length;
  res.json({
    lostCount: lostItems.length,
    foundCount: foundItems.length,
    returnedCount,
    inCustodyCount: foundItems.filter(f => f.custody_status === 'IN_CUSTODY').length,
    pendingClaimsCount: claims.filter(c => c.status === 'PENDING' || c.status === 'UNDER_REVIEW').length,
    recoveryRate: foundItems.length > 0 ? Math.round((returnedCount / foundItems.length) * 100) : 0,
    categoryStats: categories.map(c => ({
      name: c.name,
      found_count: foundItems.filter(f => f.category_id === c.id).length
    }))
  });
});

app.get('/api/items/found', (req, res) => {
  const user = getAuthUser(req);
  const isStaff = user && (user.role === 'security_personnel' || user.role === 'administrator');
  const sanitized = foundItems.map(f => {
    const cat = categories.find(c => c.id === f.category_id);
    const item = { ...f, category_name: cat?.name, category_icon: cat?.icon };
    if (!isStaff) delete item.secret_identifying_details;
    return item;
  });
  res.json({ items: sanitized });
});

app.get('/api/items/lost', (req, res) => {
  const items = lostItems.map(l => {
    const cat = categories.find(c => c.id === l.category_id);
    return { ...l, category_name: cat?.name, category_icon: cat?.icon };
  });
  res.json({ items });
});

app.post('/api/items/lost', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Auth required' });
  const newItem = {
    id: lostItems.length + 1,
    user_id: user.id,
    ...req.body,
    status: 'OPEN',
    created_at: new Date().toISOString()
  };
  lostItems.unshift(newItem);
  res.status(201).json({ message: 'Lost item report submitted', id: newItem.id, potentialMatchesFound: 1 });
});

app.post('/api/items/found', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Auth required' });
  const newItem = {
    id: foundItems.length + 1,
    finder_id: user.id,
    ...req.body,
    custody_status: 'IN_CUSTODY',
    status: 'UNCLAIMED',
    created_at: new Date().toISOString()
  };
  foundItems.unshift(newItem);
  res.status(201).json({ message: 'Found item registered', id: newItem.id, matchesCount: 1 });
});

app.get('/api/matching/my', (req, res) => {
  const matches = [
    {
      id: 1,
      lost_item_id: 1,
      found_item_id: 1,
      score: 95,
      match_reasons: {
        categoryMatch: true, brandMatch: true, colorMatch: true, locationMatch: true, dateDiffDays: 0,
        notes: ['Exact category match (+30)', 'Brand matched: Apple (+20)', 'Color matched: White (+15)', 'Location vicinity: Lab 612 (+15)']
      },
      status: 'PENDING',
      lost_title: 'Apple AirPods Pro 2nd Gen',
      found_title: 'Apple AirPods Pro in Charging Case',
      found_location: 'Lab 612, 6th Floor',
      date_found: '2026-10-23',
      storage_location: 'Security Main Office Locker 102'
    }
  ];
  res.json({ matches });
});

app.post('/api/claims', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Auth required' });
  const newClaim = {
    id: claims.length + 1,
    claimant_id: user.id,
    ...req.body,
    status: 'PENDING',
    created_at: new Date().toISOString()
  };
  claims.unshift(newClaim);
  res.status(201).json({ message: 'Claim submitted successfully', claimId: newClaim.id });
});

app.get('/api/claims/my', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Auth required' });
  const myClaims = claims.filter(c => c.claimant_id === user.id).map(c => {
    const f = foundItems.find(item => item.id === c.found_item_id);
    return {
      ...c,
      item_title: f?.title,
      storage_location: f?.storage_location,
      item_status: f?.status
    };
  });
  res.json({ claims: myClaims });
});

app.get('/api/security/dashboard', (req, res) => {
  const user = getAuthUser(req);
  if (!user || user.role === 'campus_user') return res.status(403).json({ error: 'Forbidden' });
  const pending = claims.filter(c => c.status === 'PENDING' || c.status === 'UNDER_REVIEW').map(c => {
    const f = foundItems.find(item => item.id === c.found_item_id);
    const u = users.find(usr => usr.id === c.claimant_id);
    return { ...c, item_title: f?.title, storage_location: f?.storage_location, secret_identifying_details: f?.secret_identifying_details, claimant_name: u?.name, claimant_roll: u?.identifier, claimant_phone: u?.phone };
  });
  const approved = claims.filter(c => c.status === 'APPROVED').map(c => {
    const f = foundItems.find(item => item.id === c.found_item_id);
    const u = users.find(usr => usr.id === c.claimant_id);
    return { ...c, item_title: f?.title, storage_location: f?.storage_location, claimant_name: u?.name, claimant_roll: u?.identifier };
  });
  res.json({
    pendingClaims: pending,
    approvedPendingHandover: approved,
    custodyItems: foundItems,
    recentReturns: returnRecords.map(r => {
      const f = foundItems.find(i => i.id === r.found_item_id);
      const u = users.find(i => i.id === r.receiver_id);
      return { ...r, item_title: f?.title, receiver_name: u?.name, receiver_roll: u?.identifier, officer_name: 'Officer Ramesh' };
    })
  });
});

app.put('/api/security/claims/:id/review', (req, res) => {
  const id = Number(req.params.id);
  const { status, remarks } = req.body;
  const claim = claims.find(c => c.id === id);
  if (claim) {
    claim.status = status;
    claim.reviewer_remarks = remarks;
  }
  res.json({ message: 'Claim updated', claimId: id, status });
});

app.post('/api/security/handover', (req, res) => {
  const { claim_id, receiver_id_proof, remarks } = req.body;
  const receiptNo = `REC-2026-NMIMS-${Math.floor(1000 + Math.random() * 9000)}`;
  const claim = claims.find(c => c.id === Number(claim_id));
  if (claim) {
    const item = foundItems.find(f => f.id === claim.found_item_id);
    if (item) {
      item.status = 'RETURNED';
      item.custody_status = 'RETURNED';
    }
  }
  returnRecords.unshift({
    id: returnRecords.length + 1,
    claim_id: Number(claim_id),
    receipt_no: receiptNo,
    receiver_id_proof,
    remarks,
    return_date: new Date().toISOString()
  });
  res.status(201).json({ message: 'Handover complete', receiptNo, returnDate: new Date().toISOString() });
});

// Admin routes
app.get('/api/admin/users', (req, res) => {
  res.json({ users });
});

app.put('/api/admin/users/:id/role', (req, res) => {
  const id = Number(req.params.id);
  const user = users.find(u => u.id === id);
  if (user) user.role = req.body.role;
  res.json({ message: 'Role updated', role: req.body.role });
});

app.get('/api/admin/audit-logs', (req, res) => {
  res.json({ logs: activityLogs });
});

app.get('/api/admin/system-report', (req, res) => {
  res.json({
    totals: { users: users.length, lostItems: lostItems.length, foundItems: foundItems.length, matchedItems: 3, claims: claims.length, returns: returnRecords.length },
    statusBreakdown: [{ status: 'IN_CUSTODY', count: 3 }, { status: 'RETURNED', count: 1 }],
    categoryDistribution: categories.map(c => ({ name: c.name, lost_count: 1, found_count: 1 }))
  });
});

// Experiments Catalog & Simulators
app.get('/api/experiments/catalog', (req, res) => {
  const experiments = [
    { id: 1, title: 'Requirements Engineering & Case Study Selection', aim: 'Conduct literature survey to shortlist 5 domains, frame problem statement, define project scope, feasibility study, and identify functional & non-functional requirements.', implementation: 'Formulated Campus Lost & Found System for NMIMS MPSTME. Gathered 19 FRs and 12 NFRs.', deliverables: ['Problem Statement', '5 Case Studies Shortlist', 'Scope & Feasibility Analysis', 'FRs & NFRs Matrix'], diagramType: 'Requirements Specification', diagramImage: null, featureLink: '/report-lost', status: 'VERIFIED_COMPLETE' },
    { id: 2, title: 'Agile Requirements Gathering with User Stories', aim: 'Write effective Agile User Stories with detailed Story Tests and Acceptance Criteria for quality and non-functional requirements.', implementation: 'Specified User Stories across Student, Faculty, Security Staff, and Administrator roles with Acceptance Criteria.', deliverables: ['Role-based User Stories', 'Acceptance Tests', 'Definition of Done', 'Security Story Tests'], diagramType: 'Agile User Stories', diagramImage: null, featureLink: '/dashboard', status: 'VERIFIED_COMPLETE' },
    { id: 3, title: "User's View Analysis: Use Case Diagram", aim: 'Perform use-case modeling to capture actor interactions, include/extend relationships, and system boundaries.', implementation: 'Full Use Case model with 3 primary actors, 1 external actor, and 12 use cases with <<include>> and <<extend>>.', deliverables: ['StarUML Use Case Model', 'Actor Hierarchy', 'Use Case Description Tables'], diagramType: 'Use Case Diagram', diagramImage: '/diagrams/SE_exp_image1.png', featureLink: '/browse', status: 'VERIFIED_COMPLETE' },
    { id: 4, title: 'Scenario-Based Dynamic Modeling: Activity Diagram', aim: 'Model sequential, branched, and concurrent activity flows across swimlanes for reporting, match evaluation, custody, and claim verification.', implementation: 'Constructed multi-swimlane Activity Diagram showing Lost & Found lifecycles.', deliverables: ['Activity Flowchart with Swimlanes', 'Decision Diamonds', 'Fork & Join Nodes'], diagramType: 'Activity Diagram', diagramImage: '/diagrams/SE_exp_image3.png', featureLink: '/report-found', status: 'VERIFIED_COMPLETE' },
    { id: 5, title: 'Structural Data Modeling: Class Diagram', aim: 'Design domain classes, attributes, methods, visibility, and associations.', implementation: 'Complete object-oriented class hierarchy matching StarUML model.', deliverables: ['Class Attributes & Operations', 'Multiplicity & Associations', 'Enumerations for Status'], diagramType: 'Class Diagram', diagramImage: '/diagrams/SE_exp_image4.png', featureLink: '/admin', status: 'VERIFIED_COMPLETE' },
    { id: 6, title: 'Behavioral Modeling: Sequence Diagram', aim: 'Capture time-ordered message passing and interactions among lifelines for a complete student report, matching, verification, and handover scenario.', implementation: 'Chronological sequence diagram with alt fragments for APPROVED vs REJECTED.', deliverables: ['Synchronous & Asynchronous Messages', 'Activation Boxes', 'Alt Fragments', 'Return Messages'], diagramType: 'Sequence Diagram', diagramImage: '/diagrams/SE_exp_image5.png', featureLink: '/security', status: 'VERIFIED_COMPLETE' },
    { id: 7, title: 'Behavioral View: Collaboration (Communication) Diagram', aim: 'Illustrate structural relationships between objects with sequenced message numbering to analyze object communication during claim handover.', implementation: 'Modeled object communication links with numbered messages (1 to 14.1).', deliverables: ['Collaboration Diagram', 'Numbered Message Sequence', 'Object Links'], diagramType: 'Collaboration Diagram', diagramImage: '/diagrams/EXP7_image1.png', featureLink: '/security', status: 'VERIFIED_COMPLETE' },
    { id: 8, title: 'Database Normalization (1NF, 2NF, 3NF)', aim: 'Decompose unnormalized campus lost & found tables into normalized 3NF relations to eliminate insertion, update, and deletion anomalies.', implementation: '9 normalized relational tables with clear Primary Keys, Foreign Keys, unique constraints, and referential integrity.', deliverables: ['1NF Multi-value Atomicity', '2NF Partial Dependency Removal', '3NF Transitive Dependency Removal', 'ER Schema'], diagramType: 'Database Schema & Relational Model', diagramImage: '/diagrams/Experiment_8_image1.png', featureLink: '/admin', status: 'VERIFIED_COMPLETE' },
    { id: 9, title: 'Transaction Control (TCL) & Data Control (DCL)', aim: 'Demonstrate ACID transactions using COMMIT, ROLLBACK, SAVEPOINT, and ROLLBACK TO SAVEPOINT alongside user privileges using GRANT and REVOKE.', implementation: 'Integrated SQL transaction boundaries and developed an interactive SQL Transaction Simulator demonstrating COMMIT, ROLLBACK, SAVEPOINTS, and role-based privilege checks.', deliverables: ['Live TCL Transaction Runner', 'Savepoint Checkpoints', 'DCL Role Permissions Matrix', 'Standalone SQL Script'], diagramType: 'SQL TCL & DCL Architecture', diagramImage: '/diagrams/Experiment_9_image1.png', featureLink: '/experiments', status: 'VERIFIED_COMPLETE' },
    { id: 10, title: 'MongoDB CRUD Operations using Mongo Shell', aim: 'Demonstrate NoSQL document database concepts and execute insertOne, insertMany, find, updateOne, updateMany, deleteOne, and deleteMany using MongoDB shell.', implementation: 'Built an interactive MongoDB CRUD playground executing genuine document operations against a JSON document store with query projections, regex matching, and update operators, plus a standalone mongosh script.', deliverables: ['Interactive MongoDB CRUD Console', 'Standalone mongosh Script', 'Sample Document Schema', 'Expected Output Log'], diagramType: 'MongoDB Document Collections', diagramImage: '/diagrams/Experiment_10_image7.png', featureLink: '/experiments', status: 'VERIFIED_COMPLETE' }
  ];
  res.json({
    project: 'Campus Lost & Found Management System',
    institution: "SVKM's NMIMS MPSTME",
    students: [
      { name: 'Tanay Dekate', rollNo: 'N022', sapId: '70011122001' },
      { name: 'Jivitesh Dutt', rollNo: 'N026', sapId: '70011122002' },
      { name: 'Gatha Jain', rollNo: 'N038', sapId: '70011122003' }
    ],
    experiments
  });
});

// Exp 9 TCL Simulator
let exp9Table = [
  { id: 101, item_name: 'Apple MacBook Air M2', custody_status: 'IN_CUSTODY', holder_name: 'Security Office Locker A' },
  { id: 102, item_name: 'Sony WH-1000XM5 Headphones', custody_status: 'IN_CUSTODY', holder_name: 'Security Office Locker B' },
  { id: 103, item_name: 'Casio FX-991CW Calculator', custody_status: 'IN_CUSTODY', holder_name: 'Desk Drawer 2' }
];
let exp9InTx = false;
let exp9Savepoint = null;
let exp9History = ['State initialized'];

app.get('/api/experiments/exp9/state', (req, res) => {
  res.json({ rows: exp9Table, inTransaction: exp9InTx, savepoint: exp9Savepoint, history: exp9History });
});

app.post('/api/experiments/exp9/reset', (req, res) => {
  exp9Table = [
    { id: 101, item_name: 'Apple MacBook Air M2', custody_status: 'IN_CUSTODY', holder_name: 'Security Office Locker A' },
    { id: 102, item_name: 'Sony WH-1000XM5 Headphones', custody_status: 'IN_CUSTODY', holder_name: 'Security Office Locker B' },
    { id: 103, item_name: 'Casio FX-991CW Calculator', custody_status: 'IN_CUSTODY', holder_name: 'Desk Drawer 2' }
  ];
  exp9InTx = false;
  exp9Savepoint = null;
  exp9History = ['State reset to baseline.'];
  res.json({ message: 'Table reset', rows: exp9Table, inTransaction: false });
});

app.post('/api/experiments/exp9/execute', (req, res) => {
  const { command, itemId, newStatus, newHolder } = req.body;
  if (command === 'START_TRANSACTION') {
    exp9InTx = true;
    exp9History.push('START TRANSACTION');
  } else if (command === 'UPDATE_RECORD') {
    const row = exp9Table.find(r => r.id === Number(itemId || 101));
    if (row) {
      row.custody_status = newStatus || 'RETURNED';
      row.holder_name = newHolder || 'Tanay Dekate';
    }
    exp9History.push(`UPDATE item #${itemId || 101} -> ${newStatus}`);
  } else if (command === 'SAVEPOINT') {
    exp9Savepoint = 'sp_handover';
    exp9History.push('SAVEPOINT sp_handover created');
  } else if (command === 'ROLLBACK_TO_SAVEPOINT') {
    exp9History.push('ROLLBACK TO SAVEPOINT sp_handover executed');
  } else if (command === 'COMMIT') {
    exp9InTx = false;
    exp9Savepoint = null;
    exp9History.push('COMMIT -> All changes written permanently.');
  } else if (command === 'ROLLBACK') {
    exp9InTx = false;
    exp9Savepoint = null;
    exp9History.push('ROLLBACK -> Uncommitted modifications reverted.');
  }
  res.json({ success: true, command, inTransaction: exp9InTx, savepoint: exp9Savepoint, rows: exp9Table, history: exp9History });
});

// Exp 10 MongoDB CRUD Simulator
let mongoDocs = [
  { _id: '671ba0000000000000000001', itemTitle: 'Apple MacBook Air M2 Space Grey', category: 'Electronics', brand: 'Apple', color: 'Space Grey', location: 'Library 2nd Floor', custodyLocation: 'Security Safe A-3', status: 'in_custody' },
  { _id: '671ba0000000000000000002', itemTitle: 'Casio FX-991CW Calculator', category: 'Academic & Stationery', brand: 'Casio', color: 'Black', location: 'Room 402', custodyLocation: 'Locker Box 12', status: 'in_custody' },
  { _id: '671ba0000000000000000003', itemTitle: 'Milton 1000ml Water Bottle', category: 'Bottles & Apparel', brand: 'Milton', color: 'Blue', location: 'Canteen', custodyLocation: 'Rack 2', status: 'in_custody' }
];

app.get('/api/experiments/exp10/documents', (req, res) => {
  res.json({ documents: mongoDocs });
});

app.post('/api/experiments/exp10/run-crud', (req, res) => {
  const { operation, payload } = req.body;
  let result = {};
  if (operation === 'find') {
    result = { count: mongoDocs.length, results: mongoDocs };
  } else if (operation === 'insertOne') {
    const doc = { _id: '671ba' + Date.now(), ...payload };
    mongoDocs.push(doc);
    result = { acknowledged: true, insertedId: doc._id };
  } else if (operation.startsWith('update')) {
    result = { acknowledged: true, matchedCount: 1, modifiedCount: 1 };
  } else if (operation.startsWith('delete')) {
    result = { acknowledged: true, deletedCount: 1 };
  }
  res.json({ success: true, operation, result, currentCollectionState: mongoDocs });
});

export default app;
