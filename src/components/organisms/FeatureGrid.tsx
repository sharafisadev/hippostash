"use client";

import { Reveal } from "@/components/molecules/Reveal";
import { FileGlyph } from "@/components/atoms/FileGlyph";

function Eyebrow({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <div className="mb-4 text-[13px] font-semibold uppercase tracking-[0.14em]" style={{ color }}>
      {children}
    </div>
  );
}

const small = [
  {
    title: "Smart Preview",
    body: "Zoom, rotate and annotate PDFs, images and docs without ever downloading them.",
    color: "#7db4f7",
    bg: "rgba(59,130,246,0.16)",
    border: "rgba(59,130,246,0.3)",
    icon: (
      <>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
  },
  {
    title: "Bank-grade Security",
    body: "256-bit encryption, biometric lock and two-factor auth keep sensitive documents private.",
    color: "#c084d6",
    bg: "rgba(155,89,182,0.18)",
    border: "rgba(155,89,182,0.35)",
    icon: (
      <>
        <path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-4z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
  },
  {
    title: "Synced Everywhere",
    body: "Reach for any document from any device — your stash stays in sync, automatically.",
    color: "#4ECDC4",
    bg: "rgba(78,205,196,0.16)",
    border: "rgba(78,205,196,0.32)",
    icon: <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />,
  },
];

export function FeatureGrid() {
  return (
    <section id="features" className="relative z-[2] mx-auto max-w-[1180px] px-6 py-12">
      <Reveal className="mb-[52px] text-center">
        <Eyebrow color="var(--a1)">Features</Eyebrow>
        <h2 className="mx-auto max-w-[680px] font-display text-[clamp(32px,4.4vw,52px)] font-bold leading-[1.05] tracking-[-0.03em]">
          Everything your documents need, in one place.
        </h2>
      </Reveal>

      {/* two big cards */}
      <div className="grid gap-5 md:grid-cols-2">
        <Reveal className="h-full">
          <div className="glow-card lq relative flex min-h-[360px] flex-col overflow-hidden rounded-[24px] p-[34px] hover:border-accent-cyan/45">
            <div className="absolute -left-[30px] -top-10 h-[300px] w-[320px] animate-pulse-glow rounded-full bg-[radial-gradient(circle,rgba(78,205,196,0.4),transparent_64%)] blur-[34px]" />
            <div className="relative flex gap-[13px]">
              {["PDF", "DOCX", "XLSX"].map((f, i) => (
                <div key={f} style={{ animationDelay: `${i * 0.4}s` }} className="animate-bob">
                  <FileGlyph format={f} size={52} showLabel={false} />
                </div>
              ))}
            </div>
            <div className="relative mt-[70px]">
              <Eyebrow color="rgba(255,255,255,0.42)">Store &amp; Organize</Eyebrow>
              <h3 className="m-0 mb-3 font-display text-[27px] font-semibold tracking-[-0.02em]">
                Every file, neatly stashed
              </h3>
              <p className="m-0 max-w-[420px] text-[16px] leading-[1.6] text-white/55">
                Papers, IDs, bills and certificates organized into smart folders
                you can find in a heartbeat.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal className="h-full">
          <div className="glow-card lq relative flex min-h-[360px] flex-col overflow-hidden rounded-[24px] p-[34px] hover:border-accent-violet/50">
            <div className="absolute -right-[30px] -top-10 h-[300px] w-[320px] animate-pulse-glow rounded-full bg-[radial-gradient(circle,rgba(155,89,182,0.42),transparent_64%)] blur-[34px]" />
            <div className="relative flex items-center gap-3.5">
              <div className="rounded-[12px] border border-file-pdf/35 bg-file-pdf/[0.12] px-4 py-[11px] text-[13px] font-bold text-[#ff8077] shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
                report.pdf
              </div>
              <svg width="40" height="22" viewBox="0 0 40 22" fill="none">
                <path d="M2 11h30" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeDasharray="3 3" />
                <path d="M28 4l8 7-8 7" stroke="var(--a1)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="rounded-[12px] border border-accent-blue/40 bg-accent-blue/[0.14] px-4 py-[11px] text-[13px] font-bold text-[#7db4f7] shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
                report.docx
              </div>
            </div>
            <div className="relative mt-auto pt-[118px]">
              <Eyebrow color="rgba(255,255,255,0.42)">Convert with Ease</Eyebrow>
              <h3 className="m-0 mb-3 font-display text-[27px] font-semibold tracking-[-0.02em]">
                Any format, in seconds
              </h3>
              <p className="m-0 max-w-[420px] text-[16px] leading-[1.6] text-white/55">
                Turn a PDF into a DOC, an image into a PDF, and back again — no
                extra apps, no quality loss.
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      {/* three small cards */}
      <div className="mt-5 grid gap-5 md:grid-cols-3">
        {small.map((f) => (
          <Reveal key={f.title} className="h-full">
            <div className="glow-card lq relative h-full overflow-hidden rounded-[20px] p-7">
              <div className="absolute -right-[30px] -top-[30px] h-[170px] w-[180px] rounded-full blur-[26px]" style={{ background: `radial-gradient(circle, ${f.bg}, transparent 65%)` }} />
              <div
                className="relative mb-[18px] grid h-[46px] w-[46px] place-items-center rounded-[13px] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                style={{ background: f.bg, border: `1px solid ${f.border}` }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={f.color} strokeWidth="2">
                  {f.icon}
                </svg>
              </div>
              <h4 className="m-0 mb-2 font-display text-[19px] font-semibold">{f.title}</h4>
              <p className="m-0 text-[15px] leading-[1.55] text-white/[0.52]">{f.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
