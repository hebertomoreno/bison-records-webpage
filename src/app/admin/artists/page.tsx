"use client";

import { useEffect, useState } from "react";

interface ArtistProfile {
  slug: string;
  name: string;
  image: string;
  bio: { en: string; es: string };
}

const EMPTY: ArtistProfile = { slug: "", name: "", image: "", bio: { en: "", es: "" } };

function toSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export default function AdminArtists() {
  const [artists, setArtists] = useState<ArtistProfile[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [form, setForm] = useState<ArtistProfile>(EMPTY);
  const [isNew, setIsNew] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("/api/admin/artists").then((r) => r.json()).then(setArtists);
  }, []);

  function selectArtist(slug: string) {
    const a = artists.find((x) => x.slug === slug)!;
    setSelected(slug);
    setForm(a);
    setIsNew(false);
    setStatus("");
  }

  function startNew() {
    setSelected(null);
    setForm(EMPTY);
    setIsNew(true);
    setStatus("");
  }

  function setBio(lang: "en" | "es", value: string) {
    setForm((f) => ({ ...f, bio: { ...f.bio, [lang]: value } }));
  }

  async function save() {
    if (!form.name.trim()) { setStatus("Name is required."); return; }
    const slug = isNew ? toSlug(form.name) : form.slug;
    const payload = { ...form, slug };
    setStatus("Saving…");
    await fetch("/api/admin/artists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const updated = await fetch("/api/admin/artists").then((r) => r.json());
    setArtists(updated);
    setSelected(slug);
    setForm(payload);
    setIsNew(false);
    setStatus("Saved!");
    setTimeout(() => setStatus(""), 2000);
  }

  async function remove() {
    if (!selected || !confirm(`Delete ${form.name}?`)) return;
    await fetch("/api/admin/artists", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: selected }),
    });
    const updated = await fetch("/api/admin/artists").then((r) => r.json());
    setArtists(updated);
    setSelected(null);
    setForm(EMPTY);
    setIsNew(false);
  }

  const showForm = isNew || selected !== null;

  return (
    <div>
      <div className="adm-page-header">
        <h1 className="adm-page-title">Artists</h1>
        <button className="adm-btn adm-btn--primary" onClick={startNew}>+ New Artist</button>
      </div>

      <div className="adm-album-grid">
        {artists.map((a) => (
          <div
            key={a.slug}
            className={`adm-album-card${selected === a.slug ? " adm-album-card--active" : ""}`}
            onClick={() => selectArtist(a.slug)}
          >
            {a.image && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={a.image} alt={a.name} />
            )}
            <div className="adm-album-card__name">{a.name}</div>
            <div className="adm-album-card__year">/artists/{a.slug}</div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="adm-form">
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>
            {isNew ? "New Artist" : form.name}
          </h2>

          <div className="adm-field">
            <label>Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Artist Name"
            />
          </div>

          <div className="adm-field">
            <label>Image path</label>
            <input
              value={form.image}
              onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
              placeholder="/media/images/ArtistName.jpg"
            />
            {form.image && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={form.image}
                alt="preview"
                style={{ marginTop: 8, maxHeight: 120, borderRadius: 4, objectFit: "cover" }}
              />
            )}
          </div>

          <div className="adm-field">
            <label>Bio — English</label>
            <textarea
              value={form.bio.en}
              onChange={(e) => setBio("en", e.target.value)}
              placeholder="Short bio in English…"
              style={{ minHeight: 120 }}
            />
          </div>

          <div className="adm-field">
            <label>Bio — Español</label>
            <textarea
              value={form.bio.es}
              onChange={(e) => setBio("es", e.target.value)}
              placeholder="Biografía corta en español…"
              style={{ minHeight: 120 }}
            />
          </div>

          <div className="adm-form-actions">
            <button className="adm-btn adm-btn--primary" onClick={save}>Save</button>
            {!isNew && (
              <button className="adm-btn adm-btn--danger" onClick={remove}>Delete</button>
            )}
            {status && <span className="adm-form-status">{status}</span>}
          </div>
        </div>
      )}
    </div>
  );
}
