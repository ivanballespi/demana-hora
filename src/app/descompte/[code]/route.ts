import { NextResponse, type NextRequest } from "next/server";

// Enllaç de soci (sindicat, associació...): el codi promocional de Stripe
// s'aplica sol al checkout i les vendes queden atribuïdes al soci.
export async function GET(req: NextRequest, { params }: RouteContext<"/descompte/[code]">) {
  const code = (await params).code.toUpperCase();
  const valid = /^[A-Z0-9_-]{2,30}$/.test(code);
  const res = NextResponse.redirect(new URL(valid ? `/registre?descompte=${code}` : "/registre", req.url));
  if (valid) {
    res.cookies.set("apte_promo", code, { maxAge: 60 * 60 * 24 * 60, httpOnly: true, sameSite: "lax", path: "/" });
  }
  return res;
}
