import { forwardRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "gradient" | "glass" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold rounded-btn " +
  "transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-accent-cyan disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";

const variants: Record<Variant, string> = {
  gradient:
    "bg-accent-gradient text-white shadow-glow hover:-translate-y-0.5 active:translate-y-0",
  glass:
    "glass text-white hover:bg-white/[0.08] hover:border-white/20",
  ghost: "text-text-secondary hover:text-white hover:bg-white/5",
  danger:
    "bg-file-pdf/90 text-white hover:bg-file-pdf hover:-translate-y-0.5",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base py-3.5",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
}

type ButtonProps = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "glass", size = "md", className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  )
);
Button.displayName = "Button";

type LinkButtonProps = CommonProps &
  React.ComponentProps<typeof Link>;

export function LinkButton({
  variant = "glass",
  size = "md",
  className,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}
