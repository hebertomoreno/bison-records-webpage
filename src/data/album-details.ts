export interface Credit {
  role: string;
  names: string[];
}

export interface AlbumDetail {
  spotifyId: string;
  description: string;
  credits: Credit[];
  hidden?: boolean;
}

// ── Add details here — spotifyId must match an entry in albums.ts ──

export const albumDetails: AlbumDetail[] = [
  {
    spotifyId: "6zFrZVkqqDiskxTjfsZUO9",
    description: "A short paragraph about this release.",
    credits: [
    ],
  },
  {
    spotifyId: "7s9SSVz49xpfi2kz70NX1R",
    description: "",
    credits: [
    ],
    hidden: true,
  },
];
