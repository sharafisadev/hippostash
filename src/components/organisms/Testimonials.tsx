"use client";

import { Reveal } from "@/components/molecules/Reveal";

const items = [
  {
    stars: "var(--a1)",
    glow: "rgba(78,205,196,0.26)",
    side: "left",
    quote:
      "I stopped losing track of bills and IDs entirely. Everything I need is one search away, and converting a scan to PDF takes a second.",
    name: "Nadia Rahman",
    role: "Operations Lead, Northwind",
    avatar: "linear-gradient(135deg,var(--a1),var(--a2))",
  },
  {
    stars: "var(--a2)",
    glow: "rgba(155,89,182,0.28)",
    side: "right",
    quote:
      "Hippo Stash dramatically sped up how our team handles paperwork. Storing, finding and sharing documents finally feels effortless.",
    name: "Marcus Peters",
    role: "VP Finance, Lumen·co",
    avatar: "linear-gradient(135deg,var(--a2),#3B82F6)",
  },
];

export function Testimonials() {
  return (
    <section className="relative z-[2] mx-auto max-w-[1180px] px-4 sm:px-6 py-[46px]">
      <Reveal className="mb-[46px] text-center">
        <div className="mb-4 text-[13px] font-semibold uppercase tracking-[0.14em] text-accent-violet">
          Loved by tidy minds
        </div>
        <h2 className="m-0 font-display text-[clamp(30px,4vw,46px)] font-bold leading-[1.05] tracking-[-0.03em]">
          Hear it from real users.
        </h2>
      </Reveal>

      <div className="grid gap-5 md:grid-cols-2">
        {items.map((t) => (
          <Reveal key={t.name} className="h-full">
            <div className="glow-card lq relative h-full overflow-hidden rounded-[22px] p-[34px]">
              <div
                className={`absolute -top-[30px] ${t.side === "left" ? "-left-5" : "-right-5"} h-[180px] w-[200px] rounded-full blur-[26px]`}
                style={{ background: `radial-gradient(circle, ${t.glow}, transparent 65%)` }}
              />
              <div className="relative mb-4 flex gap-[3px]" style={{ color: t.stars }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <p className="relative m-0 mb-7 text-[19px] font-medium leading-[1.55] text-white/90">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="relative flex items-center gap-[13px]">
                <div className="h-[42px] w-[42px] rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]" style={{ background: t.avatar }} />
                <div>
                  <div className="font-display text-[15px] font-semibold">{t.name}</div>
                  <div className="text-[13px] text-white/45">{t.role}</div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
