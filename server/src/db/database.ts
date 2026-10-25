import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';

const DB_PATH = path.resolve(process.cwd(), 'campus_lost_found.sqlite');

export class AppDatabase {
  private db: DatabaseSync;

  constructor() {
    const isNew = !fs.existsSync(DB_PATH);
    this.db = new DatabaseSync(DB_PATH);
    this.initPragmas();

    if (isNew) {
      console.log('[Database] Initializing fresh database with schema and seed...');
      this.initSchema();
      this.initSeed();
    } else {
      // Ensure tables exist
      const check = this.query<{ name: string }>(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='users'"
      );
      if (check.length === 0) {
        console.log('[Database] Existing file but empty tables. Initializing schema and seed...');
        this.initSchema();
        this.initSeed();
      }
    }
    console.log(`[Database] Connected to SQLite database at ${DB_PATH}`);
  }

  private initPragmas() {
    this.db.exec('PRAGMA foreign_keys = ON;');
    this.db.exec('PRAGMA journal_mode = WAL;');
  }

  public initSchema() {
    const schemaPath = path.resolve(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const sql = fs.readFileSync(schemaPath, 'utf-8');
      this.db.exec(sql);
    }
  }

  public initSeed() {
    const seedPath = path.resolve(__dirname, 'seed.sql');
    if (fs.existsSync(seedPath)) {
      const sql = fs.readFileSync(seedPath, 'utf-8');
      this.db.exec(sql);
    }
  }

  public query<T = any>(sql: string, params: any[] = []): T[] {
    const stmt = this.db.prepare(sql);
    return stmt.all(...params) as T[];
  }

  public get<T = any>(sql: string, params: any[] = []): T | undefined {
    const stmt = this.db.prepare(sql);
    return stmt.get(...params) as T | undefined;
  }

  public run(sql: string, params: any[] = []): { changes: number; lastInsertRowid: number } {
    const stmt = this.db.prepare(sql);
    const result = stmt.run(...params);
    return {
      changes: Number(result.changes),
      lastInsertRowid: Number(result.lastInsertRowid),
    };
  }

  public exec(sql: string): void {
    this.db.exec(sql);
  }

  public transaction<T>(callback: () => T): T {
    this.db.exec('BEGIN TRANSACTION;');
    try {
      const result = callback();
      this.db.exec('COMMIT;');
      return result;
    } catch (err) {
      this.db.exec('ROLLBACK;');
      throw err;
    }
  }

  public getRawDb(): DatabaseSync {
    return this.db;
  }
}

export const db = new AppDatabase();
