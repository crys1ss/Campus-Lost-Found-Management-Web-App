-- ============================================================================
-- SOFTWARE ENGINEERING / DBMS LAB - EXPERIMENT 09
-- Topic: Transaction Control Language (TCL) & Data Control Language (DCL)
-- Student: Tanay Dekate (N022), Jivitesh Dutt (N026), Gatha Jain (N038)
-- SVKM's NMIMS MPSTME - Campus Lost & Found Management System
-- ============================================================================

-- ----------------------------------------------------------------------------
-- PART 1: TRANSACTION CONTROL LANGUAGE (TCL) DEMONSTRATION
-- ----------------------------------------------------------------------------
-- Scenario: When an item handover is conducted, multiple database operations
-- must succeed atomically:
-- 1. Verify and approve the ownership claim.
-- 2. Update found item status to 'RETURNED'.
-- 3. Mark matching lost item as 'RESOLVED'.
-- 4. Create an official audit return record with receipt code.
-- 5. If any step fails (e.g., student ID verification error), ROLLBACK or
--    ROLLBACK TO SAVEPOINT to preserve data integrity.
-- ----------------------------------------------------------------------------

-- Disable autocommit to manually govern transaction boundaries
SET autocommit = 0;

-- Test Table Setup for Demonstration
CREATE TABLE IF NOT EXISTS demo_item_handover (
    item_id INT PRIMARY KEY,
    item_name VARCHAR(100),
    custody_status VARCHAR(50),
    claimed_by VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS demo_handover_audit (
    audit_id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT,
    action VARCHAR(100),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Initial State Seeding
INSERT INTO demo_item_handover VALUES (101, 'Dell XPS 15 Laptop', 'IN_CUSTODY', NULL);
INSERT INTO demo_item_handover VALUES (102, 'Sony WH-1000XM5 Headphones', 'IN_CUSTODY', NULL);
COMMIT; -- Save initial state permanently

-- ----------------------------------------------------------------------------
-- TCL OPERATION 1: START TRANSACTION & COMMIT (Successful Handover)
-- ----------------------------------------------------------------------------
START TRANSACTION;

UPDATE demo_item_handover 
SET custody_status = 'RETURNED', claimed_by = 'Tanay Dekate (SAP 70011122001)'
WHERE item_id = 101;

INSERT INTO demo_handover_audit (item_id, action)
VALUES (101, 'Handover verified and signed by Security Officer Ramesh');

-- Commit permanently commits changes
COMMIT;

-- Verify committed state
SELECT * FROM demo_item_handover WHERE item_id = 101;


-- ----------------------------------------------------------------------------
-- TCL OPERATION 2: ROLLBACK (Transaction Abort due to Invalid ID Proof)
-- ----------------------------------------------------------------------------
START TRANSACTION;

-- Fraudulent claim attempt on item 102
UPDATE demo_item_handover 
SET custody_status = 'RETURNED', claimed_by = 'Unknown Student (Invalid ID)'
WHERE item_id = 102;

INSERT INTO demo_handover_audit (item_id, action)
VALUES (102, 'Verification FAILED: Student ID mismatch');

-- Officer notices the student ID is forged or invalid!
-- Entire transaction is aborted, restoring previous state.
ROLLBACK;

-- Verify that item 102 remains in custody!
SELECT * FROM demo_item_handover WHERE item_id = 102;


-- ----------------------------------------------------------------------------
-- TCL OPERATION 3: SAVEPOINT & ROLLBACK TO SAVEPOINT
-- ----------------------------------------------------------------------------
START TRANSACTION;

-- Step A: Officer updates item inspection notes
UPDATE demo_item_handover 
SET custody_status = 'VERIFIED_READY_FOR_PICKUP'
WHERE item_id = 102;

-- Establish a checkpoint
SAVEPOINT before_handover;

-- Step B: Attempt handover with temporary receipt
UPDATE demo_item_handover 
SET custody_status = 'RELEASED_TEMPORARY', claimed_by = 'Temporary Claimant'
WHERE item_id = 102;

-- Claimant fails to submit physical ID card photocopy
-- Undo ONLY step B, keeping Step A intact!
ROLLBACK TO SAVEPOINT before_handover;

-- Now complete transaction with clean audit record
INSERT INTO demo_handover_audit (item_id, action)
VALUES (102, 'Inspection preserved; Handover deferred pending ID submission');

COMMIT;

-- Final Verification
SELECT * FROM demo_item_handover WHERE item_id = 102;
SELECT * FROM demo_handover_audit;


-- ----------------------------------------------------------------------------
-- PART 2: DATA CONTROL LANGUAGE (DCL) DEMONSTRATION
-- ----------------------------------------------------------------------------
-- Purpose: Role-Based Access Control (RBAC) in Multi-User Campus System.
-- Three distinct database roles/users are established:
-- 1. campus_user_role: Can view public items and insert/update their own reports.
-- 2. security_desk: Can manage custody records, update status, and review claims.
-- 3. admin_role: Full DDL and DML access across all tables and audit logs.
-- ----------------------------------------------------------------------------

-- Step 1: Create Database Users
CREATE USER IF NOT EXISTS 'campus_student'@'localhost' IDENTIFIED BY 'StudentPass#2026';
CREATE USER IF NOT EXISTS 'security_desk'@'localhost' IDENTIFIED BY 'SecGuard#Safe2026';
CREATE USER IF NOT EXISTS 'campus_admin'@'localhost' IDENTIFIED BY 'AdminRoot#NMIMS2026';

-- Step 2: Grant Permissions (GRANT)
-- Granting limited read/report privileges to Students
GRANT SELECT, INSERT ON campus_lost_found.lost_items TO 'campus_student'@'localhost';
GRANT SELECT ON campus_lost_found.found_items TO 'campus_student'@'localhost';
GRANT SELECT, INSERT ON campus_lost_found.claims TO 'campus_student'@'localhost';

-- Granting custody and claim management privileges to Security
GRANT SELECT, INSERT, UPDATE ON campus_lost_found.found_items TO 'security_desk'@'localhost';
GRANT SELECT, UPDATE ON campus_lost_found.claims TO 'security_desk'@'localhost';
GRANT SELECT, INSERT, UPDATE ON campus_lost_found.custody_records TO 'security_desk'@'localhost';
GRANT SELECT, INSERT ON campus_lost_found.return_records TO 'security_desk'@'localhost';

-- Granting administrative privileges to Campus Admin
GRANT ALL PRIVILEGES ON campus_lost_found.* TO 'campus_admin'@'localhost' WITH GRANT OPTION;

-- Refresh user privilege tables
FLUSH PRIVILEGES;

-- Step 3: Inspect Assigned Privileges
SHOW GRANTS FOR 'campus_student'@'localhost';
SHOW GRANTS FOR 'security_desk'@'localhost';
SHOW GRANTS FOR 'campus_admin'@'localhost';

-- Step 4: Revoke Permissions (REVOKE)
-- Example: Revoking UPDATE permission on claims if a temporary security officer departs
REVOKE UPDATE ON campus_lost_found.claims FROM 'security_desk'@'localhost';

-- Refresh privileges
FLUSH PRIVILEGES;

-- Verify revoked status
SHOW GRANTS FOR 'security_desk'@'localhost';
