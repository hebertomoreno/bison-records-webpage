import type { MetadataRoute } from "next";
import { headers } from "next/headers";

const BISON_URL = "https://bisonrecords.co";
const NIKOLAS_URL = "https://nikolasmurdock.com";

const bisonRoutes = ["/", "/artists", "/sounds", "/videos", "/blog", "/events", "/press", "/contact"];
const nikolasRoutes = ["/"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = await headers();
  const host = headersList.get("host") ?? "";
  const isNikolas = host === "nikolasmurdock.com" || host === "www.nikolasmurdock.com";

  if (isNikolas) {
    return nikolasRoutes.map((route) => ({
      url: `${NIKOLAS_URL}${route}`,
      changeFrequency: "monthly" as const,
      priority: route === "/" ? 1 : 0.8,
    }));
  }

  return bisonRoutes.map((route) => ({
    url: `${BISON_URL}${route}`,
    changeFrequency: "weekly" as const,
    priority: route === "/" ? 1 : 0.8,
  }));
}
