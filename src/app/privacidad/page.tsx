import { Footer, Header } from "@/components/Chrome";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata = { title: "Política de privacidad y cookies", alternates: { canonical: `${SITE_URL}/privacidad/` } };

const OWNER = process.env.NEXT_PUBLIC_LEGAL_NAME || "[NOMBRE DEL TITULAR]";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 space-y-4 px-4 py-10 leading-relaxed text-stone-700 [&_h2]:pt-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink">
        <h1 className="text-3xl font-extrabold text-ink">Política de privacidad y cookies</h1>
        <h2>Responsable</h2>
        <p>El responsable de {SITE_NAME} es {OWNER}. Contacto: {CONTACT_EMAIL}.</p>
        <h2>Datos que tratamos</h2>
        <p>
          Las herramientas de {SITE_NAME} funcionan en tu navegador: los números, textos, DNI, IBAN o fechas que escribes
          <b> no se envían ni se guardan</b> en ningún servidor. No hay registro de usuarios.
        </p>
        <h2>Publicidad y cookies</h2>
        <p>
          Esta web se financia con publicidad de Google AdSense (Google Ireland Limited). Google y sus socios pueden usar cookies
          u otros identificadores para mostrar anuncios, medir su rendimiento y, si das tu consentimiento, personalizarlos según tus
          visitas a esta y otras webs. Cuando entras por primera vez, te pedimos tu consentimiento mediante un mensaje gestionado por
          Google, y puedes cambiar tu elección en cualquier momento desde el enlace de privacidad que aparece en ese mensaje.
        </p>
        <p>
          Puedes consultar cómo usa Google los datos en <a className="underline" href="https://policies.google.com/technologies/partner-sites" rel="nofollow noopener" target="_blank">policies.google.com/technologies/partner-sites</a> y
          desactivar la publicidad personalizada en <a className="underline" href="https://adssettings.google.com" rel="nofollow noopener" target="_blank">adssettings.google.com</a>.
        </p>
        <h2>Tus derechos</h2>
        <p>
          Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a {CONTACT_EMAIL},
          y presentar una reclamación ante la Agencia Española de Protección de Datos (aepd.es).
        </p>
      </main>
      <Footer />
    </div>
  );
}
