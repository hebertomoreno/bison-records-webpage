"use client";

import { useEffect, useState, useRef } from "react";

function FileDropzone({ dest, accept, hint, onUploaded }: {
  dest: string;
  accept: string;
  hint: string;
  onUploaded: (path: string) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setStatus("Uploading…");
    const fd = new FormData();
    fd.append("file", file);
    fd.append("dest", dest);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    setStatus(`Saved: ${data.path}`);
    onUploaded(data.path);
  }

  return (
    <div
      className={`adm-dropzone${dragging ? " adm-dropzone--drag" : ""}`}
      style={{ marginTop: 4 }}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files[0]) upload(e.dataTransfer.files[0]); }}
      onClick={() => inputRef.current?.click()}
    >
      <div className="adm-dropzone__label">{status ?? "Drop file here or click to browse"}</div>
      <div className="adm-dropzone__hint">{hint}</div>
      <input ref={inputRef} type="file" accept={accept} style={{ display: "none" }}
        onChange={(e) => { if (e.target.files?.[0]) upload(e.target.files[0]); }} />
    </div>
  );
}

interface Track {
  id: string;
  file: string;
  title: string;
  artist: string;
  description: string;
  duration: string | null;
  recordedAt: string | null;
}

const EMPTY: Track = {
  id: "",
  file: "",
  title: "",
  artist: "",
  description: "",
  duration: null,
  recordedAt: null,
};

export default function AdminSounds() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [editing, setEditing] = useState<Track | null>(null);
  const [isNew, setIsNew] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/sounds");
    setTracks(await res.json());
  }

  useEffect(() => { load(); }, []);

  function startNew() {
    setEditing({ ...EMPTY });
    setIsNew(true);
  }

  function startEdit(t: Track) {
    setEditing({ ...t });
    setIsNew(false);
  }

  function cancel() {
    setEditing(null);
    setIsNew(false);
  }

  async function save() {
    if (!editing) return;
    const payload = {
      ...editing,
      duration: editing.duration || null,
      recordedAt: editing.recordedAt || null,
    };
    const method = isNew ? "POST" : "PUT";
    await fetch("/api/admin/sounds", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setEditing(null);
    setIsNew(false);
    load();
  }

  async function toggleHidden(t: Track) {
    await fetch("/api/admin/sounds", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...t, hidden: !t.hidden }),
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm(`Delete track "${id}"?`)) return;
    await fetch("/api/admin/sounds", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  function set(field: keyof Track, value: string) {
    setEditing((t) => t ? { ...t, [field]: value } : t);
  }

  return (
    <div>
      <div className="adm-page-header">
        <h1 className="adm-page-title">Sounds</h1>
        {!editing && (
          <button className="adm-btn adm-btn--primary" onClick={startNew}>+ New track</button>
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
            <label>Artist</label>
            <input value={editing.artist} onChange={(e) => set("artist", e.target.value)} />
          </div>
          <div className="adm-field">
            <label>File path</label>
            <input value={editing.file} onChange={(e) => set("file", e.target.value)} placeholder="/media/audio/my-track.wav" />
            <FileDropzone
              dest="audio"
              accept="audio/*"
              hint="MP3, WAV, FLAC, AAC, OGG"
              onUploaded={(path) => set("file", path)}
            />
          </div>
          <div className="adm-field">
            <label>Duration (e.g. 1:23)</label>
            <input value={editing.duration ?? ""} onChange={(e) => set("duration", e.target.value)} placeholder="0:31" />
          </div>
          <div className="adm-field">
            <label>Recorded at</label>
            <input value={editing.recordedAt ?? ""} onChange={(e) => set("recordedAt", e.target.value)} placeholder="The Rocky Mountains, near Denver." />
          </div>
          <div className="adm-field">
            <label>Description</label>
            <textarea rows={5} value={editing.description} onChange={(e) => set("description", e.target.value)} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="adm-btn adm-btn--primary" onClick={save}>Save</button>
            <button className="adm-btn adm-btn--ghost" onClick={cancel}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="adm-list">
          {tracks.length === 0 && <p style={{ color: "#71717a" }}>No tracks yet.</p>}
          {tracks.map((t) => (
            <div key={t.id} className="adm-list-item">
              <div>
                <div className="adm-list-item__title">{t.title}</div>
                <div className="adm-list-item__meta">{t.artist}{t.duration ? ` · ${t.duration}` : ""}{t.recordedAt ? ` · ${t.recordedAt}` : ""}</div>
              </div>
              <div className="adm-list-item__actions">
                <button className={`adm-btn ${t.hidden ? "adm-btn--danger" : "adm-btn--ghost"}`} onClick={() => toggleHidden(t)}>
                  {t.hidden ? "Hidden" : "Visible"}
                </button>
                <button className="adm-btn adm-btn--ghost" onClick={() => startEdit(t)}>Edit</button>
                <button className="adm-btn adm-btn--danger" onClick={() => remove(t.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
