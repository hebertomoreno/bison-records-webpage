export interface Event {
  id: string;
  title: string;
  description: string;
  image: string;
  images: string[];
  dates: string[];
  blogSlug?: string;
  hidden?: boolean;
}

// ── Add events here ─────────────────────────────────────────────

export const events: Event[] = [
  // {
  //   id: "example-event",
  //   title: "Example Event",
  //   description: "A brief description of the event.",
  //   image: "/media/images/event-main.jpg",
  //   images: ["/media/images/event-sub1.jpg", "/media/images/event-sub2.jpg"],
  //   dates: ["June 14, 2026"],
  //   blogSlug: "my-blog-post-slug", // optional — leave out if no related post
  // },
];
