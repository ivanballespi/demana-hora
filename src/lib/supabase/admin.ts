import "server-only";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

// Client amb la service role: salta RLS. Només s'utilitza al servidor i
// sempre filtrant pel negoci de l'usuari autenticat.
export function admin() {
  return createClient(env("NEXT_PUBLIC_SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
