"use client";

import { Reveal, StaggerGroup, StaggerItem } from "@/components/molecules/Reveal";
import { GlassCard } from "@/components/molecules/GlassCard";

const features = [
  {
    title: "Store",
    body: "Save papers, IDs, bills, and certificates effortlessly with plenty of secure cloud space.",
    icon: (
      <path d="M4 7a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z" />
    ),
  },
  {
    title: "Convert",
    body: "Quickly convert your documents to PDF, JPG, PNG, DOC and back — in just a couple of clicks.",
    icon: <path d="M4 12a8 8 0 0 1 14-5m2-3v4h-4M20 12a8 8 0 0 1-14 5m-2 3v-4h4" />,
  },
  {
    title: "Preview",
    body: "Open and read any supported file instantly with zoom, rotate, and annotate tools.",
    icon: (
      <>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
  },
  {
    title: "Secure",
    body: "Bank-grade encryption, two-factor auth, and private storage keep your documents safe.",
    icon: (
      <>
        <path d="M12 3l7 3v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3Z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
  },
];

export function FeatureGrid() {
  return (
    <section id="features" className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything your documents need
          </h2>
          <p className="mt-4 text-text-secondary">
            One home for storing, converting, previewing, and protecting your
            most important files.
          </p>
        </Reveal>

        <StaggerGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <StaggerItem key={f.title}>
              <GlassCard hover className="h-full">
                <div className="mb-5 grid h-12 w-12 place-items-center rounded-btn bg-accent-gradient-soft text-accent-cyan">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {f.icon}
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {f.body}
                </p>
              </GlassCard>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
