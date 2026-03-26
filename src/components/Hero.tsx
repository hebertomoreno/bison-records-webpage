"use client";

import "../styles/hero.css";

export default function Hero() {
  return (
    <div className="hero-container">
      <div className="hero-content">
        <p className="hero-artist">Nikolas Murdock's</p>
        <p className="hero-title">Year Of The Brown Bear</p>
        <p className="hero-subtitle">November 5th</p>
        <p className="hero-tagline">Because I really like V for Vendetta</p>
        <div className="hero-buttons">
          <a
            href="https://example.com"
            target="_blank"
            rel="noopener noreferrer"
            className="black-button"
          >
            Listen to other stuff
          </a>
          <a
            href="https://example.com"
            target="_blank"
            rel="noopener noreferrer"
            className="black-button"
          >
            Take me somewhere
          </a>
        </div>
      </div>
    </div>
  );
}
