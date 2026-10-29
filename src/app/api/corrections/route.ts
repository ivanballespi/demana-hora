import { NextResponse, type NextRequest } from "next/server";
import { currentUser, MONTHLY_CAP } from "@/lib/account";
import { gradeEssay, Level, Variant } from "@/lib/grader";
import { admin } from "@/lib/supabase/admin";

export const maxDuration = 300;

const fail = (error: string, status = 400) => NextResponse.json({ error }, { status });

export async function POST(req: NextRequest) {
  const user = await currentUser();
  if (!user) return fail("Has d'entrar al teu compte.", 401);

  const body = await req.json().catch(() => null);
  const level = Level.safeParse(body?.level);
  const variant = Variant.safeParse(body?.variant);
  const task = String(body?.task ?? "").trim().slice(0, 4000);
  const essay = String(body?.essay ?? "").trim().slice(0, 12000);
  if (!level.success || !variant.success) return fail("Tria el nivell i la varietat.");
  if (task.length < 20) return fail("Enganxa l'enunciat de la tasca (o tria'n un de pràctica).");
  const words = essay.split(/\s+/).filter(Boolean).length;
  if (words < 80) return fail(`La redacció és massa curta (${words} paraules). Escriu-ne almenys 80.`);
  if (words > 1500) return fail("La redacció és massa llarga (màxim 1.500 paraules).");

  const db = admin();
  const { data: paidWith, error: spendError } = await db.rpc("spend_correction", {
    p_user: user.id,
    p_monthly_cap: MONTHLY_CAP,
  });
  if (spendError) {
    console.error(spendError);
    return fail("Error intern. Torna-ho a provar.", 500);
  }
  if (!paidWith) return fail("no_credits", 402);

  const { data: row, error: insertError } = await db
    .from("corrections")
    .insert({ user_id: user.id, level: level.data, variant: variant.data, task, essay, paid_with: paidWith })
    .select("id")
    .single();
  if (insertError) {
    console.error(insertError);
    return fail("Error intern. Torna-ho a provar.", 500);
  }

  try {
    const result = await gradeEssay({ level: level.data, variant: variant.data, task, essay });
    await db
      .from("corrections")
      .update({ result, score: Math.round(result.nota * 10) / 10, status: "done" })
      .eq("id", row.id);
    return NextResponse.json({ id: row.id });
  } catch (e) {
    console.error(e);
    await db.from("corrections").update({ status: "failed" }).eq("id", row.id);
    if (paidWith === "credit") {
      // No cobrem una correcció que no s'ha pogut fer.
      await db.rpc("refund_credit", { p_user: user.id });
    }
    return fail("La correcció ha fallat i no se t'ha descomptat. Torna-ho a provar en un minut.", 502);
  }
}
