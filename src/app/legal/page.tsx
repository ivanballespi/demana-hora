import { Logo } from "@/components/Logo";

export const metadata = { title: "Avís legal, privacitat i condicions" };

// ⚠️ OMPLE AQUESTES DADES abans de llançar (obligatori per la LSSI i el RGPD).
const OWNER = process.env.LEGAL_NAME || "[NOM I COGNOMS]";
const NIF = process.env.LEGAL_NIF || "[NIF]";
const ADDRESS = process.env.LEGAL_ADDRESS || "[ADREÇA FISCAL]";
const EMAIL = "hola@senyal.cat";

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <Logo />
      <article className="mt-8 space-y-4 text-sm leading-relaxed text-stone-700 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-ink [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-ink">
        <h1>Avís legal, privacitat i condicions</h1>

        <h2>1. Titular</h2>
        <p>
          Senyal és un servei de {OWNER}, amb NIF {NIF} i domicili a {ADDRESS}. Contacte: {EMAIL}.
        </p>

        <h2>2. Què és Senyal</h2>
        <p>
          Senyal és un programari que permet a professionals («el Negoci») oferir reserves online i cobrar una paga i senyal
          als seus clients. Els pagaments de paga i senyal es processen per Stripe Payments Europe, Ltd. directament al compte
          de Stripe del Negoci: el contracte de servei és entre el client i el Negoci, i Senyal no rep ni custodia aquests diners.
        </p>

        <h2>3. Condicions per als Negocis</h2>
        <p>
          La subscripció a Senyal Pro és de 15 € al mes més IVA, amb renovació mensual i sense permanència; es pot cancel·lar en
          qualsevol moment des del panell i té efecte al final del període pagat. Els primers 14 dies són de prova gratuïta.
          El Negoci és responsable dels seus serveis, dels preus, de la seva política de cancel·lació i de complir la normativa
          aplicable amb els seus clients. Senyal es presta «tal qual»; farem tot el possible perquè funcioni sense interrupcions,
          però la nostra responsabilitat màxima es limita a l&apos;import pagat els últims 12 mesos.
        </p>

        <h2>4. Condicions per a qui reserva</h2>
        <p>
          En reservar, pots pagar una paga i senyal que es descompta del preu final del servei. Si cancel·les dins el termini
          que indica el Negoci, se&apos;t retorna automàticament. Si cancel·les fora de termini o no et presentes, el Negoci se la queda.
        </p>

        <h2>5. Privacitat (RGPD)</h2>
        <p>
          <b>Dades dels Negocis:</b> el responsable és {OWNER}. Tractem el correu, les dades del negoci i de facturació per prestar
          el servei i facturar-lo (base: execució del contracte). <b>Dades de qui reserva:</b> el responsable és el Negoci on
          reserves; Senyal actua com a encarregat del tractament i només fa servir nom, correu i telèfon per gestionar la reserva
          i enviar-ne confirmació i recordatoris. Proveïdors: Supabase (base de dades, UE), Vercel (allotjament), Stripe
          (pagaments) i Resend (correus). Conservem les dades mentre hi hagi relació i després el temps que exigeixi la llei.
          Pots exercir els drets d&apos;accés, rectificació, supressió, oposició, limitació i portabilitat escrivint a {EMAIL}, i
          reclamar davant l&apos;Agència Espanyola de Protecció de Dades (aepd.es).
        </p>

        <h2>6. Galetes</h2>
        <p>Només fem servir galetes tècniques imprescindibles per mantenir la sessió iniciada. No fem servir galetes de publicitat ni d&apos;analítica de tercers.</p>
      </article>
    </main>
  );
}
