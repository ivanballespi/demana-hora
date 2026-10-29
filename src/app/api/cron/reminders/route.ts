import { NextResponse, type NextRequest } from "next/server";
import { sendReminder } from "@/lib/email";
import { admin } from "@/lib/supabase/admin";
import type { Booking, Business } from "@/lib/types";

// Vercel Cron el crida cada dia: envia recordatori de les reserves de les
// pròximes ~30 hores i neteja les reserves pendents caducades.
export async function GET(req: NextRequest) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autoritzat" }, { status: 401 });
  }
  const db = admin();
  const now = new Date();

  await db.from("bookings").update({ status: "expired" }).eq("status", "pending").lt("hold_expires_at", now.toISOString());

  const { data } = await db
    .from("bookings")
    .select("*, businesses(*)")
    .eq("status", "confirmed")
    .eq("reminder_sent", false)
    .gt("starts_at", new Date(now.getTime() + 2 * 3_600_000).toISOString())
    .lt("starts_at", new Date(now.getTime() + 30 * 3_600_000).toISOString());

  let sent = 0;
  for (const row of data ?? []) {
    const { businesses, ...booking } = row as Booking & { businesses: Business };
    await sendReminder(booking, businesses);
    await db.from("bookings").update({ reminder_sent: true }).eq("id", booking.id);
    sent++;
  }
  return NextResponse.json({ sent });
}
