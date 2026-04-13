import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

const ALBUMS_FILE = path.join(process.cwd(), "src/data/album-details.ts");

function devOnly() {
  if (process.env.NODE_ENV !== "development") {
    return Response.json({ error: "Not available" }, { status: 403 });
  }
}

interface Credit { role: string; names: string[] }
interface AlbumDetail { spotifyId: string; description: string; credits: Credit[]; hidden?: boolean }

function parseCurrentDetails(): AlbumDetail[] {
  if (!fs.existsSync(ALBUMS_FILE)) return [];
  const src = fs.readFileSync(ALBUMS_FILE, "utf8");
  try {
    // Quick extraction via regex — safe since we write the file ourselves
    const block = src.match(/export const albumDetails[^=]*=\s*\[([\s\S]*)\];/)?.[1] ?? "";
    const entries: AlbumDetail[] = [];
    for (const m of block.matchAll(/spotifyId:\s*"([^"]+)"[\s\S]*?description:\s*("(?:[^"\\]|\\.)*"|`[^`]*`)[\s\S]*?credits:\s*\[([\s\S]*?)\]\s*,?\s*\}/g)) {
      const spotifyId = m[1];
      const description = JSON.parse(m[2].startsWith("`") ? `"${m[2].slice(1,-1).replace(/"/g,'\\"')}"` : m[2]);
      const credits: Credit[] = [];
      for (const c of m[3].matchAll(/role:\s*"([^"]+)"[^}]*names:\s*\[([^\]]*)\]/g)) {
        credits.push({ role: c[1], names: c[2].match(/"([^"]*)"/g)?.map(s => s.slice(1,-1)) ?? [] });
      }
      const hidden = src.slice(m.index ?? 0, (m.index ?? 0) + m[0].length).includes("hidden: true");
      entries.push({ spotifyId, description, credits, ...(hidden ? { hidden: true } : {}) });
    }
    return entries;
  } catch { return []; }
}

function writeDetails(details: AlbumDetail[]) {
  const lines = [
    `export interface Credit {`,
    `  role: string;`,
    `  names: string[];`,
    `}`,
    ``,
    `export interface AlbumDetail {`,
    `  spotifyId: string;`,
    `  description: string;`,
    `  credits: Credit[];`,
    `  hidden?: boolean;`,
    `}`,
    ``,
    `// ── Add details here — spotifyId must match an entry in albums.ts ──`,
    ``,
    `export const albumDetails: AlbumDetail[] = [`,
  ];
  for (const d of details) {
    lines.push(`  {`);
    lines.push(`    spotifyId: ${JSON.stringify(d.spotifyId)},`);
    lines.push(`    description: ${JSON.stringify(d.description)},`);
    lines.push(`    credits: [`);
    for (const c of d.credits) {
      lines.push(`      { role: ${JSON.stringify(c.role)}, names: ${JSON.stringify(c.names)} },`);
    }
    lines.push(`    ],`);
    if (d.hidden) lines.push(`    hidden: true,`);
    lines.push(`  },`);
  }
  lines.push(`];`, ``);
  fs.writeFileSync(ALBUMS_FILE, lines.join("\n"));
}

export async function GET() {
  devOnly();
  const details = parseCurrentDetails();
  return Response.json(details);
}

export async function POST(req: NextRequest) {
  devOnly();
  const incoming: AlbumDetail = await req.json();
  const details = parseCurrentDetails();
  const idx = details.findIndex((d) => d.spotifyId === incoming.spotifyId);
  if (idx >= 0) details[idx] = incoming;
  else details.push(incoming);
  writeDetails(details);
  return Response.json({ ok: true });
}
