-- ============================================================================
-- CAMPUS LOST & FOUND MANAGEMENT SYSTEM - RELATIONAL SCHEMA
-- Relational Normalization up to 3NF (Experiment 8 & Experiment 9)
-- SVKM's NMIMS MPSTME - Tanay Dekate (N022), Jivitesh Dutt (N026), Gatha Jain (N038)
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('campus_user', 'security_personnel', 'administrator')),
    user_type TEXT DEFAULT 'student',
    identifier TEXT,
    phone TEXT,
    department TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    retention_period_days INTEGER DEFAULT 90
);

CREATE TABLE IF NOT EXISTS lost_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    category_id INTEGER NOT NULL REFERENCES categories(id),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    color TEXT,
    brand TEXT,
    location TEXT NOT NULL,
    date_lost DATE NOT NULL,
    photo_url TEXT,
    contact_info TEXT,
    status TEXT DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'MATCH_PENDING', 'CLAIMED', 'RESOLVED', 'CLOSED')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS found_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    finder_id INTEGER REFERENCES users(id),
    category_id INTEGER NOT NULL REFERENCES categories(id),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    color TEXT,
    brand TEXT,
    location TEXT NOT NULL,
    date_found DATE NOT NULL,
    photo_url TEXT,
    storage_location TEXT DEFAULT 'Security Lost & Found Desk',
    custody_status TEXT DEFAULT 'IN_CUSTODY' CHECK (custody_status IN ('UNCOLLECTED', 'IN_CUSTODY', 'VAULT_LOCKED', 'RETURNED', 'DISPOSED')),
    is_verified INTEGER DEFAULT 1,
    verified_by INTEGER REFERENCES users(id),
    secret_identifying_details TEXT,
    status TEXT DEFAULT 'UNCLAIMED' CHECK (status IN ('UNCLAIMED', 'CLAIM_PENDING', 'RETURNED', 'AUCTIONED', 'DISPOSED')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS potential_matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lost_item_id INTEGER NOT NULL REFERENCES lost_items(id) ON DELETE CASCADE,
    found_item_id INTEGER NOT NULL REFERENCES found_items(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    match_reasons TEXT,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'DISMISSED')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(lost_item_id, found_item_id)
);

CREATE TABLE IF NOT EXISTS claims (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    found_item_id INTEGER NOT NULL REFERENCES found_items(id),
    lost_item_id INTEGER REFERENCES lost_items(id),
    claimant_id INTEGER NOT NULL REFERENCES users(id),
    proof_description TEXT NOT NULL,
    contact_phone TEXT,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED')),
    reviewer_id INTEGER REFERENCES users(id),
    reviewer_remarks TEXT,
    reviewed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS custody_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    found_item_id INTEGER NOT NULL REFERENCES found_items(id),
    officer_id INTEGER NOT NULL REFERENCES users(id),
    storage_location TEXT NOT NULL,
    action TEXT NOT NULL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS return_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    claim_id INTEGER NOT NULL REFERENCES claims(id),
    found_item_id INTEGER NOT NULL REFERENCES found_items(id),
    receiver_id INTEGER NOT NULL REFERENCES users(id),
    handed_over_by INTEGER NOT NULL REFERENCES users(id),
    receiver_id_proof TEXT NOT NULL,
    receipt_no TEXT UNIQUE NOT NULL,
    remarks TEXT,
    return_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS activity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id INTEGER,
    details TEXT,
    ip_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance and high-speed search
CREATE INDEX IF NOT EXISTS idx_lost_items_cat ON lost_items(category_id);
CREATE INDEX IF NOT EXISTS idx_lost_items_user ON lost_items(user_id);
CREATE INDEX IF NOT EXISTS idx_lost_items_status ON lost_items(status);
CREATE INDEX IF NOT EXISTS idx_found_items_cat ON found_items(category_id);
CREATE INDEX IF NOT EXISTS idx_found_items_status ON found_items(status);
CREATE INDEX IF NOT EXISTS idx_claims_item ON claims(found_item_id);
CREATE INDEX IF NOT EXISTS idx_claims_claimant ON claims(claimant_id);
CREATE INDEX IF NOT EXISTS idx_matches_score ON potential_matches(score DESC);
