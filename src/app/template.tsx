"use client";

import { motion } from "framer-motion";

/**
 * Re-mounts on every navigation → gives each route a smooth crossfade.
 * Opacity-only so it never creates a containing block for the fixed navbar
 * or modals.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
