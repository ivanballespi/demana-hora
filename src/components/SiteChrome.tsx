import Link from "next/link";
import { Logo } from "@/components/Logo";

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-5xl items-center justify-between gap-2 px-4 py-5">
      <Logo />
      <nav className="flex items-center gap-1 text-sm">
        <Link href="/guia" className="hidden rounded-lg px-3 py-2 font-medium hover:bg-stone-100 sm:block">Guies</Link>
        <Link href="/detector-castellanismes" className="hidden rounded-lg px-3 py-2 font-medium hover:bg-stone-100 sm:block">Detector</Link>
        <Link href="/entrar" className="rounded-lg px-3 py-2 font-medium hover:bg-stone-100">Entrar</Link>
        <Link href="/registre" className="btn-primary">Prova gratis</Link>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-stone-200">
      <div className="mx-auto grid w-full max-w-5xl gap-6 px-4 py-10 text-sm text-stone-600 sm:grid-cols-3">
        <div>
          <div className="font-bold text-ink">Apte</div>
          <p className="mt-2">Corrector de redaccions del C1 i C2 de català amb intel·ligència artificial.</p>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="font-bold text-ink">Recursos gratuïts</div>
          <Link href="/detector-castellanismes" className="hover:underline">Detector de castellanismes</Link>
          <Link href="/guia/castellanismes-mes-frequents" className="hover:underline">Castellanismes més freqüents</Link>
          <Link href="/guia/connectors-c1-catala" className="hover:underline">Connectors per al C1</Link>
          <Link href="/guia/model-redaccio-c1-corregida" className="hover:underline">Model de redacció corregida</Link>
          <Link href="/guia" className="hover:underline">Totes les guies</Link>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="font-bold text-ink">Apte</div>
          <Link href="/registre" className="hover:underline">Corregir la meva redacció</Link>
          <a href="mailto:hola@apte.cat" className="hover:underline">hola@apte.cat</a>
          <Link href="/legal" className="hover:underline">Avís legal i privacitat</Link>
        </div>
      </div>
    </footer>
  );
}

export function CtaBox() {
  return (
    <aside className="not-prose my-10 rounded-2xl bg-ink p-6 text-white">
      <div className="text-lg font-bold">Aprovaries la redacció del C1?</div>
      <p className="mt-1 text-sm text-stone-300">
        Enganxa-la i en un minut tens la nota estimada sobre 40, tots els errors explicats i una versió millorada.
      </p>
      <Link href="/registre" className="btn-primary mt-4">Corregir-la gratis</Link>
    </aside>
  );
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
