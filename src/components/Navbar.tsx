"use client";

import { useState, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import "../styles/navbar.css";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";
import LanguageSwitcher from "./LanguageSwitcher";

interface NavItem {
  key: string;
  label: string;
}

export default function Navbar({ items, locale = "en" }: { items: NavItem[]; locale?: "en" | "es" }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [navHidden, setNavHidden] = useState(false);

  useLayoutEffect(() => {
    const hero = document.querySelector<HTMLElement>(".hero-wrapper");
    const scrollEl = document.querySelector<HTMLElement>(".site-layout > main");

    if (!hero || !scrollEl) {
      setNavHidden(false);
      return;
    }

    const update = () => setNavHidden(scrollEl.scrollTop < hero.offsetHeight);

    update();
    scrollEl.addEventListener("scroll", update, { passive: true });
    return () => scrollEl.removeEventListener("scroll", update);
  }, [pathname]);

  return (
    <header className={`desktop-menu sticky top-0 z-50${navHidden ? " navbar--hidden" : ""}`}>
      <div className="navbar-inner flex items-center justify-between p-4">
        <Link href="/" className="navbar-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/images/RecordsLogo.png"
            alt="Bison Records"
            width={180}
            height={82}
            className="navbar-logo__full"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/images/BRLogoHead.png"
            alt="Bison Records"
            width={48}
            height={48}
            className="navbar-logo__compact"
          />
        </Link>
        <button className="navbar-hamburger" onClick={() => setOpen((o) => !o)}>
          {open ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
        <nav className={`nav-dropdown ${open ? "nav-dropdown--open" : ""}`}>
          <ul className="menu-item flex flex-col">
            {items.map((item) => (
              <li key={item.key} className="p-4">
                <Link href={`/${item.key}`} onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="p-4">
              <LanguageSwitcher locale={locale} />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
