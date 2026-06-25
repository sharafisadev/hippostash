"use client";

import { useState } from "react";
import { Reveal } from "@/components/molecules/Reveal";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { cn } from "@/lib/utils";

type Interval = "monthly" | "yearly";

// Stripe Payment Links per plan + billing interval. Paste the live URLs here.
// Leave blank to show a "checkout coming soon" message instead of redirecting.
const STRIPE_LINKS: Record<string, Record<Interval, string>> = {
  Pro:      { monthly: "", yearly: "" },
  Business: { monthly: "", yearly: "" },
};

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
    blurb: "Get your essential documents organized — free forever, no card.",
    cta: "Get Started Free",
    features: [
      { label: "1 GB secure storage", on: true },
      { label: "10 conversions / day", on: true },
      { label: "Smart preview & search", on: true },
      { label: "PDF, JPG, PNG & WEBP", on: true },
      { label: "AI image upscaling", on: false },
    ],
  },
  {
    name: "Pro",
    price: { monthly: "$9", yearly: "$79" },
    period: true,
    blurb: "Unlimited convert & store for power users who do it daily.",
    cta: "Start Pro",
    popular: true,
    features: [
      { label: "25 GB secure storage", on: true },
      { label: "Unlimited conversions", on: true },
      { label: "All file types & formats", on: true },
      { label: "AI image upscaling", on: true },
      { label: "Batch convert & merge", on: true },
      { label: "Priority support", on: true },
    ],
  },
  {
    name: "Business",
    price: { monthly: "$29", yearly: "$249" },
    period: true,
    blurb: "Everything in Pro, plus team sharing and API access at scale.",
    cta: "Start Business",
    features: [
      { label: "100 GB secure storage", on: true },
      { label: "Everything in Pro", on: true },
      { label: "Team sharing, up to 5 seats", on: true },
      { label: "API access", on: true },
      { label: "Dedicated support", on: true },
    ],
  },
];

export function PricingSection() {
  const [interval, setInterval] = useState<Interval>("monthly");
  const { user, open } = useAuth();
  const { toast } = useToast();

  function selectPlan(t: Tier) {
    // Free plan: just send them into the product (sign up if needed).
    if (!t.period) {
      if (user) document.getElementById("storage")?.scrollIntoView({ behavior: "smooth", block: "start" });
      else open("register", { plan: t.name });
      return;
    }

    const link = STRIPE_LINKS[t.name]?.[interval];

    if (user) {
      // Already signed in → straight to payment, never the sign-in modal again.
      if (link) window.location.href = link;
      else toast("Secure checkout is being set up — we'll have it live shortly!", "info");
      return;
    }

    // Not signed in → create the account first, then continue to checkout.
    if (link) sessionStorage.setItem("pendingCheckout", link);
    open("register", { plan: t.name });
  }

  return (
    <section id="pricing" className="relative z-[2] mx-auto max-w-[1180px] px-4 sm:px-6 pb-[70px] pt-[50px]">
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
                  onClick={() => selectPlan(t)}
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
