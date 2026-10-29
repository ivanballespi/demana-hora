import { NextResponse, type NextRequest } from "next/server";
import { supabaseAuth } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const next = req.nextUrl.searchParams.get("next") ?? "/app";
  if (code) {
    const supabase = await supabaseAuth();
    await supabase.auth.exchangeCodeForSession(code);
  }
  return NextResponse.redirect(new URL(next.startsWith("/") && !next.startsWith("//") ? next : "/app", req.url));
}
