import { cn } from "@/lib/utils";

/**
 * The signature Hippo Stash file icon: a folded-corner card with a gradient
 * fill and a soft colored glow, optionally labeled with the format.
 */

export type GlyphFormat =
  | "PDF" | "DOCX" | "XLSX" | "PPTX" | "JPG" | "PNG"
  | "SVG" | "HEIC" | "ZIP" | "DOC" | "TXT" | "WEBP";

interface GlyphStyle {
  from: string;
  to: string;
  glow: string;
}

// Each format gets its own gradient + glow color (matches the design concept).
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
  /** Card width in px (height scales to ~1.2x). */
  size?: number;
  showLabel?: boolean;
  className?: string;
  /** Soft floating bob animation. */
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
  const h = Math.round(size * 1.21);

  return (
    <div className={cn("flex flex-col items-center gap-2.5", className)}>
      <div
        className={cn(bob && "animate-bob")}
        style={{
          width: size,
          height: h,
          borderRadius: Math.round(size * 0.2),
          background: `linear-gradient(160deg, ${s.from}, ${s.to})`,
          clipPath: "polygon(0 0, 68% 0, 100% 26%, 100% 100%, 0 100%)",
          boxShadow: `0 18px 36px rgba(${s.glow},0.4), inset 0 1px 0 rgba(255,255,255,0.5)`,
        }}
        aria-hidden="true"
      />
      {showLabel && (
        <span className="text-sm font-semibold text-white/60">{key}</span>
      )}
    </div>
  );
}
