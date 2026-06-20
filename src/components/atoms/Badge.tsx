import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "gradient" | "neutral" | "success" | "warning";
  className?: string;
}

const styles = {
  gradient: "bg-accent-gradient text-white shadow-glow",
  neutral: "glass text-text-secondary",
  success: "bg-file-image/15 text-file-image border border-file-image/30",
  warning: "bg-amber-400/15 text-amber-300 border border-amber-400/30",
};

export function Badge({ children, variant = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
