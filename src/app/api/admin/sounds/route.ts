import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import { tracks } from "../../../../data/tracks";

const FILE = path.join(process.cwd(), "src/data/tracks.ts");

function guard() {
  if (process.env.NODE_ENV !== "development")
    return Response.json({ error: "Not available" }, { status: 403 });
}

function serialize(list: typeof tracks) {
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
  for (const t of list) {
    lines.push(`  {`);
    lines.push(`    id: ${JSON.stringify(t.id)},`);
    lines.push(`    file: ${JSON.stringify(t.file)},`);
    lines.push(`    title: ${JSON.stringify(t.title)},`);
    lines.push(`    artist: ${JSON.stringify(t.artist)},`);
    lines.push(`    description: ${JSON.stringify(t.description)},`);
    lines.push(`    duration: ${JSON.stringify(t.duration)},`);
    lines.push(`    recordedAt: ${JSON.stringify(t.recordedAt)},`);
    if (t.hidden) lines.push(`    hidden: true,`);
    lines.push(`  },`);
  }
  lines.push(`];`, ``);
  return lines.join("\n");
}

export async function GET() {
  guard();
  return Response.json(tracks);
}

export async function POST(req: NextRequest) {
  guard();
  const item = await req.json();
  const list = [...tracks, item];
  fs.writeFileSync(FILE, serialize(list));
  return Response.json({ ok: true });
}

export async function PUT(req: NextRequest) {
  guard();
  const item = await req.json();
  const list = tracks.map((t) => (t.id === item.id ? item : t));
  fs.writeFileSync(FILE, serialize(list));
  return Response.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  guard();
  const { id } = await req.json();
  const list = tracks.filter((t) => t.id !== id);
  fs.writeFileSync(FILE, serialize(list));
  return Response.json({ ok: true });
}
