"use client";

import { Reveal } from "@/components/molecules/Reveal";

const steps = [
  {
    n: "01",
    grad: "linear-gradient(135deg,var(--a1),var(--a2))",
    glow: "rgba(78,205,196,0.26)",
    title: "Upload & auto-sort",
    body: "Drag in any document. Hippo Stash files it into the right smart folder instantly.",
  },
  {
    n: "02",
    grad: "linear-gradient(135deg,var(--a2),#3B82F6)",
    glow: "rgba(155,89,182,0.26)",
    title: "Preview & convert",
    body: "Open, annotate, then switch a file to any format you need with two taps.",
  },
  {
    n: "03",
    grad: "linear-gradient(135deg,#3B82F6,var(--a1))",
    glow: "rgba(59,130,246,0.26)",
    title: "Access anywhere",
    body: "Everything syncs across your devices — secure and ready the moment you need it.",
  },
];

export function HowItWorks() {
  return (
    <section className="relative z-[2] mx-auto max-w-[1180px] px-4 sm:px-6 py-12">
      <Reveal className="mb-[54px] text-center">
        <div className="mb-4 text-[13px] font-semibold uppercase tracking-[0.14em] text-accent-violet">
          How it works
        </div>
        <h2 className="m-0 font-display text-[clamp(32px,4.4vw,50px)] font-bold leading-[1.05] tracking-[-0.03em]">
          Three steps to a tidier life.
        </h2>
      </Reveal>

      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((s) => (
          <Reveal key={s.n} className="h-full">
            <div className="glow-card lq relative h-full overflow-hidden rounded-[22px] p-8">
              <div className="absolute -left-5 -top-[30px] h-[150px] w-[160px] rounded-full blur-[24px]" style={{ background: `radial-gradient(circle, ${s.glow}, transparent 65%)` }} />
              <div className="font-display text-[54px] font-extrabold leading-none text-transparent [background-clip:text] [-webkit-background-clip:text]" style={{ backgroundImage: s.grad }}>
                {s.n}
              </div>
              <h4 className="m-0 mb-2 mt-[18px] font-display text-[20px] font-semibold">{s.title}</h4>
              <p className="m-0 text-[15px] leading-[1.6] text-white/[0.52]">{s.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
