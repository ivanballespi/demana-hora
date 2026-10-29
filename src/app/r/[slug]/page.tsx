import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookingWidget } from "@/app/r/[slug]/BookingWidget";
import { isActive } from "@/lib/business";
import { businessBySlug } from "@/lib/public";
import { admin } from "@/lib/supabase/admin";
import { addDays, localDay, weekdayOf } from "@/lib/time";
import type { Service } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/r/[slug]">): Promise<Metadata> {
  const business = await businessBySlug((await params).slug);
  if (!business) return {};
  return {
    title: `Reserva hora a ${business.name}`,
    description: business.description ?? `Demana hora online a ${business.name}.`,
  };
}

export default async function Page({ params }: PageProps<"/r/[slug]">) {
  const business = await businessBySlug((await params).slug);
  if (!business) notFound();

  const db = admin();
  const [{ data: services }, { data: hours }] = await Promise.all([
    db.from("services").select("*").eq("business_id", business.id).eq("active", true).order("created_at"),
    db.from("opening_hours").select("weekday").eq("business_id", business.id),
  ]);
  const openDays = new Set((hours ?? []).map((h) => h.weekday));
  const today = localDay(new Date(), business.timezone);
  const days: string[] = [];
  for (let i = 0; i <= Math.min(business.max_days_ahead, 60); i++) {
    const d = addDays(today, i);
    if (openDays.has(weekdayOf(d))) days.push(d);
  }
  const canDeposit = business.stripe_charges_enabled && !!business.stripe_account_id;
  const bookable = ((services ?? []) as Service[]).filter((s) => s.deposit_cents === 0 || canDeposit);

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold">{business.name}</h1>
        {business.description && <p className="mt-1 text-stone-600">{business.description}</p>}
        <div className="mt-2 flex flex-wrap gap-x-4 text-sm text-stone-500">
          {business.address && <span>📍 {business.address}</span>}
          {business.phone && <a href={`tel:${business.phone}`}>📞 {business.phone}</a>}
        </div>
      </header>

      {!isActive(business) || bookable.length === 0 ? (
        <div className="card text-center text-stone-600">
          Ara mateix no es poden fer reserves online.
          {business.phone && <> Truca al <a className="font-semibold underline" href={`tel:${business.phone}`}>{business.phone}</a>.</>}
        </div>
      ) : (
        <BookingWidget
          slug={business.slug}
          services={bookable.map(({ id, name, duration_min, price_cents, deposit_cents }) => ({ id, name, duration_min, price_cents, deposit_cents }))}
          days={days}
          cancelHours={business.cancel_hours}
        />
      )}
      <footer className="mt-10 text-center text-xs text-stone-400">
        Reserves amb <Link href="/" className="underline">Senyal</Link>
      </footer>
    </main>
  );
}
