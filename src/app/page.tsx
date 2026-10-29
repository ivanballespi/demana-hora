import Link from "next/link";
import { Logo } from "@/components/Logo";
import { RoiCalculator } from "@/components/RoiCalculator";

const FAQ = [
  ["No perdré clients si els faig pagar per reservar?", "Els clients bons no tenen cap problema a pagar 5 o 10 € que després es descompten. Qui s'enfada per pagar una paga i senyal és, sovint, qui t'acabaria plantant. I si algun client de tota la vida no vol, li pots seguir donant hora per WhatsApp com sempre."],
  ["On van els diners de la paga i senyal?", "Directament al teu compte de Stripe i d'allà al teu banc (normalment en 2-7 dies). Senyal no toca els teus diners ni et cobra comissió per reserva. Stripe cobra la seva tarifa estàndard (~1,5% + 0,25 € per targeta europea)."],
  ["I si el client cancel·la?", "Tu decideixes el termini (per defecte, 24 h). Si cancel·la a temps, se li retorna automàticament. Si cancel·la tard o no es presenta, la paga i senyal és teva."],
  ["Necessito web pròpia?", "No. Et donem un enllaç (senyal.cat/r/el-teu-negoci) que pots posar a la bio d'Instagram, a la fitxa de Google, al WhatsApp Business o on vulguis."],
  ["Hi ha permanència?", "Cap. Pagues mes a mes i ho pots cancel·lar amb un clic. Els primers 14 dies són gratis i no et demanem targeta."],
  ["És per a negocis amb diversos treballadors?", "Ara mateix Senyal està pensat per a professionals que porten una sola agenda: fisios, psicòlegs, esteticistes, barbers, tatuadors, terapeutes, entrenadors... Si en teniu diverses, cadascú pot tenir el seu compte."],
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-5">
        <Logo />
        <nav className="flex items-center gap-2 text-sm">
          <Link href="/entrar" className="rounded-lg px-3 py-2 font-medium hover:bg-stone-100">Entrar</Link>
          <Link href="/registre" className="btn-primary">Prova gratis</Link>
        </nav>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 pt-12 pb-16 text-center sm:pt-20">
          <p className="mx-auto inline-block rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-dark">
            Per a fisios, esteticistes, barbers, psicòlegs i tots els que viviu de l&apos;agenda
          </p>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl">
            Prou plantades.<br />
            <span className="text-brand">Qui paga paga i senyal, ve.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-stone-600">
            La teva pàgina de reserves en català: el client tria hora, paga una petita paga i senyal i rep recordatori. Tu
            deixes de perdre diners per forats a l&apos;agenda.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/registre" className="btn-primary px-6 py-3 text-base">Comença gratis 14 dies</Link>
            <span className="text-sm text-stone-500">Sense targeta · A punt en 5 minuts</span>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 pb-20">
          <RoiCalculator />
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-center text-3xl font-extrabold">Com funciona</h2>
            <div className="mt-12 grid gap-8 sm:grid-cols-3">
              {[
                ["1", "Crea la teva pàgina", "Posa els teus serveis, el preu, la paga i senyal i l'horari. Connecta Stripe per cobrar."],
                ["2", "Comparteix l'enllaç", "A la bio d'Instagram, a Google Maps, al WhatsApp. Els clients reserven sols, 24 hores al dia."],
                ["3", "Els clients venen", "Paguen la paga i senyal, reben confirmació i recordatori el dia abans. Si et planten, els diners són teus."],
              ].map(([n, t, d]) => (
                <div key={n}>
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-lg font-bold text-white">{n}</div>
                  <h3 className="mt-4 text-lg font-bold">{t}</h3>
                  <p className="mt-2 text-stone-600">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-20">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["💸", "Paga i senyal automàtica", "Cobrada amb targeta, Apple Pay o Google Pay. Els diners van directes al teu banc."],
              ["↩️", "Cancel·lacions sense mals de cap", "Si cancel·len a temps, es retorna sol. Si no, és teva. Tu no has de fer res."],
              ["⏰", "Recordatori el dia abans", "Un correu que recorda l'hora i deixa cancel·lar perquè algú altre la pugui aprofitar."],
              ["📊", "Saps quant estalvies", "El panell et diu quants diners has assegurat i quantes plantades t'has estalviat."],
            ].map(([i, t, d]) => (
              <div key={t} className="card">
                <div className="text-2xl">{i}</div>
                <h3 className="mt-2 font-bold">{t}</h3>
                <p className="mt-1 text-sm text-stone-600">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="preu" className="bg-white py-20">
          <div className="mx-auto max-w-md px-4 text-center">
            <h2 className="text-3xl font-extrabold">Un sol preu. Sense sorpreses.</h2>
            <div className="card mt-8 border-2 border-brand p-8">
              <div className="text-sm font-semibold uppercase tracking-wide text-brand">Senyal Pro</div>
              <div className="mt-2 flex items-baseline justify-center gap-1">
                <span className="text-5xl font-extrabold">15 €</span>
                <span className="text-stone-500">/mes + IVA</span>
              </div>
              <ul className="mt-6 space-y-2 text-left text-sm">
                {["Reserves il·limitades", "Paga i senyal sense comissió de Senyal", "Recordatoris i confirmacions per correu", "Cancel·lacions i devolucions automàtiques", "Sense permanència", "Suport en català per correu"].map((f) => (
                  <li key={f} className="flex gap-2"><span className="text-brand">✔</span>{f}</li>
                ))}
              </ul>
              <Link href="/registre" className="btn-primary mt-8 w-full py-3 text-base">Prova 14 dies gratis</Link>
              <p className="mt-3 text-xs text-stone-500">Amb evitar una sola plantada al mes, ja l&apos;has pagat.</p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-20">
          <h2 className="text-center text-3xl font-extrabold">Preguntes freqüents</h2>
          <div className="mt-10 space-y-3">
            {FAQ.map(([q, a]) => (
              <details key={q} className="card group">
                <summary className="cursor-pointer list-none font-semibold">
                  <span className="mr-2 text-brand group-open:hidden">+</span>
                  <span className="mr-2 hidden text-brand group-open:inline">−</span>
                  {q}
                </summary>
                <p className="mt-3 text-sm text-stone-600">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="bg-brand py-16 text-center text-white">
          <h2 className="text-3xl font-extrabold">La pròxima plantada pot ser l&apos;última.</h2>
          <Link href="/registre" className="btn mt-6 bg-white px-6 py-3 text-base text-brand-dark hover:bg-stone-100">
            Crear la meva pàgina gratis
          </Link>
        </section>
      </main>

      <footer className="mx-auto flex w-full max-w-5xl flex-wrap justify-between gap-4 px-4 py-8 text-sm text-stone-500">
        <span>© {new Date().getFullYear()} Senyal · Fet a Catalunya</span>
        <div className="flex gap-4">
          <a href="mailto:hola@senyal.cat" className="hover:underline">hola@senyal.cat</a>
          <Link href="/legal" className="hover:underline">Avís legal i privacitat</Link>
        </div>
      </footer>
    </div>
  );
}
