import type { MetadataRoute } from "next";
import { OPPORTUNITIES } from "@/lib/data/opportunities";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gcis.vercel.app";

/**
 * Only the curated entries are listed. Live listings rotate out of their feeds
 * within days, and advertising URLs that will 404 next week is worse than
 * omitting them.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/index-of-opportunities",
    "/matches",
    "/guide",
    "/start",
    "/saved",
  ].map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: "daily" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const entries = OPPORTUNITIES.map((o) => ({
    url: `${BASE}/opportunity/${encodeURIComponent(o.id)}`,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...entries];
}
