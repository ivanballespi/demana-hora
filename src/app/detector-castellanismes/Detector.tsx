"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CASTELLANISMES, patternFor } from "@/content/castellanismes";

const RULES = CASTELLANISMES.flatMap((c, i) => c.match.map((m) => ({ re: patternFor(m), i })));
const MASTER = new RegExp(RULES.map((r) => `(${r.re})`).join("|"), "giu");

export function Detector() {
  const [text, setText] = useState("");
  const hits = useMemo(() => {
    const out: { start: number; end: number; i: number }[] = [];
    if (!text.trim()) return out;
    for (const m of text.matchAll(MASTER)) {
      const group = m.slice(1).findIndex((g) => g !== undefined);
      out.push({ start: m.index!, end: m.index! + m[0].length, i: RULES[group].i });
    }
    return out;
  }, [text]);
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  const pieces: React.ReactNode[] = [];
  let pos = 0;
  hits.forEach((h, k) => {
    if (h.start > pos) pieces.push(text.slice(pos, h.start));
    pieces.push(
      <mark key={k} className="rounded bg-red-100 px-0.5 text-red-900" title={`→ ${CASTELLANISMES[h.i].ok}`}>
        {text.slice(h.start, h.end)}
      </mark>,
    );
    pos = h.end;
  });
  pieces.push(text.slice(pos));

  const unique = [...new Set(hits.map((h) => h.i))];

  return (
    <div className="space-y-4">
      <textarea
        className="input min-h-56 font-serif text-base leading-relaxed"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enganxa aquí la teva redacció o qualsevol text en català..."
        spellCheck={false}
      />
      <div className="text-xs text-stone-500">{words} paraules</div>
      {text.trim() && (
        <div className="card">
          <div className="mb-3 font-semibold">
            {hits.length === 0 ? "No hem trobat cap castellanisme de la llista 👌" : `${hits.length} ${hits.length === 1 ? "possible castellanisme" : "possibles castellanismes"}`}
          </div>
          {hits.length > 0 && (
            <>
              <div className="whitespace-pre-wrap rounded-xl bg-stone-50 p-4 font-serif leading-loose">{pieces}</div>
              <ul className="mt-4 space-y-1 text-sm">
                {unique.map((i) => (
                  <li key={i}>
                    <span className="text-red-700 line-through">{CASTELLANISMES[i].match[0]}</span> →{" "}
                    <b className="text-emerald-700">{CASTELLANISMES[i].ok}</b>
                    {CASTELLANISMES[i].note && <span className="text-stone-500"> · {CASTELLANISMES[i].note}</span>}
                  </li>
                ))}
              </ul>
            </>
          )}
          <div className="mt-5 rounded-xl bg-brand-soft p-4 text-sm">
            Aquest detector només busca una llista d&apos;errors fixos. <b>Una redacció d&apos;examen té molts més errors</b>: preposicions,
            pronoms febles, concordances, connectors, registre... <Link href="/registre" className="font-semibold text-brand underline">Fes-ne una correcció completa amb nota sobre 40</Link>. La primera és gratis.
          </div>
        </div>
      )}
    </div>
  );
}
