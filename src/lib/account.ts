import "server-only";
import { redirect } from "next/navigation";
import { admin } from "@/lib/supabase/admin";
import { supabaseAuth } from "@/lib/supabase/server";

export const MONTHLY_CAP = 60;

export type Profile = { user_id: string; credits: number; pass_until: string | null; ref_code: string };

export async function currentUser() {
  const supabase = await supabaseAuth();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function requireUser() {
  const user = await currentUser();
  if (!user) redirect("/entrar");
  return user;
}

export async function getProfile(userId: string): Promise<Profile> {
  const db = admin();
  const { data } = await db.from("profiles").select("*").eq("user_id", userId).maybeSingle();
  if (data) return data as Profile;
  const { data: created } = await db.from("profiles").upsert({ user_id: userId }).select().single();
  return created as Profile;
}

export function hasPass(p: Profile) {
  return !!p.pass_until && new Date(p.pass_until).getTime() > Date.now();
}
