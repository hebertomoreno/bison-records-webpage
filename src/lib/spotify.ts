const ARTIST_ID = "4TAI8CNL9UNLAZ4dYagwws";

export interface SpotifyAlbum {
  id: string;
  name: string;
  release_date: string;
  album_type: string;
  images: { url: string; width: number; height: number }[];
  external_urls: { spotify: string };
  total_tracks: number;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  duration_ms: number;
  preview_url: string | null;
  external_urls: { spotify: string };
  album: {
    name: string;
    images: { url: string }[];
  };
}

async function getAccessToken(): Promise<string> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET in .env.local");
  }

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Spotify token error ${res.status}: ${text}`);
  }

  const data = await res.json();
  if (!data.access_token) throw new Error(`Spotify token missing: ${JSON.stringify(data)}`);
  return data.access_token;
}

export async function getArtistAlbums(): Promise<SpotifyAlbum[]> {
  const token = await getAccessToken();
  const headers = { Authorization: `Bearer ${token}` };
  const items: SpotifyAlbum[] = [];

  let url: string | null =
    `https://api.spotify.com/v1/artists/${ARTIST_ID}/albums?include_groups=album,single,ep`;

  while (url) {
    const res: Response = await fetch(url, { headers, next: { revalidate: 86400 } });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Spotify albums error ${res.status}: ${text}`);
    }
    const data: { items?: SpotifyAlbum[]; next?: string | null } = await res.json();
    items.push(...(data.items ?? []));
    url = data.next ?? null;
  }

  // Sort newest first
  return items.sort((a, b) => (a.release_date < b.release_date ? 1 : -1));
}

export async function getArtistTopTracks(): Promise<SpotifyTrack[]> {
  const token = await getAccessToken();

  const res = await fetch(
    `https://api.spotify.com/v1/artists/${ARTIST_ID}/top-tracks?market=US`,
    {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 86400 },
    }
  );

  const data = await res.json();
  return data.tracks ?? [];
}

export function formatDuration(ms: number): string {
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
