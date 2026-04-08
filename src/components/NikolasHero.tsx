"use client";

import { useState, useEffect, useCallback } from "react";

interface Slide {
  image: string;
  label?: string;
  title?: string;
  spotifyUrl?: string;
  appleMusicUrl?: string | null;
}

const slides: Slide[] = [
  { image: "/media/images/bear1.jpg" },
  {
    image: "https://i.scdn.co/image/ab67616d0000b27353f72953082aeecbce08b090",
    label: "Single · 2021",
    title: "Reincarnation 2021",
    spotifyUrl: "https://open.spotify.com/album/1P36fTOvIv5tKtpQFfCe7V",
    appleMusicUrl: "https://music.apple.com/us/album/reincarnation-2021-single/1570586587?uo=4",
  },
  {
    image: "https://i.scdn.co/image/ab67616d0000b273ff3dd5ab7cebd1dd8083b896",
    label: "Single · 2021",
    title: "Monóxido",
    spotifyUrl: "https://open.spotify.com/album/0HtbGw7OkIhhWrAX8Rcd95",
    appleMusicUrl: "https://music.apple.com/us/album/mon%C3%B3xido-single/1561644636?uo=4",
  },
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
        {slides.map((slide, i) => (
          <div
            key={i}
            className="nm-hero__slide"
            style={{
              backgroundImage: `url(${slide.image})`,
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
          {slides[current].title ? (
            <>
              <p className="nm-hero__release">{slides[current].label}</p>
              <p className="nm-hero__name">{slides[current].title}</p>
              <div className="nm-hero__links">
                {slides[current].spotifyUrl && (
                  <a href={slides[current].spotifyUrl} target="_blank" rel="noopener noreferrer" className="nm-hero__cta">Spotify</a>
                )}
                {slides[current].appleMusicUrl && (
                  <a href={slides[current].appleMusicUrl!} target="_blank" rel="noopener noreferrer" className="nm-hero__cta">Apple Music</a>
                )}
              </div>
            </>
          ) : (
            <>
              <h1 className="nm-hero__name">Nikolas Murdock</h1>
              <p className="nm-hero__release">{release}</p>
              <a href="#music" className="nm-hero__cta">{cta}</a>
            </>
          )}
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
