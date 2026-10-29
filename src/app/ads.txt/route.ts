import { ADSENSE_CLIENT } from "@/lib/site";

export const dynamic = "force-static";

// ads.txt: autoritza Google a vendre anuncis en aquest domini (AdSense ho comprova).
export function GET() {
  const body = ADSENSE_CLIENT
    ? `google.com, ${ADSENSE_CLIENT.replace(/^ca-/, "")}, DIRECT, f08c47fec0942fa0\n`
    : "# AdSense encara no configurat\n";
  return new Response(body, { headers: { "Content-Type": "text/plain" } });
}
