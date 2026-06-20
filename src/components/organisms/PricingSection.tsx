"use client";

import { useState } from "react";
import type { BillingInterval } from "@/lib/types";
import { PLAN_LIST } from "@/lib/config/plans";
import { BillingToggle } from "@/components/molecules/BillingToggle";
import { PricingCard } from "@/components/molecules/PricingCard";
import { Reveal } from "@/components/molecules/Reveal";

export function PricingSection() {
  const [interval, setInterval] = useState<BillingInterval>("monthly");

  return (
    <section id="pricing" className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-text-secondary">
            Start free. Upgrade when you need more room and conversions.
          </p>
        </Reveal>

        <div className="mt-8 flex justify-center">
          <BillingToggle value={interval} onChange={setInterval} />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {PLAN_LIST.map((plan) => (
            <PricingCard key={plan.id} plan={plan} interval={interval} />
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-text-secondary">
          Prices in USD. Cancel anytime.
        </p>
      </div>
    </section>
  );
}
