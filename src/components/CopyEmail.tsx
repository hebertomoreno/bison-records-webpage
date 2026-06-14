"use client";

import { useState } from "react";

export default function CopyEmail({ email, locale = "en" }: { email: string; locale?: "en" | "es" }) {
  const [copied, setCopied] = useState(false);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <a href={`mailto:${email}`} onClick={handleClick} title="Click to copy">
      {copied ? (locale === "es" ? "¡Copiado!" : "Copied!") : email}
    </a>
  );
}
