"use client";

// ── ARTIST TEMPLATE ────────────────────────────────────────────────
// Copy this folder, rename it to your artist's slug (e.g. "jane-doe"),
// and do a find-and-replace of:
//   "Artist Name"  → the artist's display name
//   "at-"          → your initials prefix (e.g. "jd-")
//   "artist-template.css" → your renamed CSS file
//
// Add a middleware rewrite in src/middleware.ts if the artist has
// their own domain.
// ───────────────────────────────────────────────────────────────────

import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import Link from "next/link";
import "../../../styles/site-layout.css";
import "../../../styles/artist-template.css";

const navItems = [
  { key: "music", label: "Music" },
  { key: "about", label: "About" },
  { key: "shows", label: "Shows" },
  { key: "videos", label: "Videos" },
  { key: "contact", label: "Contact" },
];

function ArtistNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="at-nav">
      <div className="at-nav__inner">
        <div className="at-nav__brand-group">
          <Link href="/" className="at-nav__label">Bison Records</Link>
          <a href="#hero" className="at-nav__brand">Artist Name</a>
        </div>
        <button className="at-nav__toggle" onClick={() => setOpen((o) => !o)}>
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
        <nav className={`at-nav__menu ${open ? "at-nav__menu--open" : ""}`}>
          <ul>
            {navItems.map((item) => (
              <li key={item.key}>
                <a href={`#${item.key}`} onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default function ArtistLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-layout">
      <ArtistNavbar />
      <main>{children}</main>
    </div>
  );
}
