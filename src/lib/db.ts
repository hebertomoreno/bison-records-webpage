import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "bison.db");

let _db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH);
    _db.pragma("journal_mode = WAL");
    initSchema(_db);
  }
  return _db;
}

function initSchema(db: Database.Database) {
  // Add release_type column to existing databases if missing
  const cols = db.prepare("PRAGMA table_info(releases)").all() as { name: string }[];
  if (cols.length > 0 && !cols.find((c) => c.name === "release_type")) {
    db.exec(`ALTER TABLE releases ADD COLUMN release_type TEXT NOT NULL DEFAULT 'Album'`);
  }

  db.exec(`
    CREATE TABLE IF NOT EXISTS releases (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      artist        TEXT    NOT NULL,
      title         TEXT    NOT NULL,
      date          TEXT    NOT NULL,
      image         TEXT    NOT NULL,
      href          TEXT    NOT NULL,
      type          TEXT    NOT NULL CHECK(type IN ('upcoming', 'recent')),
      release_type  TEXT    NOT NULL DEFAULT 'Album' CHECK(release_type IN ('Album', 'Single', 'EP')),
      sort_order    INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS tracks (
      id          TEXT PRIMARY KEY,
      title       TEXT NOT NULL,
      artist      TEXT,
      description TEXT,
      duration    TEXT,
      recorded_at TEXT,
      file        TEXT NOT NULL UNIQUE
    );
  `);
}

// ── Releases ────────────────────────────────────────────────────────

export interface ReleaseRow {
  id: number;
  artist: string;
  title: string;
  date: string;
  image: string;
  href: string;
  type: "upcoming" | "recent";
  release_type: "Album" | "Single" | "EP";
  sort_order: number;
}

export function getUpcomingReleases(): ReleaseRow[] {
  return getDb()
    .prepare(`SELECT * FROM releases WHERE type = 'upcoming' ORDER BY sort_order ASC`)
    .all() as ReleaseRow[];
}

export function getRecentReleases(): ReleaseRow[] {
  return getDb()
    .prepare(`SELECT * FROM releases WHERE type = 'recent' ORDER BY sort_order ASC`)
    .all() as ReleaseRow[];
}

// ── Tracks ──────────────────────────────────────────────────────────

export interface TrackRow {
  id: string;
  title: string;
  artist: string | null;
  description: string | null;
  duration: string | null;
  recorded_at: string | null;
  file: string;
}

export function getTracks(): TrackRow[] {
  return getDb()
    .prepare(`SELECT * FROM tracks ORDER BY rowid ASC`)
    .all() as TrackRow[];
}
