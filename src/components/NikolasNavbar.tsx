"use client";

import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import "../styles/nikolas-murdock.css";

const navItems = ["music", "about", "shows", "videos", "contact"];

export default function NikolasNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="nm-nav">
      <div className="nm-nav__inner">
        <a href="#hero" className="nm-nav__brand">Nikolas Murdock</a>
        <button className="nm-nav__toggle" onClick={() => setOpen((o) => !o)}>
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
        <nav className={`nm-nav__menu ${open ? "nm-nav__menu--open" : ""}`}>
          <ul>
            {navItems.map((item) => (
              <li key={item}>
                <a href={`#${item}`} onClick={() => setOpen(false)}>
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
