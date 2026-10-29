import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBox, JsonLd, SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { GUIDES, guideBySlug } from "@/content/guides";
import { appUrl } from "@/lib/env";

export const dynamicParams = false;
export const generateStaticParams = () => GUIDES.map((g) => ({ slug: g.slug }));

export async function generateMetadata({ params }: PageProps<"/guia/[slug]">): Promise<Metadata> {
  const g = guideBySlug((await params).slug);
  if (!g) return {};
  return {
    title: { absolute: g.title },
    description: g.description,
    alternates: { canonical: `/guia/${g.slug}` },
    openGraph: { title: g.title, description: g.description, type: "article", url: `/guia/${g.slug}` },
  };
}

export default async function Page({ params }: PageProps<"/guia/[slug]">) {
  const g = guideBySlug((await params).slug);
  if (!g) notFound();
  const url = `${appUrl()}/guia/${g.slug}`;
  const related = GUIDES.filter((x) => x.slug !== g.slug).slice(0, 4);

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16">
        <nav className="text-xs text-stone-500">
          <Link href="/" className="hover:underline">Inici</Link> › <Link href="/guia" className="hover:underline">Guies</Link>
        </nav>
        <article className="article mt-4">
          <h1 className="text-3xl font-extrabold leading-tight text-ink sm:text-4xl">{g.title}</h1>
          <p className="text-sm text-stone-500">Actualitzat el {new Date(g.updated).toLocaleDateString("ca-ES", { day: "numeric", month: "long", year: "numeric" })}</p>
          {g.body()}
        </article>
        <CtaBox />
        <section>
          <h2 className="text-lg font-bold">També et pot interessar</h2>
          <ul className="mt-3 space-y-2">
            {related.map((r) => (
              <li key={r.slug}><Link href={`/guia/${r.slug}`} className="font-medium text-brand hover:underline">{r.title}</Link></li>
            ))}
          </ul>
        </section>
      </main>
      <SiteFooter />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Article",
              headline: g.title,
              description: g.description,
              dateModified: g.updated,
              inLanguage: "ca",
              mainEntityOfPage: url,
              publisher: { "@type": "Organization", name: "Apte", url: appUrl() },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Inici", item: appUrl() },
                { "@type": "ListItem", position: 2, name: "Guies", item: `${appUrl()}/guia` },
                { "@type": "ListItem", position: 3, name: g.title, item: url },
              ],
            },
          ],
        }}
      />
    </div>
  );
}
