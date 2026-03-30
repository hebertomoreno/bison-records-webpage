import Link from "next/link";
import { getAllPosts } from "../../../lib/blog";
import "../../../styles/blog.css";
import { getLocale } from "../../../lib/locale";
import { t } from "../../../lib/translations";

export default async function BlogPage() {
  const locale = await getLocale();
  const tr = t(locale);
  const posts = getAllPosts();

  return (
    <div className="blog-page">
      <h1 className="blog-heading">{tr.blog.heading}</h1>
      <div className="blog-list">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-entry">
            <div className="blog-entry__meta">
              <span>{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
              {post.author && <span>{post.author}</span>}
            </div>
            <h2 className="blog-entry__title">{post.title}</h2>
            {post.excerpt && <p className="blog-entry__excerpt">{post.excerpt}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}
