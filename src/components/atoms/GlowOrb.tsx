"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlowOrbProps {
  className?: string;
  color?: "cyan" | "violet" | "mixed";
  size?: number;
}

const colorMap = {
  cyan: "rgba(78,205,196,0.45)",
  violet: "rgba(155,89,182,0.5)",
  mixed: "rgba(120,140,200,0.45)",
};

/** Soft, floating ambient orb rendered behind key surfaces. */
export function GlowOrb({ className, color = "cyan", size = 320 }: GlowOrbProps) {
  return (
    <motion.div
      aria-hidden="true"
      className={cn("pointer-events-none absolute -z-10 rounded-full blur-3xl", className)}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${colorMap[color]} 0%, transparent 70%)`,
      }}
      animate={{ y: [0, -24, 0], opacity: [0.5, 0.85, 0.5] }}
      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}
