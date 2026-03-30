import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "bison.db");

let _db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!_db) {
    // Read-only: works on Vercel's read-only filesystem.
    // All schema changes and data writes go through scripts/seed.mjs locally.
    _db = new Database(DB_PATH, { readonly: true });
  }
  return _db;
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
