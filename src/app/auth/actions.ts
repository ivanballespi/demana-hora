"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { appUrl } from "@/lib/env";
import { admin } from "@/lib/supabase/admin";
import { supabaseAuth } from "@/lib/supabase/server";

export type AuthState = { error?: string; message?: string } | undefined;

export async function signUp(_: AuthState, form: FormData): Promise<AuthState> {
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  if (password.length < 8) return { error: "La contrasenya ha de tenir com a mínim 8 caràcters." };
  const supabase = await supabaseAuth();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${appUrl()}/auth/callback?next=/app/nova?benvinguda=1` },
  });
  if (error) return { error: translate(error.message) };
  if (data.user) await linkReferral(data.user.id);
  if (!data.session) return { message: "T'hem enviat un correu per confirmar el compte. Obre'l i tens la primera correcció gratis!" };
  redirect("/app/nova?benvinguda=1");
}

async function linkReferral(userId: string) {
  const code = (await cookies()).get("apte_ref")?.value;
  if (!code) return;
  const db = admin();
  const { data: referrer } = await db.from("profiles").select("user_id").eq("ref_code", code).maybeSingle();
  if (!referrer || referrer.user_id === userId) return;
  await db.from("profiles").upsert({ user_id: userId, referred_by: referrer.user_id }, { onConflict: "user_id" });
}

export async function signIn(_: AuthState, form: FormData): Promise<AuthState> {
  const supabase = await supabaseAuth();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(form.get("email") ?? "").trim(),
    password: String(form.get("password") ?? ""),
  });
  if (error) return { error: translate(error.message) };
  redirect("/app");
}

export async function resetPassword(_: AuthState, form: FormData): Promise<AuthState> {
  const supabase = await supabaseAuth();
  await supabase.auth.resetPasswordForEmail(String(form.get("email") ?? "").trim(), {
    redirectTo: `${appUrl()}/auth/callback?next=/app/compte`,
  });
  return { message: "Si el correu existeix, t'hem enviat un enllaç per entrar." };
}

export async function signOut() {
  const supabase = await supabaseAuth();
  await supabase.auth.signOut();
  redirect("/");
}

function translate(msg: string) {
  if (/invalid login/i.test(msg)) return "Correu o contrasenya incorrectes.";
  if (/already registered/i.test(msg)) return "Ja hi ha un compte amb aquest correu. Entra-hi.";
  if (/not confirmed/i.test(msg)) return "Encara has de confirmar el correu (mira la safata d'entrada).";
  return msg;
}
