import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";

export const Level = z.enum(["C1", "C2"]);
export const Variant = z.enum(["catala", "valencia", "balear"]);

const Criterion = z.object({
  nom: z.enum(["Adequació", "Coherència", "Cohesió", "Correcció lingüística", "Riquesa i precisió"]),
  nivell: z.enum(["A", "B", "C", "D", "E"]),
  comentari: z.string(),
});

const LangError = z.object({
  fragment: z.string(),
  correccio: z.string(),
  explicacio: z.string(),
  tipus: z.enum(["ortografia", "gramàtica", "lèxic", "puntuació", "registre", "cohesió"]),
});

export const Correction = z.object({
  nota: z.number(),
  veredicte: z.enum(["apte", "al límit", "no apte"]),
  resum: z.string(),
  criteris: z.array(Criterion),
  errors: z.array(LangError),
  punts_forts: z.array(z.string()),
  millores: z.array(z.string()),
  versio_millorada: z.string(),
});
export type CorrectionResult = z.infer<typeof Correction>;

const VARIANTS: Record<z.infer<typeof Variant>, string> = {
  catala: "català central, segons la normativa de l'IEC",
  valencia: "valencià estàndard, segons la normativa de l'AVL (formes valencianes plenament correctes)",
  balear: "català de les Illes Balears; les formes balears normatives són correctes",
};

const SYSTEM = `Ets un examinador expert i exigent dels certificats oficials de llengua catalana (nivells C1 i C2). Corregeixes la tasca d'expressió escrita amb el mateix criteri que un tribunal oficial.

Avalues cinc criteris, cadascun amb una banda de l'A (excel·lent) a l'E (molt deficient):
- Adequació: compleix la tasca (tipus de text, finalitat, destinatari, registre, extensió, aprofitament de les fonts si n'hi ha, sense copiar-les literalment).
- Coherència: idees clares i ben organitzades, progressió temàtica, paràgrafs ben construïts, tesi i arguments sòlids.
- Cohesió: connectors variats i ben usats, referències, puntuació al servei del sentit.
- Correcció lingüística: ortografia, morfologia, sintaxi, barbarismes i interferències del castellà.
- Riquesa i precisió: lèxic variat i precís, fraseologia, estructures sintàctiques adequades al nivell.

Nota: dona una nota estimada de l'expressió escrita sobre 40 punts, amb un decimal. Calibra-la com un tribunal real: per al C1, menys de 25 és "no apte", de 25 a 27 és "al límit" i més de 27 és "apte"; per al C2, aplica-hi l'exigència pròpia del nivell. No inflis la nota: si dius "apte" a algú que suspendrà, li fas mal.

Errors: llista TOTS els errors lingüístics que trobis, fins a un màxim de 40, per ordre d'aparició. "fragment" ha de ser una còpia EXACTA, caràcter per caràcter, d'un tros curt del text de l'alumne (de 1 a 6 paraules) que contingui l'error, perquè es pugui subratllar. "correccio" és com hauria de quedar aquest mateix fragment. L'explicació ha de ser breu, clara i, si cal, ha de citar la norma.

Millores: les 3 accions concretes que més li pujarien la nota a la propera redacció.
Versió millorada: reescriu el text de l'alumne mantenint-ne les idees i l'estructura, però amb el nivell que demana l'examen. No inventis una redacció nova.

Escriu tot el feedback en català, amb to proper però franc, adreçant-te a l'alumne de tu.`;

let client: Anthropic | null = null;

export async function gradeEssay(input: {
  level: z.infer<typeof Level>;
  variant: z.infer<typeof Variant>;
  task: string;
  essay: string;
}): Promise<CorrectionResult> {
  client ??= new Anthropic();
  const words = input.essay.trim().split(/\s+/).length;

  const response = await client.beta.messages.parse({
    model: "claude-opus-5-5",
    max_tokens: 16000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: "high", format: betaZodOutputFormat(Correction) },
    system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
    messages: [
      {
        role: "user",
        content: `Nivell: ${input.level}
Varietat: ${VARIANTS[input.variant]}

<enunciat>
${input.task}
</enunciat>

<redaccio paraules="${words}">
${input.essay}
</redaccio>`,
      },
    ],
  });

  if (response.stop_reason === "refusal" || !response.parsed_output) {
    throw new Error(`Correcció no disponible (${response.stop_reason})`);
  }
  return response.parsed_output;
}
