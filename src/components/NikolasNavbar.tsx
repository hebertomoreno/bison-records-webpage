"use client";

import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import "../styles/nikolas-murdock.css";
import LanguageSwitcher from "./LanguageSwitcher";

interface NavItem {
  key: string;
  label: string;
}

export default function NikolasNavbar({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="nm-nav">
      <div className="nm-nav__inner">
        <div className="nm-nav__brand-group">
          <a href="/" className="nm-nav__label">Bison Records</a>
          <a href="#hero" className="nm-nav__brand">Nikolas Murdock</a>
        </div>
        <button className="nm-nav__toggle" onClick={() => setOpen((o) => !o)}>
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
        <nav className={`nm-nav__menu ${open ? "nm-nav__menu--open" : ""}`}>
          <ul>
            {items.map((item) => (
              <li key={item.key}>
                <a href={`#${item.key}`} onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
            <li><LanguageSwitcher /></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
