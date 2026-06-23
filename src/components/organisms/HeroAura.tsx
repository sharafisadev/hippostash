"use client";

import { motion } from "framer-motion";
import { FileGlyph } from "@/components/atoms/FileGlyph";

const items = [
  { f: "PDF", x: "5%", y: "24%", s: 56, d: 0 },
  { f: "DOCX", x: "87%", y: "30%", s: 46, d: 1.4 },
  { f: "JPG", x: "11%", y: "72%", s: 40, d: 0.7 },
  { f: "XLSX", x: "83%", y: "70%", s: 52, d: 2.1 },
  { f: "PNG", x: "48%", y: "10%", s: 34, d: 1.1 },
];

/** Subtle, premium hero ambience — faint file glyphs drifting slowly. */
export function HeroAura() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 hidden overflow-hidden md:block">
      {items.map((it, i) => (
        <motion.div
          key={i}
          className="absolute opacity-[0.06]"
          style={{ left: it.x, top: it.y }}
          animate={{ y: [0, -20, 0], rotate: [-7, 7, -7] }}
          transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "easeInOut", delay: it.d }}
        >
          <FileGlyph format={it.f} size={it.s} showLabel={false} />
        </motion.div>
      ))}
    </div>
  );
}
