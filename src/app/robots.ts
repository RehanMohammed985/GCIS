import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gcis.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Personalised views render from localStorage and are empty to a crawler.
      disallow: ["/api/", "/matches", "/saved"],
    },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
