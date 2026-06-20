import { cn } from "@/lib/utils";
import type { FileKind } from "@/lib/types";

const config: Record<
  FileKind,
  { label: string; color: string; bg: string }
> = {
  pdf: { label: "PDF", color: "#E74C3C", bg: "rgba(231,76,60,0.14)" },
  image: { label: "IMG", color: "#2ECC71", bg: "rgba(46,204,113,0.14)" },
  doc: { label: "DOC", color: "#3498DB", bg: "rgba(52,152,219,0.14)" },
  other: { label: "FILE", color: "#9aa3b2", bg: "rgba(154,163,178,0.14)" },
};

interface Props {
  kind: FileKind;
  size?: number;
  className?: string;
}

/** Document-tab glyph tinted by file type. */
export function FileTypeIcon({ kind, size = 56, className }: Props) {
  const { label, color, bg } = config[kind];
  return (
    <div
      className={cn("relative grid place-items-center", className)}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden="true">
        <path
          d="M10 4h20l8 8v28a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4Z"
          fill={bg}
          stroke={color}
          strokeWidth="1.5"
        />
        <path d="M30 4v8h8" fill="none" stroke={color} strokeWidth="1.5" />
      </svg>
      <span
        className="absolute bottom-[22%] text-[9px] font-bold tracking-wider"
        style={{ color }}
      >
        {label}
      </span>
      <span className="sr-only">{label} file</span>
    </div>
  );
}
