import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  date,
  jsonb,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

export const artists = pgTable("artists", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  imageUrl: text("image_url").notNull(),
  bioEn: text("bio_en").notNull(),
  bioEs: text("bio_es").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const releases = pgTable("releases", {
  id: serial("id").primaryKey(),
  type: text("type", { enum: ["upcoming", "recent"] }).notNull(),
  artist: text("artist").notNull(),
  title: text("title").notNull(),
  // Display string, not a real date — source data mixes "May 29, 2026" and "September 2026".
  date: text("date").notNull(),
  imageUrl: text("image_url").notNull(),
  href: text("href").notNull(),
  releaseType: text("release_type", { enum: ["Album", "Single", "EP"] }).notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  hidden: boolean("hidden").notNull().default(false),
});

export const tracks = pgTable("tracks", {
  id: text("id").primaryKey(),
  fileUrl: text("file_url").notNull(),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  description: text("description").notNull(),
  duration: text("duration"),
  recordedAt: text("recorded_at"),
  hidden: boolean("hidden").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const videos = pgTable("videos", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  description: text("description").notNull(),
  type: text("type", { enum: ["local", "youtube"] }).notNull(),
  fileWebmUrl: text("file_webm_url"),
  fileMp4Url: text("file_mp4_url"),
  previewUrl: text("preview_url"),
  youtubeId: text("youtube_id"),
  hidden: boolean("hidden").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const events = pgTable("events", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  imageUrls: text("image_urls").array().notNull().default([]),
  dates: text("dates").array().notNull().default([]),
  blogSlug: text("blog_slug"),
  hidden: boolean("hidden").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const albumDetails = pgTable("album_details", {
  id: serial("id").primaryKey(),
  spotifyId: text("spotify_id").notNull().unique(),
  description: text("description").notNull().default(""),
  credits: jsonb("credits").notNull().default([]),
  hidden: boolean("hidden").notNull().default(false),
});

export const blogPosts = pgTable(
  "blog_posts",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    locale: text("locale").notNull().default("en"),
    title: text("title").notNull(),
    date: date("date").notNull(),
    author: text("author").notNull(),
    excerpt: text("excerpt"),
    imageUrl: text("image_url"),
    language: text("language"),
    content: text("content").notNull(),
    hidden: boolean("hidden").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [unique("blog_posts_slug_locale_unique").on(table.slug, table.locale)],
);
