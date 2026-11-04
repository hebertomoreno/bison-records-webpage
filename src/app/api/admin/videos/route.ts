import { NextRequest } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "../../../../db";
import { videos } from "../../../../db/schema";

function guard() {
  if (process.env.NODE_ENV !== "development")
    return Response.json({ error: "Not available" }, { status: 403 });
}

interface Video {
  id: string;
  title: string;
  author: string;
  description: string;
  type: "local" | "youtube";
  fileWebmUrl?: string;
  fileMp4Url?: string;
  preview?: string;
  youtubeId?: string;
  hidden?: boolean;
}

function toJson(v: typeof videos.$inferSelect): Video {
  return {
    id: v.id,
    title: v.title,
    author: v.author,
    description: v.description,
    type: v.type as "local" | "youtube",
    fileWebmUrl: v.fileWebmUrl ?? undefined,
    fileMp4Url: v.fileMp4Url ?? undefined,
    preview: v.previewUrl ?? undefined,
    youtubeId: v.youtubeId ?? undefined,
    hidden: v.hidden,
  };
}

export async function GET() {
  const err = guard();
  if (err) return err;
  const rows = await db.select().from(videos).orderBy(asc(videos.sortOrder));
  return Response.json(rows.map(toJson));
}

export async function POST(req: NextRequest) {
  const err = guard();
  if (err) return err;
  const item: Video = await req.json();
  const existing = await db.select().from(videos);
  await db.insert(videos).values({
    id: item.id,
    title: item.title,
    author: item.author,
    description: item.description,
    type: item.type,
    fileWebmUrl: item.fileWebmUrl ?? null,
    fileMp4Url: item.fileMp4Url ?? null,
    previewUrl: item.preview ?? null,
    youtubeId: item.youtubeId ?? null,
    hidden: item.hidden ?? false,
    sortOrder: existing.length,
  });
  return Response.json({ ok: true });
}

export async function PUT(req: NextRequest) {
  const err = guard();
  if (err) return err;
  const item: Video = await req.json();
  await db
    .update(videos)
    .set({
      title: item.title,
      author: item.author,
      description: item.description,
      type: item.type,
      fileWebmUrl: item.fileWebmUrl ?? null,
      fileMp4Url: item.fileMp4Url ?? null,
      previewUrl: item.preview ?? null,
      youtubeId: item.youtubeId ?? null,
      hidden: item.hidden ?? false,
    })
    .where(eq(videos.id, item.id));
  return Response.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const err = guard();
  if (err) return err;
  const { id } = await req.json();
  await db.delete(videos).where(eq(videos.id, id));
  return Response.json({ ok: true });
}
