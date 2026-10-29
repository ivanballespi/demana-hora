import "server-only";
import type Stripe from "stripe";
import { sendBookingConfirmed, sendCancelled } from "@/lib/email";
import { stripe } from "@/lib/stripe";
import { admin } from "@/lib/supabase/admin";
import type { Booking, Business } from "@/lib/types";

async function loadBusiness(id: string) {
  const { data } = await admin().from("businesses").select("*").eq("id", id).single();
  return data as Business;
}

/**
 * Marca com a confirmada la reserva d'una Checkout Session pagada.
 * Idempotent: el webhook i la pàgina de retorn poden cridar-la tots dos.
 */
export async function confirmFromSession(session: Stripe.Checkout.Session, accountId: string) {
  const bookingId = session.metadata?.booking_id;
  if (!bookingId || session.payment_status !== "paid") return;
  const paymentIntent =
    typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? null;

  const { data, error } = await admin()
    .from("bookings")
    .update({ status: "confirmed", stripe_payment_intent: paymentIntent, hold_expires_at: null })
    .eq("id", bookingId)
    .in("status", ["pending", "expired"])
    .select()
    .maybeSingle();

  if (error) {
    // 23P01 = solapament: algú altre ha agafat l'hora mentre pagava (molt rar).
    if (error.code === "23P01" && paymentIntent) {
      await stripe().refunds.create({ payment_intent: paymentIntent }, { stripeAccount: accountId });
      await admin()
        .from("bookings")
        .update({ status: "cancelled", refunded: true, stripe_payment_intent: paymentIntent })
        .eq("id", bookingId);
      return;
    }
    throw error;
  }
  if (data) {
    const booking = data as Booking;
    await sendBookingConfirmed(booking, await loadBusiness(booking.business_id));
  }
}

export async function notifyConfirmed(booking: Booking) {
  await sendBookingConfirmed(booking, await loadBusiness(booking.business_id));
}

/** Cancel·la una reserva confirmada i retorna la paga i senyal si toca. */
export async function cancelBooking(booking: Booking, business: Business, by: "client" | "business") {
  const hoursLeft = (new Date(booking.starts_at).getTime() - Date.now()) / 3_600_000;
  const refund =
    booking.deposit_cents > 0 &&
    !!booking.stripe_payment_intent &&
    !!business.stripe_account_id &&
    (by === "business" || hoursLeft >= business.cancel_hours);

  if (refund) {
    await stripe().refunds.create(
      { payment_intent: booking.stripe_payment_intent! },
      { stripeAccount: business.stripe_account_id!, idempotencyKey: `refund-${booking.id}` },
    );
  }
  const { data } = await admin()
    .from("bookings")
    .update({ status: "cancelled", refunded: refund })
    .eq("id", booking.id)
    .eq("status", "confirmed")
    .select()
    .maybeSingle();
  if (data) await sendCancelled(data as Booking, business, by);
  return refund;
}
