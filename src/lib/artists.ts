import { asc } from "drizzle-orm";
import { db } from "../db";
import { artists } from "../db/schema";

export interface ArtistProfile {
  slug: string;
  name: string;
  image: string;
  bio: { en: string; es: string };
}

export async function getArtists(): Promise<ArtistProfile[]> {
  const rows = await db.select().from(artists).orderBy(asc(artists.sortOrder));
  return rows.map((a) => ({
    slug: a.slug,
    name: a.name,
    image: a.imageUrl,
    bio: { en: a.bioEn, es: a.bioEs },
  }));
}
