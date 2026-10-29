import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { admin } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  let event;
  try {
    event = stripe().webhooks.constructEvent(
      await req.text(),
      req.headers.get("stripe-signature") ?? "",
      env("STRIPE_WEBHOOK_SECRET"),
    );
  } catch {
    return NextResponse.json({ error: "Signatura invàlida" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const s = event.data.object;
    const product = s.metadata?.product;
    if (s.payment_status === "paid" && s.client_reference_id && product) {
      await admin().rpc("grant_purchase", {
        p_session: s.id,
        p_user: s.client_reference_id,
        p_product: product,
        p_amount: s.amount_total ?? 0,
      });
    }
  }
  return NextResponse.json({ received: true });
}
