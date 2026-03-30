"use client";

import { useState, useEffect, useCallback } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "../styles/hero.css";

interface Slide {
  image: string;
  artist?: string;
  title: string;
  subtitle?: string;
  tagline?: string;
  buttons?: { label: string; href: string }[];
}

// ── Add or edit slides here ──────────────────────────────────────
const slides: Slide[] = [
  {
    image: "/media/images/NikolasMurdockImage.jpg",
    artist: "Nikolas Murdock's",
    title: "Year Of The Brown Bear",
    subtitle: "November 5th",
    tagline: "Because I really like V for Vendetta",
    buttons: [
      { label: "Listen", href: "/artists/nikolas-murdock#music" },
      { label: "More", href: "/artists/nikolas-murdock" },
    ],
  },
  {
    image: "/media/images/forest.JPG",
    title: "Bison Records",
    subtitle: "Independent · Intentional",
    tagline: "Music that earns its silence",
    buttons: [
      { label: "Our Artists", href: "/artists" },
    ],
  },
];
// ────────────────────────────────────────────────────────────────

const INTERVAL = 15000;

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((i) => (i + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((i) => (i - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, INTERVAL);
    return () => clearInterval(id);
  }, [paused, next]);

  return (
    <div
      className="hero-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`hero-slide ${i === current ? "hero-slide--active" : ""}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="hero-slide__overlay" />
          <div className="hero-content">
            {slide.artist && <p className="hero-artist">{slide.artist}</p>}
            <p className="hero-title">{slide.title}</p>
            {slide.subtitle && <p className="hero-subtitle">{slide.subtitle}</p>}
            {slide.tagline && <p className="hero-tagline">{slide.tagline}</p>}
            {slide.buttons && (
              <div className="hero-buttons">
                {slide.buttons.map((btn) => (
                  <a key={btn.label} href={btn.href} className="black-button">
                    {btn.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Arrows */}
      <button className="hero-arrow hero-arrow--prev" onClick={prev} aria-label="Previous slide">
        <FiChevronLeft size={28} />
      </button>
      <button className="hero-arrow hero-arrow--next" onClick={next} aria-label="Next slide">
        <FiChevronRight size={28} />
      </button>

      {/* Dot navigation */}
      <div className="hero-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`hero-dot ${i === current ? "hero-dot--active" : ""}`}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
