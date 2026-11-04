import { and, desc, eq } from "drizzle-orm";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import { db } from "../db";
import { blogPosts } from "../db/schema";

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  image?: string;
  hidden?: boolean;
}

export interface Post extends PostMeta {
  content: string;
}

export async function getAllPosts(): Promise<PostMeta[]> {
  const rows = await db
    .select()
    .from(blogPosts)
    .where(and(eq(blogPosts.locale, "en"), eq(blogPosts.hidden, false)))
    .orderBy(desc(blogPosts.date));

  return rows.map((p) => ({
    slug: p.slug,
    title: p.title,
    date: p.date,
    author: p.author,
    excerpt: p.excerpt ?? "",
    image: p.imageUrl ?? undefined,
    hidden: p.hidden,
  }));
}

export async function getPost(slug: string, locale?: string): Promise<Post> {
  let row: typeof blogPosts.$inferSelect | undefined;

  if (locale && locale !== "en") {
    [row] = await db
      .select()
      .from(blogPosts)
      .where(and(eq(blogPosts.slug, slug), eq(blogPosts.locale, locale)));
  }

  if (!row) {
    [row] = await db
      .select()
      .from(blogPosts)
      .where(and(eq(blogPosts.slug, slug), eq(blogPosts.locale, "en")));
  }

  if (!row) throw new Error(`Blog post not found: ${slug}`);

  const processed = await remark().use(remarkGfm).use(remarkHtml, { sanitize: false }).process(row.content);

  return {
    slug: row.slug,
    title: row.title,
    date: row.date,
    author: row.author,
    excerpt: row.excerpt ?? "",
    content: processed.toString(),
  };
}
