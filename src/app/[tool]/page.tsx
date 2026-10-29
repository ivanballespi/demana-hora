import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer, Header, JsonLd, ToolCard } from "@/components/Chrome";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { ShareBar, ToolWidget } from "@/tools/components";
import { EVENTO_INFO, shortName } from "@/tools/eventos";
import { CATEGORIES, CATEGORY_INFO, ICONS, POPULAR, TOOLS, toolBySlug } from "@/tools/registry";

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
    openGraph: { title: t.title, description: t.description, url, type: "website" },
  };
}

export default async function Page({ params }: PageProps<"/[tool]">) {
  const t = toolBySlug((await params).tool);
  if (!t) notFound();
  const url = `${SITE_URL}/${t.slug}/`;
  const cat = CATEGORY_INFO[t.category];
  const sameCat = TOOLS.filter((x) => x.category === t.category && x.slug !== t.slug);
  const related = [...sameCat, ...TOOLS.filter((x) => x.category !== t.category)].slice(0, 6);
  const popular = POPULAR.filter((s) => s !== t.slug).slice(0, 6);

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-10 px-4 py-8 lg:grid-cols-[1fr_280px]">
        <div className="min-w-0">
          <nav className="text-xs text-stone-500">
            <Link href="/" className="hover:underline">Inicio</Link> › <Link href={`/categoria/${cat.slug}/`} className="hover:underline">{CATEGORIES[t.category]}</Link>
          </nav>
          <div className="mt-4 flex items-start gap-4">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-100 to-sky-100 text-3xl shadow-sm">{ICONS[t.slug]}</span>
            <div>
              <h1 className="text-2xl font-black leading-tight sm:text-4xl">{t.title}</h1>
            </div>
          </div>
          <p className="mt-4 text-lg text-stone-600">{t.intro}</p>

          <section className="card mt-6 border-brand/20 shadow-lg shadow-emerald-900/5 sm:p-7">
            <ToolWidget slug={t.slug} />
          </section>
          <div className="mt-4"><ShareBar title={t.title} url={url} /></div>

          {t.slug === "cuenta-atras" && (
            <div className="mt-8 flex flex-wrap gap-2">
              {Object.entries(EVENTO_INFO).map(([k, e]) => (
                <Link key={k} href={`/cuanto-falta-para/${k}/`} className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold hover:border-brand hover:text-brand">{e.icon} {e.titulo}</Link>
              ))}
            </div>
          )}

          <article className="mt-12 space-y-4 text-[1.05rem] leading-relaxed text-stone-700">
            <h2 className="text-2xl font-extrabold text-ink">{t.howTo.title}</h2>
            {t.howTo.body.map((p) => <p key={p}>{p}</p>)}
          </article>

          <section className="mt-12">
            <h2 className="text-2xl font-extrabold">Preguntas frecuentes</h2>
            <div className="mt-4 space-y-3">
              {t.faq.map(([q, a]) => (
                <details key={q} className="group rounded-2xl border border-stone-200 bg-white p-4 open:shadow-md">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                    {q}<span className="text-brand transition group-open:rotate-45">＋</span>
                  </summary>
                  <p className="mt-3 text-stone-700">{a}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="mt-12">
            <h2 className="text-xl font-extrabold">También te puede servir</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {related.map((r) => <ToolCard key={r.slug} slug={r.slug} name={r.name} description={r.description} />)}
            </div>
          </section>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-2xl border border-stone-200 bg-white p-4">
              <div className="text-sm font-bold">🔥 Más usadas</div>
              <ul className="mt-3 space-y-1">
                {popular.map((s) => (
                  <li key={s}>
                    <Link href={`/${s}/`} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-brand-soft">
                      <span>{ICONS[s]}</span>{toolBySlug(s)!.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-brand to-sky-700 p-4 text-white">
              <div className="text-sm font-bold">⏳ ¿Cuánto falta para…?</div>
              <ul className="mt-3 space-y-1 text-sm">
                {Object.entries(EVENTO_INFO).slice(0, 5).map(([k, e]) => (
                  <li key={k}><Link href={`/cuanto-falta-para/${k}/`} className="hover:underline">{e.icon} {shortName(e.titulo)}</Link></li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
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
              isAccessibleForFree: true,
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
                { "@type": "ListItem", position: 2, name: CATEGORIES[t.category], item: `${SITE_URL}/categoria/${cat.slug}/` },
                { "@type": "ListItem", position: 3, name: t.name, item: url },
              ],
            },
          ],
        }}
      />
    </div>
  );
}
