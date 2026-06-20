"use client";

import { motion, type Variants } from "framer-motion";

const variants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1 },
};

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  /** Render as a list container that staggers its Reveal children. */
  stagger?: boolean;
}

/** Fade-up + scale on scroll into view. */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ staggerChildren: 0.08 }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}
