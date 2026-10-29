"use client";

import Link from "next/link";
import { useState } from "react";
import type { Category } from "@/tools/registry";

type T = { slug: string; name: string; description: string; category: Category };

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function ToolSearch({ tools, categories }: { tools: T[]; categories: Record<Category, string> }) {
  const [q, setQ] = useState("");
  const found = tools.filter((t) => norm(`${t.name} ${t.description}`).includes(norm(q.trim())));
  return (
    <div>
      <input className="input mx-auto block max-w-xl py-3 text-base" value={q} onChange={(e) => setQ(e.target.value)} placeholder="¿Qué quieres calcular? (ej.: IVA, DNI, fechas...)" aria-label="Buscar herramienta" />
      {(Object.keys(categories) as Category[]).map((c) => {
        const list = found.filter((t) => t.category === c);
        if (!list.length) return null;
        return (
          <section key={c} className="mt-8">
            <h2 className="text-lg font-bold">{categories[c]}</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((t) => (
                <Link key={t.slug} href={`/${t.slug}/`} className="card block transition hover:border-brand hover:shadow-md">
                  <div className="font-bold">{t.name}</div>
                  <p className="mt-1 line-clamp-2 text-sm text-stone-600">{t.description}</p>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
      {!found.length && <p className="mt-8 text-center text-stone-500">No hemos encontrado nada. Prueba con otra palabra.</p>}
    </div>
  );
}
