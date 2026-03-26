export interface BandsintownEvent {
  id: string;
  datetime: string;
  venue: {
    name: string;
    city: string;
    region: string;
    country: string;
  };
  offers: {
    type: string;
    url: string;
    status: string;
  }[];
  lineup: string[];
  title: string;
  description: string;
}

export async function getArtistEvents(): Promise<BandsintownEvent[]> {
  const appId = process.env.BANDSINTOWN_APP_ID;
  const artistName = process.env.BANDSINTOWN_ARTIST_NAME ?? "Nikolas Murdock";

  if (!appId || appId === "your_app_id_here") {
    throw new Error("Missing BANDSINTOWN_APP_ID in .env.local");
  }

  const encoded = encodeURIComponent(artistName);
  const res = await fetch(
    `https://rest.bandsintown.com/artists/${encoded}/events?app_id=${appId}`,
    { next: { revalidate: 3600 } } // refresh every hour
  );

  if (!res.ok) throw new Error(`Bandsintown error: ${res.status}`);

  const data = await res.json();

  // Bandsintown returns an object with a warning key if artist not found
  if (!Array.isArray(data)) return [];

  return data;
}

export function formatEventDate(datetime: string): string {
  return new Date(datetime).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
