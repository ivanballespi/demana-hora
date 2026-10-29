import "server-only";
import { admin } from "@/lib/supabase/admin";
import { addDays, fromMinutes, localDay, localToUtc, toMinutes, weekdayOf } from "@/lib/time";
import type { Business, OpeningHour, Service } from "@/lib/types";

const STEP_MIN = 15;

/** Hores lliures (HH:MM, hora local) per a un servei en un dia concret. */
export async function freeSlots(business: Business, service: Service, day: string): Promise<string[]> {
  const tz = business.timezone;
  const today = localDay(new Date(), tz);
  if (day < today || day > addDays(today, business.max_days_ahead)) return [];

  const db = admin();
  const dayStart = localToUtc(day, "00:00", tz);
  const dayEnd = localToUtc(addDays(day, 1), "00:00", tz);

  const [{ data: hours }, { data: busy }] = await Promise.all([
    db.from("opening_hours").select("*").eq("business_id", business.id).eq("weekday", weekdayOf(day)),
    db
      .from("bookings")
      .select("starts_at, ends_at, status, hold_expires_at")
      .eq("business_id", business.id)
      .in("status", ["pending", "confirmed"])
      .lt("starts_at", dayEnd.toISOString())
      .gt("ends_at", dayStart.toISOString()),
  ]);

  const now = Date.now();
  const taken = (busy ?? [])
    .filter((b) => b.status === "confirmed" || new Date(b.hold_expires_at).getTime() > now)
    .map((b) => [new Date(b.starts_at).getTime(), new Date(b.ends_at).getTime()] as const);
  const earliest = now + business.min_notice_hours * 3_600_000;
  const durationMs = service.duration_min * 60_000;

  const slots = new Set<string>();
  for (const range of (hours ?? []) as OpeningHour[]) {
    const end = toMinutes(range.end_time);
    for (let m = toMinutes(range.start_time); m + service.duration_min <= end; m += STEP_MIN) {
      const time = fromMinutes(m);
      const start = localToUtc(day, time, tz).getTime();
      if (start < earliest) continue;
      if (taken.some(([s, e]) => start < e && start + durationMs > s)) continue;
      slots.add(time);
    }
  }
  return [...slots].sort();
}
