import { NextRequest } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "../../../../db";
import { tracks } from "../../../../db/schema";

function guard() {
  if (process.env.NODE_ENV !== "development")
    return Response.json({ error: "Not available" }, { status: 403 });
}

interface Track {
  id: string;
  file: string;
  title: string;
  artist: string;
  description: string;
  duration: string | null;
  recordedAt: string | null;
  hidden?: boolean;
}

function toJson(t: typeof tracks.$inferSelect): Track {
  return {
    id: t.id,
    file: t.fileUrl,
    title: t.title,
    artist: t.artist,
    description: t.description,
    duration: t.duration,
    recordedAt: t.recordedAt,
    hidden: t.hidden,
  };
}

export async function GET() {
  const err = guard();
  if (err) return err;
  const rows = await db.select().from(tracks).orderBy(asc(tracks.sortOrder));
  return Response.json(rows.map(toJson));
}

export async function POST(req: NextRequest) {
  const err = guard();
  if (err) return err;
  const item: Track = await req.json();
  const existing = await db.select().from(tracks);
  await db.insert(tracks).values({
    id: item.id,
    fileUrl: item.file,
    title: item.title,
    artist: item.artist,
    description: item.description,
    duration: item.duration,
    recordedAt: item.recordedAt,
    hidden: item.hidden ?? false,
    sortOrder: existing.length,
  });
  return Response.json({ ok: true });
}

export async function PUT(req: NextRequest) {
  const err = guard();
  if (err) return err;
  const item: Track = await req.json();
  await db
    .update(tracks)
    .set({
      fileUrl: item.file,
      title: item.title,
      artist: item.artist,
      description: item.description,
      duration: item.duration,
      recordedAt: item.recordedAt,
      hidden: item.hidden ?? false,
    })
    .where(eq(tracks.id, item.id));
  return Response.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const err = guard();
  if (err) return err;
  const { id } = await req.json();
  await db.delete(tracks).where(eq(tracks.id, id));
  return Response.json({ ok: true });
}
