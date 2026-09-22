import { NextRequest } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "../../../../db";
import { artists } from "../../../../db/schema";

function devOnly() {
  if (process.env.NODE_ENV !== "development") {
    return Response.json({ error: "Not available" }, { status: 403 });
  }
}

interface ArtistProfile {
  slug: string;
  name: string;
  image: string;
  bio: { en: string; es: string };
}

function toJson(a: typeof artists.$inferSelect): ArtistProfile {
  return { slug: a.slug, name: a.name, image: a.imageUrl, bio: { en: a.bioEn, es: a.bioEs } };
}

export async function GET() {
  const err = devOnly();
  if (err) return err;
  const rows = await db.select().from(artists).orderBy(asc(artists.sortOrder));
  return Response.json(rows.map(toJson));
}

export async function POST(req: NextRequest) {
  const err = devOnly();
  if (err) return err;
  const incoming: ArtistProfile = await req.json();
  const existing = await db.select().from(artists);
  const sortOrder = existing.find((a) => a.slug === incoming.slug)?.sortOrder ?? existing.length;

  await db
    .insert(artists)
    .values({
      slug: incoming.slug,
      name: incoming.name,
      imageUrl: incoming.image,
      bioEn: incoming.bio.en,
      bioEs: incoming.bio.es,
      sortOrder,
    })
    .onConflictDoUpdate({
      target: artists.slug,
      set: {
        name: incoming.name,
        imageUrl: incoming.image,
        bioEn: incoming.bio.en,
        bioEs: incoming.bio.es,
        updatedAt: new Date(),
      },
    });

  return Response.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const err = devOnly();
  if (err) return err;
  const { slug } = await req.json();
  await db.delete(artists).where(eq(artists.slug, slug));
  return Response.json({ ok: true });
}
