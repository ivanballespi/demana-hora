import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer, Header, JsonLd } from "@/components/Chrome";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { EventCountdown, ShareBar } from "@/tools/components";
import { EVENTO_INFO } from "@/tools/eventos";
import { EVENTOS } from "@/tools/logic";

export const dynamicParams = false;
export const generateStaticParams = () => Object.keys(EVENTOS).map((evento) => ({ evento }));

export async function generateMetadata({ params }: PageProps<"/cuanto-falta-para/[evento]">): Promise<Metadata> {
  const slug = (await params).evento;
  const info = EVENTO_INFO[slug];
  if (!info) return {};
  const url = `${SITE_URL}/cuanto-falta-para/${slug}/`;
  const description = `Cuenta atrás en directo: días, horas, minutos y segundos que faltan para ${EVENTOS[slug].nombre}, con la fecha exacta de este año.`;
  return { title: info.titulo, description, alternates: { canonical: url }, openGraph: { title: info.titulo, description, url } };
}

export default async function Page({ params }: PageProps<"/cuanto-falta-para/[evento]">) {
  const slug = (await params).evento;
  const info = EVENTO_INFO[slug];
  if (!info) notFound();
  const url = `${SITE_URL}/cuanto-falta-para/${slug}/`;
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <nav className="text-xs text-stone-500">
          <Link href="/" className="hover:underline">Inicio</Link> › <Link href="/cuenta-atras/" className="hover:underline">Cuenta atrás</Link>
        </nav>
        <div className="mt-3 text-5xl">{info.icon}</div>
        <h1 className="mt-2 text-3xl font-extrabold leading-tight sm:text-4xl">{info.titulo}</h1>
        <section className="card mt-6 space-y-4">
          <EventCountdown slug={slug} nombre={EVENTOS[slug].nombre} />
        </section>
        <div className="mt-4"><ShareBar title={info.titulo} url={url} /></div>
        <article className="mt-8 space-y-4 leading-relaxed text-stone-700">
          {info.texto.map((p) => <p key={p}>{p}</p>)}
        </article>
        <section className="mt-10">
          <h2 className="text-lg font-bold">Otras cuentas atrás</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {Object.keys(EVENTO_INFO).filter((k) => k !== slug).map((k) => (
              <Link key={k} href={`/cuanto-falta-para/${k}/`} className="card flex items-center gap-3 py-3 font-medium hover:border-brand">
                <span className="text-2xl">{EVENTO_INFO[k].icon}</span>{EVENTO_INFO[k].titulo}
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebPage", name: info.titulo, url, inLanguage: "es", isPartOf: { "@type": "WebSite", name: SITE_NAME, url: `${SITE_URL}/` } }} />
    </div>
  );
}
