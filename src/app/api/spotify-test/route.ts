export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return Response.json({ error: "Missing credentials in .env.local" });
  }

  // Step 1: get token
  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    return Response.json({ error: "Token failed", details: tokenData });
  }

  // Step 2: fetch albums
  const albumsRes = await fetch(
    "https://api.spotify.com/v1/artists/4TAI8CNL9UNLAZ4dYagwws/albums?include_groups=album,single,ep&limit=20&market=US",
    {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
      cache: "no-store",
    }
  );

  const albumsData = await albumsRes.json();
  return Response.json({ token: "OK", albums: albumsData });
}
