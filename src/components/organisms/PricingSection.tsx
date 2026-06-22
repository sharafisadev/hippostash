"use client";

import { useState } from "react";
import { Reveal } from "@/components/molecules/Reveal";
import { useAuth } from "@/components/providers/AuthProvider";
import { cn } from "@/lib/utils";

type Interval = "monthly" | "yearly";

interface Tier {
  name: string;
  price: { monthly: string; yearly: string };
  period: boolean; // false = "/forever"
  blurb: string;
  cta: string;
  popular?: boolean;
  features: { label: string; on: boolean }[];
}

const tiers: Tier[] = [
  {
    name: "Free",
    price: { monthly: "$0", yearly: "$0" },
    period: false,
    blurb: "For getting your essential documents in order.",
    cta: "Get Started Free",
    features: [
      { label: "1GB secure storage", on: true },
      { label: "Up to 50 files", on: true },
      { label: "PDF, JPG & PNG", on: true },
      { label: "No conversions", on: false },
    ],
  },
  {
    name: "Pro",
    price: { monthly: "$9", yearly: "$79" },
    period: true,
    blurb: "For power users who store and convert daily.",
    cta: "Start Pro",
    popular: true,
    features: [
      { label: "25GB secure storage", on: true },
      { label: "Unlimited files", on: true },
      { label: "All file types", on: true },
      { label: "50 conversions / month", on: true },
      { label: "Priority support", on: true },
    ],
  },
  {
    name: "Business",
    price: { monthly: "$29", yearly: "$249" },
    period: true,
    blurb: "For teams that share documents securely.",
    cta: "Start Business",
    features: [
      { label: "100GB secure storage", on: true },
      { label: "Unlimited files & conversions", on: true },
      { label: "Team sharing, up to 5 users", on: true },
      { label: "API access", on: true },
      { label: "Dedicated support", on: true },
    ],
  },
];

export function PricingSection() {
  const [interval, setInterval] = useState<Interval>("monthly");
  const { open } = useAuth();

  return (
    <section id="pricing" className="relative z-[2] mx-auto max-w-[1180px] px-6 pb-[70px] pt-[50px]">
      <Reveal className="mb-[38px] text-center">
        <div className="mb-4 text-[13px] font-semibold uppercase tracking-[0.14em] text-accent-cyan">
          Pricing
        </div>
        <h2 className="m-0 mb-[26px] font-display text-[clamp(32px,4.4vw,52px)] font-bold leading-[1.05] tracking-[-0.03em]">
          Simple plans that grow with you.
        </h2>

        {/* toggle */}
        <div className="lq inline-flex items-center gap-1 rounded-[14px] p-[5px]">
          {(["monthly", "yearly"] as const).map((m) => {
            const on = interval === m;
            return (
              <button
                key={m}
                onClick={() => setInterval(m)}
                className={cn(
                  "rounded-[10px] px-5 py-[9px] text-sm transition-all",
                  on ? "btn-primary" : "bg-transparent font-semibold text-white/60"
                )}
              >
                {m === "monthly" ? "Monthly" : (
                  <>
                    Yearly <span className="font-bold text-accent-cyan">−27%</span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </Reveal>

      <div className="grid items-start gap-5 md:grid-cols-3">
        {tiers.map((t) => (
          <Reveal key={t.name} className="h-full">
            <div
              className={cn(
                "glow-card lq relative h-full overflow-hidden rounded-[22px] p-8",
                t.popular ? "border-accent-violet/45" : "hover:border-white/20"
              )}
            >
              {t.popular && (
                <div className="pointer-events-none absolute -inset-0.5 overflow-hidden rounded-[22px] opacity-45">
                  <div className="absolute left-1/2 top-1/2 h-[170%] w-[170%] -translate-x-1/2 -translate-y-1/2 animate-spin blur-[7px] [background:conic-gradient(from_0deg,rgba(78,205,196,0.7),rgba(155,89,182,0.7),rgba(59,130,246,0.5),rgba(78,205,196,0.7))]" />
                </div>
              )}
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className={cn("font-display text-[15px] font-semibold", t.popular ? "text-white" : "text-white/70")}>
                    {t.name}
                  </div>
                  {t.popular && (
                    <span className="btn-primary rounded-full px-3 py-[5px] text-[11px] font-extrabold uppercase tracking-[0.04em]">
                      Most Popular
                    </span>
                  )}
                </div>

                <div className="mb-1.5 mt-[18px] flex items-end gap-1.5">
                  <span className="font-display text-[48px] font-bold tracking-[-0.03em]">
                    {t.price[interval]}
                  </span>
                  <span className="mb-2.5 text-[15px] text-white/45">
                    {t.period ? (interval === "yearly" ? "/year" : "/month") : "/forever"}
                  </span>
                </div>
                <p className="m-0 mb-6 text-sm text-white/[0.48]">{t.blurb}</p>

                <button
                  onClick={() => open("register", { plan: t.name })}
                  className={cn(
                    "mb-[26px] block w-full rounded-[12px] py-[13px] text-center text-[15px] font-semibold text-white",
                    t.popular ? "btn-primary !text-[#0b0b14]" : "lq"
                  )}
                >
                  {t.cta}
                </button>

                <div className="flex flex-col gap-[13px]">
                  {t.features.map((f) => (
                    <div
                      key={f.label}
                      className={cn("flex gap-[11px] text-sm", f.on ? "text-white/80" : "text-white/35")}
                    >
                      <span className={f.on ? "text-accent-cyan" : ""}>{f.on ? "✓" : "–"}</span>
                      {f.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
