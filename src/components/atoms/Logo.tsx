import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  href?: string;
  showWord?: boolean;
  size?: number;
  className?: string;
}

export function Logo({ href = "#top", showWord = true, size = 30, className }: LogoProps) {
  const content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image
        src="/hippo-icon.png"
        alt="Hippo Stash"
        width={size}
        height={size}
        className="block rounded-[8px]"
        priority
      />
      {showWord && (
        <span className="font-display text-[19px] font-bold tracking-[-0.02em] text-white">
          Hippo Stash
        </span>
      )}
    </span>
  );

  if (!href) return content;
  return (
    <a href={href} aria-label="Hippo Stash home" className="shrink-0">
      {content}
    </a>
  );
}
