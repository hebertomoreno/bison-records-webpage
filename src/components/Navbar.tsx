"use client";

import { useState } from "react";
import "../styles/navbar.css";
import Link from "next/link";
import Image from "next/image";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const items = [
    "artists",
    "videos",
    "sounds",
    // "music",
    // "events",
    "blog",
    "press",
    "contact",
  ];

  return (
    <header className="desktop-menu fixed top-0 w-full bg-white shadow z-50">
      <div className="max-w-4xl mx-auto flex items-center justify-between p-4">
        <Link href="/">
          <Image
            src="/media/images/RecordsLogo.png"
            alt="MySite logo"
            width={238}
            height={82}
          />
        </Link>
        <button className="md:hidden" onClick={() => setOpen((o) => !o)}>
          {open ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
        <nav className={`nav-dropdown ${open ? "nav-dropdown--open" : ""}`}>
          <ul className="menu-item flex flex-col md:flex-row">
            {items.map((item) => (
              <li key={item} className="p-4 hover:red">
                <Link href={`/${item}`} onClick={() => setOpen(false)}>
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
