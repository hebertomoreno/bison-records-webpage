"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const EMPTY = { title: "", date: new Date().toISOString().slice(0, 10), author: "", excerpt: "", body: "", language: "en" };

export default function BlogEditor() {
  const { slug } = useParams<{ slug: string }>();
  const isNew = slug === "new";
  const router = useRouter();

  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (isNew) return;
    fetch(`/api/admin/blog/${slug}`).then((r) => r.json()).then((d) => {
      setForm({ title: d.title, date: d.date, author: d.author, excerpt: d.excerpt, body: d.body, language: d.language ?? "en" });
    });
  }, [slug]);

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function save() {
    setStatus("Saving…");
    if (isNew) {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const { slug: newSlug } = await res.json();
      setStatus("Saved!");
      router.replace(`/admin/blog/${newSlug}`);
    } else {
      await fetch(`/api/admin/blog/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus("Saved!");
    }
    setTimeout(() => setStatus(""), 2000);
  }

  return (
    <div>
      <Link href="/admin/blog" className="adm-back">← All posts</Link>
      <div className="adm-page-header">
        <h1 className="adm-page-title">{isNew ? "New post" : "Edit post"}</h1>
      </div>

      <div className="adm-form">
        <div className="adm-form-row">
          <div className="adm-field">
            <label>Title</label>
            <input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Post title" />
          </div>
          <div className="adm-field">
            <label>Date</label>
            <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} />
          </div>
          <div className="adm-field">
            <label>Language</label>
            <select value={form.language} onChange={(e) => set("language", e.target.value)}>
              <option value="en">English</option>
              <option value="es">Spanish</option>
            </select>
          </div>
        </div>

        <div className="adm-form-row">
          <div className="adm-field">
            <label>Author</label>
            <input value={form.author} onChange={(e) => set("author", e.target.value)} placeholder="Author name" />
          </div>
          <div className="adm-field">
            <label>Excerpt</label>
            <input value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} placeholder="Short summary shown in the list" />
          </div>
        </div>

        <div className="adm-field">
          <label>Body (Markdown)</label>
          <textarea
            className="adm-body"
            value={form.body}
            onChange={(e) => set("body", e.target.value)}
            placeholder="Write your post in Markdown…"
          />
        </div>

        <div className="adm-form-actions">
          <button className="adm-btn adm-btn--primary" onClick={save}>Save</button>
          {status && <span className="adm-form-status">{status}</span>}
        </div>
      </div>
    </div>
  );
}
