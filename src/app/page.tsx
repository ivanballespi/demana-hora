import Link from "next/link";
import { Footer, Header, JsonLd } from "@/components/Chrome";
import { HeroSearch } from "@/components/ToolSearch";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { EVENTO_INFO, shortName } from "@/tools/eventos";
import { CATEGORIES, CATEGORY_INFO, ICONS, POPULAR, TOOLS, type Category, toolsIn } from "@/tools/registry";

export const metadata = { alternates: { canonical: `${SITE_URL}/` } };

const CATS = Object.keys(CATEGORIES) as Category[];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1">
        <section className="hero-bg border-b border-stone-200">
          <div className="mx-auto max-w-6xl px-4 pb-10 pt-12 text-center sm:pt-16">
            <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/70 px-3 py-1 text-xs font-semibold text-brand-dark">
              ✨ {TOOLS.length} herramientas · 100 % gratis · sin registro
            </p>
            <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">
              Calcula <span className="bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent">cualquier cosa</span> en segundos
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-600">
              Sueldo neto, IVA, hipoteca, letra del DNI, días entre fechas… Resultados al instante y con la explicación de cada cálculo.
            </p>
            <div className="mt-7">
              <HeroSearch tools={TOOLS.map(({ slug, name, description }) => ({ slug, name, description, icon: ICONS[slug] }))} />
            </div>
            <nav aria-label="Categorías" className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-2">
              {CATS.map((c) => (
                <a key={c} href={`#${CATEGORY_INFO[c].slug}`} className="rounded-full border border-stone-300 bg-white/80 px-3.5 py-1.5 text-sm font-semibold shadow-sm transition hover:border-brand hover:text-brand">
                  {CATEGORY_INFO[c].icon} {CATEGORIES[c]}
                </a>
              ))}
            </nav>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4">
          <section className="mt-10">
            <h2 className="text-xl font-extrabold">🔥 Las más usadas</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {POPULAR.map((slug) => TOOLS.find((t) => t.slug === slug)!).map((t) => (
                <Link key={t.slug} href={`/${t.slug}/`} className="group flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-xl">{ICONS[t.slug]}</span>
                  <span className="text-sm font-bold leading-tight group-hover:text-brand">{t.name}</span>
                </Link>
              ))}
            </div>
          </section>

          <section id="herramientas" className="mt-12 scroll-mt-20">
            <h2 className="text-xl font-extrabold">Todas las herramientas</h2>
            <div className="mt-4 columns-1 gap-4 sm:columns-2 lg:columns-3">
              {CATS.map((c) => (
                <div key={c} id={CATEGORY_INFO[c].slug} className="mb-4 break-inside-avoid scroll-mt-24 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="flex items-center gap-2 font-extrabold">
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-soft">{CATEGORY_INFO[c].icon}</span>
                      {CATEGORIES[c]}
                    </h3>
                    <Link href={`/categoria/${CATEGORY_INFO[c].slug}/`} className="text-xs font-semibold text-brand hover:underline">Ver →</Link>
                  </div>
                  <ul className="mt-3 space-y-0.5">
                    {toolsIn(c).map((t) => (
                      <li key={t.slug}>
                        <Link href={`/${t.slug}/`} className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[0.95rem] hover:bg-brand-soft hover:text-brand-dark">
                          <span className="w-5 text-center">{ICONS[t.slug]}</span>{t.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8 rounded-3xl bg-gradient-to-br from-brand to-sky-700 p-6 text-white sm:p-8">
            <h2 className="text-xl font-extrabold">⏳ ¿Cuánto falta para…?</h2>
            <p className="mt-1 text-white/80">Cuentas atrás en directo para las fechas más esperadas del año.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {Object.entries(EVENTO_INFO).map(([k, e]) => (
                <Link key={k} href={`/cuanto-falta-para/${k}/`} className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur transition hover:bg-white/30">
                  {e.icon} {shortName(e.titulo)}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "WebSite", name: SITE_NAME, url: `${SITE_URL}/`, inLanguage: "es" },
            {
              "@type": "ItemList",
              name: "Herramientas",
              itemListElement: TOOLS.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, url: `${SITE_URL}/${t.slug}/` })),
            },
          ],
        }}
      />
    </div>
  );
}
