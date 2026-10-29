import "server-only";
import { admin } from "@/lib/supabase/admin";
import type { Business, Service } from "@/lib/types";

export async function businessBySlug(slug: string) {
  const { data } = await admin().from("businesses").select("*").eq("slug", slug).maybeSingle();
  return data as Business | null;
}

export async function activeService(businessId: string, serviceId: string) {
  if (!/^[0-9a-f-]{36}$/i.test(serviceId)) return null;
  const { data } = await admin()
    .from("services")
    .select("*")
    .eq("id", serviceId)
    .eq("business_id", businessId)
    .eq("active", true)
    .maybeSingle();
  return data as Service | null;
}
