"use client";

import { useRef } from "react";
import Link from "next/link";

export default function SideNavLink({
  href,
  label,
  videoSrc,
}: {
  href: string;
  label: string;
  videoSrc: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playPromise = useRef<Promise<void> | null>(null);

  const handleMouseEnter = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    playPromise.current = video.play();
  };

  const handleMouseLeave = () => {
    const video = videoRef.current;
    if (!video) return;
    const stop = () => { video.pause(); video.currentTime = 0; };
    if (playPromise.current) {
      playPromise.current.then(stop).catch(() => {});
      playPromise.current = null;
    } else {
      stop();
    }
  };

  return (
    <Link
      href={href}
      className="hero-sidenav__link"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        className="hero-sidenav__video"
        muted
        playsInline
        loop
        preload="metadata"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
      <span className="hero-sidenav__label">{label}</span>
    </Link>
  );
}
