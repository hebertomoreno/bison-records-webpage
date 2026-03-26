import Link from "next/link";
import { getPost, getAllPosts } from "../../../../lib/blog";
import "../../../../styles/blog.css";

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  return (
    <div className="blog-post">
      <Link href="/blog" className="blog-post__back">← All Posts</Link>
      <div className="blog-post__meta">
        <span>{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
        {post.author && <span>{post.author}</span>}
      </div>
      <h1 className="blog-post__title">{post.title}</h1>
      <div
        className="blog-post__body"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
}
