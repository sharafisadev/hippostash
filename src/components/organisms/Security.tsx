"use client";

import { Reveal } from "@/components/molecules/Reveal";

const chips = ["256-bit encryption", "Biometric lock", "Two-factor auth", "Zero-knowledge"];

export function Security() {
  return (
    <section className="relative z-[2] mx-auto max-w-[1180px] px-6 py-12">
      <div className="grid items-center gap-[60px] md:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <div className="mb-4 text-[13px] font-semibold uppercase tracking-[0.14em] text-accent-cyan">
            Security first
          </div>
          <h2 className="m-0 mb-[18px] font-display text-[clamp(30px,3.8vw,46px)] font-bold leading-[1.06] tracking-[-0.03em]">
            Your documents, locked down by default.
          </h2>
          <p className="m-0 mb-7 text-[17px] leading-[1.6] text-white/55">
            From the moment a file lands in your stash it&apos;s encrypted,
            access-controlled and only ever yours. Privacy isn&apos;t a setting —
            it&apos;s the foundation.
          </p>
          <div className="flex flex-wrap gap-2.5">
            {chips.map((c) => (
              <span key={c} className="lq rounded-full px-4 py-[9px] text-[13px] text-white/[0.78]">
                {c}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <div className="glow-card lq relative flex min-h-[300px] items-center justify-center overflow-hidden rounded-[24px] p-[46px]">
            <div className="absolute inset-0 animate-pulse-glow bg-[radial-gradient(50%_50%_at_50%_50%,rgba(78,205,196,0.22),transparent_70%)] blur-[10px]" />
            <div className="pointer-events-none absolute -inset-0.5 overflow-hidden rounded-[24px] opacity-50">
              <div className="absolute left-1/2 top-1/2 h-[160%] w-[160%] -translate-x-1/2 -translate-y-1/2 animate-spin blur-[8px] [background:conic-gradient(from_0deg,rgba(78,205,196,0.7),rgba(155,89,182,0.6),rgba(59,130,246,0.5),rgba(78,205,196,0.7))]" />
            </div>
            <div className="relative grid h-[120px] w-[120px] animate-bob place-items-center rounded-[30px] border border-white/20 bg-[linear-gradient(150deg,rgba(78,205,196,0.25),rgba(155,89,182,0.25))] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_20px_50px_rgba(0,0,0,0.4)]">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
                <path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-4z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
