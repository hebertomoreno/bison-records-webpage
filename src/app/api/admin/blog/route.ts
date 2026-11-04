import { NextRequest } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "../../../../db";
import { blogPosts } from "../../../../db/schema";

function devOnly() {
  if (process.env.NODE_ENV !== "development") {
    return Response.json({ error: "Not available" }, { status: 403 });
  }
}

// Composite slug shown to the admin UI: "slug" for locale "en", "slug.xx" otherwise.
function compositeSlug(slug: string, locale: string) {
  return locale === "en" ? slug : `${slug}.${locale}`;
}

export async function GET() {
  const err = devOnly();
  if (err) return err;
  const rows = await db.select().from(blogPosts).orderBy(desc(blogPosts.date));
  const posts = rows.map((p) => ({
    slug: compositeSlug(p.slug, p.locale),
    title: p.title,
    date: p.date,
    author: p.author,
    hidden: p.hidden,
    language: p.language ?? "",
  }));
  return Response.json(posts);
}

export async function POST(req: NextRequest) {
  const err = devOnly();
  if (err) return err;
  const { title, date, author, excerpt, body, hidden, language } = await req.json();
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  await db.insert(blogPosts).values({
    slug,
    locale: "en",
    title,
    date,
    author: author ?? "",
    excerpt: excerpt ?? null,
    hidden: hidden === true,
    language: language ?? null,
    content: body ?? "",
  });

  return Response.json({ slug });
}
