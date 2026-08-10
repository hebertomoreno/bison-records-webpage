"use client";
import { useState, useEffect, useCallback } from "react";

const photos = [
  "M-6.jpg",
  "M-10.jpg",
  "M-22.jpg",
  "M-43.jpg",
  "M-89.jpg",
  "M-100.jpg",
  "45148807_769762566692084_4563012137609330688_n.jpg",
];

export default function NmPhotosGallery() {
  const [selected, setSelected] = useState<string | null>(null);

  const close = useCallback(() => setSelected(null), []);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selected, close]);

  return (
    <>
      <div className="nm-photos-grid">
        {photos.map((filename) => (
          <button
            key={filename}
            className="nm-photo-btn"
            onClick={() => setSelected(filename)}
            aria-label="View photo"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/media/images/NikMdkOfficialPhotos/${filename}`}
              alt="Nikolas Murdock"
              className="nm-photo"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {selected && (
        <div className="nm-lightbox" onClick={close} role="dialog" aria-modal="true">
          <button className="nm-lightbox__close" onClick={close} aria-label="Close">✕</button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/media/images/NikMdkOfficialPhotos/${selected}`}
            alt="Nikolas Murdock"
            className="nm-lightbox__img"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
