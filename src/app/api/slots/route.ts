import { NextResponse, type NextRequest } from "next/server";
import { freeSlots } from "@/lib/availability";
import { isActive } from "@/lib/business";
import { activeService, businessBySlug } from "@/lib/public";
import { isDay } from "@/lib/time";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams;
  const slug = q.get("negoci") ?? "";
  const day = q.get("dia");
  const business = await businessBySlug(slug);
  if (!business || !isActive(business) || !isDay(day)) return NextResponse.json({ slots: [] });
  const service = await activeService(business.id, q.get("servei") ?? "");
  if (!service) return NextResponse.json({ slots: [] });
  return NextResponse.json(
    { slots: await freeSlots(business, service, day) },
    { headers: { "Cache-Control": "no-store" } },
  );
}
