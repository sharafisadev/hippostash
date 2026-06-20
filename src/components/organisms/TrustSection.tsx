"use client";

import { Reveal } from "@/components/molecules/Reveal";
import { GlowOrb } from "@/components/atoms/GlowOrb";

const stats = [
  { value: "256-bit", label: "AES encryption at rest" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "2FA", label: "Two-factor authentication" },
  { value: "SOC 2", label: "Aligned controls" },
];

const quotes = [
  {
    quote:
      "Hippo Stash replaced three different apps for me. Everything I need is finally in one secure place.",
    name: "Amara O.",
    role: "Freelance Designer",
  },
  {
    quote:
      "The conversion tool alone is worth it. I move between PDF and images all day and it just works.",
    name: "Daniel K.",
    role: "Operations Lead",
  },
  {
    quote:
      "Clean, fast, and I never worry about my IDs and certificates getting lost again.",
    name: "Priya S.",
    role: "Small Business Owner",
  },
];

export function TrustSection() {
  return (
    <section id="trust" className="relative overflow-hidden px-4 py-24">
      <GlowOrb color="mixed" size={500} className="left-1/2 top-10 -translate-x-1/2" />
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Trusted with what matters most
          </h2>
          <p className="mt-4 text-text-secondary">
            Security isn&apos;t a feature — it&apos;s the foundation.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((s) => (
            <Reveal key={s.label}>
              <div className="glass rounded-card p-6 text-center">
                <p className="gradient-text text-2xl font-bold">{s.value}</p>
                <p className="mt-1 text-xs text-text-secondary">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {quotes.map((q) => (
            <Reveal key={q.name}>
              <figure className="glass h-full rounded-card p-6">
                <blockquote className="text-sm leading-relaxed text-white/85">
                  “{q.quote}”
                </blockquote>
                <figcaption className="mt-4 text-sm">
                  <span className="font-semibold text-white">{q.name}</span>
                  <span className="text-text-secondary"> · {q.role}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
