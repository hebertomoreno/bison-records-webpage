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
    description:
      "I took a trip through Vancouver Island. In one of the places I parked was a really loud family with kids and jetskis. I waited for them to move a little away and shut up before standing in the dock and taking this video. Video and the internet happened so close together in my mind that it's kinda wild to think that it hasn't been very long since humanity started thinking 'This would be a good video.' People used to have to travel around to see stuff like this. Nowadays, you can see it for free in the Bison Records Webpage.",
    type: "local",
    file: "/media/video/dock",
    preview: "/media/video/dock-preview.gif",
  },
  {
    id: "facesplaces",
    title: "Faces Places",
    author: "Heberto Moreno",
    description:
      "Bison Records hosts a cineclub over in Guadalajara, Mexico. This video was meant to serve as an ad for our showing of Faces Places by Agnes Varda.",
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
