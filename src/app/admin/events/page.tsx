"use client";

import { useEffect, useState } from "react";

interface Event {
  id: string;
  title: string;
  description: string;
  image: string;
  images: string[];
  dates: string[];
  blogSlug?: string;
}

const EMPTY: Event = {
  id: "",
  title: "",
  description: "",
  image: "",
  images: [],
  dates: [],
  blogSlug: "",
};

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [editing, setEditing] = useState<Event | null>(null);
  const [isNew, setIsNew] = useState(false);
  // Editable as newline-separated strings
  const [datesText, setDatesText] = useState("");
  const [imagesText, setImagesText] = useState("");

  async function load() {
    const res = await fetch("/api/admin/events");
    setEvents(await res.json());
  }

  useEffect(() => { load(); }, []);

  function startNew() {
    setEditing({ ...EMPTY });
    setDatesText("");
    setImagesText("");
    setIsNew(true);
  }

  function startEdit(e: Event) {
    setEditing({ ...e });
    setDatesText(e.dates.join("\n"));
    setImagesText(e.images.join("\n"));
    setIsNew(false);
  }

  function cancel() {
    setEditing(null);
    setIsNew(false);
  }

  async function save() {
    if (!editing) return;
    const payload: Event = {
      ...editing,
      dates: datesText.split("\n").map((s) => s.trim()).filter(Boolean),
      images: imagesText.split("\n").map((s) => s.trim()).filter(Boolean),
      blogSlug: editing.blogSlug || undefined,
    };
    const method = isNew ? "POST" : "PUT";
    await fetch("/api/admin/events", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setEditing(null);
    setIsNew(false);
    load();
  }

  async function toggleHidden(ev: Event) {
    const payload = {
      ...ev,
      hidden: !ev.hidden,
      blogSlug: ev.blogSlug || undefined,
    };
    await fetch("/api/admin/events", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm(`Delete event "${id}"?`)) return;
    await fetch("/api/admin/events", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  function set(field: keyof Event, value: string) {
    setEditing((e) => e ? { ...e, [field]: value } : e);
  }

  return (
    <div>
      <div className="adm-page-header">
        <h1 className="adm-page-title">Events</h1>
        {!editing && (
          <button className="adm-btn adm-btn--primary" onClick={startNew}>+ New event</button>
        )}
      </div>

      {editing ? (
        <div className="adm-form" style={{ maxWidth: 640 }}>
          <div className="adm-field">
            <label>ID</label>
            <input value={editing.id} onChange={(e) => set("id", e.target.value)} placeholder="unique-slug" disabled={!isNew} />
          </div>
          <div className="adm-field">
            <label>Title</label>
            <input value={editing.title} onChange={(e) => set("title", e.target.value)} />
          </div>
          <div className="adm-field">
            <label>Description</label>
            <textarea rows={4} value={editing.description} onChange={(e) => set("description", e.target.value)} />
          </div>
          <div className="adm-field">
            <label>Main image path</label>
            <input value={editing.image} onChange={(e) => set("image", e.target.value)} placeholder="/media/images/event.jpg" />
          </div>
          <div className="adm-field">
            <label>Sub-images (one path per line)</label>
            <textarea rows={3} value={imagesText} onChange={(e) => setImagesText(e.target.value)} placeholder="/media/images/sub1.jpg&#10;/media/images/sub2.jpg" />
          </div>
          <div className="adm-field">
            <label>Dates (one per line)</label>
            <textarea rows={3} value={datesText} onChange={(e) => setDatesText(e.target.value)} placeholder="June 14, 2026&#10;June 15, 2026" />
          </div>
          <div className="adm-field">
            <label>Blog slug (optional)</label>
            <input value={editing.blogSlug ?? ""} onChange={(e) => set("blogSlug", e.target.value)} placeholder="my-blog-post-slug" />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="adm-btn adm-btn--primary" onClick={save}>Save</button>
            <button className="adm-btn adm-btn--ghost" onClick={cancel}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="adm-list">
          {events.length === 0 && <p style={{ color: "#71717a" }}>No events yet.</p>}
          {events.map((e) => (
            <div key={e.id} className="adm-list-item">
              <div>
                <div className="adm-list-item__title">{e.title}</div>
                <div className="adm-list-item__meta">{e.dates.join(", ")}{e.blogSlug ? ` · blog: ${e.blogSlug}` : ""}</div>
              </div>
              <div className="adm-list-item__actions">
                <button className={`adm-btn ${e.hidden ? "adm-btn--danger" : "adm-btn--ghost"}`} onClick={() => toggleHidden(e)}>
                  {e.hidden ? "Hidden" : "Visible"}
                </button>
                <button className="adm-btn adm-btn--ghost" onClick={() => startEdit(e)}>Edit</button>
                <button className="adm-btn adm-btn--danger" onClick={() => remove(e.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
