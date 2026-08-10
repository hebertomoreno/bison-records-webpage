export interface Release {
  artist: string;
  title: string;
  date: string;
  image: string;
  href: string;
  release_type: "Album" | "Single" | "EP";
}

// ── Edit releases here ───────────────────────────────────────────────

export const upcomingReleases: Release[] = [
  {
    artist: "Nikolas Murdock",
    title: "Uhhh... Sure... Ok?",
    date: "September 2026",
    image: "/media/images/UhSureOkCover.jpg",
    href: "/blog/uhhh-sure-ok",
    release_type: "EP",
  },
  {
    artist: "Nikolas Murdock",
    title: "Year Of The Brown Bear",
    date: "November 2026",
    image: "/media/images/bear1.jpg",
    href: "/blog/year-of-the-brown-bear-album",
    release_type: "Album",
  },
];

export const recentReleases: Release[] = [
  {
    artist: "Nikolas Murdock feat. R.A.P Ferreira",
    title: "Earth 2",
    date: "May 29, 2026",
    image: "/media/images/Earth2CoverDenisse.jpeg",
    href: "https://open.spotify.com/album/6bR1vJNRu2sLnZaGM1Cg3d",
    release_type: "Single",
  },
  {
    artist: "Nube Render feat. OZOZOZ",
    title: "Río Lerma",
    date: "August 1, 2024",
    image: "https://i.scdn.co/image/ab67616d0000b27377ad47ab7f337287528a7295",
    href: "https://open.spotify.com/album/6JqcOP54cLzUsq6sJ6FIZs",
    release_type: "Single",
  },
];
