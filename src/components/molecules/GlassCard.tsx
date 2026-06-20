"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

/** Glassmorphic surface with optional hover lift + border glow. */
export function GlassCard({
  children,
  className,
  hover = false,
  glow = false,
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4 } : undefined}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "glass rounded-card p-5",
        hover &&
          "cursor-pointer transition-colors duration-300 hover:border-accent-cyan/30 hover:shadow-glow",
        glow && "shadow-card",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
