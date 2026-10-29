import Link from "next/link";
import { Logo } from "@/components/Logo";

const FAQ = [
  ["La nota és fiable?", "És una estimació feta amb els criteris oficials de correcció (adequació, coherència, cohesió, correcció i riquesa) i calibrada amb el llindar d'aprovat. No és la nota del tribunal, però et diu molt bé on ets i, sobretot, què has de millorar."],
  ["Serveix per a l'examen de la Generalitat, de la JQCV o de les Illes?", "Sí. Pots triar català (IEC), valencià (AVL) o balear, i enganxar l'enunciat del teu examen o model. També tens enunciats de pràctica preparats."],
  ["Quant costa?", "La primera correcció és gratis. Després, 7,90 € per 5 correccions o 14,90 € per 30 dies il·limitats. És un pagament únic: no hi ha cap subscripció que hagis de cancel·lar."],
  ["Què passa amb els meus textos?", "Només els fem servir per corregir-te'ls i els pots veure al teu historial. No els publiquem ni els venem."],
  ["I l'oral i la comprensió?", "Ara mateix ens centrem en l'expressió escrita, que és on més gent suspèn i on una bona correcció et fa pujar més punts."],
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
        <section className="mx-auto max-w-5xl px-4 pb-16 pt-12 text-center sm:pt-20">
          <p className="mx-auto inline-block rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
            C1 i C2 · Català, valencià i balear
          </p>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl">
            Aprovaries la redacció del <span className="text-brand">C1 de català</span>?
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-stone-600">
            Enganxa la teva redacció i, en un minut, tens la nota estimada sobre 40, tots els errors explicats un per un i una
            versió millorada del teu text. Amb els criteris oficials.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/registre" className="btn-primary px-6 py-3 text-base">Corregir la meva redacció gratis</Link>
            <span className="text-sm text-stone-500">Sense targeta · La primera és gratis</span>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 pb-20">
          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xl sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="text-center sm:w-44">
                <div className="text-5xl font-extrabold">26,5<span className="text-2xl text-stone-400">/40</span></div>
                <div className="mt-2 inline-block rounded-full bg-amber-500 px-3 py-1 text-sm font-bold uppercase text-white">al límit</div>
              </div>
              <p className="flex-1 text-stone-700">
                Les idees són bones i la tesi és clara, però els castellanismes i la falta de connectors variats et poden fer
                suspendre. Si corregeixes els 3 punts de sota, tens l&apos;apte a tocar.
              </p>
            </div>
            <div className="mt-6 rounded-xl bg-stone-50 p-4 font-serif leading-loose">
              …i per això crec que{" "}
              <mark className="rounded bg-red-100 px-0.5 text-red-900">en quant a<sup className="font-sans text-[10px] font-bold text-red-600">1</sup></mark>{" "}
              l&apos;ús del mòbil,{" "}
              <mark className="rounded bg-red-100 px-0.5 text-red-900">hi han<sup className="font-sans text-[10px] font-bold text-red-600">2</sup></mark>{" "}
              massa alumnes que no{" "}
              <mark className="rounded bg-red-100 px-0.5 text-red-900">es donen compte<sup className="font-sans text-[10px] font-bold text-red-600">3</sup></mark>{" "}
              del problema…
            </div>
            <ul className="mt-4 space-y-1 text-sm">
              <li><b className="text-red-600">1.</b> <s>en quant a</s> → <b className="text-emerald-700">pel que fa a</b> · castellanisme sintàctic</li>
              <li><b className="text-red-600">2.</b> <s>hi han</s> → <b className="text-emerald-700">hi ha</b> · el verb haver-hi és impersonal</li>
              <li><b className="text-red-600">3.</b> <s>es donen compte</s> → <b className="text-emerald-700">s&apos;adonen</b> · calc del castellà «darse cuenta»</li>
            </ul>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto grid max-w-5xl gap-8 px-4 sm:grid-cols-3">
            {[
              ["📊", "Nota com la del tribunal", "Cinc criteris oficials amb banda de l'A a l'E i una nota sobre 40, amb el llindar d'aprovat del C1."],
              ["🔍", "Cada error, explicat", "Subratllat al teu text, amb la correcció i la norma. Sobretot els castellanismes que no veus."],
              ["✍️", "Aprèn de la teva versió", "Et reescrivim el text, amb les teves idees però al nivell de l'examen. Així veus exactament què has de canviar."],
            ].map(([i, t, d]) => (
              <div key={t}>
                <div className="text-3xl">{i}</div>
                <h3 className="mt-3 text-lg font-bold">{t}</h3>
                <p className="mt-2 text-stone-600">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="preus" className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h2 className="text-3xl font-extrabold">Més barat que una sola classe particular</h2>
          <p className="mt-2 text-stone-600">Una correcció humana costa uns 25 € per redacció. Aquí, molt menys, i en un minut.</p>
          <div className="mt-10 grid gap-4 text-left sm:grid-cols-3">
            {[
              ["Primera correcció", "0 €", "Per veure on ets"],
              ["Pack 5", "7,90 €", "5 correccions que no caduquen"],
              ["Intensiu 30 dies", "14,90 €", "Il·limitat: una redacció cada dia fins a l'examen"],
            ].map(([n, p, d], i) => (
              <div key={n} className={`card ${i === 2 ? "border-2 border-brand" : ""}`}>
                <div className="text-sm font-semibold text-brand">{n}</div>
                <div className="mt-1 text-3xl font-extrabold">{p}</div>
                <div className="mt-1 text-sm text-stone-600">{d}</div>
              </div>
            ))}
          </div>
          <Link href="/registre" className="btn-primary mt-8 px-6 py-3 text-base">Començar gratis</Link>
          <p className="mt-2 text-xs text-stone-500">Pagament únic, IVA inclòs. Sense subscripcions.</p>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto max-w-3xl px-4">
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
          </div>
        </section>

        <section className="bg-brand py-16 text-center text-white">
          <h2 className="px-4 text-3xl font-extrabold">Tens examen aviat? Comença avui.</h2>
          <Link href="/registre" className="btn mt-6 bg-white px-6 py-3 text-base text-brand hover:bg-stone-100">
            Corregir la meva primera redacció
          </Link>
        </section>
      </main>

      <footer className="mx-auto flex w-full max-w-5xl flex-wrap justify-between gap-4 px-4 py-8 text-sm text-stone-500">
        <span>© {new Date().getFullYear()} Apte · Fet als Països Catalans</span>
        <div className="flex gap-4">
          <a href="mailto:hola@apte.cat" className="hover:underline">hola@apte.cat</a>
          <Link href="/legal" className="hover:underline">Avís legal i privacitat</Link>
        </div>
      </footer>
    </div>
  );
}
