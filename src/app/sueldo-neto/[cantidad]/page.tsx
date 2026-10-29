import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer, Header, JsonLd } from "@/components/Chrome";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { ShareBar, SueldoNetoWidget } from "@/tools/components";
import { datosSueldo, sueldoFromSlug, sueldoSlug, SUELDOS } from "@/tools/sueldos";

export const dynamicParams = false;
export const generateStaticParams = () => SUELDOS.map((n) => ({ cantidad: sueldoSlug(n) }));

const eur = (n: number) => n.toLocaleString("es-ES", { style: "currency", currency: "EUR" });
const miles = (n: number) => n.toLocaleString("es-ES");

export async function generateMetadata({ params }: PageProps<"/sueldo-neto/[cantidad]">): Promise<Metadata> {
  const bruto = sueldoFromSlug((await params).cantidad);
  if (!bruto) return {};
  const { principal } = datosSueldo(bruto);
  const title = `${miles(bruto)} € brutos al año: ¿cuánto es neto? (2026)`;
  const description = `${miles(bruto)} euros brutos son unos ${eur(principal.netoMensual)} netos al mes en 14 pagas (${eur(principal.netoAnual)} al año). Cálculo 2026 con Seguridad Social e IRPF, por situación familiar.`;
  const url = `${SITE_URL}/sueldo-neto/${sueldoSlug(bruto)}/`;
  return { title: { absolute: `${title} | ${SITE_NAME}` }, description, alternates: { canonical: url }, openGraph: { title, description, url } };
}

export default async function Page({ params }: PageProps<"/sueldo-neto/[cantidad]">) {
  const bruto = sueldoFromSlug((await params).cantidad);
  if (!bruto) notFound();
  const { principal: p, variantes, notas, anterior, siguiente } = datosSueldo(bruto);
  const url = `${SITE_URL}/sueldo-neto/${sueldoSlug(bruto)}/`;
  const neto12 = p.netoAnual / 12;
  const faq: [string, string][] = [
    [`¿Cuánto es ${miles(bruto)} € brutos al mes en neto?`, `Unos ${eur(p.netoMensual)} al mes en 14 pagas, o ${eur(neto12)} al mes si cobras en 12 pagas. Al año son ${eur(p.netoAnual)} netos (soltero/a, sin hijos y contrato indefinido).`],
    [`¿Cuánto IRPF me retienen con ${miles(bruto)} € brutos?`, `Una retención estimada del ${p.tipo.toLocaleString("es-ES")} %, unos ${eur(p.irpf)} al año. Con hijos o con el cónyuge sin ingresos, la retención baja.`],
    [`¿Cuánto pago a la Seguridad Social con ${miles(bruto)} €?`, `${eur(p.ss)} al año con contrato indefinido (el ${((p.ss / bruto) * 100).toLocaleString("es-ES", { maximumFractionDigits: 2 })} % del bruto).`],
  ];
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <nav className="text-xs text-stone-500">
          <Link href="/" className="hover:underline">Inicio</Link> › <Link href="/calculadora-sueldo-neto/" className="hover:underline">Sueldo neto</Link> › {miles(bruto)} €
        </nav>
        <h1 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">{miles(bruto)} € brutos al año: ¿cuánto es neto?</h1>
        <p className="mt-4 text-lg text-stone-700">
          Con un sueldo de <b>{miles(bruto)} € brutos anuales</b>, en 2026 cobrarías unos <b>{eur(p.netoMensual)} netos al mes</b> en 14 pagas
          ({eur(neto12)} en 12 pagas), es decir, <b>{eur(p.netoAnual)} al año</b>. Es el cálculo para una persona soltera, sin hijos y con contrato indefinido.
        </p>

        <section className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            ["Neto al mes (14 pagas)", eur(p.netoMensual)],
            ["Neto al mes (12 pagas)", eur(neto12)],
            ["Neto al año", eur(p.netoAnual)],
          ].map(([l, v]) => (
            <div key={l} className="rounded-2xl bg-brand-soft p-4">
              <div className="text-sm text-stone-600">{l}</div>
              <div className="text-2xl font-black tabular-nums">{v}</div>
            </div>
          ))}
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-extrabold">De dónde sale el neto</h2>
          <div className="mt-3 overflow-x-auto rounded-2xl border border-stone-200 bg-white">
            <table className="w-full text-sm tabular-nums">
              <tbody>
                <tr className="border-b border-stone-100"><td className="p-3">Sueldo bruto anual</td><td className="p-3 text-right font-semibold">{eur(bruto)}</td></tr>
                <tr className="border-b border-stone-100"><td className="p-3">− Seguridad Social (6,50 %)</td><td className="p-3 text-right">{eur(p.ss)}</td></tr>
                <tr className="border-b border-stone-100"><td className="p-3">− Retención de IRPF ({p.tipo.toLocaleString("es-ES")} %)</td><td className="p-3 text-right">{eur(p.irpf)}</td></tr>
                <tr className="bg-brand-soft"><td className="p-3 font-bold">= Neto anual</td><td className="p-3 text-right font-black">{eur(p.netoAnual)}</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-extrabold">Según tu situación</h2>
          <div className="mt-3 overflow-x-auto rounded-2xl border border-stone-200 bg-white">
            <table className="w-full text-sm tabular-nums">
              <thead className="bg-stone-50 text-xs text-stone-500"><tr><th className="p-3 text-left">Situación</th><th className="p-3 text-right">IRPF</th><th className="p-3 text-right">Neto/mes (14)</th><th className="p-3 text-right">Neto/año</th></tr></thead>
              <tbody>
                {variantes.map((v) => (
                  <tr key={v.nombre} className="border-t border-stone-100">
                    <td className="p-3">{v.nombre}</td>
                    <td className="p-3 text-right">{v.r.tipo.toLocaleString("es-ES")} %</td>
                    <td className="p-3 text-right font-semibold">{eur(v.r.netoMensual)}</td>
                    <td className="p-3 text-right">{eur(v.r.netoAnual)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-stone-500">Hijos computados al 50 % (se reparten con el otro progenitor). Estimación con la normativa de 2026 para territorio común.</p>
        </section>

        {notas.length > 0 && (
          <section className="mt-8 space-y-3 text-stone-700">
            <h2 className="text-xl font-extrabold text-ink">A tener en cuenta con este sueldo</h2>
            {notas.map((n) => <p key={n}>{n}</p>)}
          </section>
        )}

        <section className="card mt-8">
          <h2 className="mb-4 text-xl font-extrabold">Calcula tu caso exacto</h2>
          <SueldoNetoWidget inicial={bruto} />
        </section>
        <div className="mt-4"><ShareBar title={`${miles(bruto)} € brutos: ¿cuánto es neto?`} url={url} /></div>

        <section className="mt-10">
          <h2 className="text-xl font-extrabold">Preguntas frecuentes</h2>
          <div className="mt-3 space-y-3">
            {faq.map(([q, a]) => (
              <details key={q} className="rounded-2xl border border-stone-200 bg-white p-4" open>
                <summary className="cursor-pointer font-semibold">{q}</summary>
                <p className="mt-2 text-stone-700">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <nav className="mt-10 flex flex-wrap justify-between gap-3">
          {anterior ? <Link href={`/sueldo-neto/${sueldoSlug(anterior)}/`} className="btn-ghost">← {miles(anterior)} € brutos</Link> : <span />}
          {siguiente ? <Link href={`/sueldo-neto/${sueldoSlug(siguiente)}/`} className="btn-ghost">{miles(siguiente)} € brutos →</Link> : <span />}
        </nav>
        <section className="mt-8">
          <h2 className="text-sm font-bold text-stone-500">Otros sueldos</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {SUELDOS.filter((n) => n !== bruto).map((n) => (
              <Link key={n} href={`/sueldo-neto/${sueldoSlug(n)}/`} className="rounded-full border border-stone-300 bg-white px-3 py-1 text-sm hover:border-brand hover:text-brand">{miles(n)} €</Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "FAQPage", mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: SITE_NAME, item: `${SITE_URL}/` },
                { "@type": "ListItem", position: 2, name: "Sueldo neto", item: `${SITE_URL}/calculadora-sueldo-neto/` },
                { "@type": "ListItem", position: 3, name: `${miles(bruto)} € brutos`, item: url },
              ],
            },
          ],
        }}
      />
    </div>
  );
}
