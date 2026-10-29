import type { MetadataRoute } from "next";
import { GUIDES } from "@/content/guides";
import { appUrl } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = appUrl();
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/detector-castellanismes`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/guia`, changeFrequency: "weekly", priority: 0.8 },
    ...GUIDES.map((g) => ({ url: `${base}/guia/${g.slug}`, lastModified: g.updated, changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: `${base}/registre`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${base}/legal`, changeFrequency: "yearly", priority: 0.1 },
  ];
}
