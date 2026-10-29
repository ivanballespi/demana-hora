import "server-only";
import { redirect } from "next/navigation";
import { admin } from "@/lib/supabase/admin";
import { supabaseAuth } from "@/lib/supabase/server";
import type { Business } from "@/lib/types";

export async function currentUser() {
  const supabase = await supabaseAuth();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

/** Usuari autenticat + el seu negoci. Redirigeix si falta alguna cosa. */
export async function requireBusiness() {
  const user = await currentUser();
  if (!user) redirect("/entrar");
  const { data } = await admin().from("businesses").select("*").eq("owner_id", user.id).maybeSingle();
  if (!data) redirect("/panell/nou");
  return { user, business: data as Business };
}

/** El negoci pot rebre reserves: prova gratuïta vigent o subscripció activa. */
export function isActive(b: Business) {
  if (["active", "trialing", "past_due"].includes(b.subscription_status ?? "")) return true;
  return new Date(b.trial_ends_at).getTime() > Date.now();
}

export function trialDaysLeft(b: Business) {
  return Math.max(0, Math.ceil((new Date(b.trial_ends_at).getTime() - Date.now()) / 86_400_000));
}
