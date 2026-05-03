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

  const handleMouseEnter = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play();
  };

  const handleMouseLeave = () => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.currentTime >= 5) video.currentTime = 0;
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
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
      <span className="hero-sidenav__label">{label}</span>
    </Link>
  );
}
