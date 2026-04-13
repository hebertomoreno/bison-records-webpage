"use client";

import { useEffect, useState } from "react";

interface Credit { role: string; names: string[] }
interface Album { spotifyId: string; name: string; releaseDate: string; albumType: string; image: string }
interface AlbumDetail { spotifyId: string; description: string; credits: Credit[]; hidden?: boolean }

const ROLES = ["Written by", "Produced by", "Performed by", "Mixed by", "Mastered by", "Recorded by", "Featuring"];

export default function AdminAlbums() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [details, setDetails] = useState<Record<string, AlbumDetail>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [form, setForm] = useState<AlbumDetail>({ spotifyId: "", description: "", credits: [] });
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("/api/admin/album-details").then((r) => r.json()).then((list: AlbumDetail[]) => {
      const map: Record<string, AlbumDetail> = {};
      for (const d of list) map[d.spotifyId] = d;
      setDetails(map);
    });
    // Load albums from the static file via a small inline fetch
    fetch("/api/admin/albums").then((r) => r.json()).then(setAlbums).catch(() => {
      // Fallback: load from the page itself via import
    });
  }, []);

  function select(id: string) {
    setSelected(id);
    setStatus("");
    const existing = details[id];
    setForm(existing ?? { spotifyId: id, description: "", credits: [] });
  }

  function addCredit() {
    setForm((f) => ({ ...f, credits: [...f.credits, { role: "Written by", names: [""] }] }));
  }

  function removeCredit(i: number) {
    setForm((f) => ({ ...f, credits: f.credits.filter((_, idx) => idx !== i) }));
  }

  function setCredit(i: number, field: "role" | "names", value: string) {
    setForm((f) => {
      const credits = [...f.credits];
      if (field === "names") credits[i] = { ...credits[i], names: value.split(",").map((s) => s.trim()) };
      else credits[i] = { ...credits[i], role: value };
      return { ...f, credits };
    });
  }

  async function toggleHidden(id: string) {
    const existing = details[id] ?? { spotifyId: id, description: "", credits: [] };
    const updated = { ...existing, hidden: !existing.hidden };
    await fetch("/api/admin/album-details", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    setDetails((d) => ({ ...d, [id]: updated }));
  }

  async function save() {
    setStatus("Saving…");
    await fetch("/api/admin/album-details", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, spotifyId: selected }),
    });
    setDetails((d) => ({ ...d, [selected!]: { ...form, spotifyId: selected! } }));
    setStatus("Saved!");
    setTimeout(() => setStatus(""), 2000);
  }

  const selectedAlbum = albums.find((a) => a.spotifyId === selected);

  return (
    <div>
      <div className="adm-page-header">
        <h1 className="adm-page-title">Music — Descriptions & Credits</h1>
      </div>

      {albums.length === 0 && (
        <p style={{ color: "#71717a", marginBottom: "1rem" }}>
          Loading albums… (make sure <code>src/data/albums.ts</code> is populated)
        </p>
      )}

      <div className="adm-album-grid">
        {albums.map((a) => (
          <div
            key={a.spotifyId}
            className={`adm-album-card${selected === a.spotifyId ? " adm-album-card--active" : ""}${details[a.spotifyId]?.hidden ? " adm-album-card--hidden" : ""}`}
            onClick={() => select(a.spotifyId)}
          >
            <img src={a.image} alt={a.name} style={{ opacity: details[a.spotifyId]?.hidden ? 0.4 : 1 }} />
            <div className="adm-album-card__name">{a.name}</div>
            <div className="adm-album-card__year">
              {a.releaseDate.slice(0, 4)} · {a.albumType}
              {details[a.spotifyId] && !details[a.spotifyId].hidden ? " ✓" : ""}
            </div>
            <button
              className={`adm-btn ${details[a.spotifyId]?.hidden ? "adm-btn--danger" : "adm-btn--ghost"}`}
              style={{ marginTop: 6, width: "100%", fontSize: 11 }}
              onClick={(ev) => { ev.stopPropagation(); toggleHidden(a.spotifyId); }}
            >
              {details[a.spotifyId]?.hidden ? "Hidden" : "Visible"}
            </button>
          </div>
        ))}
      </div>

      {selected && (
        <div className="adm-form">
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{selectedAlbum?.name}</h2>

          <div className="adm-field">
            <label>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="A short paragraph about this release…"
              style={{ minHeight: 120 }}
            />
          </div>

          <div className="adm-field">
            <label>Credits</label>
            <div className="adm-credits">
              {form.credits.map((c, i) => (
                <div key={i} className="adm-credit-row">
                  <select value={c.role} onChange={(e) => setCredit(i, "role", e.target.value)}>
                    {ROLES.map((r) => <option key={r}>{r}</option>)}
                    <option value={c.role}>{ROLES.includes(c.role) ? null : c.role}</option>
                  </select>
                  <input
                    value={c.names.join(", ")}
                    onChange={(e) => setCredit(i, "names", e.target.value)}
                    placeholder="Name, Name, …"
                  />
                  <button className="adm-btn adm-btn--danger" onClick={() => removeCredit(i)}>✕</button>
                </div>
              ))}
              <button className="adm-btn adm-btn--ghost" style={{ alignSelf: "flex-start" }} onClick={addCredit}>
                + Add credit
              </button>
            </div>
          </div>

          <div className="adm-form-actions">
            <button className="adm-btn adm-btn--primary" onClick={save}>Save</button>
            {status && <span className="adm-form-status">{status}</span>}
          </div>
        </div>
      )}
    </div>
  );
}
