import { ResetConsent } from "@/components/Consent";
import { Logo } from "@/components/Logo";

export const metadata = { title: "Avís legal, privacitat i condicions" };

// Omple LEGAL_NAME, LEGAL_NIF i LEGAL_ADDRESS a les variables d'entorn (LSSI i RGPD).
const OWNER = process.env.LEGAL_NAME || "[NOM I COGNOMS]";
const NIF = process.env.LEGAL_NIF || "[NIF]";
const ADDRESS = process.env.LEGAL_ADDRESS || "[ADREÇA FISCAL]";
const EMAIL = "hola@apte.cat";

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <Logo />
      <article className="mt-8 space-y-4 text-sm leading-relaxed text-stone-700 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-ink [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-ink">
        <h1>Avís legal, privacitat i condicions</h1>
        <h2>1. Titular</h2>
        <p>Apte és un servei de {OWNER}, amb NIF {NIF} i domicili a {ADDRESS}. Contacte: {EMAIL}.</p>
        <h2>2. El servei</h2>
        <p>
          Apte corregeix redaccions de preparació d&apos;exàmens de llengua catalana fent servir intel·ligència artificial.
          La nota i els comentaris són orientatius, no oficials: no tenen cap relació amb els organismes que convoquen els
          exàmens, i no en garantim el resultat.
        </p>
        <h2>3. Preus i pagaments</h2>
        <p>
          Els preus inclouen l&apos;IVA. Els paquets són de pagament únic i els processa Stripe. El paquet de 5 correccions no
          caduca. L&apos;accés intensiu dura 30 dies des de la compra, amb un ús raonable de fins a 60 correccions. Com que és un
          contingut digital que es comença a fer servir de seguida, en comprar acceptes que s&apos;executi immediatament i
          perds el dret de desistiment (art. 103.m de la Llei general per a la defensa dels consumidors i usuaris). Si una
          correcció falla per un error nostre, no se&apos;t descompta. Per a qualsevol incidència, escriu a {EMAIL}.
        </p>
        <h2>4. Privacitat (RGPD)</h2>
        <p>
          Responsable: {OWNER}. Tractem el teu correu, els textos que envies i les dades de les compres per prestar el servei
          i facturar-lo (base: execució del contracte). Proveïdors: Supabase (base de dades, UE), Vercel (allotjament),
          Anthropic (model d&apos;IA que fa la correcció; no fa servir els textos per entrenar models) i Stripe (pagaments). No
          venem ni publiquem els teus textos. Pots demanar l&apos;accés, la rectificació, la supressió, l&apos;oposició, la limitació i
          la portabilitat a {EMAIL}, i reclamar davant l&apos;AEPD (aepd.es).
        </p>
        <h2 id="galetes">5. Galetes</h2>
        <p>
          Fem servir galetes tècniques imprescindibles per mantenir la sessió iniciada i recordar codis d&apos;invitació o de
          descompte. Només si les acceptes, fem servir galetes de Google Ads (Google Ireland Ltd.) per mesurar si els nostres
          anuncis porten registres i compres. No fem servir galetes per fer-te publicitat personalitzada. Pots canviar
          d&apos;opinió quan vulguis: <ResetConsent />.
        </p>
      </article>
    </main>
  );
}
