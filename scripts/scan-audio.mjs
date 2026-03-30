/**
 * Scans public/media/audio/ and upserts track metadata into bison.db.
 * Run with: npm run scan-audio
 *
 * New files are inserted. Existing files update metadata from tags
 * but preserve any title/artist/description you've manually edited.
 */

import { parseFile } from "music-metadata";
import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AUDIO_DIR = path.join(__dirname, "../public/media/audio");
const DB_PATH = path.join(__dirname, "../bison.db");

const EXTS = [".mp3", ".wav", ".flac", ".aac", ".ogg", ".m4a"];

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");

db.exec(`
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

const insert = db.prepare(`
  INSERT INTO tracks (id, title, artist, description, duration, recorded_at, file)
  VALUES (@id, @title, @artist, @description, @duration, @recorded_at, @file)
  ON CONFLICT(file) DO UPDATE SET
    duration    = excluded.duration,
    recorded_at = excluded.recorded_at
`);

function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function formatDuration(seconds) {
  if (!seconds) return null;
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function extractDate(meta) {
  const candidates = [
    meta.common?.date,
    meta.common?.originaldate,
    meta.common?.year ? String(meta.common.year) : null,
    meta.native?.["ID3v2.4"]?.find((t) => t.id === "TDRC")?.value,
    meta.native?.["ID3v2.3"]?.find((t) => t.id === "TYER")?.value,
    meta.native?.ID3v1?.find((t) => t.id === "year")?.value,
    meta.native?.vorbis?.find((t) => t.id === "DATE")?.value,
  ];
  return candidates.find(Boolean) ?? null;
}

const files = fs.readdirSync(AUDIO_DIR).filter((f) => EXTS.includes(path.extname(f).toLowerCase()));

if (files.length === 0) {
  console.log("No audio files found in", AUDIO_DIR);
  process.exit(0);
}

let inserted = 0;
let updated = 0;

for (const filename of files) {
  const filepath = path.join(AUDIO_DIR, filename);
  const ext = path.extname(filename);
  const basename = path.basename(filename, ext);
  const filePath = `/media/audio/${filename}`;

  let meta;
  try {
    meta = await parseFile(filepath, { duration: true });
  } catch {
    meta = { common: {}, format: {} };
  }

  const existing = db.prepare("SELECT id FROM tracks WHERE file = ?").get(filePath);
  const title = meta.common?.title ?? basename;
  const artist = meta.common?.artist ?? meta.common?.albumartist ?? null;
  const description = meta.common?.comment?.[0] ?? null;
  const duration = formatDuration(meta.format?.duration);
  const recorded_at = extractDate(meta);
  const id = slugify(title);

  insert.run({ id, title, artist, description, duration, recorded_at, file: filePath });

  if (existing) {
    console.log(`  ~ updated metadata: ${filename}`);
    updated++;
  } else {
    console.log(`  + inserted: ${filename}`);
    console.log(`    Open bison.db to fill in title, artist, description if needed.`);
    inserted++;
  }
}

db.close();
console.log(`\n✅ Done — ${inserted} inserted, ${updated} updated`);
