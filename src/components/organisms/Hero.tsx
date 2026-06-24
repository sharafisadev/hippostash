"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HeroApp } from "@/components/organisms/HeroApp";
import { HeroAura } from "@/components/organisms/HeroAura";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

// Words that cycle in the headline — communicates *what* you stash.
const ROTATING = ["documents", "passports", "bills", "contracts", "receipts"];

function RotatingWord() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % ROTATING.length), 2200);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="relative inline-grid overflow-hidden py-[0.12em] align-bottom -my-[0.12em]">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={i}
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-110%", opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="gradient-text animate-grad-move col-start-1 row-start-1 inline-block whitespace-nowrap pr-1"
        >
          {ROTATING[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function Hero() {
  return (
    <header
      id="top"
      className="relative z-[2] mx-auto max-w-[1200px] px-4 pb-12 pt-[132px] sm:px-6 sm:pt-[160px]"
    >
      <HeroAura />
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        {/* Left — copy */}
        <motion.div variants={container} initial="hidden" animate="show" className="text-center lg:text-left">
          <motion.div
            variants={item}
            whileHover={{ scale: 1.03 }}
            className="mb-7 inline-flex items-center gap-[9px] rounded-full border border-white/10 bg-white/5 px-4 py-[7px] text-[13px] font-medium text-white/[0.78] backdrop-blur-[10px]"
          >
            <motion.span
              className="h-[7px] w-[7px] rounded-full bg-accent-cyan shadow-[0_0_12px_2px_var(--a1)]"
              animate={{ scale: [1, 1.35, 1], opacity: [1, 0.65, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            Secure document storage &amp; conversion
          </motion.div>

          <motion.h1
            variants={item}
            className="m-0 mb-5 font-display text-[clamp(40px,5vw,66px)] font-bold leading-[1.02] tracking-[-0.035em]"
          >
            All your <RotatingWord />
            <br />
            <span className="gradient-text animate-grad-move">one secure stash.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mb-8 max-w-[520px] text-[17px] leading-[1.6] text-white/55 lg:mx-0"
          >
            Save papers, IDs, bills and certificates effortlessly — then convert
            any file to the format you need, in seconds. Wrapped in bank-grade
            security.
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap items-center justify-center gap-3.5 lg:justify-start">
            <motion.a
              href="#pricing"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary animate-grad-move group inline-flex items-center gap-2 rounded-[14px] px-7 py-[15px] text-[15px]"
            >
              Get Started Free
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                className="transition-transform duration-300 group-hover:translate-x-1">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.a>
            <motion.a
              href="#convert"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="lq inline-flex items-center gap-2 rounded-[14px] px-[26px] py-[15px] text-[15px] font-semibold text-white"
            >
              Try the converter
            </motion.a>
          </motion.div>

          {/* small trust line */}
          <motion.div variants={item} className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px] text-white/40 lg:justify-start">
            {["No credit card needed", "256-bit encrypted"].map((label, idx) => (
              <motion.span
                key={label}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + idx * 0.15, duration: 0.4 }}
                className="flex items-center gap-1.5"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--a1)" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                {label}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        {/* Right — app preview (floats gently) */}
        <motion.div
          initial={{ opacity: 0, y: 24, rotateX: 8 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.25, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative min-w-0"
          style={{ transformStyle: "preserve-3d", perspective: 1000 }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <div className="pointer-events-none absolute -inset-x-4 -bottom-6 -top-8 bg-[radial-gradient(55%_55%_at_60%_40%,rgba(155,89,182,0.22),transparent_70%)] blur-[40px]" />
            <div className="pointer-events-none absolute -inset-px rounded-[25px] opacity-40 [background:linear-gradient(135deg,rgba(78,205,196,0.5),transparent_40%,transparent_60%,rgba(155,89,182,0.5))]" />
            <div className="relative">
              <HeroApp />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </header>
  );
}
