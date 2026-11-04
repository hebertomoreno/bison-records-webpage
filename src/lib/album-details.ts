import { db } from "../db";
import { albumDetails } from "../db/schema";

export interface Credit {
  role: string;
  names: string[];
}

export interface AlbumDetail {
  spotifyId: string;
  description: string;
  credits: Credit[];
  hidden?: boolean;
}

export async function getAlbumDetails(): Promise<AlbumDetail[]> {
  const rows = await db.select().from(albumDetails);
  return rows.map((d) => ({
    spotifyId: d.spotifyId,
    description: d.description,
    credits: d.credits as Credit[],
    hidden: d.hidden,
  }));
}
