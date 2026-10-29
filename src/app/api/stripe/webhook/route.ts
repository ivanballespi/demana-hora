import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { confirmFromSession } from "@/lib/bookings";
import { stripe } from "@/lib/stripe";
import { admin } from "@/lib/supabase/admin";

// Un sol endpoint per als dos webhooks de Stripe: el del compte propi
// (subscripcions) i el de comptes connectats (paga i senyal dels negocis).
function verify(payload: string, signature: string): Stripe.Event | null {
  const secrets = [process.env.STRIPE_WEBHOOK_SECRET, process.env.STRIPE_CONNECT_WEBHOOK_SECRET].filter(Boolean);
  for (const secret of secrets) {
    try {
      return stripe().webhooks.constructEvent(payload, signature, secret!);
    } catch {}
  }
  return null;
}

async function syncSubscription(sub: Stripe.Subscription) {
  await admin()
    .from("businesses")
    .update({ subscription_id: sub.id, subscription_status: sub.status })
    .eq("stripe_customer_id", typeof sub.customer === "string" ? sub.customer : sub.customer.id);
}

export async function POST(req: NextRequest) {
  const event = verify(await req.text(), req.headers.get("stripe-signature") ?? "");
  if (!event) return NextResponse.json({ error: "Signatura invàlida" }, { status: 400 });

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object;
      if (event.account && session.mode === "payment") {
        await confirmFromSession(session, event.account);
      } else if (!event.account && session.mode === "subscription" && session.client_reference_id) {
        const sub = await stripe().subscriptions.retrieve(session.subscription as string);
        await admin()
          .from("businesses")
          .update({
            stripe_customer_id: session.customer as string,
            subscription_id: sub.id,
            subscription_status: sub.status,
          })
          .eq("id", session.client_reference_id);
      }
      break;
    }
    case "checkout.session.expired": {
      const id = event.data.object.metadata?.booking_id;
      if (event.account && id) {
        await admin().from("bookings").update({ status: "expired" }).eq("id", id).eq("status", "pending");
      }
      break;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      if (!event.account) await syncSubscription(event.data.object);
      break;
    case "account.updated": {
      const account = event.data.object;
      await admin()
        .from("businesses")
        .update({ stripe_charges_enabled: account.charges_enabled })
        .eq("stripe_account_id", account.id);
      break;
    }
  }
  return NextResponse.json({ received: true });
}
