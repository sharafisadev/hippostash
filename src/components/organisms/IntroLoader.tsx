"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { FileGlyph } from "@/components/atoms/FileGlyph";
import { HippoMark } from "@/components/atoms/HippoMark";

const FILES = ["PDF", "JPG", "DOCX", "PNG"];

/** Branded first-load experience: the hippo catching & stashing files. */
export function IntroLoader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("hs-intro")) return;
    setShow(true);
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => {
      sessionStorage.setItem("hs-intro", "1");
      setShow(false);
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!show) document.body.style.overflow = "";
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[200] grid place-items-center bg-bg"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* watermark */}
          <HippoMark className="pointer-events-none absolute h-[300px] w-[300px] text-white/[0.03]" />

          <div className="relative flex flex-col items-center">
            <div className="relative grid h-[130px] w-[230px] place-items-center">
              {FILES.map((f, i) => (
                <motion.div
                  key={f}
                  className="absolute"
                  initial={{ x: (i % 2 ? 1 : -1) * (130 + i * 14), y: -50 - i * 10, opacity: 0, rotate: i % 2 ? 24 : -24 }}
                  animate={{ x: 0, y: 0, opacity: [0, 1, 1, 0], rotate: 0, scale: [1, 1, 0.55] }}
                  transition={{ duration: 1.5, delay: 0.12 * i, ease: "easeInOut" }}
                >
                  <FileGlyph format={f} size={42} showLabel={false} />
                </motion.div>
              ))}
              <Image src="/hippo-icon.png" width={76} height={76} alt="" priority className="hippo-run relative z-10 rounded-[24%]" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="mt-3 text-center"
            >
              <div className="font-display text-[20px] font-bold tracking-[-0.02em]">Hippo Stash</div>
              <div className="mt-1 text-sm text-white/50">Stashing your documents…</div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
