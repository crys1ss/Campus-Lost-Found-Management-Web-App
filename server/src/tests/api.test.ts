import test from 'node:test';
import assert from 'node:assert/strict';
import { db } from '../db/database.js';
import { calculateMatchScore } from '../utils/matcher.js';

test('1. Database connectivity and Seed Integrity', () => {
  const users = db.query('SELECT count(*) as count FROM users');
  assert.ok(users[0].count >= 5, 'Should have at least 5 seeded users');

  const categories = db.query('SELECT count(*) as count FROM categories');
  assert.ok(categories[0].count >= 6, 'Should have at least 6 standard categories');
});

test('2. Matching Engine Rule-Based Scoring', () => {
  const lostMacBook = {
    category_id: 1,
    title: 'Apple MacBook Air M2 13-inch',
    description: 'Space grey laptop left in library',
    color: 'Space Grey',
    brand: 'Apple',
    location: 'Central Library 2nd Floor',
    date_lost: '2026-10-22',
  };

  const matchingFoundMacBook = {
    category_id: 1,
    title: 'Apple MacBook Air Space Grey',
    description: 'Found on desk in 2nd floor library reading room',
    color: 'Space Grey',
    brand: 'Apple',
    location: 'Central Library',
    date_found: '2026-10-22',
  };

  const mismatchWaterBottle = {
    category_id: 6,
    title: 'Milton Steel Bottle',
    description: 'Blue insulated water bottle in canteen',
    color: 'Blue',
    brand: 'Milton',
    location: 'Canteen',
    date_found: '2026-10-25',
  };

  const highMatch = calculateMatchScore(lostMacBook, matchingFoundMacBook);
  assert.ok(highMatch.score >= 80, `MacBook match score should be high (>=80), got ${highMatch.score}`);
  assert.equal(highMatch.reasons.categoryMatch, true);
  assert.equal(highMatch.reasons.brandMatch, true);

  const lowMatch = calculateMatchScore(lostMacBook, mismatchWaterBottle);
  assert.ok(lowMatch.score < 20, `Different category and brand score should be low, got ${lowMatch.score}`);
});

test('3. SQL Transaction Integrity (ACID rollback & commit)', () => {
  // Test transaction rollback
  const initialCount = db.get<{ c: number }>('SELECT count(*) as c FROM activity_logs')?.c || 0;

  try {
    db.transaction(() => {
      db.run("INSERT INTO activity_logs (action, entity_type, details) VALUES ('TEST_ACTION', 'test', 'will rollback')");
      throw new Error('Simulated failure triggering rollback');
    });
  } catch (err) {
    // Expected error
  }

  const afterRollbackCount = db.get<{ c: number }>('SELECT count(*) as c FROM activity_logs')?.c || 0;
  assert.equal(afterRollbackCount, initialCount, 'Transaction rollback should preserve initial state');

  // Test transaction commit
  db.transaction(() => {
    db.run("INSERT INTO activity_logs (action, entity_type, details) VALUES ('COMMITTED_ACTION', 'test', 'saved permanently')");
  });

  const afterCommitCount = db.get<{ c: number }>('SELECT count(*) as c FROM activity_logs')?.c || 0;
  assert.equal(afterCommitCount, initialCount + 1, 'Transaction commit should add exactly one row');
});

test('4. Handover Workflow and Receipt Generation', () => {
  const claim = db.get<any>("SELECT * FROM claims WHERE status = 'APPROVED' LIMIT 1");
  assert.ok(claim, 'Must have at least one approved claim');

  const receiptNo = `TEST-REC-${Date.now()}`;
  const returnResult = db.run(
    `INSERT INTO return_records (claim_id, found_item_id, receiver_id, handed_over_by, receiver_id_proof, receipt_no, remarks)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [claim.id, claim.found_item_id, claim.claimant_id, 4, 'Student ID Card N022', receiptNo, 'Automated unit test handover']
  );

  assert.ok(returnResult.lastInsertRowid > 0, 'Return record should be successfully inserted');

  const fetched = db.get<any>('SELECT * FROM return_records WHERE receipt_no = ?', [receiptNo]);
  assert.equal(fetched.receipt_no, receiptNo);
});
