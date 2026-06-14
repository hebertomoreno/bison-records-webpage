import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

function devOnly() {
  if (process.env.NODE_ENV !== "development") {
    return Response.json({ error: "Not available" }, { status: 403 });
  }
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  devOnly();
  const { slug } = await params;
  const file = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return Response.json({ error: "Not found" }, { status: 404 });
  const raw = fs.readFileSync(file, "utf8");
  const fm: Record<string, string> = {};
  let body = raw;
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (match) {
    for (const line of match[1].split("\n")) {
      const [k, ...v] = line.split(":");
      if (k) fm[k.trim()] = v.join(":").trim();
    }
    body = match[2].trim();
  }
  return Response.json({ slug, title: fm.title ?? "", date: fm.date ?? "", author: fm.author ?? "", excerpt: fm.excerpt ?? "", hidden: fm.hidden === "true", language: fm.language ?? "en", body });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  devOnly();
  const { slug } = await params;
  const { title, date, author, excerpt, body, hidden, language } = await req.json();
  const fm = [`---`, `title: ${title}`, `date: ${date}`, author ? `author: ${author}` : null, excerpt ? `excerpt: ${excerpt}` : null, hidden ? `hidden: true` : null, language && language !== "en" ? `language: ${language}` : null, `---`].filter(Boolean).join("\n");
  fs.writeFileSync(path.join(BLOG_DIR, `${slug}.md`), `${fm}\n\n${body ?? ""}`);
  return Response.json({ ok: true });
}

export async function PATCH(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  devOnly();
  const { slug } = await params;
  const file = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return Response.json({ error: "Not found" }, { status: 404 });
  const raw = fs.readFileSync(file, "utf8");
  const fm: Record<string, string> = {};
  let body = "";
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (match) {
    for (const line of match[1].split("\n")) {
      const [k, ...v] = line.split(":");
      if (k) fm[k.trim()] = v.join(":").trim();
    }
    body = match[2].trim();
  }
  const nowHidden = fm.hidden === "true";
  const newFm = [`---`, `title: ${fm.title ?? ""}`, `date: ${fm.date ?? ""}`, fm.author ? `author: ${fm.author}` : null, fm.excerpt ? `excerpt: ${fm.excerpt}` : null, !nowHidden ? `hidden: true` : null, fm.language && fm.language !== "en" ? `language: ${fm.language}` : null, `---`].filter(Boolean).join("\n");
  fs.writeFileSync(file, `${newFm}\n\n${body}`);
  return Response.json({ hidden: !nowHidden });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  devOnly();
  const { slug } = await params;
  const file = path.join(BLOG_DIR, `${slug}.md`);
  if (fs.existsSync(file)) fs.unlinkSync(file);
  return Response.json({ ok: true });
}
