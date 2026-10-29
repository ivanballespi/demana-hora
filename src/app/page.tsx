import { Footer, Header, JsonLd } from "@/components/Chrome";
import { ToolSearch } from "@/components/ToolSearch";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { CATEGORIES, TOOLS } from "@/tools/registry";

export const metadata = { alternates: { canonical: `${SITE_URL}/` } };

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
        <section className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Calculadoras y herramientas <span className="text-brand">gratis</span></h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-stone-600">
            Números a letras, letra del DNI, IVA, hipoteca, días entre fechas... Resultados al instante, sin registro y sin que tus datos salgan de tu navegador.
          </p>
        </section>
        <div id="herramientas" className="mt-10">
          <ToolSearch tools={TOOLS.map(({ slug, name, description, category }) => ({ slug, name, description, category }))} categories={CATEGORIES} />
        </div>
      </main>
      <Footer />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebSite", name: SITE_NAME, url: `${SITE_URL}/`, inLanguage: "es" }} />
    </div>
  );
}
