import { NextRequest } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "../../../../db";
import { events } from "../../../../db/schema";

function guard() {
  if (process.env.NODE_ENV !== "development")
    return Response.json({ error: "Not available" }, { status: 403 });
}

interface Event {
  id: string;
  title: string;
  description: string;
  image: string;
  images: string[];
  dates: string[];
  blogSlug?: string;
  hidden?: boolean;
}

function toJson(e: typeof events.$inferSelect): Event {
  return {
    id: e.id,
    title: e.title,
    description: e.description,
    image: e.imageUrl,
    images: e.imageUrls,
    dates: e.dates,
    blogSlug: e.blogSlug ?? undefined,
    hidden: e.hidden,
  };
}

export async function GET() {
  const err = guard();
  if (err) return err;
  const rows = await db.select().from(events).orderBy(asc(events.sortOrder));
  return Response.json(rows.map(toJson));
}

export async function POST(req: NextRequest) {
  const err = guard();
  if (err) return err;
  const item: Event = await req.json();
  const existing = await db.select().from(events);
  await db.insert(events).values({
    id: item.id,
    title: item.title,
    description: item.description,
    imageUrl: item.image,
    imageUrls: item.images,
    dates: item.dates,
    blogSlug: item.blogSlug ?? null,
    hidden: item.hidden ?? false,
    sortOrder: existing.length,
  });
  return Response.json({ ok: true });
}

export async function PUT(req: NextRequest) {
  const err = guard();
  if (err) return err;
  const item: Event = await req.json();
  await db
    .update(events)
    .set({
      title: item.title,
      description: item.description,
      imageUrl: item.image,
      imageUrls: item.images,
      dates: item.dates,
      blogSlug: item.blogSlug ?? null,
      hidden: item.hidden ?? false,
    })
    .where(eq(events.id, item.id));
  return Response.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const err = guard();
  if (err) return err;
  const { id } = await req.json();
  await db.delete(events).where(eq(events.id, id));
  return Response.json({ ok: true });
}
