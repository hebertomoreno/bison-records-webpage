"use client";

import { useState, useEffect, useCallback } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Image from "next/image";
import "../styles/hero.css";

export interface Slide {
  image?: string;
  video?: string;
  logo?: string;
  artist?: string;
  title: string;
  subtitle?: string;
  tagline?: string;
  buttons?: { label: string; href: string }[];
}

const INTERVAL = 15000;

export default function Hero({ slides }: { slides: Slide[] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((i) => (i + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((i) => (i - 1 + slides.length) % slides.length);
  }, [slides.length]);

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
          style={slide.image ? { backgroundImage: `url(${slide.image})` } : undefined}
        >
          {slide.video && (
            <video className="hero-slide__video" autoPlay muted loop playsInline>
              <source src={`${slide.video}.webm`} type="video/webm" />
              <source src={`${slide.video}-opt.mp4`} type="video/mp4" />
              <source src={`${slide.video}.mp4`} type="video/mp4" />
            </video>
          )}
          <div className="hero-slide__overlay" />
          <div className="hero-content">
            {slide.artist && <p className="hero-artist">{slide.artist}</p>}
            {slide.logo ? (
              <Image
                src={slide.logo}
                alt={slide.title}
                height={200}
                width={600}
                className="hero-title-logo"
              />
            ) : (
              <p className="hero-title">{slide.title}</p>
            )}
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
        <FiChevronLeft size={80} />
      </button>
      <button className="hero-arrow hero-arrow--next" onClick={next} aria-label="Next slide">
        <FiChevronRight size={80} />
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
