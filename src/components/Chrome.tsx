import Link from "next/link";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/site";
import { CATEGORIES, CATEGORY_INFO, ICONS, TOOLS, type Category } from "@/tools/registry";

const CATS = Object.keys(CATEGORIES) as Category[];

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-brand-dark text-lg text-white shadow-md">=</span>
      <span>Calcular<span className="text-brand">Online</span></span>
    </Link>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Logo />
        <nav className="hidden items-center gap-1 text-sm md:flex">
          {CATS.map((c) => (
            <Link key={c} href={`/categoria/${CATEGORY_INFO[c].slug}/`} className="rounded-lg px-2.5 py-1.5 font-medium text-stone-600 hover:bg-stone-100 hover:text-ink">
              {CATEGORIES[c]}
            </Link>
          ))}
        </nav>
        <Link href="/#herramientas" className="btn-primary py-2 md:hidden">Herramientas</Link>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-20 border-t border-stone-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Logo />
          <p className="mt-3 text-stone-600">
            {TOOLS.length} calculadoras y herramientas gratis en español. Sin registro, sin instalar nada y sin que tus datos salgan de tu navegador.
          </p>
        </div>
        {CATS.slice(0, 3).map((c) => (
          <div key={c}>
            <Link href={`/categoria/${CATEGORY_INFO[c].slug}/`} className="font-bold hover:underline">{CATEGORY_INFO[c].icon} {CATEGORIES[c]}</Link>
            <ul className="mt-3 space-y-2">
              {TOOLS.filter((t) => t.category === c).map((t) => (
                <li key={t.slug}><Link href={`/${t.slug}/`} className="text-stone-600 hover:text-brand">{t.name}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-3 border-t border-stone-100 px-4 py-6 text-xs text-stone-500">
        <span>© {new Date().getFullYear()} {SITE_NAME}</span>
        <div className="flex flex-wrap gap-4">
          {CATS.slice(3).map((c) => (
            <Link key={c} href={`/categoria/${CATEGORY_INFO[c].slug}/`} className="hover:underline">{CATEGORIES[c]}</Link>
          ))}
          <Link href="/sobre-nosotros/" className="hover:underline">Sobre nosotros</Link>
          <Link href="/contacto/" className="hover:underline">Contacto</Link>
          <Link href="/privacidad/" className="hover:underline">Privacidad y cookies</Link>
          <Link href="/aviso-legal/" className="hover:underline">Aviso legal</Link>
        </div>
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: SITE_NAME,
          url: `${SITE_URL}/`,
          logo: `${SITE_URL}/icon.svg`,
          email: CONTACT_EMAIL,
        }}
      />
    </footer>
  );
}

export function ToolCard({ slug, name, description, big = false }: { slug: string; name: string; description: string; big?: boolean }) {
  return (
    <Link
      href={`/${slug}/`}
      className={`group flex gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-lg ${big ? "sm:p-5" : ""}`}
    >
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-soft text-2xl transition group-hover:scale-110">{ICONS[slug]}</span>
      <span className="min-w-0">
        <span className="block font-bold text-ink group-hover:text-brand">{name}</span>
        <span className="mt-0.5 line-clamp-2 block text-sm text-stone-600">{description}</span>
      </span>
    </Link>
  );
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
