import { Footer, Header } from "@/components/Chrome";
import { CONTACT_EMAIL, LEGAL_ADDRESS, LEGAL_NAME, LEGAL_NIF, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata = { title: "Aviso legal", alternates: { canonical: `${SITE_URL}/aviso-legal/` } };


export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 space-y-4 px-4 py-10 leading-relaxed text-stone-700 [&_h2]:pt-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink">
        <h1 className="text-3xl font-extrabold text-ink">Aviso legal</h1>
        <p>
          En cumplimiento de la Ley 34/2002, de servicios de la sociedad de la información (LSSI), se informa de que {SITE_NAME} ({SITE_URL.replace(/^https?:\/\//, "")})
          es un sitio web de {LEGAL_NAME}, con NIF {LEGAL_NIF} y domicilio en {LEGAL_ADDRESS}. Contacto: {CONTACT_EMAIL}.
        </p>
        <h2>Uso de las herramientas</h2>
        <p>
          Las calculadoras se ofrecen gratis y con fines informativos. Hacemos todo lo posible para que los resultados sean
          correctos, pero no garantizamos su exactitud ni que se ajusten a tu caso concreto. Para decisiones económicas, fiscales o
          legales (hipotecas, impuestos, plazos...), consulta con un profesional.
        </p>
        <h2>Propiedad intelectual</h2>
        <p>Los textos y el diseño de {SITE_NAME} son de su titular. No se permite copiarlos sin autorización.</p>
      </main>
      <Footer />
    </div>
  );
}
