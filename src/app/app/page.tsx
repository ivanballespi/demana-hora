import Link from "next/link";
import { Conversion } from "@/components/Consent";
import { CopyLink } from "@/components/CopyLink";
import { getProfile, hasPass, requireUser } from "@/lib/account";
import { appUrl } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { admin } from "@/lib/supabase/admin";

export const metadata = { title: "Historial" };

const fmt = (d: string) =>
  new Intl.DateTimeFormat("ca-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Madrid" }).format(new Date(d));

export default async function Page({ searchParams }: PageProps<"/app">) {
  const user = await requireUser();
  const db = admin();
  const compra = (await searchParams).compra;
  let justBought: { value: number; id: string } | null = null;
  if (typeof compra === "string" && compra.startsWith("cs_")) {
    // Tornada de Stripe: activem la compra sense esperar el webhook (idempotent).
    const s = await stripe().checkout.sessions.retrieve(compra);
    if (s.payment_status === "paid" && s.client_reference_id === user.id && s.metadata?.product) {
      await db.rpc("grant_purchase", { p_session: s.id, p_user: user.id, p_product: s.metadata.product, p_amount: s.amount_total ?? 0 });
      justBought = { value: (s.amount_total ?? 0) / 100, id: s.id };
    }
  }
  const profile = await getProfile(user.id);
  const { data } = await db
    .from("corrections")
    .select("id, level, score, status, created_at, task, result->>veredicte")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);
  const { count: invited } = await db
    .from("profiles")
    .select("user_id", { count: "exact", head: true })
    .eq("referred_by", user.id)
    .eq("referral_rewarded", true);
  const rows = (data ?? []) as { id: string; level: string; score: number | null; status: string; created_at: string; task: string; veredicte: string | null }[];
  const done = rows.filter((r) => r.status === "done" && r.score !== null);

  return (
    <div className="space-y-8">
      {justBought && <Conversion kind="purchase" value={justBought.value} id={justBought.id} />}
      {justBought && <p className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800">Pagament rebut, gràcies! 🙌 Ja pots corregir.</p>}
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Les teves correccions</h1>
          <p className="text-sm text-stone-600">
            {hasPass(profile)
              ? `Accés il·limitat fins al ${fmt(profile.pass_until!)}.`
              : `Et queden ${profile.credits} ${profile.credits === 1 ? "correcció" : "correccions"}.`}{" "}
            <Link href="/app/preus" className="font-medium text-brand underline">Més correccions</Link>
          </p>
        </div>
        {done.length >= 2 && (
          <div className="card py-3 text-sm">
            Evolució: <b>{Number(done[done.length - 1].score).toLocaleString("ca-ES")}</b> → <b>{Number(done[0].score).toLocaleString("ca-ES")}</b> /40
          </div>
        )}
      </section>

      <section className="card border-brand/30 bg-brand-soft">
        <h2 className="font-bold">🎁 Convida un company i guanyeu una correcció cadascú</h2>
        <p className="mt-1 text-sm text-stone-700">
          Quan faci la seva primera correcció, tots dos en rebeu una de gratis (fins a 10 amics).
          {invited ? ` Ja n'has guanyat ${invited}.` : ""}
        </p>
        <div className="mt-3"><CopyLink url={`${appUrl()}/convida/${profile.ref_code}`} shareText="Mira, això et corregeix la redacció del C1 i et diu la nota sobre 40. Amb el meu enllaç tens una correcció extra gratis:" /></div>
      </section>

      {rows.length === 0 ? (
        <div className="card text-center">
          <p className="text-stone-600">Encara no has corregit cap redacció. La primera és gratis 🎁</p>
          <Link href="/app/nova" className="btn-primary mt-4">Corregir la primera redacció</Link>
        </div>
      ) : (
        <div className="space-y-2">
          {rows.map((r) => (
            <Link key={r.id} href={`/app/correccio/${r.id}`} className="card flex items-center justify-between gap-4 py-3 hover:border-brand">
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{r.task.slice(0, 90)}</div>
                <div className="text-xs text-stone-500">{r.level} · {fmt(r.created_at)}</div>
              </div>
              <div className="shrink-0 text-right">
                {r.status === "done" ? (
                  <>
                    <div className="font-bold tabular-nums">{Number(r.score).toLocaleString("ca-ES", { minimumFractionDigits: 1 })}/40</div>
                    <div className="text-xs capitalize text-stone-500">{r.veredicte}</div>
                  </>
                ) : (
                  <span className="text-xs text-stone-400">{r.status === "pending" ? "En curs" : "Fallida"}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
