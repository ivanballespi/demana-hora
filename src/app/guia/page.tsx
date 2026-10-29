import Link from "next/link";
import { CtaBox, SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { GUIDES } from "@/content/guides";

export const metadata = {
  title: "Guies per aprovar el C1 i el C2 de català",
  description: "Recursos gratuïts per preparar la redacció dels exàmens de català: castellanismes, connectors, estructura, accents i models corregits.",
  alternates: { canonical: "/guia" },
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Guies per aprovar la redacció del C1 i el C2</h1>
        <p className="mt-3 text-stone-600">Tot el que necessites per escriure una bona redacció el dia de l&apos;examen. Gratis.</p>
        <div className="mt-8 space-y-3">
          <Link href="/detector-castellanismes" className="card block hover:border-brand">
            <div className="text-xs font-semibold uppercase text-brand">Eina gratuïta</div>
            <div className="mt-1 font-bold">Detector de castellanismes</div>
            <p className="mt-1 text-sm text-stone-600">Enganxa el teu text i et marquem els castellanismes més habituals.</p>
          </Link>
          {GUIDES.map((g) => (
            <Link key={g.slug} href={`/guia/${g.slug}`} className="card block hover:border-brand">
              <div className="font-bold">{g.title}</div>
              <p className="mt-1 text-sm text-stone-600">{g.description}</p>
            </Link>
          ))}
        </div>
        <CtaBox />
      </main>
      <SiteFooter />
    </div>
  );
}
