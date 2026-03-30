"use client";

import { useRef, useState, useEffect } from "react";
import { FiPlay, FiPause, FiDownload, FiShare2 } from "react-icons/fi";
import "../styles/sounds.css";

export interface Track {
  id: string;
  title: string;
  artist: string;
  description: string;
  duration: string | null;
  recordedAt: string | null;
  file: string;
}

export default function SoundsClient({ tracks }: { tracks: Track[] }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [toast, setToast] = useState(false);

  // Sync audio src when active track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !activeId) return;
    const track = tracks.find((t) => t.id === activeId);
    if (!track) return;
    audio.src = track.file;
    audio.play();
    setIsPlaying(true);
  }, [activeId]);

  // Progress tracking
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => {
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
    };
    const onEnded = () => { setIsPlaying(false); setProgress(0); };
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  function togglePlay(id: string) {
    const audio = audioRef.current;
    if (!audio) return;
    if (activeId === id) {
      if (isPlaying) { audio.pause(); setIsPlaying(false); }
      else { audio.play(); setIsPlaying(true); }
    } else {
      setProgress(0);
      setActiveId(id);
    }
  }

  function seek(e: React.MouseEvent<HTMLDivElement>) {
    const audio = audioRef.current;
    if (!audio) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audio.currentTime = ratio * audio.duration;
  }

  async function share(track: Track) {
    const url = `${window.location.origin}/sounds#${track.id}`;
    if (navigator.share) {
      await navigator.share({ title: track.title, url });
    } else {
      await navigator.clipboard.writeText(url);
      setToast(true);
      setTimeout(() => setToast(false), 2000);
    }
  }

  return (
    <>
      <audio ref={audioRef} />

      <div className="sounds-list">
        {tracks.map((track) => {
          const active = track.id === activeId;
          const playing = active && isPlaying;
          return (
            <div key={track.id} id={track.id} className={`sound-row${active ? " sound-row--active" : ""}`}>
              <button className="sound-play" onClick={() => togglePlay(track.id)} aria-label={playing ? "Pause" : "Play"}>
                {playing ? <FiPause size={16} /> : <FiPlay size={16} />}
              </button>

              <div className="sound-info">
                <span className="sound-title">{track.title}</span>
                <span className="sound-artist">{track.artist}</span>
                {track.description && (
                  <span className="sound-description">{track.description}</span>
                )}
              </div>

              <div className="sound-meta">
                {track.recordedAt && (
                  <span className="sound-recorded">{track.recordedAt}</span>
                )}
                {track.duration && (
                  <span className="sound-duration">{track.duration}</span>
                )}
              </div>

              <button className="sound-action" onClick={() => share(track)} aria-label="Share">
                <FiShare2 size={17} />
              </button>

              <a className="sound-action" href={track.file} download aria-label="Download">
                <FiDownload size={17} />
              </a>

              {active && (
                <div className="sound-progress-wrap" onClick={seek} style={{ gridColumn: "2 / -1" }}>
                  <div className="sound-progress-fill" style={{ width: `${progress}%` }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className={`sound-toast${toast ? " sound-toast--visible" : ""}`}>
        Link copied
      </div>
    </>
  );
}
