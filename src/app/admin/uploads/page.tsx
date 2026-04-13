"use client";

import { useState, useRef } from "react";

export default function AdminUploads() {
  const [dest, setDest] = useState<"images" | "audio">("images");
  const [dragging, setDragging] = useState(false);
  const [results, setResults] = useState<{ name: string; path: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFiles(files: FileList | File[]) {
    setUploading(true);
    const newResults: { name: string; path: string }[] = [];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("dest", dest);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      newResults.push({ name: file.name, path: data.path });
    }
    setResults((r) => [...newResults, ...r]);
    setUploading(false);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
  }

  return (
    <div>
      <div className="adm-page-header">
        <h1 className="adm-page-title">Uploads</h1>
      </div>

      <div className="adm-form" style={{ maxWidth: 600 }}>
        <div className="adm-field">
          <label>Destination</label>
          <select value={dest} onChange={(e) => setDest(e.target.value as "images" | "audio")}>
            <option value="images">Images → public/media/images/</option>
            <option value="audio">Audio → public/media/audio/</option>
          </select>
        </div>

        <div
          className={`adm-dropzone${dragging ? " adm-dropzone--drag" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
        >
          <div className="adm-dropzone__label">
            {uploading ? "Uploading…" : "Drop files here or click to browse"}
          </div>
          <div className="adm-dropzone__hint">
            {dest === "audio" ? "MP3, WAV, FLAC, AAC, OGG" : "JPG, PNG, GIF, WebP, SVG"}
          </div>
          <input
            ref={inputRef}
            type="file"
            multiple
            style={{ display: "none" }}
            accept={dest === "audio" ? "audio/*" : "image/*"}
            onChange={(e) => { if (e.target.files) uploadFiles(e.target.files); }}
          />
        </div>

        {results.length > 0 && (
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Uploaded
            </label>
            {results.map((r) => (
              <div key={r.path} className="adm-upload-result">
                <strong>{r.name}</strong> → <code>{r.path}</code>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
