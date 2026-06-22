"use client";

import { motion } from "framer-motion";
import { HeroApp } from "@/components/organisms/HeroApp";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export function Hero() {
  return (
    <header
      id="top"
      className="relative z-[2] mx-auto max-w-[1200px] px-4 pb-12 pt-[132px] sm:px-6 sm:pt-[160px]"
    >
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        {/* Left — copy */}
        <motion.div variants={container} initial="hidden" animate="show" className="text-center lg:text-left">
          <motion.div
            variants={item}
            className="mb-7 inline-flex items-center gap-[9px] rounded-full border border-white/10 bg-white/5 px-4 py-[7px] text-[13px] font-medium text-white/[0.78] backdrop-blur-[10px]"
          >
            <span className="h-[7px] w-[7px] rounded-full bg-accent-cyan shadow-[0_0_12px_2px_var(--a1)]" />
            Secure document storage &amp; conversion
          </motion.div>

          <motion.h1
            variants={item}
            className="m-0 mb-5 font-display text-[clamp(40px,5vw,66px)] font-bold leading-[1.02] tracking-[-0.035em]"
          >
            All your documents,
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
            <a href="#pricing" className="btn-primary animate-grad-move inline-flex items-center gap-2 rounded-[14px] px-7 py-[15px] text-[15px]">
              Get Started Free
            </a>
            <a href="#convert" className="lq inline-flex items-center gap-2 rounded-[14px] px-[26px] py-[15px] text-[15px] font-semibold text-white">
              Try the converter
            </a>
          </motion.div>

          {/* small trust line */}
          <motion.div variants={item} className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px] text-white/40 lg:justify-start">
            <span className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--a1)" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
              No credit card needed
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--a1)" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
              256-bit encrypted
            </span>
          </motion.div>
        </motion.div>

        {/* Right — app preview */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative min-w-0"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="pointer-events-none absolute -inset-x-4 -bottom-6 -top-8 bg-[radial-gradient(55%_55%_at_60%_40%,rgba(155,89,182,0.22),transparent_70%)] blur-[40px]" />
          <div className="pointer-events-none absolute -inset-px rounded-[25px] opacity-40 [background:linear-gradient(135deg,rgba(78,205,196,0.5),transparent_40%,transparent_60%,rgba(155,89,182,0.5))]" />
          <div className="relative">
            <HeroApp />
          </div>
        </motion.div>
      </div>
    </header>
  );
}
