export interface Release {
  artist: string;
  title: string;
  date: string;
  image: string;
  href: string;
}

export const upcomingReleases: Release[] = [
  {
    artist: "Nikolas Murdock feat. R.A.P Ferreira",
    title: "Earth 2",
    date: "May 5, 2026",
    image: "/media/images/bear2.jpg",
    href: "/artists/nikolas-murdock",
  },
  {
    artist: "Nikolas Murdock",
    title: "Uhhhh...",
    date: "June 1, 2026",
    image: "/media/images/bear3.jpg",
    href: "/artists/nikolas-murdock",
  },
  {
    artist: "Nikolas Murdock",
    title: "Year Of The Brown Bear",
    date: "November 2026",
    image: "/media/images/bear1.jpg",
    href: "/artists/nikolas-murdock",
  },
];

export const recentReleases: Release[] = [
  // Add recent releases here
];
