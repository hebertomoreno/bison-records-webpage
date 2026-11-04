import { asc, eq } from "drizzle-orm";
import { db } from "../db";
import { releases, tracks } from "../db/schema";

export interface ReleaseRow {
  id: number;
  type: "upcoming" | "recent";
  artist: string;
  title: string;
  date: string;
  image: string;
  href: string;
  release_type: "Album" | "Single" | "EP";
  sort_order: number;
}

export interface TrackRow {
  id: string;
  file: string;
  title: string;
  artist: string;
  description: string;
  duration: string | null;
  recorded_at: string | null;
  hidden: boolean;
}

async function getReleases(type: "upcoming" | "recent"): Promise<ReleaseRow[]> {
  const rows = await db
    .select()
    .from(releases)
    .where(eq(releases.type, type))
    .orderBy(asc(releases.sortOrder));

  return rows.map((r) => ({
    id: r.id,
    type: r.type as "upcoming" | "recent",
    artist: r.artist,
    title: r.title,
    date: r.date,
    image: r.imageUrl,
    href: r.href,
    release_type: r.releaseType as "Album" | "Single" | "EP",
    sort_order: r.sortOrder,
  }));
}

export function getUpcomingReleases(): Promise<ReleaseRow[]> {
  return getReleases("upcoming");
}

export function getRecentReleases(): Promise<ReleaseRow[]> {
  return getReleases("recent");
}

export async function getTracks(): Promise<TrackRow[]> {
  const rows = await db
    .select()
    .from(tracks)
    .where(eq(tracks.hidden, false))
    .orderBy(asc(tracks.sortOrder));

  return rows.map((t) => ({
    id: t.id,
    file: t.fileUrl,
    title: t.title,
    artist: t.artist,
    description: t.description,
    duration: t.duration,
    recorded_at: t.recordedAt,
    hidden: t.hidden,
  }));
}
