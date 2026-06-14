import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

function devOnly() {
  if (process.env.NODE_ENV !== "development") {
    return Response.json({ error: "Not available" }, { status: 403 });
  }
}

export async function GET() {
  devOnly();
  if (!fs.existsSync(BLOG_DIR)) return Response.json([]);
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));
  const posts = files.map((f) => {
    const slug = f.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(BLOG_DIR, f), "utf8");
    const fm: Record<string, string> = {};
    const match = raw.match(/^---\n([\s\S]*?)\n---/);
    if (match) {
      for (const line of match[1].split("\n")) {
        const [k, ...v] = line.split(":");
        if (k) fm[k.trim()] = v.join(":").trim();
      }
    }
    return {
      slug,
      title: fm.title ?? slug,
      date: fm.date ?? "",
      author: fm.author ?? "",
      hidden: fm.hidden === "true",
      language: fm.language ?? "",
    };
  });
  return Response.json(posts.sort((a, b) => (a.date < b.date ? 1 : -1)));
}

export async function POST(req: NextRequest) {
  devOnly();
  const { title, date, author, excerpt, body, hidden, language } = await req.json();
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  if (!fs.existsSync(BLOG_DIR)) fs.mkdirSync(BLOG_DIR, { recursive: true });
  const fm = [
    `---`,
    `title: ${title}`,
    `date: ${date}`,
    author ? `author: ${author}` : null,
    excerpt ? `excerpt: ${excerpt}` : null,
    hidden ? `hidden: true` : null,
    language ? `language: ${language}` : null,
    `---`,
  ]
    .filter(Boolean)
    .join("\n");
  fs.writeFileSync(path.join(BLOG_DIR, `${slug}.md`), `${fm}\n\n${body ?? ""}`);
  return Response.json({ slug });
}
