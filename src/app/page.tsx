import Link from "next/link";
import { Footer, Header, JsonLd, ToolCard } from "@/components/Chrome";
import { HeroSearch } from "@/components/ToolSearch";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { EVENTO_INFO, shortName } from "@/tools/eventos";
import { CATEGORIES, CATEGORY_INFO, ICONS, POPULAR, TOOLS, type Category } from "@/tools/registry";

export const metadata = { alternates: { canonical: `${SITE_URL}/` } };

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1">
        <section className="hero-bg border-b border-stone-200">
          <div className="mx-auto max-w-6xl px-4 pb-14 pt-14 text-center sm:pt-20">
            <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/70 px-3 py-1 text-xs font-semibold text-brand-dark">
              ✨ {TOOLS.length} herramientas · 100 % gratis · sin registro
            </p>
            <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">
              Calcula <span className="bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent">cualquier cosa</span> en segundos
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-stone-600">
              IVA, porcentajes, hipoteca, letra del DNI, días entre fechas, números a letras… Resultados al instante y con la explicación de cada cálculo.
            </p>
            <div className="mt-8">
              <HeroSearch tools={TOOLS.map(({ slug, name, description }) => ({ slug, name, description, icon: ICONS[slug] }))} />
            </div>
            <div className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-stone-600">
              <span>⚡ Resultados al instante</span>
              <span>🔒 Tus datos no salen de tu navegador</span>
              <span>📱 Funciona en el móvil</span>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4">
          <section className="mt-12">
            <h2 className="text-2xl font-extrabold">🔥 Las más usadas</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {POPULAR.map((slug) => TOOLS.find((t) => t.slug === slug)!).map((t) => (
                <ToolCard key={t.slug} slug={t.slug} name={t.name} description={t.description} big />
              ))}
            </div>
          </section>

          <section className="mt-12 rounded-3xl bg-gradient-to-br from-brand to-sky-700 p-6 text-white sm:p-8">
            <h2 className="text-2xl font-extrabold">⏳ ¿Cuánto falta para…?</h2>
            <p className="mt-1 text-white/80">Cuentas atrás en directo para las fechas más esperadas del año.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {Object.entries(EVENTO_INFO).map(([k, e]) => (
                <Link key={k} href={`/cuanto-falta-para/${k}/`} className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur transition hover:bg-white/30">
                  {e.icon} {shortName(e.titulo)}
                </Link>
              ))}
            </div>
          </section>

          <div id="herramientas" className="scroll-mt-20">
            {(Object.keys(CATEGORIES) as Category[]).map((c) => (
              <section key={c} className="mt-12">
                <div className="flex items-end justify-between gap-4">
                  <h2 className="flex items-center gap-2 text-xl font-extrabold"><span>{CATEGORY_INFO[c].icon}</span>{CATEGORIES[c]}</h2>
                  <Link href={`/categoria/${CATEGORY_INFO[c].slug}/`} className="text-sm font-semibold text-brand hover:underline">Ver todas →</Link>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {TOOLS.filter((t) => t.category === c).map((t) => <ToolCard key={t.slug} slug={t.slug} name={t.name} description={t.description} />)}
                </div>
              </section>
            ))}
          </div>
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
