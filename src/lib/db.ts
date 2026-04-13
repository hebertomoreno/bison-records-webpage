// Data is stored in src/data/*.ts files — edit those directly or use scripts.
// This module keeps a stable import API for the rest of the app.

import { upcomingReleases, recentReleases, type Release } from "../data/releases";
import { tracks, type Track } from "../data/tracks";

export type ReleaseRow = Release & { id: number; type: "upcoming" | "recent"; sort_order: number };
export type TrackRow = Omit<Track, "recordedAt"> & { recorded_at: string | null };

export function getUpcomingReleases(): ReleaseRow[] {
  return upcomingReleases.map((r, i) => ({ ...r, id: i + 1, type: "upcoming" as const, sort_order: i }));
}

export function getRecentReleases(): ReleaseRow[] {
  return recentReleases.map((r, i) => ({ ...r, id: i + 1, type: "recent" as const, sort_order: i }));
}

export function getTracks(): TrackRow[] {
  return tracks.filter((t) => !t.hidden).map((t) => ({ ...t, recorded_at: t.recordedAt }));
}
