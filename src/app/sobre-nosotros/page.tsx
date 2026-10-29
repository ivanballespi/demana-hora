import Link from "next/link";
import { Footer, Header } from "@/components/Chrome";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { TOOLS } from "@/tools/registry";

export const metadata = {
  title: "Sobre nosotros",
  description: `Qué es ${SITE_NAME}, cómo hacemos las calculadoras y cómo comprobamos que los resultados sean correctos.`,
  alternates: { canonical: `${SITE_URL}/sobre-nosotros/` },
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 space-y-4 px-4 py-10 leading-relaxed text-stone-700 [&_h2]:pt-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink">
        <h1 className="text-3xl font-black text-ink sm:text-4xl">Sobre {SITE_NAME}</h1>
        <p className="text-lg">
          {SITE_NAME} reúne {TOOLS.length} calculadoras y herramientas que usamos todos en el día a día: calcular el IVA de una factura,
          saber la letra de un DNI, cuántos días faltan para una fecha o cuánto pagaremos de hipoteca.
        </p>
        <h2>Cómo lo hacemos</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li><b>Resultados comprobados.</b> Cada fórmula está probada con casos reales y casos límite (años bisiestos, cambios de hora, céntimos, el 29 de febrero…).</li>
          <li><b>Explicamos el cálculo.</b> Cada herramienta incluye cómo se calcula, para que entiendas el resultado y no tengas que fiarte a ciegas.</li>
          <li><b>Privacidad.</b> Los cálculos se hacen en tu navegador: lo que escribes no se envía a ningún servidor.</li>
          <li><b>Gratis.</b> La web se mantiene con publicidad, sin registros ni suscripciones.</li>
        </ul>
        <h2>¿Has encontrado un error o echas en falta una calculadora?</h2>
        <p>Escríbenos desde la página de <Link href="/contacto/" className="font-semibold text-brand underline">contacto</Link>. Leemos todos los mensajes.</p>
      </main>
      <Footer />
    </div>
  );
}
