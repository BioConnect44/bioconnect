import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "BioConnect — India's Premier Biotech Academic Platform";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 80px",
          background: "linear-gradient(135deg, #09343B 0%, #061F24 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "#14B8A6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: 800,
            }}
          >
            🧬
          </div>
          <span style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.5px", color: "#2DD4BF" }}>
            BioConnect
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "900px" }}>
          <h1
            style={{
              fontSize: "56px",
              fontWeight: 900,
              lineHeight: 1.15,
              color: "#F0FDFA",
              margin: 0,
            }}
          >
            India's Dedicated Biotechnology Academic Platform
          </h1>
          <p style={{ fontSize: "24px", color: "#99F6E4", margin: 0, lineHeight: 1.4 }}>
            Master curriculum notes, research papers, biotech internships & interactive challenges.
          </p>
        </div>

        <div style={{ display: "flex", gap: "32px", fontSize: "18px", color: "#5EEAD4" }}>
          <span>📚 250+ Pages of Study Notes</span>
          <span>🔬 PubMed Literature Search</span>
          <span>💼 Career & Fellowship Portal</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
