"use client";

import { useState } from "react";
import "../styles/language-switcher.css";

export default function LanguageSwitcher({ locale = "en" }: { locale?: "en" | "es" }) {
  const [current, setCurrent] = useState<"en" | "es">(locale);

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
