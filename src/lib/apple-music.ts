const ARTIST_NAME = "Nikolas Murdock";

// Uses the free iTunes Search API — no credentials needed
export async function getAppleMusicUrl(albumName: string): Promise<string | null> {
  const query = encodeURIComponent(`${ARTIST_NAME} ${albumName}`);
  const res = await fetch(
    `https://itunes.apple.com/search?term=${query}&entity=album&limit=3`,
    { next: { revalidate: 86400 } }
  );

  const data = await res.json();
  const match = data.results?.find((r: { collectionName: string }) =>
    r.collectionName.toLowerCase().includes(albumName.toLowerCase())
  );

  return match?.collectionViewUrl ?? null;
}

// Fetch Apple Music URLs for a list of album names in parallel
export async function getAppleMusicUrls(
  albumNames: string[]
): Promise<Record<string, string | null>> {
  const entries = await Promise.all(
    albumNames.map(async (name) => [name, await getAppleMusicUrl(name)])
  );
  return Object.fromEntries(entries);
}
