"use client";

// ── Replace slide images, section content, and email below ──

import { useState, useEffect, useCallback } from "react";

const slides = [
  "/media/images/placeholder1.jpg",
  "/media/images/placeholder2.jpg",
  "/media/images/placeholder3.jpg",
];

const videoIds = [
  "dQw4w9WgXcQ",
  "dQw4w9WgXcQ",
];

function ArtistHero() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), []);
  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [paused, next]);

  return (
    <section id="hero" className="at-hero">
      <div
        className="at-hero__carousel"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {slides.map((src, i) => (
          <div
            key={src}
            className="at-hero__slide"
            style={{ backgroundImage: `url(${src})`, opacity: i === current ? 1 : 0 }}
          />
        ))}
        <div className="at-hero__overlay" />
        <button className="at-hero__arrow at-hero__arrow--prev" onClick={prev} aria-label="Previous">‹</button>
        <button className="at-hero__arrow at-hero__arrow--next" onClick={next} aria-label="Next">›</button>
        <div className="at-hero__content">
          <h1 className="at-hero__name">Artist Name</h1>
          <p className="at-hero__release">Album Title — Out Now</p>
          <a href="#music" className="at-hero__cta">Listen Now</a>
        </div>
        <div className="at-hero__dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`at-hero__dot${i === current ? " at-hero__dot--active" : ""}`}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ArtistPage() {
  return (
    <div className="at-page">

      <ArtistHero />

      <div className="at-divider" />

      {/* ── Music ── */}
      <section id="music">
        <div className="at-section">
          <h2 className="at-section__title">Music</h2>
          {/* Replace with Spotify/Apple Music integration — see lib/spotify.ts */}
          <p className="at-empty">Music coming soon.</p>
        </div>
      </section>

      <div className="at-divider" />

      {/* ── About ── */}
      <section id="about">
        <div className="at-section">
          <h2 className="at-section__title">About</h2>
          <div className="at-about-inner">
            <img
              src="/media/images/placeholder1.jpg"
              alt="Artist Name"
              className="at-about__photo"
            />
            <div className="at-about__bio">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris.
              </p>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident, sunt in culpa qui officia deserunt mollit
                anim id est laborum.
              </p>
              <p>
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit
                aut fugit, sed quia consequuntur magni dolores eos qui ratione
                voluptatem sequi nesciunt.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="at-divider" />

      {/* ── Shows ── */}
      <section id="shows">
        <div className="at-section">
          <h2 className="at-section__title">Shows</h2>
          {/* Replace with Bandsintown integration — see lib/bandsintown.ts */}
          <p className="at-empty">No upcoming shows.</p>
        </div>
      </section>

      <div className="at-divider" />

      {/* ── Videos ── */}
      <section id="videos">
        <div className="at-section">
          <h2 className="at-section__title">Videos</h2>
          <div className="at-videos-grid">
            {videoIds.map((id, i) => (
              <iframe
                key={i}
                src={`https://www.youtube.com/embed/${id}`}
                allow="accelerometer; autoplay; encrypted-media"
                allowFullScreen
              />
            ))}
          </div>
        </div>
      </section>

      <div className="at-divider" />

      {/* ── Contact ── */}
      <section id="contact">
        <div className="at-section">
          <h2 className="at-section__title">Contact</h2>
          <div className="at-contact-inner">
            <p className="at-contact__text">
              For booking, press inquiries, or general correspondence, reach out
              directly.
            </p>
            <a href="mailto:booking@artistname.com" className="at-contact__email">
              booking@artistname.com
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
