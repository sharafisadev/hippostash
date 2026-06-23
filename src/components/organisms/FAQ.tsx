"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "@/components/molecules/Reveal";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "How secure are my documents?",
    a: "Every file is encrypted with 256-bit encryption at rest and in transit. You can add a biometric lock and two-factor authentication for an extra layer of protection.",
  },
  {
    q: "Which file formats can I convert?",
    a: "Convert freely between PDF, DOCX, JPG, PNG, XLSX, PPTX and more. Pro and Business plans unlock the full set of formats with higher monthly limits.",
  },
  {
    q: "What happens when I hit my storage limit?",
    a: "We'll let you know as you approach your limit. Your existing files stay safe and accessible — you simply upgrade your plan to add more space whenever you're ready.",
  },
  {
    q: "Can I cancel or change my plan anytime?",
    a: "Absolutely. Upgrade, downgrade or cancel at any time from your settings. Changes take effect immediately and billing adjusts automatically.",
  },
  {
    q: "Can I access my stash on any device?",
    a: "Yes. Your documents sync automatically across phone, tablet and desktop, so the latest version is always with you wherever you are.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="cv-auto relative z-[2] mx-auto max-w-[840px] px-4 sm:px-6 py-12">
      <Reveal className="mb-12 text-center">
        <div className="mb-4 text-[13px] font-semibold uppercase tracking-[0.14em] text-accent-cyan">
          FAQ
        </div>
        <h2 className="m-0 mb-3.5 font-display text-[clamp(32px,4.4vw,50px)] font-bold leading-[1.05] tracking-[-0.03em]">
          Got questions? We&apos;ve got answers.
        </h2>
        <p className="m-0 text-[16px] text-white/50">
          Everything you need to know about storing and converting with Hippo Stash.
        </p>
      </Reveal>

      <div className="flex flex-col gap-3">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q} className="lq overflow-hidden rounded-[16px]">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="text-[16px] font-semibold text-white">{f.q}</span>
                <span
                  className={cn(
                    "grid h-[26px] w-[26px] flex-none place-items-center rounded-[8px] text-[18px] transition-all duration-300",
                    isOpen ? "btn-primary rotate-45 !text-[#0b0b14]" : "bg-white/[0.08] text-white/70"
                  )}
                >
                  +
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.32, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="m-0 px-6 pb-[22px] text-[15px] leading-[1.6] text-white/55">
                      {f.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
