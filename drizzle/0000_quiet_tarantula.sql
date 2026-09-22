CREATE TABLE "album_details" (
	"id" serial PRIMARY KEY NOT NULL,
	"spotify_id" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"credits" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"hidden" boolean DEFAULT false NOT NULL,
	CONSTRAINT "album_details_spotify_id_unique" UNIQUE("spotify_id")
);
--> statement-breakpoint
CREATE TABLE "artists" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"image_url" text NOT NULL,
	"bio_en" text NOT NULL,
	"bio_es" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "artists_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"locale" text DEFAULT 'en' NOT NULL,
	"title" text NOT NULL,
	"date" date NOT NULL,
	"author" text NOT NULL,
	"excerpt" text,
	"image_url" text,
	"language" text,
	"content" text NOT NULL,
	"hidden" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "blog_posts_slug_locale_unique" UNIQUE("slug","locale")
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"image_url" text NOT NULL,
	"image_urls" text[] DEFAULT '{}' NOT NULL,
	"dates" text[] DEFAULT '{}' NOT NULL,
	"blog_slug" text,
	"hidden" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "releases" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"artist" text NOT NULL,
	"title" text NOT NULL,
	"date" text NOT NULL,
	"image_url" text NOT NULL,
	"href" text NOT NULL,
	"release_type" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"hidden" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tracks" (
	"id" text PRIMARY KEY NOT NULL,
	"file_url" text NOT NULL,
	"title" text NOT NULL,
	"artist" text NOT NULL,
	"description" text NOT NULL,
	"duration" text,
	"recorded_at" text,
	"hidden" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "videos" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"author" text NOT NULL,
	"description" text NOT NULL,
	"type" text NOT NULL,
	"file_webm_url" text,
	"file_mp4_url" text,
	"preview_url" text,
	"youtube_id" text,
	"hidden" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
