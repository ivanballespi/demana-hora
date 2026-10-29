"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/account";
import { appUrl, env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { supabaseAuth } from "@/lib/supabase/server";

const PRICES = { pack5: "STRIPE_PRICE_PACK5", pass30: "STRIPE_PRICE_PASS30" } as const;

export async function buy(form: FormData) {
  const user = await requireUser();
  const product = String(form.get("product")) as keyof typeof PRICES;
  if (!(product in PRICES)) redirect("/app/preus");
  const session = await stripe().checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: env(PRICES[product]), quantity: 1 }],
    client_reference_id: user.id,
    customer_email: user.email,
    metadata: { product },
    invoice_creation: { enabled: true },
    allow_promotion_codes: true,
    locale: "es",
    success_url: `${appUrl()}/app?compra={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl()}/app/preus`,
  });
  redirect(session.url!);
}

export type FormState = { error?: string; ok?: string } | undefined;

export async function changePassword(_: FormState, form: FormData): Promise<FormState> {
  const password = String(form.get("password") ?? "");
  if (password.length < 8) return { error: "Mínim 8 caràcters." };
  const supabase = await supabaseAuth();
  const { error } = await supabase.auth.updateUser({ password });
  return error ? { error: error.message } : { ok: "Contrasenya canviada ✓" };
}
