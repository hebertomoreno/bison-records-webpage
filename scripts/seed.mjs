/**
 * Seed the SQLite database with initial data.
 * Run with: npm run seed
 *
 * Safe to re-run — uses INSERT OR IGNORE so existing rows are preserved.
 */

import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "../bison.db");

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");

// ── Schema ──────────────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS releases (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    artist      TEXT    NOT NULL,
    title       TEXT    NOT NULL,
    date        TEXT    NOT NULL,
    image       TEXT    NOT NULL,
    href        TEXT    NOT NULL,
    type        TEXT    NOT NULL CHECK(type IN ('upcoming', 'recent')),
    sort_order  INTEGER NOT NULL DEFAULT 0
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

// ── Releases ────────────────────────────────────────────────────────
const insertRelease = db.prepare(`
  INSERT OR IGNORE INTO releases (artist, title, date, image, href, type, release_type, sort_order)
  VALUES (@artist, @title, @date, @image, @href, @type, @release_type, @sort_order)
`);

const upcoming = [
  {
    artist: "Nikolas Murdock feat. R.A.P Ferreira",
    title: "Earth 2",
    date: "May 5, 2026",
    image: "/media/images/bear2.jpg",
    href: "/artists/nikolas-murdock",
    type: "upcoming",
    release_type: "Single",
    sort_order: 0,
  },
  {
    artist: "Nikolas Murdock",
    title: "Uhhhh...",
    date: "June 1, 2026",
    image: "/media/images/bear3.jpg",
    href: "/artists/nikolas-murdock",
    type: "upcoming",
    release_type: "EP",
    sort_order: 1,
  },
  {
    artist: "Nikolas Murdock",
    title: "Year Of The Brown Bear",
    date: "November 2026",
    image: "/media/images/bear1.jpg",
    href: "/artists/nikolas-murdock",
    type: "upcoming",
    release_type: "Album",
    sort_order: 2,
  },
];

const recent = [
  // Add recent releases here
];

for (const r of [...upcoming, ...recent]) {
  insertRelease.run(r);
}
console.log(`✓ Seeded ${upcoming.length} upcoming, ${recent.length} recent releases`);

// ── Tracks ──────────────────────────────────────────────────────────
const insertTrack = db.prepare(`
  INSERT OR IGNORE INTO tracks (id, title, artist, description, duration, recorded_at, file)
  VALUES (@id, @title, @artist, @description, @duration, @recorded_at, @file)
`);

const tracks = [
  {
    id: "denverriver1",
    file: "/media/audio/DenverRiver1.wav",
    title: "Quiet River",
    artist: "Heberto Moreno",
    description:
      "First time I went to the Rockies, I was in Denver for work. I rented a Toyota 4Runner and drove to the rockies. Of course, at first I had rented another car and had a lot of trouble getting them to accept my credit card. The lady all but accused me of fraud. I went next door and thankfully they had a beautiful, big 4runner available for rent. The drive to The Rockies is one of my favorites.",
    duration: "0:31",
    recorded_at: "The Rocky Mountains, near Denver.",
  },
  {
    id: "denverriver2",
    file: "/media/audio/DenverRiver2.wav",
    title: "A Louder River",
    artist: "Heberto Moreno",
    description:
      "After recording Quiet River, I increased the volume in the recorder to get this recording. I know, I'm so smart.",
    duration: "0:34",
    recorded_at: "The Rocky Mountains, near Denver.",
  },
  {
    id: "lake-water",
    file: "/media/audio/Lake Water.wav",
    title: "Water sounds from the shore of a lake in Vancouver Island",
    artist: "Heberto Moreno",
    description:
      "I camped at the shores of Upper Campbell Lake, up near Campbell River, in Vancouver Island. I drove an old RAV4 with a tent on the roof. I took off my shoes and put the Zoom H4n Pro real close to the water for this one. Great time, great time.",
    duration: "0:37",
    recorded_at: "Near Campbell River, Vancouver Island.",
  },
  {
    id: "thesea1",
    file: "/media/audio/TheSea1.wav",
    title: "Sea Recording 1",
    artist: "Heberto Moreno",
    description:
      "I love taking recordings of the sea. I love taking video of the sea too, even if I've seen it before. This must have been a beach in Jalisco.",
    duration: "0:18",
    recorded_at: "A beach in Jalisco. Maybe PV?",
  },
  {
    id: "thesea2",
    file: "/media/audio/TheSea2.wav",
    title: "Sea Recording 2",
    artist: "Heberto Moreno",
    description: "Everyone: One more sea. One more sea. One more sea!",
    duration: "1:57",
    recorded_at: "A beach in Jalisco. Maybe PV?",
  },
];

for (const t of tracks) {
  insertTrack.run(t);
}
console.log(`✓ Seeded ${tracks.length} tracks`);

db.close();
console.log(`\n✅ Database ready at bison.db`);
