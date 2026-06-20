"use client";

import { motion } from "framer-motion";
import type { BillingInterval } from "@/lib/types";
import type { Plan } from "@/lib/config/plans";
import { yearlySavingsPercent } from "@/lib/config/plans";
import { Badge } from "@/components/atoms/Badge";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  plan: Plan;
  interval: BillingInterval;
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true">
      <circle cx="10" cy="10" r="9" className="fill-accent-cyan/15" />
      <path
        d="M6 10.5l2.5 2.5L14 7"
        fill="none"
        stroke="#4ECDC4"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PricingCard({ plan, interval }: PricingCardProps) {
  const price = plan.price[interval];
  const savings = yearlySavingsPercent(plan);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "relative flex flex-col rounded-card p-7",
        plan.highlighted
          ? "glass-strong border-accent-violet/40 shadow-glow-violet"
          : "glass"
      )}
    >
      {plan.highlighted && (
        <div className="pointer-events-none absolute -inset-px -z-10 rounded-card bg-accent-gradient opacity-20 blur-md" />
      )}

      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">{plan.name}</h3>
        {plan.badge && <Badge variant="gradient">{plan.badge}</Badge>}
      </div>

      <p className="mb-5 min-h-[40px] text-sm text-text-secondary">
        {plan.tagline}
      </p>

      <div className="mb-1 flex items-end gap-1">
        <span className="text-4xl font-bold text-white">${price}</span>
        {price > 0 && (
          <span className="mb-1 text-sm text-text-secondary">
            /{interval === "yearly" ? "year" : "month"}
          </span>
        )}
      </div>
      <div className="mb-6 h-5 text-xs text-accent-cyan">
        {interval === "yearly" && savings > 0 && `Save ${savings}% vs monthly`}
      </div>

      <a
        href="#get-started"
        className={cn(
          "inline-flex h-13 w-full items-center justify-center rounded-btn py-3.5 text-base font-semibold transition-all duration-300",
          plan.highlighted
            ? "btn-gradient"
            : "glass text-white hover:bg-white/[0.08] hover:border-white/20"
        )}
      >
        {plan.cta}
      </a>

      <ul className="mt-7 space-y-3">
        {plan.features.map((f) => (
          <li key={f} className="flex gap-2.5 text-sm text-white/85">
            <CheckIcon />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
