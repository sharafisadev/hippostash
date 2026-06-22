"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/molecules/Reveal";

function CountUp({ target, suffix, decimals }: { target: number; suffix: string; decimals: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [val, setVal] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !done.current) {
            done.current = true;
            const dur = 1400;
            const start = performance.now();
            const tick = (now: number) => {
              const p = Math.min((now - start) / dur, 1);
              const eased = 1 - Math.pow(1 - p, 3);
              setVal(target * eased);
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="bg-gradient-to-r from-accent-cyan to-accent-violet bg-clip-text font-display text-[48px] font-bold tracking-[-0.03em] text-transparent">
      {val.toFixed(decimals)}
      {suffix}
    </div>
  );
}

const stats = [
  { node: <CountUp target={12} suffix="+" decimals={0} />, label: "File formats supported" },
  { node: <div className="bg-gradient-to-r from-accent-cyan to-accent-violet bg-clip-text font-display text-[48px] font-bold tracking-[-0.03em] text-transparent">&lt;2s</div>, label: "Average conversion time" },
  { node: <div className="bg-gradient-to-r from-accent-cyan to-accent-violet bg-clip-text font-display text-[48px] font-bold tracking-[-0.03em] text-transparent">256-bit</div>, label: "End-to-end encryption" },
  { node: <CountUp target={99.9} suffix="%" decimals={1} />, label: "Uptime, always available" },
];

export function Stats() {
  return (
    <section className="relative z-[2] mx-auto max-w-[1180px] px-6 pb-[70px] pt-[30px]">
      <Reveal>
        <div className="lq relative grid grid-cols-2 gap-5 overflow-hidden rounded-[24px] px-[30px] py-[46px] md:grid-cols-4">
          <div className="absolute -top-[60px] left-[40%] h-[240px] w-[380px] rounded-full bg-[radial-gradient(circle,rgba(78,205,196,0.2),transparent_65%)] blur-[34px]" />
          {stats.map((s, i) => (
            <div key={i} className="relative text-center">
              <div className="flex justify-center">{s.node}</div>
              <div className="mt-2 text-sm text-white/[0.52]">{s.label}</div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
