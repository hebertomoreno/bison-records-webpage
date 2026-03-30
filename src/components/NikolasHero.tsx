"use client";

import { useState, useEffect, useCallback } from "react";

const slides = [
  "/media/images/bear1.jpg",
  "/media/images/bear2.jpg",
  "/media/images/bear3.jpg",
];

interface Props {
  release: string;
  cta: string;
}

export default function NikolasHero({ release, cta }: Props) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 15000);
    return () => clearInterval(id);
  }, [paused, next]);

  return (
    <section id="hero" className="nm-hero">
      <div
        className="nm-hero__carousel"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {slides.map((src, i) => (
          <div
            key={src}
            className="nm-hero__slide"
            style={{
              backgroundImage: `url(${src})`,
              opacity: i === current ? 1 : 0,
            }}
          />
        ))}

        <div className="nm-hero__overlay" />

        <button className="nm-hero__arrow nm-hero__arrow--prev" onClick={prev} aria-label="Previous">
          ‹
        </button>
        <button className="nm-hero__arrow nm-hero__arrow--next" onClick={next} aria-label="Next">
          ›
        </button>

        <div className="nm-hero__content">
          <h1 className="nm-hero__name">Nikolas Murdock</h1>
          <p className="nm-hero__release">{release}</p>
          <a href="#music" className="nm-hero__cta">{cta}</a>
        </div>

        <div className="nm-hero__dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`nm-hero__dot${i === current ? " nm-hero__dot--active" : ""}`}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
