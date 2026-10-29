import { NextResponse, type NextRequest } from "next/server";
import { freeSlots } from "@/lib/availability";
import { notifyConfirmed } from "@/lib/bookings";
import { isActive } from "@/lib/business";
import { appUrl } from "@/lib/env";
import { activeService, businessBySlug } from "@/lib/public";
import { stripe } from "@/lib/stripe";
import { admin } from "@/lib/supabase/admin";
import { isDay, isTime, localToUtc } from "@/lib/time";
import type { Booking } from "@/lib/types";

const fail = (error: string, status = 400) => NextResponse.json({ error }, { status });

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return fail("Petició incorrecta");

  const name = String(body.name ?? "").trim().slice(0, 100);
  const email = String(body.email ?? "").trim().toLowerCase().slice(0, 200);
  const phone = String(body.phone ?? "").trim().slice(0, 30);
  if (name.length < 2) return fail("Escriu el teu nom");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("El correu no és vàlid");
  if (phone.replace(/\D/g, "").length < 9) return fail("El telèfon no és vàlid");
  if (!isDay(body.day) || !isTime(body.time)) return fail("Tria dia i hora");

  const business = await businessBySlug(String(body.slug ?? ""));
  if (!business || !isActive(business)) return fail("Aquest negoci no accepta reserves ara mateix", 404);
  const service = await activeService(business.id, String(body.serviceId ?? ""));
  if (!service) return fail("Aquest servei ja no està disponible", 404);
  if (service.deposit_cents > 0 && !(business.stripe_account_id && business.stripe_charges_enabled)) {
    return fail("Aquest negoci encara no pot cobrar la paga i senyal", 409);
  }

  const slots = await freeSlots(business, service, body.day);
  if (!slots.includes(body.time)) return fail("Aquesta hora ja no està lliure. Tria'n una altra.", 409);

  const db = admin();
  const { data, error } = await db.rpc("create_booking", {
    p_business_id: business.id,
    p_service_id: service.id,
    p_starts_at: localToUtc(body.day, body.time, business.timezone).toISOString(),
    p_customer_name: name,
    p_customer_email: email,
    p_customer_phone: phone,
    p_hold_minutes: 35,
  });
  if (error) {
    if (error.code === "23P01") return fail("Aquesta hora ja no està lliure. Tria'n una altra.", 409);
    console.error(error);
    return fail("No s'ha pogut crear la reserva", 500);
  }
  const booking = data as Booking;
  const manage = `${appUrl()}/reserva/${booking.id}?t=${booking.cancel_token}`;

  if (booking.status === "confirmed") {
    await notifyConfirmed(booking);
    return NextResponse.json({ url: manage });
  }

  try {
    const session = await stripe().checkout.sessions.create(
      {
        mode: "payment",
        customer_email: email,
        locale: "es",
        expires_at: Math.floor(Date.now() / 1000) + 30 * 60 + 30,
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "eur",
              unit_amount: booking.deposit_cents,
              product_data: {
                name: `Paga i senyal · ${service.name}`,
                description: `${business.name}. Es descompta del preu final. Cancel·lació gratuïta fins a ${business.cancel_hours} h abans.`,
              },
            },
          },
        ],
        metadata: { booking_id: booking.id },
        payment_intent_data: { metadata: { booking_id: booking.id }, description: `Reserva ${business.name}` },
        success_url: `${manage}&pagat=1`,
        cancel_url: `${appUrl()}/r/${business.slug}`,
      },
      { stripeAccount: business.stripe_account_id! },
    );
    await db.from("bookings").update({ stripe_session_id: session.id }).eq("id", booking.id);
    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error(e);
    await db.from("bookings").update({ status: "expired" }).eq("id", booking.id);
    return fail("No s'ha pogut iniciar el pagament", 502);
  }
}
