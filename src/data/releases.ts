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
    artist: "Nikolas Murdock feat. R.A.P Ferreira",
    title: "Earth 2",
    date: "May 5, 2026",
    image: "/media/images/Earth2CoverDenisse.jpeg",
    href: "/artists/nikolas-murdock",
    release_type: "Single",
  },
  {
    artist: "Nikolas Murdock",
    title: "Uhhh... Sure... Ok?",
    date: "June 1, 2026",
    image: "/media/images/UhSureOkCover.jpg",
    href: "/artists/nikolas-murdock",
    release_type: "EP",
  },
  {
    artist: "Nikolas Murdock",
    title: "Year Of The Brown Bear",
    date: "November 2026",
    image: "/media/images/bear1.jpg",
    href: "/artists/nikolas-murdock",
    release_type: "Album",
  },
];

export const recentReleases: Release[] = [
  // Add recent releases here
];
