import { asc } from "drizzle-orm";
import { db } from "../db";
import { videos } from "../db/schema";

export interface Video {
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

export async function getVideos(): Promise<Video[]> {
  const rows = await db.select().from(videos).orderBy(asc(videos.sortOrder));
  return rows.map((v) => ({
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
  }));
}
