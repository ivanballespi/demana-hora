import { NextResponse, type NextRequest } from "next/server";

// Enllaç d'invitació d'un usuari: el recordem fins que el convidat es registri.
export async function GET(req: NextRequest, { params }: RouteContext<"/convida/[code]">) {
  const code = (await params).code.toLowerCase();
  const res = NextResponse.redirect(new URL("/registre?convidat=1", req.url));
  if (/^[0-9a-f]{8}$/.test(code)) {
    res.cookies.set("apte_ref", code, { maxAge: 60 * 60 * 24 * 30, httpOnly: true, sameSite: "lax", path: "/" });
  }
  return res;
}
