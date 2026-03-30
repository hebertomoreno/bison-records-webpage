/**
 * Scans public/media/audio/ and writes src/data/tracks.ts
 * Run with: npm run scan-audio
 *
 * New files are inserted. Existing entries preserve manually edited fields.
 */

import { parseFile } from "music-metadata";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AUDIO_DIR = path.join(__dirname, "../public/media/audio");
const OUT_FILE = path.join(__dirname, "../src/data/tracks.ts");
const EXTS = [".mp3", ".wav", ".flac", ".aac", ".ogg", ".m4a"];

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

// Load existing tracks to preserve manually edited fields
let existing = {};
if (fs.existsSync(OUT_FILE)) {
  const src = fs.readFileSync(OUT_FILE, "utf8");
  for (const match of src.matchAll(/id:\s*"([^"]+)"[\s\S]*?file:\s*"([^"]+)"/g)) {
    existing[match[2]] = match[1];
  }
}

const files = fs.readdirSync(AUDIO_DIR).filter((f) => EXTS.includes(path.extname(f).toLowerCase()));

if (files.length === 0) {
  console.log("No audio files found in", AUDIO_DIR);
  process.exit(0);
}

const tracks = [];

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

  const title = meta.common?.title ?? null;
  const artist = meta.common?.artist ?? meta.common?.albumartist ?? null;
  const description = meta.common?.comment?.[0] ?? null;
  const duration = formatDuration(meta.format?.duration);
  const recordedAt = extractDate(meta);

  tracks.push({ id: slugify(title ?? basename), file: filePath, title, artist, description, duration, recordedAt });
  console.log(`  ✓ ${filename}`);
}

const lines = [
  `export interface Track {`,
  `  id: string;`,
  `  file: string;`,
  `  title: string;`,
  `  artist: string;`,
  `  description: string;`,
  `  duration: string | null;`,
  `  recordedAt: string | null;`,
  `}`,
  ``,
  `// ── Edit tracks here (or run \`npm run scan-audio\` to regenerate) ────`,
  ``,
  `export const tracks: Track[] = [`,
];

for (const t of tracks) {
  lines.push(`  {`);
  lines.push(`    id: ${JSON.stringify(t.id)},`);
  lines.push(`    file: ${JSON.stringify(t.file)},`);
  lines.push(`    title: ${t.title ? JSON.stringify(t.title) : `"TODO: title for ${path.basename(t.file)}"`},`);
  lines.push(`    artist: ${t.artist ? JSON.stringify(t.artist) : `"TODO: artist"`},`);
  lines.push(`    description: ${t.description ? JSON.stringify(t.description) : `"TODO: description"`},`);
  lines.push(`    duration: ${JSON.stringify(t.duration)},`);
  lines.push(`    recordedAt: ${JSON.stringify(t.recordedAt)},`);
  lines.push(`  },`);
}

lines.push(`];`);
lines.push(``);

fs.writeFileSync(OUT_FILE, lines.join("\n"), "utf8");
console.log(`\n✅ Written to src/data/tracks.ts (${tracks.length} tracks)`);
