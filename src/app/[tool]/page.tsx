import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer, Header, JsonLd } from "@/components/Chrome";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { ToolWidget } from "@/tools/components";
import { CATEGORIES, TOOLS, toolBySlug } from "@/tools/registry";

export const dynamicParams = false;
export const generateStaticParams = () => TOOLS.map((t) => ({ tool: t.slug }));

export async function generateMetadata({ params }: PageProps<"/[tool]">): Promise<Metadata> {
  const t = toolBySlug((await params).tool);
  if (!t) return {};
  const url = `${SITE_URL}/${t.slug}/`;
  return {
    title: t.title,
    description: t.description,
    alternates: { canonical: url },
    openGraph: { title: t.title, description: t.description, url },
  };
}

export default async function Page({ params }: PageProps<"/[tool]">) {
  const t = toolBySlug((await params).tool);
  if (!t) notFound();
  const url = `${SITE_URL}/${t.slug}/`;
  const related = [...TOOLS.filter((x) => x.category === t.category && x.slug !== t.slug), ...TOOLS.filter((x) => x.category !== t.category)].slice(0, 6);

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <nav className="text-xs text-stone-500">
          <Link href="/" className="hover:underline">Inicio</Link> › <span>{CATEGORIES[t.category]}</span>
        </nav>
        <h1 className="mt-2 text-3xl font-extrabold leading-tight sm:text-4xl">{t.title}</h1>
        <p className="mt-3 text-stone-600">{t.intro}</p>

        <section className="card mt-6">
          <ToolWidget slug={t.slug} />
        </section>

        <article className="mt-10 space-y-4 leading-relaxed text-stone-700">
          <h2 className="text-xl font-bold text-ink">{t.howTo.title}</h2>
          {t.howTo.body.map((p) => <p key={p}>{p}</p>)}
          <h2 className="pt-4 text-xl font-bold text-ink">Preguntas frecuentes</h2>
          {t.faq.map(([q, a]) => (
            <div key={q}>
              <h3 className="font-semibold text-ink">{q}</h3>
              <p className="mt-1">{a}</p>
            </div>
          ))}
        </article>

        <section className="mt-12">
          <h2 className="text-lg font-bold">Otras herramientas útiles</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {related.map((r) => (
              <Link key={r.slug} href={`/${r.slug}/`} className="card py-3 font-medium hover:border-brand">{r.name}</Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebApplication",
              name: t.name,
              url,
              description: t.description,
              applicationCategory: "UtilitiesApplication",
              operatingSystem: "Any",
              inLanguage: "es",
              offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
            },
            {
              "@type": "FAQPage",
              mainEntity: t.faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: SITE_NAME, item: `${SITE_URL}/` },
                { "@type": "ListItem", position: 2, name: t.name, item: url },
              ],
            },
          ],
        }}
      />
    </div>
  );
}
