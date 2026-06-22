"use client";

import Image from "next/image";
import { Reveal } from "@/components/molecules/Reveal";

export function CTABanner() {
  return (
    <section id="get-started" className="relative z-[2] mx-auto max-w-[1180px] px-4 sm:px-6 pb-[90px] pt-10">
      <Reveal>
        <div className="lq relative overflow-hidden rounded-[28px] px-10 py-20 text-center">
          <div className="absolute -top-20 left-1/2 h-[380px] w-[600px] -translate-x-1/2 animate-pulse-glow rounded-full bg-[radial-gradient(circle,rgba(155,89,182,0.45),rgba(78,205,196,0.2)_50%,transparent_72%)] blur-[42px]" />
          <div className="pointer-events-none absolute -inset-0.5 overflow-hidden rounded-[28px] opacity-35">
            <div className="absolute left-1/2 top-1/2 h-[300%] w-[130%] -translate-x-1/2 -translate-y-1/2 animate-spin blur-[10px] [background:conic-gradient(from_0deg,rgba(78,205,196,0.6),rgba(155,89,182,0.6),rgba(59,130,246,0.4),rgba(78,205,196,0.6))]" />
          </div>
          <div className="relative">
            <Image
              src="/hippo-icon.png"
              alt=""
              width={62}
              height={62}
              className="mx-auto mb-6 animate-bob rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
            />
            <h2 className="m-0 mb-4 font-display text-[clamp(34px,5vw,58px)] font-bold leading-[1.04] tracking-[-0.035em]">
              Ready to begin?
            </h2>
            <p className="mx-auto mb-[34px] max-w-[460px] text-[18px] leading-[1.55] text-white/55">
              Start managing your documents now — secure, organized and
              convertible in one friendly place.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3.5">
              <a href="#" className="btn-primary animate-grad-move inline-flex items-center gap-2 rounded-[14px] px-[30px] py-[15px] text-[15px]">
                Get Started Free
              </a>
              <a href="#pricing" className="lq inline-flex items-center gap-2 rounded-[14px] px-7 py-[15px] text-[15px] font-semibold text-white">
                View Plans
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
