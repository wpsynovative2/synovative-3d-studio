import type { MetadataRoute } from "next";
import { site } from "@/content/site";

// Ad variants (/lp/*) are noindex, so only the canonical pages are listed.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
