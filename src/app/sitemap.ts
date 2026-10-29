import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { EVENTOS } from "@/tools/logic";
import { CATEGORY_INFO, POPULAR, TOOLS } from "@/tools/registry";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    ...TOOLS.map((t) => ({ url: `${SITE_URL}/${t.slug}/`, lastModified, changeFrequency: "monthly" as const, priority: POPULAR.includes(t.slug) ? 0.9 : 0.8 })),
    ...Object.keys(EVENTOS).map((e) => ({ url: `${SITE_URL}/cuanto-falta-para/${e}/`, lastModified, changeFrequency: "daily" as const, priority: 0.7 })),
    ...Object.values(CATEGORY_INFO).map((c) => ({ url: `${SITE_URL}/categoria/${c.slug}/`, lastModified, changeFrequency: "weekly" as const, priority: 0.6 })),
    { url: `${SITE_URL}/sobre-nosotros/`, priority: 0.3 },
    { url: `${SITE_URL}/contacto/`, priority: 0.3 },
    { url: `${SITE_URL}/privacidad/`, priority: 0.1 },
    { url: `${SITE_URL}/aviso-legal/`, priority: 0.1 },
  ];
}
