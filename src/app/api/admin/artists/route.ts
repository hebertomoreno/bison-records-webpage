import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

const ARTISTS_FILE = path.join(process.cwd(), "src/data/artists.ts");

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

function parseArtists(): ArtistProfile[] {
  if (!fs.existsSync(ARTISTS_FILE)) return [];
  const src = fs.readFileSync(ARTISTS_FILE, "utf8");
  try {
    const block = src.match(/export const artistProfiles[^=]*=\s*\[([\s\S]*)\];/)?.[1] ?? "";
    const entries: ArtistProfile[] = [];
    for (const m of block.matchAll(
      /\{\s*slug:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*image:\s*"([^"]+)",\s*bio:\s*\{[\s\S]*?en:\s*`([^`]*)`[\s\S]*?es:\s*`([^`]*)`[\s\S]*?\},?\s*\}/g
    )) {
      entries.push({
        slug: m[1],
        name: m[2],
        image: m[3],
        bio: { en: m[4], es: m[5] },
      });
    }
    return entries;
  } catch {
    return [];
  }
}

function writeArtists(artists: ArtistProfile[]) {
  const lines = [
    `export interface ArtistProfile {`,
    `  slug: string;`,
    `  name: string;`,
    `  image: string;`,
    `  bio: { en: string; es: string };`,
    `}`,
    ``,
    `export const artistProfiles: ArtistProfile[] = [`,
  ];
  for (const a of artists) {
    lines.push(`  {`);
    lines.push(`    slug: ${JSON.stringify(a.slug)},`);
    lines.push(`    name: ${JSON.stringify(a.name)},`);
    lines.push(`    image: ${JSON.stringify(a.image)},`);
    lines.push(`    bio: {`);
    lines.push(`      en: \`${a.bio.en.replace(/`/g, "\\`")}\`,`);
    lines.push(`      es: \`${a.bio.es.replace(/`/g, "\\`")}\`,`);
    lines.push(`    },`);
    lines.push(`  },`);
  }
  lines.push(`];`, ``);
  fs.writeFileSync(ARTISTS_FILE, lines.join("\n"));
}

export async function GET() {
  const err = devOnly();
  if (err) return err;
  return Response.json(parseArtists());
}

export async function POST(req: NextRequest) {
  const err = devOnly();
  if (err) return err;
  const incoming: ArtistProfile = await req.json();
  const artists = parseArtists();
  const idx = artists.findIndex((a) => a.slug === incoming.slug);
  if (idx >= 0) artists[idx] = incoming;
  else artists.push(incoming);
  writeArtists(artists);
  return Response.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const err = devOnly();
  if (err) return err;
  const { slug } = await req.json();
  const artists = parseArtists().filter((a) => a.slug !== slug);
  writeArtists(artists);
  return Response.json({ ok: true });
}
