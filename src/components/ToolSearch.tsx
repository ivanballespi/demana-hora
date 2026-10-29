"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type T = { slug: string; name: string; description: string; icon: string };

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Cercador amb suggeriments: escrius «iva» i et porta directament a l'eina. */
export function HeroSearch({ tools }: { tools: T[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const terms = norm(q.trim()).split(/\s+/).filter(Boolean);
  const found = terms.length ? tools.filter((t) => terms.every((w) => norm(`${t.name} ${t.description}`).includes(w))).slice(0, 6) : [];
  return (
    <form
      className="relative mx-auto max-w-2xl text-left"
      onSubmit={(e) => {
        e.preventDefault();
        if (found[0]) router.push(`/${found[0].slug}/`);
      }}
    >
      <span className="pointer-events-none absolute left-4 top-[1.6rem] -translate-y-1/2 text-xl">🔎</span>
      <input
        className="w-full rounded-2xl border border-stone-300 bg-white py-4 pl-12 pr-4 text-base shadow-lg outline-none focus:border-brand focus:ring-4 focus:ring-brand/15"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="¿Qué quieres calcular? IVA, DNI, hipoteca, días…"
        aria-label="Buscar herramienta"
      />
      {terms.length > 0 && (
        <div className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl">
          {found.length ? (
            found.map((t) => (
              <Link key={t.slug} href={`/${t.slug}/`} className="flex items-center gap-3 px-4 py-3 hover:bg-brand-soft">
                <span className="text-xl">{t.icon}</span>
                <span className="font-semibold">{t.name}</span>
              </Link>
            ))
          ) : (
            <p className="px-4 py-3 text-sm text-stone-500">Nada con «{q}». Prueba con otra palabra.</p>
          )}
        </div>
      )}
    </form>
  );
}
