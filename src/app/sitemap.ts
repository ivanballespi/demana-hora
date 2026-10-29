import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { TOOLS } from "@/tools/registry";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    ...TOOLS.map((t) => ({ url: `${SITE_URL}/${t.slug}/`, changeFrequency: "monthly" as const, priority: 0.9 })),
    { url: `${SITE_URL}/privacidad/`, priority: 0.1 },
    { url: `${SITE_URL}/aviso-legal/`, priority: 0.1 },
  ];
}
