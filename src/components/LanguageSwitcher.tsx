"use client";

import { useEffect, useState } from "react";
import "../styles/language-switcher.css";

export default function LanguageSwitcher() {
  const [current, setCurrent] = useState<"en" | "es">("en");

  useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)locale=([^;]*)/);
    if (match?.[1] === "es") setCurrent("es");
  }, []);

  function handleSwitch(locale: "en" | "es") {
    if (locale === current) return;
    document.cookie = `locale=${locale}; path=/; max-age=31536000`;
    window.location.reload();
  }

  return (
    <div className="lang-switcher">
      <button
        className={`lang-btn ${current === "en" ? "lang-btn--active" : ""}`}
        onClick={() => handleSwitch("en")}
      >
        EN
      </button>
      <span className="lang-divider">|</span>
      <button
        className={`lang-btn ${current === "es" ? "lang-btn--active" : ""}`}
        onClick={() => handleSwitch("es")}
      >
        ES
      </button>
    </div>
  );
}
