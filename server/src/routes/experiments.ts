import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';

const router = Router();

// Structured Experiments 1-10 Catalog mapping
router.get('/catalog', (_req: Request, res: Response) => {
  const experiments = [
    {
      id: 1,
      title: 'Requirements Engineering & Case Study Selection',
      aim: 'Conduct literature survey to shortlist 5 domains, frame problem statement, define project scope, feasibility study, and identify functional & non-functional requirements.',
      implementation: 'Formulated the Campus Lost & Found Management System problem statement for NMIMS MPSTME. Gathered 19 Functional Requirements (FR-1 to FR-19) and 12 Non-Functional Requirements (NFR-1 to NFR-12).',
      deliverables: ['Problem Statement', '5 Case Studies Shortlist', 'Scope & Feasibility Analysis', 'FRs & NFRs Matrix'],
      diagramType: 'Requirements Specification',
      diagramImage: null,
      featureLink: '/report-lost',
      status: 'VERIFIED_COMPLETE',
    },
    {
      id: 2,
      title: 'Agile Requirements Gathering with User Stories',
      aim: 'Write effective Agile User Stories with detailed Story Tests and Acceptance Criteria for quality and non-functional requirements (Usability, Reliability, Performance, Security).',
      implementation: 'Specified User Stories across Student, Faculty, Security Staff, and Administrator roles with concrete Acceptance Criteria (e.g. response time < 1s, role-based route guard, transaction safety).',
      deliverables: ['Role-based User Stories', 'Acceptance Tests', 'Definition of Done', 'Security Story Tests'],
      diagramType: 'Agile User Stories',
      diagramImage: null,
      featureLink: '/dashboard',
      status: 'VERIFIED_COMPLETE',
    },
    {
      id: 3,
      title: "User's View Analysis: Use Case Diagram",
      aim: 'Perform use-case modeling to capture actor interactions, include/extend relationships, and system boundaries for Campus Lost & Found.',
      implementation: 'Full Use Case model with 3 primary actors (Campus User, Security Personnel, Administrator), 1 external actor (Notification Service), and 12 use cases with <<include>> and <<extend>> relationships.',
      deliverables: ['StarUML Use Case Model', 'Actor Hierarchy', 'Use Case Description Tables'],
      diagramType: 'Use Case Diagram',
      diagramImage: '/diagrams/SE_exp_image1.png',
      featureLink: '/browse',
      status: 'VERIFIED_COMPLETE',
    },
    {
      id: 4,
      title: 'Scenario-Based Dynamic Modeling: Activity Diagram',
      aim: 'Model sequential, branched, and concurrent activity flows across swimlanes for reporting, match evaluation, custody, and claim verification.',
      implementation: 'Constructed detailed multi-swimlane Activity Diagram showing the lifecycles of Lost & Found reporting, automated match alert generation, claim evaluation, and return.',
      deliverables: ['Activity Flowchart with Swimlanes', 'Decision Diamonds', 'Fork & Join Nodes'],
      diagramType: 'Activity Diagram',
      diagramImage: '/diagrams/SE_exp_image3.png',
      featureLink: '/report-found',
      status: 'VERIFIED_COMPLETE',
    },
    {
      id: 5,
      title: 'Structural Data Modeling: Class Diagram',
      aim: 'Design domain classes, attributes, methods, visibility, and associations (inheritance, composition, aggregation, dependency).',
      implementation: 'Created complete object-oriented class hierarchy: User (abstract) -> CampusUser -> Student / Staff; SecurityPersonnel; Administrator; Item -> LostItem / FoundItem; ItemCategory; Match; MatchingEngine; Claim; ReturnRecord.',
      deliverables: ['Class Attributes & Operations', 'Multiplicity & Associations', 'Enumerations for Status'],
      diagramType: 'Class Diagram',
      diagramImage: '/diagrams/SE_exp_image4.png',
      featureLink: '/admin',
      status: 'VERIFIED_COMPLETE',
    },
    {
      id: 6,
      title: 'Behavioral Modeling: Sequence Diagram',
      aim: 'Capture time-ordered message passing and interactions among lifelines for a complete student report, matching, verification, and handover scenario.',
      implementation: 'Drawn chronological sequence diagram spanning Student, SystemController, LostItem, MatchingEngine, Database, Claim, SecurityPersonnel, and ReturnRecord with alt fragments for APPROVED vs REJECTED.',
      deliverables: ['Synchronous & Asynchronous Messages', 'Activation Boxes', 'Alt Fragments', 'Return Messages'],
      diagramType: 'Sequence Diagram',
      diagramImage: '/diagrams/SE_exp_image5.png',
      featureLink: '/security',
      status: 'VERIFIED_COMPLETE',
    },
    {
      id: 7,
      title: 'Behavioral View: Collaboration (Communication) Diagram',
      aim: 'Illustrate structural relationships between objects with sequenced message numbering to analyze object communication during claim handover.',
      implementation: 'Modeled object communication links between Student (Actor), LostFoundPortal, MatchingEngine, ClaimManager, SecurityDesk, and HandoverLedger with numbered messages (1 to 14.1).',
      deliverables: ['Collaboration Diagram', 'Numbered Message Sequence', 'Object Links'],
      diagramType: 'Collaboration Diagram',
      diagramImage: '/diagrams/EXP7_image1.png',
      featureLink: '/security',
      status: 'VERIFIED_COMPLETE',
    },
    {
      id: 8,
      title: 'Database Normalization (1NF, 2NF, 3NF)',
      aim: 'Decompose unnormalized campus lost & found tables into normalized 3NF relations to eliminate insertion, update, and deletion anomalies.',
      implementation: 'Transformed raw multi-valued and partially dependent registers into 9 normalized relational tables with clear Primary Keys, Foreign Keys, unique constraints, and referential integrity.',
      deliverables: ['1NF Multi-value Atomicity', '2NF Partial Dependency Removal', '3NF Transitive Dependency Removal', 'ER Schema'],
      diagramType: 'Database Schema & Relational Model',
      diagramImage: '/diagrams/Experiment_8_image1.png',
      featureLink: '/admin',
      status: 'VERIFIED_COMPLETE',
    },
    {
      id: 9,
      title: 'Transaction Control (TCL) & Data Control (DCL)',
      aim: 'Demonstrate ACID transactions using COMMIT, ROLLBACK, SAVEPOINT, and ROLLBACK TO SAVEPOINT alongside user privileges using GRANT and REVOKE.',
      implementation: 'Integrated real SQL transaction boundaries for item handovers and developed an interactive SQL Transaction Simulator demonstrating COMMIT, ROLLBACK, SAVEPOINTS, and role-based privilege checks.',
      deliverables: ['Live TCL Transaction Runner', 'Savepoint Checkpoints', 'DCL Role Permissions Matrix', 'Standalone SQL Script'],
      diagramType: 'SQL TCL & DCL Architecture',
      diagramImage: '/diagrams/Experiment_9_image1.png',
      featureLink: '/experiments',
      status: 'VERIFIED_COMPLETE',
    },
    {
      id: 10,
      title: 'MongoDB CRUD Operations using Mongo Shell',
      aim: 'Demonstrate NoSQL document database concepts and execute insertOne, insertMany, find, updateOne, updateMany, deleteOne, and deleteMany using MongoDB shell.',
      implementation: 'Built an interactive MongoDB CRUD playground executing genuine document operations against a JSON document store with query projections, regex matching, and update operators, plus a standalone mongosh script.',
      deliverables: ['Interactive MongoDB CRUD Console', 'Standalone mongosh Script', 'Sample Document Schema', 'Expected Output Log'],
      diagramType: 'MongoDB Document Collections',
      diagramImage: '/diagrams/Experiment_10_image7.png',
      featureLink: '/experiments',
      status: 'VERIFIED_COMPLETE',
    },
  ];

  res.json({
    project: 'Campus Lost & Found Management System',
    institution: "SVKM's NMIMS Mukesh Patel School of Technology Management & Engineering (MPSTME)",
    department: 'Computer Engineering Department - MBA Tech CE',
    students: [
      { name: 'Tanay Dekate', rollNo: 'N022', sapId: '70011122001' },
      { name: 'Jivitesh Dutt', rollNo: 'N026', sapId: '70011122002' },
      { name: 'Gatha Jain', rollNo: 'N038', sapId: '70011122003' },
    ],
    experiments,
  });
});

// ----------------------------------------------------------------------------
// EXPERIMENT 9: Interactive TCL Transaction Simulator
// ----------------------------------------------------------------------------
// Dedicated test table for live interactive TCL execution
db.exec(`
  CREATE TABLE IF NOT EXISTS exp9_demo_table (
    id INTEGER PRIMARY KEY,
    item_name TEXT,
    custody_status TEXT,
    holder_name TEXT
  );
`);

// Reset test table with initial seed
function resetExp9Table() {
  db.exec('DELETE FROM exp9_demo_table;');
  db.run("INSERT INTO exp9_demo_table VALUES (101, 'Apple MacBook Air M2', 'IN_CUSTODY', 'Security Office Locker A');");
  db.run("INSERT INTO exp9_demo_table VALUES (102, 'Sony WH-1000XM5 Headphones', 'IN_CUSTODY', 'Security Office Locker B');");
  db.run("INSERT INTO exp9_demo_table VALUES (103, 'Casio FX-991CW Calculator', 'IN_CUSTODY', 'Desk Drawer 2');");
}

// Reset once if empty
const countExp9 = db.get<{ c: number }>('SELECT count(*) as c FROM exp9_demo_table')?.c || 0;
if (countExp9 === 0) {
  resetExp9Table();
}

let activeTransaction: boolean = false;
let currentSavepoint: string | null = null;
let transactionHistory: string[] = [];

router.get('/exp9/state', (_req: Request, res: Response) => {
  const rows = db.query('SELECT * FROM exp9_demo_table ORDER BY id ASC');
  res.json({
    rows,
    inTransaction: activeTransaction,
    savepoint: currentSavepoint,
    history: transactionHistory,
  });
});

router.post('/exp9/reset', (_req: Request, res: Response) => {
  if (activeTransaction) {
    try {
      db.exec('ROLLBACK;');
    } catch (e) {}
    activeTransaction = false;
  }
  currentSavepoint = null;
  transactionHistory = ['State reset to baseline.'];
  resetExp9Table();
  const rows = db.query('SELECT * FROM exp9_demo_table ORDER BY id ASC');
  res.json({ message: 'Table reset to initial state', rows, inTransaction: false });
});

router.post('/exp9/execute', (req: Request, res: Response) => {
  const { command, itemId, newStatus, newHolder } = req.body;

  try {
    let resultMessage = '';

    switch (command) {
      case 'START_TRANSACTION':
        if (activeTransaction) {
          return res.status(400).json({ error: 'A transaction is already active! COMMIT or ROLLBACK first.' });
        }
        db.exec('BEGIN TRANSACTION;');
        activeTransaction = true;
        currentSavepoint = null;
        resultMessage = 'START TRANSACTION executed. Transaction is now active.';
        transactionHistory.push('START TRANSACTION');
        break;

      case 'UPDATE_RECORD':
        if (!activeTransaction) {
          // In autocommit mode
          db.run(
            'UPDATE exp9_demo_table SET custody_status = ?, holder_name = ? WHERE id = ?',
            [newStatus || 'RETURNED', newHolder || 'Student Tanay Dekate (SAP 70011122001)', Number(itemId || 101)]
          );
          resultMessage = `Record #${itemId || 101} updated in AUTOCOMMIT mode (saved immediately).`;
          transactionHistory.push(`UPDATE item #${itemId || 101} -> ${newStatus} (Autocommit)`);
        } else {
          db.run(
            'UPDATE exp9_demo_table SET custody_status = ?, holder_name = ? WHERE id = ?',
            [newStatus || 'RETURNED', newHolder || 'Student Tanay Dekate (SAP 70011122001)', Number(itemId || 101)]
          );
          resultMessage = `Record #${itemId || 101} updated inside active transaction (uncommitted changes).`;
          transactionHistory.push(`UPDATE item #${itemId || 101} -> ${newStatus}`);
        }
        break;

      case 'SAVEPOINT':
        if (!activeTransaction) {
          return res.status(400).json({ error: 'Cannot create SAVEPOINT without an active transaction.' });
        }
        db.exec('SAVEPOINT sp_handover;');
        currentSavepoint = 'sp_handover';
        resultMessage = 'SAVEPOINT "sp_handover" created.';
        transactionHistory.push('SAVEPOINT sp_handover created');
        break;

      case 'ROLLBACK_TO_SAVEPOINT':
        if (!activeTransaction || !currentSavepoint) {
          return res.status(400).json({ error: 'No active savepoint to rollback to!' });
        }
        db.exec(`ROLLBACK TO SAVEPOINT ${currentSavepoint};`);
        resultMessage = `Rolled back to savepoint "${currentSavepoint}". Post-savepoint modifications reverted!`;
        transactionHistory.push(`ROLLBACK TO SAVEPOINT ${currentSavepoint}`);
        break;

      case 'COMMIT':
        if (!activeTransaction) {
          return res.status(400).json({ error: 'No transaction active to COMMIT.' });
        }
        db.exec('COMMIT;');
        activeTransaction = false;
        currentSavepoint = null;
        resultMessage = 'COMMIT executed successfully. All changes are permanently written to database disk!';
        transactionHistory.push('COMMIT -> All changes committed permanently.');
        break;

      case 'ROLLBACK':
        if (!activeTransaction) {
          return res.status(400).json({ error: 'No transaction active to ROLLBACK.' });
        }
        db.exec('ROLLBACK;');
        activeTransaction = false;
        currentSavepoint = null;
        resultMessage = 'ROLLBACK executed. All modifications made during this transaction have been completely undone!';
        transactionHistory.push('ROLLBACK -> All uncommitted changes discarded.');
        break;

      default:
        return res.status(400).json({ error: 'Unknown command: ' + command });
    }

    const rows = db.query('SELECT * FROM exp9_demo_table ORDER BY id ASC');
    res.json({
      success: true,
      command,
      resultMessage,
      inTransaction: activeTransaction,
      savepoint: currentSavepoint,
      rows,
      history: transactionHistory,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'TCL execution error: ' + err.message });
  }
});

// ----------------------------------------------------------------------------
// EXPERIMENT 10: Interactive MongoDB CRUD Runner
// ----------------------------------------------------------------------------
// In-memory document store for interactive MongoDB CRUD operations
let mongoDocuments: any[] = [
  {
    _id: '671ba0000000000000000001',
    itemTitle: 'Apple MacBook Air M2 Space Grey',
    category: 'Electronics',
    brand: 'Apple',
    color: 'Space Grey',
    foundLocation: 'Library 2nd Floor Reading Room Desk 14',
    foundDate: '2026-10-20T14:30:00Z',
    custodyLocation: 'Security Control Room Safe Cabinet A-3',
    status: 'in_custody',
    isValuable: true,
    tags: ['laptop', 'apple', 'macbook'],
  },
  {
    _id: '671ba0000000000000000002',
    itemTitle: 'Casio FX-991CW ClassWiz Scientific Calculator',
    category: 'Academic & Stationery',
    brand: 'Casio',
    color: 'Black',
    foundLocation: 'Room 402, 4th Floor Engineering Wing',
    foundDate: '2026-10-21T09:15:00Z',
    custodyLocation: 'Lost & Found Locker Box 12',
    status: 'in_custody',
    isValuable: false,
    tags: ['calculator', 'casio', 'exam'],
  },
  {
    _id: '671ba0000000000000000003',
    itemTitle: 'Stainless Steel Insulated Water Bottle (Milton 1000ml)',
    category: 'Bottles & Apparel',
    brand: 'Milton',
    color: 'Metallic Blue',
    foundLocation: 'MPSTME Ground Floor Canteen Table 8',
    foundDate: '2026-10-22T13:00:00Z',
    custodyLocation: 'Lost & Found Rack 2',
    status: 'in_custody',
    isValuable: false,
    tags: ['bottle', 'canteen'],
  },
  {
    _id: '671ba000000000000000004',
    itemTitle: 'Sony WH-1000XM5 Wireless Headphones',
    category: 'Electronics',
    brand: 'Sony',
    color: 'Silver',
    foundLocation: 'Computer Lab 612',
    foundDate: '2026-10-23T16:45:00Z',
    custodyLocation: 'Security Safe Cabinet B-1',
    status: 'in_custody',
    isValuable: true,
    tags: ['audio', 'sony', 'headphones'],
  },
];

let docIdCounter = 5;

router.get('/exp10/documents', (_req: Request, res: Response) => {
  res.json({
    collection: 'found_items',
    count: mongoDocuments.length,
    documents: mongoDocuments,
  });
});

router.post('/exp10/run-crud', (req: Request, res: Response) => {
  const { operation, payload } = req.body;

  try {
    let resultPayload: any = {};

    switch (operation) {
      case 'insertOne': {
        const newDoc = {
          _id: '671ba' + String(docIdCounter++).padStart(19, '0'),
          ...payload,
        };
        mongoDocuments.push(newDoc);
        resultPayload = { acknowledged: true, insertedId: newDoc._id };
        break;
      }

      case 'insertMany': {
        const docs = Array.isArray(payload) ? payload : [payload];
        const insertedIds: Record<number, string> = {};
        docs.forEach((d, idx) => {
          const newDoc = {
            _id: '671ba' + String(docIdCounter++).padStart(19, '0'),
            ...d,
          };
          mongoDocuments.push(newDoc);
          insertedIds[idx] = newDoc._id;
        });
        resultPayload = { acknowledged: true, insertedCount: docs.length, insertedIds };
        break;
      }

      case 'find': {
        const filter = payload?.filter || {};
        const matches = mongoDocuments.filter(doc => {
          for (const k in filter) {
            if (filter[k] && typeof filter[k] === 'object' && filter[k].$regex) {
              const regex = new RegExp(filter[k].$regex, filter[k].$options || 'i');
              if (!regex.test(doc[k])) return false;
            } else if (doc[k] !== filter[k]) {
              return false;
            }
          }
          return true;
        });
        resultPayload = { count: matches.length, results: matches };
        break;
      }

      case 'updateOne': {
        const { filter = {}, update = {} } = payload;
        const target = mongoDocuments.find(doc => {
          for (const k in filter) {
            if (filter[k] && typeof filter[k] === 'object' && filter[k].$regex) {
              const regex = new RegExp(filter[k].$regex, filter[k].$options || 'i');
              if (!regex.test(doc[k])) return false;
            } else if (doc[k] !== filter[k]) {
              return false;
            }
          }
          return true;
        });

        if (target) {
          if (update.$set) Object.assign(target, update.$set);
          if (update.$push) {
            for (const key in update.$push) {
              if (Array.isArray(target[key])) target[key].push(update.$push[key]);
            }
          }
          resultPayload = { acknowledged: true, matchedCount: 1, modifiedCount: 1 };
        } else {
          resultPayload = { acknowledged: true, matchedCount: 0, modifiedCount: 0 };
        }
        break;
      }

      case 'updateMany': {
        const { filter = {}, update = {} } = payload;
        let count = 0;
        mongoDocuments.forEach(doc => {
          let match = true;
          for (const k in filter) {
            if (filter[k] && typeof filter[k] === 'object' && filter[k].$regex) {
              const regex = new RegExp(filter[k].$regex, filter[k].$options || 'i');
              if (!regex.test(doc[k])) match = false;
            } else if (doc[k] !== filter[k]) {
              match = false;
            }
          }
          if (match) {
            if (update.$set) Object.assign(doc, update.$set);
            count++;
          }
        });
        resultPayload = { acknowledged: true, matchedCount: count, modifiedCount: count };
        break;
      }

      case 'deleteOne': {
        const filter = payload || {};
        const idx = mongoDocuments.findIndex(doc => {
          for (const k in filter) {
            if (filter[k] && typeof filter[k] === 'object' && filter[k].$regex) {
              const regex = new RegExp(filter[k].$regex, filter[k].$options || 'i');
              if (!regex.test(doc[k])) return false;
            } else if (doc[k] !== filter[k]) {
              return false;
            }
          }
          return true;
        });

        if (idx !== -1) {
          mongoDocuments.splice(idx, 1);
          resultPayload = { acknowledged: true, deletedCount: 1 };
        } else {
          resultPayload = { acknowledged: true, deletedCount: 0 };
        }
        break;
      }

      case 'deleteMany': {
        const filter = payload || {};
        const initialLen = mongoDocuments.length;
        mongoDocuments = mongoDocuments.filter(doc => {
          for (const k in filter) {
            if (doc[k] === filter[k]) return false;
          }
          return true;
        });
        resultPayload = { acknowledged: true, deletedCount: initialLen - mongoDocuments.length };
        break;
      }

      default:
        return res.status(400).json({ error: 'Unsupported operation: ' + operation });
    }

    res.json({
      success: true,
      operation,
      result: resultPayload,
      currentCollectionState: mongoDocuments,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'MongoDB operation failed: ' + err.message });
  }
});

export default router;
