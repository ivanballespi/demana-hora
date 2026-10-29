"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Task } from "@/lib/tasks";

const STEPS = [
  "Llegint la teva redacció...",
  "Comprovant l'adequació a la tasca...",
  "Buscant errors d'ortografia i gramàtica...",
  "Revisant connectors i cohesió...",
  "Valorant la riquesa del lèxic...",
  "Calculant la nota com un tribunal...",
  "Preparant la versió millorada...",
];

export function NewCorrection({ tasks, canCorrect }: { tasks: Task[]; canCorrect: boolean }) {
  const router = useRouter();
  const [level, setLevel] = useState<"C1" | "C2">("C1");
  const [variant, setVariant] = useState("catala");
  const [task, setTask] = useState("");
  const [essay, setEssay] = useState("");
  const [sending, setSending] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [noCredits, setNoCredits] = useState(!canCorrect);
  const words = essay.trim() ? essay.trim().split(/\s+/).length : 0;

  useEffect(() => {
    if (!sending) return;
    const t = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 7000);
    return () => clearInterval(t);
  }, [sending]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setStep(0);
    setError(null);
    const res = await fetch("/api/corrections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ level, variant, task, essay }),
    }).catch(() => null);
    const data = await res?.json().catch(() => ({}));
    if (res?.ok && data?.id) {
      router.push(`/app/correccio/${data.id}`);
      router.refresh();
      return;
    }
    setSending(false);
    if (res?.status === 402) setNoCredits(true);
    else setError(data?.error ?? "No s'ha pogut connectar. Torna-ho a provar.");
  }

  if (sending) {
    return (
      <div className="card mx-auto mt-10 max-w-md text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-brand-soft border-t-brand" />
        <p className="mt-6 font-semibold">{STEPS[step]}</p>
        <p className="mt-2 text-sm text-stone-500">Una correcció a fons triga entre 30 i 90 segons. No tanquis la pàgina.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <h1 className="text-2xl font-bold">Corregeix la teva redacció</h1>

      {noCredits && (
        <div className="rounded-2xl border border-brand/30 bg-brand-soft p-4 text-sm">
          Ja has fet servir les teves correccions. <Link href="/app/preus" className="font-semibold text-brand underline">Aconsegueix-ne més</Link> des de 7,90 €.
          Mentrestant, pots deixar el text escrit aquí.
        </div>
      )}

      <div className="flex flex-wrap gap-6">
        <fieldset>
          <legend className="label">Nivell</legend>
          <div className="flex gap-2">
            {(["C1", "C2"] as const).map((l) => (
              <button key={l} type="button" onClick={() => setLevel(l)}
                className={`rounded-xl border px-4 py-2 text-sm font-semibold ${level === l ? "border-brand bg-brand text-white" : "border-stone-300 bg-white"}`}>
                {l}
              </button>
            ))}
          </div>
        </fieldset>
        <div>
          <label className="label" htmlFor="variant">Varietat</label>
          <select id="variant" className="input" value={variant} onChange={(e) => setVariant(e.target.value)}>
            <option value="catala">Català (IEC)</option>
            <option value="valencia">Valencià (AVL)</option>
            <option value="balear">Balear</option>
          </select>
        </div>
      </div>

      <div>
        <label className="label" htmlFor="task">Enunciat de la tasca</label>
        <div className="mb-2 flex flex-wrap gap-2">
          {tasks.filter((t) => t.level === level).map((t) => (
            <button key={t.id} type="button" onClick={() => setTask(t.text)}
              className="rounded-full border border-stone-300 bg-white px-3 py-1 text-xs hover:border-brand hover:text-brand">
              {t.title}
            </button>
          ))}
        </div>
        <textarea id="task" className="input min-h-28" value={task} onChange={(e) => setTask(e.target.value)}
          placeholder="Enganxa aquí l'enunciat del teu examen o model, o tria'n un de pràctica." required />
      </div>

      <div>
        <div className="flex items-end justify-between">
          <label className="label" htmlFor="essay">La teva redacció</label>
          <span className={`mb-1 text-xs ${words >= 80 ? "text-stone-500" : "text-amber-600"}`}>{words} paraules</span>
        </div>
        <textarea id="essay" className="input min-h-80 font-serif text-base leading-relaxed" value={essay}
          onChange={(e) => setEssay(e.target.value)} spellCheck={false}
          placeholder="Escriu o enganxa la redacció tal com la faries a l'examen. Sense corrector: així la nota és realista." required />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      <button className="btn-primary w-full py-3 text-base sm:w-auto" disabled={noCredits || words < 80}>
        Corregir la redacció
      </button>
    </form>
  );
}
