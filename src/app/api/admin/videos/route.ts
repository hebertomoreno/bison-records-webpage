import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import { videos } from "../../../../data/videos";

const FILE = path.join(process.cwd(), "src/data/videos.ts");

function guard() {
  if (process.env.NODE_ENV !== "development")
    return Response.json({ error: "Not available" }, { status: 403 });
}

function serialize(list: typeof videos) {
  const lines = [
    `export interface Video {`,
    `  id: string;`,
    `  title: string;`,
    `  author: string;`,
    `  description: string;`,
    `  type: "local" | "youtube";`,
    `  /** Path without extension, e.g. "/media/video/dock" — for local videos */`,
    `  file?: string;`,
    `  /** Path to animated GIF preview — for local videos */`,
    `  preview?: string;`,
    `  /** YouTube video ID — for youtube videos */`,
    `  youtubeId?: string;`,
    `}`,
    ``,
    `// ── Edit videos here ─────────────────────────────────────────────`,
    ``,
    `export const videos: Video[] = [`,
  ];
  for (const v of list) {
    lines.push(`  {`);
    lines.push(`    id: ${JSON.stringify(v.id)},`);
    lines.push(`    title: ${JSON.stringify(v.title)},`);
    lines.push(`    author: ${JSON.stringify(v.author)},`);
    lines.push(`    description: ${JSON.stringify(v.description)},`);
    lines.push(`    type: ${JSON.stringify(v.type)},`);
    if (v.file) lines.push(`    file: ${JSON.stringify(v.file)},`);
    if (v.preview) lines.push(`    preview: ${JSON.stringify(v.preview)},`);
    if (v.youtubeId) lines.push(`    youtubeId: ${JSON.stringify(v.youtubeId)},`);
    if (v.hidden) lines.push(`    hidden: true,`);
    lines.push(`  },`);
  }
  lines.push(`];`, ``);
  return lines.join("\n");
}

export async function GET() {
  guard();
  return Response.json(videos);
}

export async function POST(req: NextRequest) {
  guard();
  const item = await req.json();
  const list = [...videos, item];
  fs.writeFileSync(FILE, serialize(list));
  return Response.json({ ok: true });
}

export async function PUT(req: NextRequest) {
  guard();
  const item = await req.json();
  const list = videos.map((v) => (v.id === item.id ? item : v));
  fs.writeFileSync(FILE, serialize(list));
  return Response.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  guard();
  const { id } = await req.json();
  const list = videos.filter((v) => v.id !== id);
  fs.writeFileSync(FILE, serialize(list));
  return Response.json({ ok: true });
}
