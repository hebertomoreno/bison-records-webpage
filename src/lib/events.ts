import { asc, eq } from "drizzle-orm";
import { db } from "../db";
import { events } from "../db/schema";

export interface Event {
  id: string;
  title: string;
  description: string;
  image: string;
  images: string[];
  dates: string[];
  blogSlug?: string;
  hidden?: boolean;
}

function toEvent(e: typeof events.$inferSelect): Event {
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

export async function getEvents(): Promise<Event[]> {
  const rows = await db.select().from(events).orderBy(asc(events.sortOrder));
  return rows.map(toEvent);
}

export async function getVisibleEvents(): Promise<Event[]> {
  const rows = await db
    .select()
    .from(events)
    .where(eq(events.hidden, false))
    .orderBy(asc(events.sortOrder));
  return rows.map(toEvent);
}
