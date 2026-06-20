"use client";

import { Reveal } from "@/components/molecules/Reveal";
import { LinkButton } from "@/components/atoms/Button";
import { GlowOrb } from "@/components/atoms/GlowOrb";

export function CTABanner() {
  return (
    <section className="px-4 py-20">
      <Reveal className="mx-auto max-w-5xl">
        <div className="glass-strong relative overflow-hidden rounded-card px-6 py-16 text-center">
          <GlowOrb color="cyan" size={320} className="-left-10 top-0" />
          <GlowOrb color="violet" size={340} className="-right-10 bottom-0" />
          <h2 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to Begin?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-text-secondary">
            Start managing your documents now — it&apos;s free to get started.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <LinkButton href="#get-started" variant="gradient" size="lg">
              Get Started
            </LinkButton>
            <LinkButton href="#pricing" variant="glass" size="lg">
              View Pricing
            </LinkButton>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
