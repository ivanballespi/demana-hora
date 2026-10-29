"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cancelBooking } from "@/lib/bookings";
import { currentUser, requireBusiness } from "@/lib/business";
import { appUrl, env } from "@/lib/env";
import { parseEuros, slugify } from "@/lib/format";
import { stripe } from "@/lib/stripe";
import { admin } from "@/lib/supabase/admin";
import { supabaseAuth } from "@/lib/supabase/server";
import { isTime } from "@/lib/time";
import type { Booking } from "@/lib/types";

export type FormState = { error?: string; ok?: string } | undefined;

const RESERVED = new Set(["panell", "api", "entrar", "registre", "legal", "reserva", "auth", "admin", "senyal"]);

function cleanSlug(input: string) {
  const slug = slugify(input);
  if (slug.length < 3) return { error: "L'enllaç ha de tenir com a mínim 3 lletres." };
  if (RESERVED.has(slug)) return { error: "Aquest enllaç està reservat. Prova'n un altre." };
  return { slug };
}

const done = () => revalidatePath("/panell", "layout");

export async function createBusiness(_: FormState, form: FormData): Promise<FormState> {
  const user = await currentUser();
  if (!user) redirect("/entrar");
  const name = String(form.get("name") ?? "").trim();
  if (name.length < 2) return { error: "Escriu el nom del teu negoci." };
  const { slug, error } = cleanSlug(String(form.get("slug") || name));
  if (error) return { error };

  const db = admin();
  const { data: biz, error: insertError } = await db
    .from("businesses")
    .insert({ owner_id: user.id, name, slug, email: user.email })
    .select()
    .single();
  if (insertError) {
    if (insertError.code === "23505") {
      return insertError.message.includes("slug")
        ? { error: "Aquest enllaç ja l'utilitza un altre negoci. Prova'n un altre." }
        : { error: "Ja tens un negoci creat." };
    }
    return { error: insertError.message };
  }

  // Valors per defecte perquè la pàgina funcioni des del primer minut.
  const hours = [1, 2, 3, 4, 5].flatMap((weekday) => [
    { business_id: biz.id, weekday, start_time: "09:00", end_time: "14:00" },
    { business_id: biz.id, weekday, start_time: "16:00", end_time: "20:00" },
  ]);
  await db.from("opening_hours").insert(hours);
  await db.from("services").insert({
    business_id: biz.id,
    name: "Visita",
    duration_min: 60,
    price_cents: 4000,
    deposit_cents: 1000,
  });
  redirect("/panell?benvinguda=1");
}

export async function updateBusiness(_: FormState, form: FormData): Promise<FormState> {
  const { business } = await requireBusiness();
  const name = String(form.get("name") ?? "").trim();
  if (name.length < 2) return { error: "El nom és massa curt." };
  const { slug, error } = cleanSlug(String(form.get("slug") ?? ""));
  if (error) return { error };
  const email = String(form.get("email") ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "El correu no és vàlid." };
  const int = (k: string, min: number, max: number) =>
    Math.min(max, Math.max(min, Math.round(Number(form.get(k)) || 0)));

  const { error: dbError } = await admin()
    .from("businesses")
    .update({
      name,
      slug,
      email,
      phone: String(form.get("phone") ?? "").trim() || null,
      address: String(form.get("address") ?? "").trim() || null,
      description: String(form.get("description") ?? "").trim().slice(0, 500) || null,
      cancel_hours: int("cancel_hours", 0, 168),
      min_notice_hours: int("min_notice_hours", 0, 168),
      max_days_ahead: int("max_days_ahead", 1, 365),
    })
    .eq("id", business.id);
  if (dbError) {
    return dbError.code === "23505" ? { error: "Aquest enllaç ja l'utilitza un altre negoci." } : { error: dbError.message };
  }
  done();
  return { ok: "Desat ✓" };
}

export async function saveHours(_: FormState, form: FormData): Promise<FormState> {
  const { business } = await requireBusiness();
  const rows: { business_id: string; weekday: number; start_time: string; end_time: string }[] = [];
  for (let d = 0; d < 7; d++) {
    if (!form.get(`open_${d}`)) continue;
    for (const r of ["a", "b"]) {
      const start = String(form.get(`${r}_start_${d}`) ?? "");
      const end = String(form.get(`${r}_end_${d}`) ?? "");
      if (!start && !end) continue;
      if (!isTime(start) || !isTime(end) || end <= start) {
        return { error: "Revisa les hores: l'hora de tancar ha de ser posterior a la d'obrir." };
      }
      rows.push({ business_id: business.id, weekday: d, start_time: start, end_time: end });
    }
  }
  const db = admin();
  await db.from("opening_hours").delete().eq("business_id", business.id);
  if (rows.length) await db.from("opening_hours").insert(rows);
  done();
  return { ok: "Horari desat ✓" };
}

export async function saveService(_: FormState, form: FormData): Promise<FormState> {
  const { business } = await requireBusiness();
  const id = String(form.get("id") ?? "");
  const name = String(form.get("name") ?? "").trim();
  const duration = Math.round(Number(form.get("duration_min")));
  const price = parseEuros(form.get("price"));
  const deposit = parseEuros(form.get("deposit"));
  if (name.length < 2) return { error: "Posa-li nom al servei." };
  if (!(duration >= 5 && duration <= 600)) return { error: "La durada ha de ser entre 5 i 600 minuts." };
  if (Number.isNaN(price) || Number.isNaN(deposit)) return { error: "Revisa els imports." };
  if (deposit > price) return { error: "La paga i senyal no pot ser més gran que el preu." };
  if (deposit > 0 && deposit < 100) return { error: "La paga i senyal mínima és 1 € (o 0 per no cobrar-ne)." };

  const values = { name, duration_min: duration, price_cents: price, deposit_cents: deposit, active: true };
  const db = admin();
  const { error } = id
    ? await db.from("services").update(values).eq("id", id).eq("business_id", business.id)
    : await db.from("services").insert({ ...values, business_id: business.id });
  if (error) return { error: error.message };
  done();
  return { ok: "Servei desat ✓" };
}

export async function removeService(form: FormData) {
  const { business } = await requireBusiness();
  // Es desactiva en lloc d'esborrar perquè les reserves antigues el conservin.
  await admin()
    .from("services")
    .update({ active: false })
    .eq("id", String(form.get("id")))
    .eq("business_id", business.id);
  done();
}

async function ownBooking(form: FormData) {
  const { business } = await requireBusiness();
  const { data } = await admin()
    .from("bookings")
    .select("*")
    .eq("id", String(form.get("id")))
    .eq("business_id", business.id)
    .single();
  return { business, booking: data as Booking };
}

export async function markBooking(form: FormData) {
  const { booking } = await ownBooking(form);
  const status = String(form.get("status"));
  if (!booking || !["attended", "no_show"].includes(status)) return;
  if (new Date(booking.starts_at).getTime() > Date.now()) return;
  await admin().from("bookings").update({ status }).eq("id", booking.id).in("status", ["confirmed", "attended", "no_show"]);
  done();
}

export async function cancelByBusiness(form: FormData) {
  const { business, booking } = await ownBooking(form);
  if (booking?.status === "confirmed") await cancelBooking(booking, business, "business");
  done();
}

export async function connectStripe() {
  const { business, user } = await requireBusiness();
  let accountId = business.stripe_account_id;
  if (!accountId) {
    const account = await stripe().accounts.create({
      country: "ES",
      email: user.email,
      business_profile: { name: business.name, url: `${appUrl()}/r/${business.slug}` },
      controller: {
        stripe_dashboard: { type: "full" },
        fees: { payer: "account" },
        losses: { payments: "stripe" },
        requirement_collection: "stripe",
      },
      metadata: { business_id: business.id },
    });
    accountId = account.id;
    await admin().from("businesses").update({ stripe_account_id: accountId }).eq("id", business.id);
  }
  const link = await stripe().accountLinks.create({
    account: accountId,
    type: "account_onboarding",
    refresh_url: `${appUrl()}/panell/cobraments`,
    return_url: `${appUrl()}/panell/cobraments?tornada=1`,
  });
  redirect(link.url);
}

export async function subscribe() {
  const { business, user } = await requireBusiness();
  let customerId = business.stripe_customer_id;
  if (!customerId) {
    const customer = await stripe().customers.create({
      email: user.email,
      name: business.name,
      metadata: { business_id: business.id },
    });
    customerId = customer.id;
    await admin().from("businesses").update({ stripe_customer_id: customerId }).eq("id", business.id);
  }
  const trialEnd = new Date(business.trial_ends_at).getTime();
  const session = await stripe().checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    client_reference_id: business.id,
    line_items: [
      {
        price: env("STRIPE_PRICE_ID"),
        quantity: 1,
        // IVA 21%: taxa creada a Stripe (Product catalog → Tax rates)
        ...(process.env.STRIPE_TAX_RATE_ID && { tax_rates: [process.env.STRIPE_TAX_RATE_ID] }),
      },
    ],
    // Si encara li queden dies de prova, no els perd: el primer cobrament és quan s'acaba.
    ...(trialEnd > Date.now() + 49 * 3_600_000 && { subscription_data: { trial_end: Math.floor(trialEnd / 1000) } }),
    allow_promotion_codes: true,
    billing_address_collection: "required",
    tax_id_collection: { enabled: true },
    customer_update: { address: "auto", name: "auto" },
    locale: "es",
    success_url: `${appUrl()}/panell/cobraments?subscrit=1`,
    cancel_url: `${appUrl()}/panell/cobraments`,
  });
  redirect(session.url!);
}

export async function openBillingPortal() {
  const { business } = await requireBusiness();
  if (!business.stripe_customer_id) redirect("/panell/cobraments");
  const portal = await stripe().billingPortal.sessions.create({
    customer: business.stripe_customer_id,
    return_url: `${appUrl()}/panell/cobraments`,
  });
  redirect(portal.url);
}

export async function changePassword(_: FormState, form: FormData): Promise<FormState> {
  const password = String(form.get("password") ?? "");
  if (password.length < 8) return { error: "Mínim 8 caràcters." };
  const supabase = await supabaseAuth();
  const { error } = await supabase.auth.updateUser({ password });
  return error ? { error: error.message } : { ok: "Contrasenya canviada ✓" };
}
