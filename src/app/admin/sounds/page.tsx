"use client";

import { useEffect, useState, useRef } from "react";

type UploadState =
  | { phase: "idle" }
  | { phase: "uploading"; progress: number }
  | { phase: "done"; path: string }
  | { phase: "error"; message: string };

function extractDuration(file: File): Promise<string> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const audio = new Audio(url);
    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      const total = Math.round(audio.duration);
      const m = Math.floor(total / 60);
      const s = total % 60;
      resolve(`${m}:${s.toString().padStart(2, "0")}`);
    };
    audio.onerror = () => { URL.revokeObjectURL(url); resolve(""); };
  });
}

function slugify(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function uniqueSlug(base: string, existingIds: string[]): string {
  if (!existingIds.includes(base)) return base;
  let n = 2;
  while (existingIds.includes(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}

function FileDropzone({ dest, accept, hint, onUploaded }: {
  dest: string;
  accept: string;
  hint: string;
  onUploaded: (path: string, duration: string) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const [state, setState] = useState<UploadState>({ phase: "idle" });
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setState({ phase: "uploading", progress: 0 });

    const CHUNK = 4 * 1024 * 1024; // 4 MB — stays under the 10 MB body limit
    const totalChunks = Math.ceil(file.size / CHUNK);
    const uploadId = crypto.randomUUID();
    const durationPromise = extractDuration(file);

    for (let i = 0; i < totalChunks; i++) {
      const fd = new FormData();
      fd.append("chunk", file.slice(i * CHUNK, (i + 1) * CHUNK), file.name);
      fd.append("uploadId", uploadId);
      fd.append("chunkIndex", String(i));
      fd.append("totalChunks", String(totalChunks));
      fd.append("filename", file.name);
      fd.append("dest", dest);

      let res: Response;
      try {
        res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      } catch {
        setState({ phase: "error", message: "Network error — upload did not complete." });
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setState({ phase: "error", message: data.error ?? `Upload failed (${res.status})` });
        return;
      }

      setState({ phase: "uploading", progress: Math.round(((i + 1) / totalChunks) * 100) });
    }

    const duration = await durationPromise;
    const finalPath = `/media/${dest}/${file.name}`;
    setState({ phase: "done", path: finalPath });
    onUploaded(finalPath, duration);
  }

  const uploading = state.phase === "uploading";

  return (
    <div
      className={`adm-dropzone${dragging ? " adm-dropzone--drag" : ""}${uploading ? " adm-dropzone--busy" : ""}`}
      style={{ marginTop: 4 }}
      onDragOver={(e) => { if (!uploading) { e.preventDefault(); setDragging(true); } }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); if (!uploading && e.dataTransfer.files[0]) upload(e.dataTransfer.files[0]); }}
      onClick={() => { if (!uploading) inputRef.current?.click(); }}
    >
      {state.phase === "uploading" && (
        <div className="adm-dropzone__progress-bar">
          <div className="adm-dropzone__progress-fill" style={{ width: `${state.progress}%` }} />
        </div>
      )}
      <div className={`adm-dropzone__label${state.phase === "error" ? " adm-dropzone__label--error" : ""}`}>
        {state.phase === "idle" && "Drop file here or click to browse"}
        {state.phase === "uploading" && `Uploading… ${state.progress}%`}
        {state.phase === "done" && `✓ Saved: ${state.path}`}
        {state.phase === "error" && `✗ ${state.message}`}
      </div>
      {state.phase === "error" && (
        <div className="adm-dropzone__hint" style={{ color: "#ef4444" }}>Click to try again</div>
      )}
      {state.phase === "idle" && <div className="adm-dropzone__hint">{hint}</div>}
      <input ref={inputRef} type="file" accept={accept} style={{ display: "none" }}
        onChange={(e) => { if (e.target.files?.[0]) { upload(e.target.files[0]); e.target.value = ""; } }} />
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
  hidden?: boolean;
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
    // Update local state directly — the API returns stale data until the dev
    // server hot-reloads the updated tracks.ts module.
    setTracks((prev) =>
      isNew ? [...prev, payload] : prev.map((t) => (t.id === payload.id ? payload : t))
    );
    setEditing(null);
    setIsNew(false);
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

  function handleTitleChange(value: string) {
    setEditing((t) => {
      if (!t) return t;
      const base = slugify(value);
      const existingIds = tracks.map((tr) => tr.id).filter((id) => id !== t.id);
      const id = isNew ? uniqueSlug(base, existingIds) : t.id;
      return { ...t, title: value, id };
    });
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
            <label>Title</label>
            <input value={editing.title} onChange={(e) => handleTitleChange(e.target.value)} />
          </div>
          <div className="adm-field">
            <label>ID (slug)</label>
            <input value={editing.id} onChange={(e) => set("id", e.target.value)} placeholder="unique-slug" disabled={!isNew} />
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
              hint="MP3, WAV, FLAC, AAC, OGG — duration will be read automatically"
              onUploaded={(path, duration) => setEditing((t) => t ? { ...t, file: path, duration: duration || t.duration } : t)}
            />
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
