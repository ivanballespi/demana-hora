import Link from "next/link";
import { cancelByBusiness, markBooking } from "@/app/panell/actions";
import { ConfirmButton } from "@/components/ConfirmButton";
import { CopyLink } from "@/components/CopyLink";
import { isActive, requireBusiness, trialDaysLeft } from "@/lib/business";
import { appUrl } from "@/lib/env";
import { dateLong, euros, timeShort } from "@/lib/format";
import { admin } from "@/lib/supabase/admin";
import { localDay } from "@/lib/time";
import type { Booking } from "@/lib/types";

export const metadata = { title: "Agenda" };

export default async function Page({ searchParams }: PageProps<"/panell">) {
  const { business } = await requireBusiness();
  const welcome = (await searchParams).benvinguda;
  const db = admin();
  const tz = business.timezone;
  const now = new Date();
  const monthAgo = new Date(now.getTime() - 30 * 86_400_000).toISOString();

  const [{ data: upcoming }, { data: toReview }, { data: last30 }, { count: services }, { count: hours }] = await Promise.all([
    db.from("bookings").select("*").eq("business_id", business.id).eq("status", "confirmed")
      .gte("ends_at", now.toISOString()).order("starts_at").limit(100),
    db.from("bookings").select("*").eq("business_id", business.id).eq("status", "confirmed")
      .lt("ends_at", now.toISOString()).order("starts_at", { ascending: false }).limit(30),
    db.from("bookings").select("status, deposit_cents, refunded").eq("business_id", business.id)
      .gte("starts_at", monthAgo),
    db.from("services").select("id", { count: "exact", head: true }).eq("business_id", business.id).eq("active", true),
    db.from("opening_hours").select("id", { count: "exact", head: true }).eq("business_id", business.id),
  ]);

  const live = (last30 ?? []).filter((b) => ["confirmed", "attended", "no_show"].includes(b.status));
  const noShows = live.filter((b) => b.status === "no_show");
  const protectedCents = live.reduce((sum, b) => sum + b.deposit_cents, 0);
  const keptCents =
    noShows.reduce((s, b) => s + b.deposit_cents, 0) +
    (last30 ?? []).filter((b) => b.status === "cancelled" && !b.refunded).reduce((s, b) => s + b.deposit_cents, 0);

  const bookingUrl = `${appUrl()}/r/${business.slug}`;
  const active = isActive(business);
  const steps = [
    { done: (services ?? 0) > 0, label: "Revisa els teus serveis i la paga i senyal", href: "/panell/configuracio" },
    { done: (hours ?? 0) > 0, label: "Ajusta el teu horari", href: "/panell/configuracio#horari" },
    { done: business.stripe_charges_enabled, label: "Connecta Stripe per cobrar la paga i senyal", href: "/panell/cobraments" },
    { done: true, label: "Posa l'enllaç a la bio d'Instagram, a Google i al WhatsApp", href: bookingUrl },
  ];
  const pendingSteps = steps.slice(0, 3).some((s) => !s.done);

  const byDay = new Map<string, Booking[]>();
  for (const b of (upcoming ?? []) as Booking[]) {
    const key = localDay(new Date(b.starts_at), tz);
    byDay.set(key, [...(byDay.get(key) ?? []), b]);
  }

  return (
    <div className="space-y-8">
      {!active && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          La prova gratuïta s&apos;ha acabat i la teva pàgina <b>no accepta reserves</b>.{" "}
          <Link href="/panell/cobraments" className="font-semibold underline">Activa el pla per 15 €/mes</Link>
        </div>
      )}
      {active && !business.subscription_status && (
        <div className="rounded-2xl bg-brand-soft p-4 text-sm text-brand-dark">
          Et queden <b>{trialDaysLeft(business)} dies</b> de prova gratuïta.{" "}
          <Link href="/panell/cobraments" className="font-semibold underline">Activa el pla</Link> quan vulguis.
        </div>
      )}

      <section>
        <h1 className="text-2xl font-bold">{welcome ? "La teva pàgina ja és viva 🎉" : business.name}</h1>
        <p className="mt-1 text-sm text-stone-600">Aquest és l&apos;enllaç que has de passar als teus clients:</p>
        <div className="mt-3"><CopyLink url={bookingUrl} /></div>
      </section>

      {pendingSteps && (
        <section className="card">
          <h2 className="font-semibold">Deixa-ho a punt (5 minuts)</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {steps.map((s) => (
              <li key={s.label} className="flex items-center gap-2">
                <span className={s.done ? "text-emerald-600" : "text-stone-300"}>{s.done ? "✔" : "○"}</span>
                <Link href={s.href} className={s.done ? "text-stone-500 line-through" : "font-medium hover:underline"}>
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="grid gap-3 sm:grid-cols-3">
        <Stat label="Reserves (30 dies)" value={String(live.length)} />
        <Stat label="Diners assegurats amb paga i senyal" value={euros(protectedCents)} />
        <Stat label="Cobrat de plantades i cancel·lacions tardanes" value={euros(keptCents)} hint={`${noShows.length} plantades`} />
      </section>

      {(toReview ?? []).length > 0 && (
        <section>
          <h2 className="text-lg font-semibold">Ha vingut?</h2>
          <p className="text-sm text-stone-600">Marca-ho perquè les estadístiques siguin reals. Si no ha vingut, la paga i senyal és teva.</p>
          <div className="mt-3 space-y-2">
            {(toReview as Booking[]).map((b) => (
              <div key={b.id} className="card flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="text-sm">
                  <b>{b.customer_name}</b> · {b.service_name}
                  <div className="text-stone-500">{dateLong(b.starts_at, tz)} · {timeShort(b.starts_at, tz)}</div>
                </div>
                <div className="flex gap-2">
                  <form action={markBooking}>
                    <input type="hidden" name="id" value={b.id} />
                    <input type="hidden" name="status" value="attended" />
                    <button className="btn-ghost py-1.5">✅ Ha vingut</button>
                  </form>
                  <form action={markBooking}>
                    <input type="hidden" name="id" value={b.id} />
                    <input type="hidden" name="status" value="no_show" />
                    <button className="btn-ghost py-1.5">🚫 Plantada</button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-lg font-semibold">Pròximes reserves</h2>
        {byDay.size === 0 && (
          <p className="mt-2 text-sm text-stone-600">
            Encara no n&apos;hi ha cap. Fes una reserva de prova a la teva pàgina per veure com ho viuen els clients.
          </p>
        )}
        <div className="mt-3 space-y-6">
          {[...byDay.entries()].map(([day, list]) => (
            <div key={day}>
              <h3 className="mb-2 text-sm font-semibold text-stone-500 first-letter:uppercase">{dateLong(list[0].starts_at, tz)}</h3>
              <div className="space-y-2">
                {list.map((b) => (
                  <div key={b.id} className="card flex flex-wrap items-center justify-between gap-3 py-3">
                    <div className="flex items-center gap-4">
                      <div className="w-14 text-lg font-bold tabular-nums">{timeShort(b.starts_at, tz)}</div>
                      <div className="text-sm">
                        <b>{b.customer_name}</b> · {b.service_name}
                        <div className="text-stone-500">
                          <a href={`tel:${b.customer_phone}`} className="hover:underline">{b.customer_phone}</a> ·{" "}
                          <a href={`mailto:${b.customer_email}`} className="hover:underline">{b.customer_email}</a>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {b.deposit_cents > 0 && (
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                          {euros(b.deposit_cents)} pagats
                        </span>
                      )}
                      <form action={cancelByBusiness}>
                        <input type="hidden" name="id" value={b.id} />
                        <ConfirmButton
                          className="text-xs text-stone-400 hover:text-red-600"
                          message={`Cancel·lar la reserva de ${b.customer_name}? Se li retornarà la paga i senyal i rebrà un correu.`}
                        >
                          Cancel·lar
                        </ConfirmButton>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="card">
      <div className="text-2xl font-bold">{value}</div>
      <div className="mt-1 text-xs text-stone-500">{label}</div>
      {hint && <div className="mt-1 text-xs text-stone-400">{hint}</div>}
    </div>
  );
}
