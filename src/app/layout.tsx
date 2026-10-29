import type { Metadata } from "next";
import { ConsentBanner } from "@/components/Consent";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: { default: "Apte · Corrector de redaccions del C1 i C2 de català amb IA", template: "%s · Apte" },
  description:
    "Escriu la redacció de l'examen de català i en 1 minut tens la nota estimada sobre 40, tots els errors explicats i una versió millorada. C1 i C2, català i valencià. Prova-ho gratis.",
  openGraph: {
    title: "Apte · Saps si aprovaries el C1 de català?",
    description: "Correcció de la redacció amb els criteris oficials en 1 minut. La primera és gratis.",
    locale: "ca_ES",
    type: "website",
  },
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ca" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        {children}
        <ConsentBanner />
      </body>
    </html>
  );
}
