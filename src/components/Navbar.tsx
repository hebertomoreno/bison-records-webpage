"use client";

import { useState } from "react";
import "../styles/navbar.css";
import Link from "next/link";
import Image from "next/image";
import { FiMenu, FiX } from "react-icons/fi";
import LanguageSwitcher from "./LanguageSwitcher";

interface NavItem {
  key: string;
  label: string;
}

export default function Navbar({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="desktop-menu sticky top-0 z-50">
      <div className="navbar-inner flex items-center justify-between p-4">
        <Link href="/" className="navbar-logo">
          <Image
            src="/media/images/RecordsLogo.png"
            alt="Bison Records"
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
              <li key={item.key} className="p-4">
                <Link href={`/${item.key}`} onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="p-4">
              <LanguageSwitcher />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
