import { ImageResponse } from "next/og";

export const alt = "Hippo Stash — All your documents, one secure stash";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "90px",
          background:
            "radial-gradient(120% 80% at 20% 0%, #15131f 0%, #08080F 55%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 40 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "linear-gradient(135deg,#4ECDC4,#9B59B6)",
            }}
          />
          <div style={{ fontSize: 34, fontWeight: 700 }}>Hippo Stash</div>
        </div>

        <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
          All your documents,
        </div>
        <div
          style={{
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: -2,
            background: "linear-gradient(90deg,#4ECDC4,#9B59B6,#3B82F6)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          one secure stash.
        </div>

        <div style={{ marginTop: 36, fontSize: 30, color: "rgba(255,255,255,0.6)" }}>
          Secure storage + file conversion — PDF, DOCX, JPG, PNG & more
        </div>
      </div>
    ),
    { ...size }
  );
}
