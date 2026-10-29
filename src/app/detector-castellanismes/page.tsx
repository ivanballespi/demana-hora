import Link from "next/link";
import { Detector } from "@/app/detector-castellanismes/Detector";
import { CtaBox, JsonLd, SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { CASTELLANISMES } from "@/content/castellanismes";

export const metadata = {
  title: { absolute: "Detector de castellanismes en català gratis · Apte" },
  description:
    "Enganxa el teu text i et marquem els castellanismes més freqüents («hi han», «en quant a», «tenir que», «lo»...) amb la forma correcta. Gratis i sense registre.",
  alternates: { canonical: "/detector-castellanismes" },
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Detector de castellanismes</h1>
        <p className="mt-3 text-stone-600">
          Enganxa el teu text i et marcarem els castellanismes i calcs més habituals, amb la forma correcta. Gratis, sense
          registre i sense que el text surti del teu navegador.
        </p>
        <div className="mt-6"><Detector /></div>
        <article className="article mt-12">
          <h2>Quins castellanismes detecta?</h2>
          <p>
            Ara mateix en revisa {CASTELLANISMES.length}, que són els que més apareixen a les redaccions d&apos;examen: «hi han», «en
            quant a», «tenir que», «donar-se compte», «per lo tant», l&apos;article neutre «lo», «desde», «bueno»... Tens la llista
            sencera, amb explicacions, a la guia dels{" "}
            <Link href="/guia/castellanismes-mes-frequents">castellanismes més freqüents</Link>.
          </p>
          <h2>Per què és important a l&apos;examen de C1?</h2>
          <p>
            A la correcció de la redacció, els castellanismes resten al criteri de correcció lingüística. Si n&apos;hi ha molts, també
            et poden fer baixar de banda en riquesa i precisió. Són dels errors més fàcils d&apos;eliminar si saps on són.
          </p>
        </article>
        <CtaBox />
      </main>
      <SiteFooter />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Detector de castellanismes",
          applicationCategory: "EducationalApplication",
          inLanguage: "ca",
          offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
        }}
      />
    </div>
  );
}
