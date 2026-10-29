import Link from "next/link";
import { notFound } from "next/navigation";
import { cancelByClient } from "@/app/reserva/[id]/actions";
import { ConfirmButton } from "@/components/ConfirmButton";
import { confirmFromSession } from "@/lib/bookings";
import { dateLong, euros, timeShort } from "@/lib/format";
import { stripe } from "@/lib/stripe";
import { admin } from "@/lib/supabase/admin";
import { hoursUntil } from "@/lib/time";
import type { Booking, Business } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "La teva reserva", robots: { index: false } };

async function load(id: string, token: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id) || !/^[0-9a-f-]{36}$/i.test(token)) return null;
  const { data } = await admin().from("bookings").select("*, businesses(*)").eq("id", id).eq("cancel_token", token).maybeSingle();
  if (!data) return null;
  const { businesses, ...booking } = data as Booking & { businesses: Business };
  return { booking: booking as Booking, business: businesses };
}

export default async function Page({ params, searchParams }: PageProps<"/reserva/[id]">) {
  const { id } = await params;
  const sp = await searchParams;
  const token = String(sp.t ?? "");
  let found = await load(id, token);
  if (!found) notFound();

  // Tornem de Stripe: confirmem sense esperar el webhook.
  if (sp.pagat && found.booking.status === "pending" && found.booking.stripe_session_id && found.business.stripe_account_id) {
    const session = await stripe().checkout.sessions.retrieve(
      found.booking.stripe_session_id,
      {},
      { stripeAccount: found.business.stripe_account_id },
    );
    await confirmFromSession(session, found.business.stripe_account_id);
    found = (await load(id, token))!;
  }

  const { booking: b, business: biz } = found;
  const tz = biz.timezone;
  const hoursLeft = hoursUntil(b.starts_at);
  const freeCancel = hoursLeft >= biz.cancel_hours;

  const header: Record<Booking["status"], [string, string]> = {
    confirmed: ["Tens hora! ✅", "T'hem enviat la confirmació per correu."],
    pending: ["Esperant el pagament ⏳", "Si ja has pagat, actualitza la pàgina en uns segons."],
    cancelled: ["Reserva cancel·lada", b.refunded && b.deposit_cents ? `T'hem retornat ${euros(b.deposit_cents)}. Pot trigar 5-10 dies.` : ""],
    expired: ["Reserva no completada", "No es va completar el pagament i l'hora s'ha alliberat."],
    attended: ["Gràcies per venir! 🙌", ""],
    no_show: ["Reserva no presentada", ""],
  };
  const [title, subtitle] = header[b.status];

  return (
    <main className="mx-auto w-full max-w-md flex-1 px-4 py-12">
      <div className="card">
        <h1 className="text-2xl font-extrabold">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-stone-600">{subtitle}</p>}
        <dl className="mt-6 space-y-2 text-sm">
          <Row k="On" v={biz.name} />
          <Row k="Què" v={b.service_name} />
          <Row k="Quan" v={`${dateLong(b.starts_at, tz)}, ${timeShort(b.starts_at, tz)}`} />
          {biz.address && <Row k="Adreça" v={biz.address} />}
          <Row k="Preu" v={euros(b.price_cents)} />
          {b.deposit_cents > 0 && <Row k="Paga i senyal" v={`${euros(b.deposit_cents)}${b.status === "confirmed" ? " (pagada)" : ""}`} />}
        </dl>

        {b.status === "confirmed" && hoursLeft > 0 && (
          <form action={cancelByClient} className="mt-6 border-t border-stone-100 pt-4">
            <input type="hidden" name="id" value={b.id} />
            <input type="hidden" name="t" value={token} />
            <p className="mb-3 text-xs text-stone-500">
              {b.deposit_cents === 0
                ? "Si no pots venir, cancel·la perquè algú altre pugui aprofitar l'hora."
                : freeCancel
                  ? `Pots cancel·lar gratis fins a ${biz.cancel_hours} h abans i et retornem la paga i senyal.`
                  : `Falten menys de ${biz.cancel_hours} h: si cancel·les ara, la paga i senyal no es retorna.`}
            </p>
            <ConfirmButton
              className="btn-ghost w-full"
              message={freeCancel || b.deposit_cents === 0 ? "Segur que vols cancel·lar la reserva?" : "Falta poc: la paga i senyal no es retornarà. Vols cancel·lar igualment?"}
            >
              Cancel·lar la reserva
            </ConfirmButton>
          </form>
        )}
        {["cancelled", "expired"].includes(b.status) && (
          <Link href={`/r/${biz.slug}`} className="btn-primary mt-6 w-full">Reservar una altra hora</Link>
        )}
      </div>
      {biz.phone && (
        <p className="mt-4 text-center text-sm text-stone-500">
          Dubtes? Truca a {biz.name}: <a className="underline" href={`tel:${biz.phone}`}>{biz.phone}</a>
        </p>
      )}
    </main>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-stone-500">{k}</dt>
      <dd className="text-right font-medium">{v}</dd>
    </div>
  );
}
