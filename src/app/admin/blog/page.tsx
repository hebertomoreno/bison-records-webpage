"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Post { slug: string; title: string; date: string; author: string; hidden: boolean }

export default function AdminBlogList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const router = useRouter();

  async function load() {
    const res = await fetch("/api/admin/blog");
    setPosts(await res.json());
  }

  useEffect(() => { load(); }, []);

  async function toggleHidden(slug: string) {
    await fetch(`/api/admin/blog/${slug}`, { method: "PATCH" });
    load();
  }

  async function deletePost(slug: string) {
    if (!confirm(`Delete "${slug}"?`)) return;
    await fetch(`/api/admin/blog/${slug}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="adm-page-header">
        <h1 className="adm-page-title">Blog Posts</h1>
        <button className="adm-btn adm-btn--primary" onClick={() => router.push("/admin/blog/new")}>
          + New post
        </button>
      </div>

      {posts.length === 0 ? (
        <p style={{ color: "#71717a" }}>No posts yet.</p>
      ) : (
        <div className="adm-list">
          {posts.map((p) => (
            <div key={p.slug} className="adm-list-item">
              <div>
                <div className="adm-list-item__title">{p.title}</div>
                <div className="adm-list-item__meta">{p.date}{p.author ? ` · ${p.author}` : ""}</div>
              </div>
              <div className="adm-list-item__actions">
                <button className={`adm-btn ${p.hidden ? "adm-btn--danger" : "adm-btn--ghost"}`} onClick={() => toggleHidden(p.slug)}>
                  {p.hidden ? "Hidden" : "Visible"}
                </button>
                <Link href={`/admin/blog/${p.slug}`} className="adm-btn adm-btn--ghost">Edit</Link>
                <button className="adm-btn adm-btn--danger" onClick={() => deletePost(p.slug)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
