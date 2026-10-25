# Campus Lost & Found Management Web App (CampusFind)
### SVKM's NMIMS MPSTME — Software Engineering Lab Experiments 1–10 Project

[![Node.js](https://img.shields.io/badge/Node.js-v24.x-339933?logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18.x-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.7-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-v6.x-646CFF?logo=vite)](https://vitejs.dev/)
[![SQLite](https://img.shields.io/badge/SQLite-3NF%20ACID-003B57?logo=sqlite)](https://sqlite.org/)
[![License](https://img.shields.io/badge/License-MIT-peach)](LICENSE)

A complete, working, lightweight full-stack web application designed for college campuses. **CampusFind** automates lost and found reporting, intelligent rule-based similarity matching, secure security locker custody tracking, ownership claim verification, and receipt-audited physical handovers.

This project practically demonstrates all concepts covered in **Software Engineering Lab Experiments 1 through 10** at **Mukesh Patel School of Technology Management & Engineering (MPSTME)**.

---

## 👥 Student Contributors & Academic Details

- **Institution:** SVKM's NMIMS Mukesh Patel School of Technology Management & Engineering (MPSTME), Mumbai
- **Department:** Computer Engineering Department
- **Program:** MBA Tech Computer Engineering (CE) — Division D, Batch D1
- **Course:** Software Engineering (SE) Lab
- **Team Members:**
  1. **Tanay Dekate** — Roll No: `N022` | SAP ID: `70011122001`
  2. **Jivitesh Dutt** — Roll No: `N026` | SAP ID: `70011122002`
  3. **Gatha Jain** — Roll No: `N038` | SAP ID: `70011122003`

---

## 📑 Software Engineering Lab Curriculum Mapping (Experiments 1–10)

| Exp # | Experiment Title | Concepts & Deliverables | CampusFind Practical Feature |
| :---: | :--- | :--- | :--- |
| **01** | **Requirements Engineering** | Problem statement, 5 case studies survey, scope, feasibility, FR-1 to FR-19 & NFR-1 to NFR-12. | Functional requirements implemented across reporting, custody, and return workflows. Documented in [Lab Showcase](http://localhost:5173/experiments). |
| **02** | **Agile Requirements with User Stories** | Non-Functional Requirements (Usability, Reliability, Performance, Security), Story Tests, Acceptance Criteria. | Enforced role-based access control, response times under 1 second, session protection, and transactional data integrity. |
| **03** | **Use Case Diagram** | Actors (Campus User, Security Personnel, Administrator), System boundaries, `<<include>>` and `<<extend>>` links. | Native StarUML `.mdj` model + authentic diagram rendered in UI. Live role switching between student, guard, and admin. |
| **04** | **Activity Diagram** | Dynamic scenario-based modeling with swimlanes, decision diamonds, fork/join nodes. | Multi-swimlane visual workflow for reporting, match evaluation, locker custody, and verification handover. |
| **05** | **Class Diagram** | Object-oriented class hierarchy: `User` (abstract), `CampusUser`, `SecurityPersonnel`, `Administrator`, `Item`, `LostItem`, `FoundItem`, `Claim`, `ReturnRecord`. | Backend normalized relational entities, TypeScript interfaces, and OOP data layer matching StarUML model. |
| **06** | **Sequence Diagram** | Time-ordered message sequences with synchronous/asynchronous calls and `alt` fragments (`APPROVED` vs `REJECTED`). | Implemented claim verification flow and physical handover transaction emitting return receipts. |
| **07** | **Collaboration Diagram** | Object communication links with numbered message sequence passing (1 to 14.1). | Numbered message passing between Student, Controller, MatchingEngine, SecurityDesk, and HandoverLedger. |
| **08** | **Database Normalization** | Relational schema decomposed into 1NF, 2NF, and 3NF to eliminate insertion, update, and deletion anomalies. | 9 normalized relational tables with primary keys, foreign keys, unique constraints, and search indexes in SQLite. |
| **09** | **TCL & DCL SQL Commands** | Transaction Control (`COMMIT`, `ROLLBACK`, `SAVEPOINT`, `ROLLBACK TO SAVEPOINT`) and Data Control (`GRANT`, `REVOKE`). | **Interactive Live SQL Transaction Simulator** in UI running genuine SQL commands against database disk + [`scripts/experiment_9_tcl_dcl.sql`](scripts/experiment_9_tcl_dcl.sql). |
| **10** | **MongoDB CRUD Operations** | NoSQL document database, collections (`found_items`), BSON CRUD commands (`insertOne`, `insertMany`, `find`, `updateOne`, `deleteMany`). | **Interactive MongoDB CRUD Playground** in UI with JSON queries and projections + standalone [`scripts/experiment_10_mongodb_crud.js`](scripts/experiment_10_mongodb_crud.js). |

---

## 🎨 UI/UX Design System (Peach & Cream Palette)

The frontend features a student-project aesthetic:
- **Color Palette:** Warm off-white background (`#FAF8F5`), soft peach accents (`#E07A5F` / `#D95D39`), warm ivory cream (`#FDF0E7`), and high-contrast charcoal typography (`#1E293B`).
- **Typography:** Google Fonts **Outfit** (headings) and **Inter** (body text).
- **Interactive Feedback:** 1-Click Demo Role Switcher, animated modals, empty state illustrations, toast alerts, and confetti upon verified handover.
- **Privacy-First Anti-Fraud:** Found item listings hide confidential identifying marks from the public to prevent fraudulent claims.

---

## ⚡ Quickstart Guide (Run in 2 Minutes)

### Prerequisites
- [Node.js](https://nodejs.org/) v18, v20, v22, or v24+ (Node.js v24.14.0 tested and recommended)
- `npm` (bundled with Node.js)

### 1. Clone the Repository
```bash
git clone https://github.com/crys1ss/Campus-Lost-Found-Management-Web-App.git
cd "Campus-Lost-Found-Management-Web-App"
```

### 2. Install Dependencies
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install

# Return to root directory
cd ..
```

### 3. Launch the Application (One Command)
```bash
npm start
# or: node start.js
```
This automatically boots:
- **Backend API Server:** `http://localhost:5000`
- **Frontend Vite Web App:** `http://localhost:5173`

Open **`http://localhost:5173`** in your browser.

---

## 🔑 Demo Login Accounts

During live presentations, use the **1-Click Role Switcher** on the top black banner of the website, or log in with these credentials:

| Role | Name | Email | Password | Identifier / Roll |
| :--- | :--- | :--- | :--- | :--- |
| **Campus User (Student)** | Tanay Dekate | `tanay@nmims.edu` | `password123` | Roll: `N022` (SAP: `70011122001`) |
| **Security Personnel** | Officer Ramesh Shinde | `security@nmims.edu` | `password123` | Badge: `SEC-402` |
| **Administrator** | Dr. K. Mehta | `admin@nmims.edu` | `password123` | ID: `ADM-001` (Dean / IT Cell) |

---

## 🧪 Automated Testing

Run the automated integration and unit test suite verifying database connectivity, 3NF seed integrity, rule-based matching scores, ACID transaction rollback/commit, and return receipt generation:

```bash
npm test
```
*Expected result:*
```
✔ 1. Database connectivity and Seed Integrity
✔ 2. Matching Engine Rule-Based Scoring
✔ 3. SQL Transaction Integrity (ACID rollback & commit)
✔ 4. Handover Workflow and Receipt Generation
ℹ pass 4, fail 0
```

---

## 🍃 Running Experiment 10 (MongoDB CRUD)

Experiment 10 can be executed in two ways:

### Option A: Standalone Node.js Runner (Zero External Prerequisites)
```bash
npm run test:mongo
# or: node scripts/experiment_10_mongodb_crud.js
```
Demonstrates `createCollection`, `insertOne`, `insertMany`, `find` with filters & projections, `updateOne`, `updateMany`, `deleteOne`, and `deleteMany`.

### Option B: Native MongoDB Shell (`mongosh`)
If MongoDB is installed locally on your system:
```bash
mongosh < scripts/experiment_10_mongodb_crud.js
```

### Option C: Interactive UI Console
Navigate to **`http://localhost:5173/experiments`**, click **Experiment 10**, and interactively test `db.found_items.find()` or `insertOne()` directly with live JSON output.

---

## 💾 Running Experiment 9 (SQL TCL & DCL)

- **Interactive UI Simulator:** Navigate to **`http://localhost:5173/experiments`**, select **Experiment 09**, and click:
  1. `1. START TRANSACTION`
  2. `2. UPDATE RECORD`
  3. `3. SAVEPOINT sp_handover`
  4. `5. COMMIT` (or `6. ROLLBACK`)
  Watch the live table and audit logs update immediately on disk!
- **Standalone MySQL/RDBMS Script:** Open [`scripts/experiment_9_tcl_dcl.sql`](scripts/experiment_9_tcl_dcl.sql) and execute in MySQL Workbench or MySQL CLI:
  ```bash
  mysql -u root -p < scripts/experiment_9_tcl_dcl.sql
  ```

---

## 📐 StarUML Project Models

The editable StarUML project file is stored at:
- **`docs/staruml/CampusLostAndFound.mdj`**

You can open this `.mdj` file directly in StarUML to view the Use Case Diagram, Class Diagram, Activity Diagram, Sequence Diagram, and Collaboration Diagram.

---

## 📁 Repository Structure

```
├── client/                     # Frontend (React 18, TypeScript, Vite, Tailwind CSS)
│   ├── public/
│   │   └── diagrams/           # Authentic extracted StarUML diagrams from SE lab manuals
│   ├── src/
│   │   ├── components/         # Navbar, Footer, DemoBanner, ItemCard, ItemModal, ClaimModal
│   │   ├── context/            # AuthContext (JWT & demo switcher state)
│   │   ├── lib/                # Typed REST API client
│   │   ├── pages/              # Landing, Browse, ReportLost, ReportFound, Dashboards, Showcase
│   │   └── types/              # Comprehensive TypeScript interfaces
│   └── vite.config.ts          # Vite configuration with backend proxy
│
├── server/                     # Backend (Node.js, Express, SQLite 3NF)
│   ├── src/
│   │   ├── db/
│   │   │   ├── database.ts     # SQLite database wrapper with ACID transactions
│   │   │   ├── schema.sql      # 3NF normalized relational schema
│   │   │   └── seed.sql        # Realistic NMIMS campus seed data
│   │   ├── middleware/         # JWT authentication & role-based route guards
│   │   ├── routes/             # auth, items, matching, claims, security, admin, experiments
│   │   ├── tests/              # Automated unit and workflow tests
│   │   ├── utils/              # Rule-based matching engine
│   │   └── index.ts            # Main Express server entrypoint
│
├── docs/                       # Extracted SE Lab Manuals, Markdown notes, & StarUML models
│   ├── staruml/
│   │   └── CampusLostAndFound.mdj
│   └── all_experiments_detailed.md
│
├── scripts/
│   ├── experiment_9_tcl_dcl.sql          # Standalone SQL TCL & DCL script
│   └── experiment_10_mongodb_crud.js     # Standalone MongoDB CRUD script for mongosh & Node
│
├── start.js                    # Cross-platform concurrent runner
├── package.json                # Root package configuration
└── README.md
```

---

## 🛠️ Troubleshooting

- **Port Conflict (Port 5000 or 5173 already in use):**
  Edit `server/.env` or pass `PORT=5001 node start.js`.
- **Database Reset:**
  If you ever want to re-seed the SQLite database from scratch, simply delete `server/campus_lost_found.sqlite` and restart `npm start`. A fresh database with sample data will be created automatically.
- **Windows Path with `&`:**
  All scripts have been configured to use direct module entrypoints (`node --import tsx`), ensuring zero syntax errors regardless of folder names containing spaces or ampersands.

---

## 🎓 Academic Submission Statement

This project was developed by **Tanay Dekate (N022)**, **Jivitesh Dutt (N026)**, and **Gatha Jain (N038)** for the **Software Engineering Lab Evaluation** at SVKM's NMIMS MPSTME. All rights reserved © 2026.