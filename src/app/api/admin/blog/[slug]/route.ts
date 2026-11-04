import { NextRequest } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "../../../../../db";
import { blogPosts } from "../../../../../db/schema";

function devOnly() {
  if (process.env.NODE_ENV !== "development") {
    return Response.json({ error: "Not available" }, { status: 403 });
  }
}

// Composite slug from the admin UI: "slug" for locale "en", "slug.xx" otherwise.
function parseCompositeSlug(composite: string): { slug: string; locale: string } {
  const match = composite.match(/^(.*)\.([a-z]{2})$/);
  return match ? { slug: match[1], locale: match[2] } : { slug: composite, locale: "en" };
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const err = devOnly();
  if (err) return err;
  const { slug: composite } = await params;
  const { slug, locale } = parseCompositeSlug(composite);

  const [row] = await db
    .select()
    .from(blogPosts)
    .where(and(eq(blogPosts.slug, slug), eq(blogPosts.locale, locale)));

  if (!row) return Response.json({ error: "Not found" }, { status: 404 });

  return Response.json({
    slug: composite,
    title: row.title,
    date: row.date,
    author: row.author,
    excerpt: row.excerpt ?? "",
    hidden: row.hidden,
    language: row.language ?? "en",
    body: row.content,
  });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const err = devOnly();
  if (err) return err;
  const { slug: composite } = await params;
  const { slug, locale } = parseCompositeSlug(composite);
  const { title, date, author, excerpt, body, hidden, language } = await req.json();

  await db
    .insert(blogPosts)
    .values({
      slug,
      locale,
      title,
      date,
      author: author ?? "",
      excerpt: excerpt ?? null,
      hidden: hidden === true,
      language: language ?? null,
      content: body ?? "",
    })
    .onConflictDoUpdate({
      target: [blogPosts.slug, blogPosts.locale],
      set: {
        title,
        date,
        author: author ?? "",
        excerpt: excerpt ?? null,
        hidden: hidden === true,
        language: language ?? null,
        content: body ?? "",
        updatedAt: new Date(),
      },
    });

  return Response.json({ ok: true });
}

export async function PATCH(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const err = devOnly();
  if (err) return err;
  const { slug: composite } = await params;
  const { slug, locale } = parseCompositeSlug(composite);

  const [row] = await db
    .select()
    .from(blogPosts)
    .where(and(eq(blogPosts.slug, slug), eq(blogPosts.locale, locale)));
  if (!row) return Response.json({ error: "Not found" }, { status: 404 });

  const nowHidden = !row.hidden;
  await db
    .update(blogPosts)
    .set({ hidden: nowHidden, updatedAt: new Date() })
    .where(and(eq(blogPosts.slug, slug), eq(blogPosts.locale, locale)));

  return Response.json({ hidden: nowHidden });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const err = devOnly();
  if (err) return err;
  const { slug: composite } = await params;
  const { slug, locale } = parseCompositeSlug(composite);
  await db.delete(blogPosts).where(and(eq(blogPosts.slug, slug), eq(blogPosts.locale, locale)));
  return Response.json({ ok: true });
}
