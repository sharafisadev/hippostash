"use client";

import { motion } from "framer-motion";
import type { BillingInterval } from "@/lib/types";
import { cn } from "@/lib/utils";

interface BillingToggleProps {
  value: BillingInterval;
  onChange: (v: BillingInterval) => void;
}

const options: { id: BillingInterval; label: string }[] = [
  { id: "monthly", label: "Monthly" },
  { id: "yearly", label: "Yearly" },
];

export function BillingToggle({ value, onChange }: BillingToggleProps) {
  return (
    <div
      className="glass inline-flex items-center gap-1 rounded-pill p-1"
      role="tablist"
      aria-label="Billing interval"
    >
      {options.map((o) => {
        const active = value === o.id;
        return (
          <button
            key={o.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.id)}
            className="relative rounded-pill px-5 py-2 text-sm font-medium transition-colors"
          >
            {active && (
              <motion.span
                layoutId="billing-pill"
                className="absolute inset-0 rounded-pill bg-accent-gradient"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span
              className={cn(
                "relative z-10",
                active ? "text-white" : "text-text-secondary"
              )}
            >
              {o.label}
              {o.id === "yearly" && (
                <span className="ml-1.5 text-accent-cyan">–save</span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
