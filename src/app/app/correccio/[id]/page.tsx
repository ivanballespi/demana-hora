import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/account";
import type { CorrectionResult } from "@/lib/grader";
import { admin } from "@/lib/supabase/admin";

export const metadata = { title: "Correcció" };

const BAND: Record<string, string> = {
  A: "bg-emerald-100 text-emerald-800",
  B: "bg-lime-100 text-lime-800",
  C: "bg-amber-100 text-amber-800",
  D: "bg-orange-100 text-orange-800",
  E: "bg-red-100 text-red-800",
};
const VERDICT: Record<string, string> = {
  apte: "bg-emerald-600",
  "al límit": "bg-amber-500",
  "no apte": "bg-red-600",
};

export default async function Page({ params }: PageProps<"/app/correccio/[id]">) {
  const user = await requireUser();
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { data } = await admin().from("corrections").select("*").eq("id", id).eq("user_id", user.id).maybeSingle();
  if (!data) notFound();
  if (data.status !== "done") {
    return (
      <div className="card text-center">
        <p>Aquesta correcció no es va poder completar i no se t&apos;ha descomptat.</p>
        <Link href="/app/nova" className="btn-primary mt-4">Tornar-ho a provar</Link>
      </div>
    );
  }
  const r = data.result as CorrectionResult;
  const segments = highlight(data.essay, r.errors);

  return (
    <div className="space-y-8">
      <section className="card flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="text-center sm:w-48">
          <div className="text-5xl font-extrabold tabular-nums">{r.nota.toLocaleString("ca-ES", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}<span className="text-2xl text-stone-400">/40</span></div>
          <div className={`mt-2 inline-block rounded-full px-3 py-1 text-sm font-bold uppercase text-white ${VERDICT[r.veredicte]}`}>{r.veredicte}</div>
          <div className="mt-1 text-xs text-stone-500">Expressió escrita · {data.level}</div>
        </div>
        <p className="flex-1 text-stone-700">{r.resum}</p>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold">Criteris</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {r.criteris.map((c) => (
            <div key={c.nom} className="card">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{c.nom}</h3>
                <span className={`rounded-lg px-2.5 py-0.5 text-sm font-bold ${BAND[c.nivell]}`}>{c.nivell}</span>
              </div>
              <p className="mt-2 text-sm text-stone-600">{c.comentari}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold">La teva redacció <span className="text-sm font-normal text-stone-500">· {r.errors.length} errors marcats</span></h2>
        <div className="card whitespace-pre-wrap font-serif text-base leading-loose">
          {segments.map((s, i) =>
            s.n === undefined ? (
              <span key={i}>{s.text}</span>
            ) : (
              <mark key={i} className="rounded bg-red-100 px-0.5 text-red-900 decoration-red-400 underline-offset-4" title={r.errors[s.n].correccio}>
                {s.text}<sup className="ml-0.5 font-sans text-[10px] font-bold text-red-600">{s.n + 1}</sup>
              </mark>
            ),
          )}
        </div>
      </section>

      {r.errors.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-bold">Errors</h2>
          <ol className="space-y-2">
            {r.errors.map((e, i) => (
              <li key={i} className="card py-3 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-red-600">{i + 1}.</span>
                  <span className="text-red-700 line-through">{e.fragment}</span>
                  <span>→</span>
                  <span className="font-semibold text-emerald-700">{e.correccio}</span>
                  <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600">{e.tipus}</span>
                </div>
                <p className="mt-1 text-stone-600">{e.explicacio}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="card">
          <h2 className="font-bold">💪 El que fas bé</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-stone-700">{r.punts_forts.map((p) => <li key={p}>{p}</li>)}</ul>
        </div>
        <div className="card border-brand/40">
          <h2 className="font-bold">🎯 Per pujar nota</h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-stone-700">{r.millores.map((p) => <li key={p}>{p}</li>)}</ol>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold">Versió millorada</h2>
        <div className="card whitespace-pre-wrap font-serif text-base leading-relaxed">{r.versio_millorada}</div>
      </section>

      <p className="text-center text-xs text-stone-500">
        Nota orientativa generada amb IA a partir dels criteris oficials. No substitueix la correcció del tribunal.
      </p>
      <div className="text-center"><Link href="/app/nova" className="btn-primary">Corregir una altra redacció</Link></div>
    </div>
  );
}

/** Divideix el text en trossos i marca els fragments amb error, per ordre d'aparició. */
function highlight(text: string, errors: CorrectionResult["errors"]) {
  const marks: { start: number; end: number; n: number }[] = [];
  let cursor = 0;
  errors.forEach((e, n) => {
    if (!e.fragment) return;
    let at = text.indexOf(e.fragment, cursor);
    if (at === -1) at = text.indexOf(e.fragment);
    if (at === -1) return;
    const end = at + e.fragment.length;
    if (marks.some((m) => at < m.end && end > m.start)) return;
    marks.push({ start: at, end, n });
    cursor = end;
  });
  marks.sort((a, b) => a.start - b.start);
  const out: { text: string; n?: number }[] = [];
  let pos = 0;
  for (const m of marks) {
    if (m.start > pos) out.push({ text: text.slice(pos, m.start) });
    out.push({ text: text.slice(m.start, m.end), n: m.n });
    pos = m.end;
  }
  if (pos < text.length) out.push({ text: text.slice(pos) });
  return out;
}
