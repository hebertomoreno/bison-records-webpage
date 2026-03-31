export interface Video {
  id: string;
  title: string;
  author: string;
  description: string;
  type: "local" | "youtube";
  /** Path without extension, e.g. "/media/video/dock" — for local videos */
  file?: string;
  /** Path to animated GIF preview — for local videos */
  preview?: string;
  /** YouTube video ID — for youtube videos */
  youtubeId?: string;
}

// ── Edit videos here ─────────────────────────────────────────────

export const videos: Video[] = [
  {
    id: "dock",
    title: "The Dock",
    author: "Heberto Moreno",
    description: "TODO: description",
    type: "local",
    file: "/media/video/dock",
    preview: "/media/video/dock-preview.gif",
  },
  {
    id: "facesplaces",
    title: "Faces Places",
    author: "Heberto Moreno",
    description: "TODO: description",
    type: "local",
    file: "/media/video/facesplaces",
    preview: "/media/video/facesplaces-preview.gif",
  },
  {
    id: "dQw4w9WgXcQ",
    title: "Never Gonna Give You Up",
    author: "Rick Astley",
    description: "You know this one.",
    type: "youtube",
    youtubeId: "dQw4w9WgXcQ",
  },
];
