"use client";

import { motion } from "framer-motion";
import { LinkButton } from "@/components/atoms/Button";
import { GlowOrb } from "@/components/atoms/GlowOrb";
import { FileTypeIcon } from "@/components/atoms/FileTypeIcon";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-36 sm:pt-44">
      <GlowOrb color="cyan" size={420} className="left-[8%] top-24" />
      <GlowOrb color="violet" size={460} className="right-[6%] top-40" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto max-w-4xl text-center"
      >
        <motion.div variants={item} className="mb-6 flex justify-center">
          <span className="glass inline-flex items-center gap-2 rounded-pill px-4 py-1.5 text-xs text-text-secondary">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-cyan" />
            Premium document storage, organized
          </span>
        </motion.div>

        <motion.h1
          variants={item}
          className="text-balance text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl"
        >
          Manage all your important documents in{" "}
          <span className="gradient-text">one secure place.</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mx-auto mt-6 max-w-2xl text-balance text-lg text-text-secondary"
        >
          Store papers, IDs, bills, and certificates effortlessly. Convert to any
          format, preview instantly, and keep everything protected.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <LinkButton href="#pricing" variant="gradient" size="lg">
            Get Started
          </LinkButton>
          <LinkButton href="#features" variant="glass" size="lg">
            Learn More
          </LinkButton>
        </motion.div>

        <motion.div
          variants={item}
          className="mt-16 flex items-center justify-center gap-5"
        >
          {(["pdf", "image", "doc"] as const).map((k, i) => (
            <motion.div
              key={k}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 0.4 }}
            >
              <div className="glass rounded-card p-4">
                <FileTypeIcon kind={k} size={56} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
