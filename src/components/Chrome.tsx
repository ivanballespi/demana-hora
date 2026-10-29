import Link from "next/link";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";
import { CATEGORIES, TOOLS, type Category } from "@/tools/registry";

export function Header() {
  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-white">=</span>
          {SITE_NAME}
        </Link>
        <Link href="/#herramientas" className="text-sm font-medium text-stone-600 hover:text-ink">Todas las herramientas</Link>
      </div>
    </header>
  );
}

export function Footer() {
  const cats = Object.keys(CATEGORIES) as Category[];
  return (
    <footer className="mt-16 border-t border-stone-200 bg-white">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 text-sm sm:grid-cols-3">
        {cats.slice(0, 5).map((c) => (
          <div key={c}>
            <div className="font-bold">{CATEGORIES[c]}</div>
            <ul className="mt-2 space-y-1.5">
              {TOOLS.filter((t) => t.category === c).map((t) => (
                <li key={t.slug}><Link href={`/${t.slug}/`} className="text-stone-600 hover:text-ink hover:underline">{t.name}</Link></li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <div className="font-bold">{SITE_NAME}</div>
          <ul className="mt-2 space-y-1.5 text-stone-600">
            {TOOLS.filter((t) => t.category === "utilidades").map((t) => (
              <li key={t.slug}><Link href={`/${t.slug}/`} className="hover:text-ink hover:underline">{t.name}</Link></li>
            ))}
            <li><Link href="/privacidad/" className="hover:underline">Privacidad y cookies</Link></li>
            <li><Link href="/aviso-legal/" className="hover:underline">Aviso legal</Link></li>
            <li><a href={`mailto:${CONTACT_EMAIL}`} className="hover:underline">Contacto</a></li>
          </ul>
        </div>
      </div>
      <p className="pb-8 text-center text-xs text-stone-400">© {new Date().getFullYear()} {SITE_NAME}. Herramientas gratuitas: los cálculos se hacen en tu navegador.</p>
    </footer>
  );
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
