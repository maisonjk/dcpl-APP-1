import Database from "better-sqlite3";
import path from "path";

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), "data.db");

export const db = new Database(DB_PATH);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// migrations
try { db.exec("ALTER TABLE prayers ADD COLUMN shared INTEGER NOT NULL DEFAULT 0"); } catch {}

// Password reset tokens table
try {
  db.exec(`CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    expires_at INTEGER NOT NULL,
    used INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  )`);
} catch {}
try {
  db.exec(`CREATE TABLE IF NOT EXISTS prayer_shares (
    prayer_id INTEGER NOT NULL REFERENCES prayers(id) ON DELETE CASCADE,
    shared_with_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (prayer_id, shared_with_user_id)
  )`);
} catch {}

db.exec(`
  CREATE TABLE IF NOT EXISTS prayer_reactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    prayer_id INTEGER NOT NULL REFERENCES prayers(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    UNIQUE(prayer_id, user_id)
  );

  CREATE TABLE IF NOT EXISTS encouragements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    username TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    tier TEXT NOT NULL DEFAULT 'free',
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  );

  CREATE TABLE IF NOT EXISTS prayers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    category_tags TEXT NOT NULL DEFAULT '[]',
    answered INTEGER NOT NULL DEFAULT 0,
    answer_text TEXT,
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    updated_at INTEGER NOT NULL DEFAULT (unixepoch())
  );

  CREATE TABLE IF NOT EXISTS missions (
    id TEXT NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'idle',
    updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
    PRIMARY KEY (id, user_id)
  );

  CREATE TABLE IF NOT EXISTS accountability_partners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    requester_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    partner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    UNIQUE(requester_id, partner_id)
  );

  CREATE TABLE IF NOT EXISTS progress (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    current_streak INTEGER NOT NULL DEFAULT 0,
    level INTEGER NOT NULL DEFAULT 1,
    completed_missions_count INTEGER NOT NULL DEFAULT 0,
    checklist_prayer INTEGER NOT NULL DEFAULT 0,
    checklist_word INTEGER NOT NULL DEFAULT 0,
    checklist_obedience INTEGER NOT NULL DEFAULT 0,
    last_checkin_date TEXT,
    active_verse_id TEXT NOT NULL DEFAULT 'v1',
    path_requirements TEXT NOT NULL DEFAULT '[]',
    updated_at INTEGER NOT NULL DEFAULT (unixepoch())
  );
`);

export type DbUser = {
  id: number;
  email: string;
  username: string;
  password_hash: string;
  tier: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: number;
};

export type DbProgress = {
  user_id: number;
  current_streak: number;
  level: number;
  completed_missions_count: number;
  checklist_prayer: number;
  checklist_word: number;
  checklist_obedience: number;
  last_checkin_date: string | null;
  active_verse_id: string;
  path_requirements: string;
  updated_at: number;
};

export type DbPrayer = {
  id: number;
  user_id: number;
  text: string;
  category_tags: string;
  answered: number;
  answer_text: string | null;
  shared: number;
  created_at: number;
  updated_at: number;
};

export type DbMission = {
  id: string;
  user_id: number;
  status: string;
  updated_at: number;
};
