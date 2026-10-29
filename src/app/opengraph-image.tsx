import { ImageResponse } from "next/og";

export const alt = "Apte · Corrector de redaccions del C1 i C2 de català";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "#3f3cbb", color: "white" }}>
        <div style={{ fontSize: 44, fontWeight: 800, opacity: 0.85 }}>Apte</div>
        <div style={{ fontSize: 76, fontWeight: 900, lineHeight: 1.05, marginTop: 24 }}>Aprovaries la redacció del C1 de català?</div>
        <div style={{ fontSize: 34, marginTop: 32, opacity: 0.9 }}>Nota sobre 40 · Errors explicats · Primera correcció gratis</div>
      </div>
    ),
    size,
  );
}
