"use client";

import { destinations } from "../data/destinations";
import "../styles/somewhere.css";

export default function SomewhereButton() {
  function go() {
    const url = destinations[Math.floor(Math.random() * destinations.length)];
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="somewhere-section">
      <button className="somewhere-btn" onClick={go}>
        Take me somewhere
      </button>
    </div>
  );
}
