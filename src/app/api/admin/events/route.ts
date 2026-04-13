import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import { events } from "../../../../data/events";

const FILE = path.join(process.cwd(), "src/data/events.ts");

function guard() {
  if (process.env.NODE_ENV !== "development")
    return Response.json({ error: "Not available" }, { status: 403 });
}

function serialize(list: typeof events) {
  const lines = [
    `export interface Event {`,
    `  id: string;`,
    `  title: string;`,
    `  description: string;`,
    `  image: string;`,
    `  images: string[];`,
    `  dates: string[];`,
    `  blogSlug?: string;`,
    `}`,
    ``,
    `// ── Add events here ─────────────────────────────────────────────`,
    ``,
    `export const events: Event[] = [`,
  ];
  for (const e of list) {
    lines.push(`  {`);
    lines.push(`    id: ${JSON.stringify(e.id)},`);
    lines.push(`    title: ${JSON.stringify(e.title)},`);
    lines.push(`    description: ${JSON.stringify(e.description)},`);
    lines.push(`    image: ${JSON.stringify(e.image)},`);
    lines.push(`    images: ${JSON.stringify(e.images)},`);
    lines.push(`    dates: ${JSON.stringify(e.dates)},`);
    if (e.blogSlug) lines.push(`    blogSlug: ${JSON.stringify(e.blogSlug)},`);
    if (e.hidden) lines.push(`    hidden: true,`);
    lines.push(`  },`);
  }
  lines.push(`];`, ``);
  return lines.join("\n");
}

export async function GET() {
  guard();
  return Response.json(events);
}

export async function POST(req: NextRequest) {
  guard();
  const item = await req.json();
  const list = [...events, item];
  fs.writeFileSync(FILE, serialize(list));
  return Response.json({ ok: true });
}

export async function PUT(req: NextRequest) {
  guard();
  const item = await req.json();
  const list = events.map((e) => (e.id === item.id ? item : e));
  fs.writeFileSync(FILE, serialize(list));
  return Response.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  guard();
  const { id } = await req.json();
  const list = events.filter((e) => e.id !== id);
  fs.writeFileSync(FILE, serialize(list));
  return Response.json({ ok: true });
}
