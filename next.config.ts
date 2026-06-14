import type { NextConfig } from "next";

const csp = [
  "default-src 'self'",
  // Next.js requires unsafe-inline for hydration; dev also needs unsafe-eval for React debugging
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
  // Next.js injects inline styles
  "style-src 'self' 'unsafe-inline'",
  // Spotify album art, YouTube thumbnails
  "img-src 'self' data: https://i.scdn.co https://img.youtube.com",
  // Local audio and video
  "media-src 'self' blob:",
  // YouTube embeds on Nikolas Murdock page
  "frame-src https://www.youtube.com",
  // API calls from the browser (admin CMS)
  "connect-src 'self'",
  // Self-hosted fonts only
  "font-src 'self'",
  // Block plugins (Flash etc.)
  "object-src 'none'",
  // Prevent base tag hijacking
  "base-uri 'self'",
  // Forms only submit to own origin
  "form-action 'self'",
  // Prevent this site from being iframed anywhere
  "frame-ancestors 'none'",
].join("; ");

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Redundant with frame-ancestors but covers older browsers
          { key: "X-Frame-Options", value: "DENY" },
          // Prevent MIME-type sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Don't leak full URL in referer to third parties
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Restrict browser feature access
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // Force HTTPS for 2 years once visited
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Content-Security-Policy", value: csp },
        ],
      },
    ];
  },
};

export default nextConfig;
