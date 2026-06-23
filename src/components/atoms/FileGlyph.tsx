import { cn } from "@/lib/utils";

export type GlyphFormat =
  | "PDF" | "DOCX" | "XLSX" | "PPTX" | "JPG" | "PNG"
  | "SVG" | "HEIC" | "ZIP" | "DOC" | "TXT" | "WEBP" | "CSV" | "MP4" | "GIF";

interface GlyphStyle {
  from: string;
  to: string;
  glow: string;
}

const STYLES: Record<string, GlyphStyle> = {
  PDF:  { from: "#ff7d72", to: "#E74C3C", glow: "231,76,60" },
  DOCX: { from: "#5fa8e8", to: "#3B82F6", glow: "59,130,246" },
  DOC:  { from: "#5fa8e8", to: "#3B82F6", glow: "59,130,246" },
  XLSX: { from: "#46e08a", to: "#22C55E", glow: "34,197,94" },
  PPTX: { from: "#fb9a4b", to: "#F97316", glow: "249,115,22" },
  JPG:  { from: "#c07ad6", to: "#9B59B6", glow: "155,89,182" },
  PNG:  { from: "#6fe3da", to: "#4ECDC4", glow: "78,205,196" },
  WEBP: { from: "#6fe3da", to: "#4ECDC4", glow: "78,205,196" },
  SVG:  { from: "#fbc04b", to: "#F59E0B", glow: "245,158,11" },
  HEIC: { from: "#f579ab", to: "#EC4899", glow: "236,72,153" },
  ZIP:  { from: "#8b97a8", to: "#64748B", glow: "100,116,139" },
  TXT:  { from: "#8b97a8", to: "#64748B", glow: "100,116,139" },
  CSV:  { from: "#46e08a", to: "#16A34A", glow: "22,163,74" },
  MP4:  { from: "#8b8bf5", to: "#6366F1", glow: "99,102,241" },
  GIF:  { from: "#6fe3da", to: "#14B8A6", glow: "20,184,166" },
};

interface FileGlyphProps {
  format: string;
  /** Outer card width in px (card is square). */
  size?: number;
  showLabel?: boolean;
  className?: string;
  bob?: boolean;
}

export function FileGlyph({
  format,
  size = 66,
  showLabel = true,
  className,
  bob = false,
}: FileGlyphProps) {
  const key = format.toUpperCase();
  const s = STYLES[key] ?? STYLES.ZIP!;

  // File shape is ~62% of the outer card
  const shapeW = Math.round(size * 0.62);
  const shapeH = Math.round(shapeW * 1.21);
  const shapeR = Math.round(shapeW * 0.14);
  const cardR = Math.round(size * 0.22);

  // Hippo icon sits centered inside the file shape, ~52% of shape width
  const hippoSize = Math.round(shapeW * 0.52);

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      {/* outer dark card */}
      <div
        className={cn(bob && "animate-bob")}
        style={{
          width: size,
          height: size,
          borderRadius: cardR,
          background: "linear-gradient(160deg, rgba(255,255,255,0.055), rgba(255,255,255,0.015))",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 8px 24px rgba(0,0,0,0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-hidden="true"
      >
        {/* colored file shape with hippo mark on top */}
        <div
          style={{
            position: "relative",
            width: shapeW,
            height: shapeH,
            borderRadius: shapeR,
            background: `linear-gradient(160deg, ${s.from}, ${s.to})`,
            clipPath: "polygon(0 0, 68% 0, 100% 26%, 100% 100%, 0 100%)",
            boxShadow: `0 8px 22px rgba(${s.glow},0.5), inset 0 1px 0 rgba(255,255,255,0.35)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* hippo SVG mark in white */}
          <svg
            width={hippoSize}
            height={hippoSize}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ position: "relative", zIndex: 1, marginTop: "10%" }}
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3.51146 12.9952V7.25212C3.51146 5.3599 4.79687 3.69319 6.61272 3.19064C7.06583 3.06524 7.53975 3 8.00974 3H8.8677C10.5489 3 9.27578 5.76636 10 7.5C10.6269 7.5 11.2362 7.45837 11.8096 7.39855C14.2709 7.14178 16.8901 7.10476 18.8126 8.66291C19.431 9.16415 19.8993 9.80254 20.1376 10.7032C20.6165 12.513 20.6229 14.4413 20.144 16.2511C19.6201 18.2309 18.1406 19.7928 16.2364 20.4321C15.8816 20.5513 15.5328 20.2789 15.5171 19.905C15.5067 19.6599 15.3489 19.4439 15.1171 19.3634C12.7544 18.5425 11.4768 18.5456 8.84898 19.3726C8.61292 19.4468 8.45287 19.6673 8.45287 19.9148C8.45287 20.2779 8.11793 20.5504 7.77346 20.4354C5.86453 19.7981 4.38077 18.2343 3.85597 16.2511C3.6626 15.5203 3.54835 14.7702 3.5124 14.0164L3.51146 14.0138V13.9964C3.49617 13.6629 3.49619 13.3287 3.51146 12.9952ZM14.7132 9.14833C14.372 9.09119 14.0492 9.32281 13.9923 9.66566C13.9354 10.0085 14.166 10.3328 14.5073 10.3899L14.5499 10.3971C16.0307 10.645 17.1161 11.9322 17.1161 13.4404C17.1161 13.788 17.3966 14.0698 17.7426 14.0698C18.0885 14.0698 18.369 13.788 18.369 13.4404C18.369 11.3169 16.8409 9.50458 14.7559 9.15547L14.7132 9.14833Z"
              fill="rgba(255,255,255,0.92)"
            />
          </svg>
        </div>
      </div>
      {showLabel && (
        <span className="text-sm font-semibold text-white/60">{key}</span>
      )}
    </div>
  );
}
