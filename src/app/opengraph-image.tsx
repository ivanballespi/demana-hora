import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "CalcularOnline · Calculadoras y herramientas gratis";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "linear-gradient(135deg, #047857 0%, #0369a1 100%)", color: "white" }}>
        <div style={{ fontSize: 48, fontWeight: 800, opacity: 0.9 }}>calcularonline.es</div>
        <div style={{ fontSize: 84, fontWeight: 900, lineHeight: 1.05, marginTop: 24 }}>Calcula cualquier cosa en segundos</div>
        <div style={{ fontSize: 36, marginTop: 32, opacity: 0.9 }}>IVA · Porcentajes · Hipoteca · DNI · Fechas · y mucho más</div>
      </div>
    ),
    size,
  );
}
