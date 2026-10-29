import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: { default: "Senyal · Reserves amb paga i senyal, sense plantades", template: "%s · Senyal" },
  description:
    "La teva pàgina de reserves en català amb paga i senyal automàtica. Els clients que paguen, venen. Prova-ho 14 dies gratis.",
  openGraph: {
    title: "Senyal · Adeu a les plantades",
    description: "Reserves online amb paga i senyal i recordatoris automàtics. 15 €/mes.",
    locale: "ca_ES",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ca" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
