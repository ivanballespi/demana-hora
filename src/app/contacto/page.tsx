import { Footer, Header } from "@/components/Chrome";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata = {
  title: "Contacto",
  description: `Contacta con ${SITE_NAME}: sugerencias de nuevas calculadoras, errores o cualquier consulta.`,
  alternates: { canonical: `${SITE_URL}/contacto/` },
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
        <h1 className="text-3xl font-black sm:text-4xl">Contacto</h1>
        <p className="mt-4 text-lg text-stone-600">¿Has encontrado un error, quieres proponer una calculadora nueva o tienes cualquier otra consulta? Escríbenos y te responderemos lo antes posible.</p>
        <a href={`mailto:${CONTACT_EMAIL}`} className="btn-primary mt-8 px-6 py-3 text-base">✉️ {CONTACT_EMAIL}</a>
      </main>
      <Footer />
    </div>
  );
}
