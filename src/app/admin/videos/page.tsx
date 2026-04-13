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

interface Video {
  id: string;
  title: string;
  author: string;
  description: string;
  type: "local" | "youtube";
  file?: string;
  preview?: string;
  youtubeId?: string;
}

const EMPTY: Video = {
  id: "",
  title: "",
  author: "",
  description: "",
  type: "youtube",
  file: "",
  preview: "",
  youtubeId: "",
};

export default function AdminVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [editing, setEditing] = useState<Video | null>(null);
  const [isNew, setIsNew] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/videos");
    setVideos(await res.json());
  }

  useEffect(() => { load(); }, []);

  function startNew() {
    setEditing({ ...EMPTY });
    setIsNew(true);
  }

  function startEdit(v: Video) {
    setEditing({ ...v });
    setIsNew(false);
  }

  function cancel() {
    setEditing(null);
    setIsNew(false);
  }

  async function save() {
    if (!editing) return;
    const method = isNew ? "POST" : "PUT";
    await fetch("/api/admin/videos", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    setEditing(null);
    setIsNew(false);
    load();
  }

  async function toggleHidden(v: Video) {
    await fetch("/api/admin/videos", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...v, hidden: !v.hidden }),
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm(`Delete video "${id}"?`)) return;
    await fetch("/api/admin/videos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  function set(field: keyof Video, value: string) {
    setEditing((e) => e ? { ...e, [field]: value } : e);
  }

  return (
    <div>
      <div className="adm-page-header">
        <h1 className="adm-page-title">Videos</h1>
        {!editing && (
          <button className="adm-btn adm-btn--primary" onClick={startNew}>+ New video</button>
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
            <label>Author</label>
            <input value={editing.author} onChange={(e) => set("author", e.target.value)} />
          </div>
          <div className="adm-field">
            <label>Type</label>
            <select value={editing.type} onChange={(e) => set("type", e.target.value)}>
              <option value="youtube">YouTube</option>
              <option value="local">Local</option>
            </select>
          </div>
          {editing.type === "youtube" ? (
            <div className="adm-field">
              <label>YouTube ID</label>
              <input value={editing.youtubeId ?? ""} onChange={(e) => set("youtubeId", e.target.value)} placeholder="dQw4w9WgXcQ" />
            </div>
          ) : (
            <>
              <div className="adm-field">
                <label>File path (no extension)</label>
                <input value={editing.file ?? ""} onChange={(e) => set("file", e.target.value)} placeholder="/media/video/my-video" />
                <FileDropzone
                  dest="video"
                  accept="video/*"
                  hint="MP4, WebM, MOV, MKV"
                  onUploaded={(path) => {
                    // Strip extension so the player can append .mp4 / .webm itself
                    const withoutExt = path.replace(/\.[^/.]+$/, "");
                    set("file", withoutExt);
                  }}
                />
              </div>
              <div className="adm-field">
                <label>Preview GIF path</label>
                <input value={editing.preview ?? ""} onChange={(e) => set("preview", e.target.value)} placeholder="/media/video/my-video-preview.gif" />
                <FileDropzone
                  dest="video"
                  accept="image/gif"
                  hint="Animated GIF"
                  onUploaded={(path) => set("preview", path)}
                />
              </div>
            </>
          )}
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
          {videos.length === 0 && <p style={{ color: "#71717a" }}>No videos yet.</p>}
          {videos.map((v) => (
            <div key={v.id} className="adm-list-item">
              <div>
                <div className="adm-list-item__title">{v.title}</div>
                <div className="adm-list-item__meta">{v.author} · {v.type}{v.youtubeId ? ` · ${v.youtubeId}` : ""}{v.file ? ` · ${v.file}` : ""}</div>
              </div>
              <div className="adm-list-item__actions">
                <button className={`adm-btn ${v.hidden ? "adm-btn--danger" : "adm-btn--ghost"}`} onClick={() => toggleHidden(v)}>
                  {v.hidden ? "Hidden" : "Visible"}
                </button>
                <button className="adm-btn adm-btn--ghost" onClick={() => startEdit(v)}>Edit</button>
                <button className="adm-btn adm-btn--danger" onClick={() => remove(v.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
