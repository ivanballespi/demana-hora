import type { Metadata } from "next";
import { ADSENSE_CLIENT, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} · Calculadoras y herramientas online gratis`, template: `%s | ${SITE_NAME}` },
  description:
    "Calculadoras y herramientas gratis en español: números a letras, letra del DNI, IVA, porcentajes, hipoteca, días entre fechas y más. Rápidas, sin registro y sin instalar nada.",
  openGraph: { siteName: SITE_NAME, locale: "es_ES", type: "website" },
  verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full antialiased">
      <head>
        {/* Anuncis automàtics d'AdSense: Google decideix on els posa. El missatge de consentiment (RGPD) es configura a AdSense. */}
        {ADSENSE_CLIENT ? (
          <script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`} crossOrigin="anonymous" />
        ) : null}
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
