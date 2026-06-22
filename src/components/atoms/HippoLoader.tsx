import Image from "next/image";
import { cn } from "@/lib/utils";

interface HippoLoaderProps {
  size?: number;
  label?: string;
  className?: string;
}

/** Cute hippo mascot loader — bobs/hops with a squishing shadow. */
export function HippoLoader({ size = 56, label, className }: HippoLoaderProps) {
  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div
        className="relative grid place-items-end"
        style={{ width: size, height: Math.round(size * 1.25) }}
      >
        <Image
          src="/hippo-icon.png"
          alt=""
          width={size}
          height={size}
          className="hippo-run relative z-10 rounded-[24%]"
          priority
        />
        <span
          className="hippo-ground absolute bottom-0 left-1/2 h-[6px] -translate-x-1/2 rounded-full"
          style={{ width: Math.round(size * 0.7) }}
        />
      </div>
      {label && (
        <p className="text-sm font-medium text-white/55">{label}</p>
      )}
    </div>
  );
}
