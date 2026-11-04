import { NextRequest } from "next/server";
import { db } from "../../../../db";
import { albumDetails } from "../../../../db/schema";

function devOnly() {
  if (process.env.NODE_ENV !== "development") {
    return Response.json({ error: "Not available" }, { status: 403 });
  }
}

interface Credit {
  role: string;
  names: string[];
}
interface AlbumDetail {
  spotifyId: string;
  description: string;
  credits: Credit[];
  hidden?: boolean;
}

function toJson(d: typeof albumDetails.$inferSelect): AlbumDetail {
  return {
    spotifyId: d.spotifyId,
    description: d.description,
    credits: d.credits as Credit[],
    hidden: d.hidden,
  };
}

export async function GET() {
  const err = devOnly();
  if (err) return err;
  const rows = await db.select().from(albumDetails);
  return Response.json(rows.map(toJson));
}

export async function POST(req: NextRequest) {
  const err = devOnly();
  if (err) return err;
  const incoming: AlbumDetail = await req.json();

  await db
    .insert(albumDetails)
    .values({
      spotifyId: incoming.spotifyId,
      description: incoming.description,
      credits: incoming.credits,
      hidden: incoming.hidden ?? false,
    })
    .onConflictDoUpdate({
      target: albumDetails.spotifyId,
      set: {
        description: incoming.description,
        credits: incoming.credits,
        hidden: incoming.hidden ?? false,
      },
    });

  return Response.json({ ok: true });
}
