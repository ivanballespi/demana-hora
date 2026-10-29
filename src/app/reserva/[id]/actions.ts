"use server";

import { redirect } from "next/navigation";
import { cancelBooking } from "@/lib/bookings";
import { admin } from "@/lib/supabase/admin";
import type { Booking, Business } from "@/lib/types";

export async function cancelByClient(form: FormData) {
  const id = String(form.get("id"));
  const token = String(form.get("t"));
  const { data } = await admin().from("bookings").select("*, businesses(*)").eq("id", id).eq("cancel_token", token).maybeSingle();
  if (!data) redirect("/");
  const { businesses, ...booking } = data as Booking & { businesses: Business };
  if (booking.status === "confirmed" && new Date(booking.starts_at).getTime() > Date.now()) {
    await cancelBooking(booking, businesses, "client");
  }
  redirect(`/reserva/${id}?t=${token}`);
}
