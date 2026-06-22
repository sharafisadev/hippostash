"use client";

import { Reveal, StaggerGroup, StaggerItem } from "@/components/molecules/Reveal";
import { FileGlyph } from "@/components/atoms/FileGlyph";

const FORMATS = [
  "PDF", "DOCX", "XLSX", "PPTX", "JPG", "PNG",
  "WEBP", "SVG", "HEIC", "CSV", "MP4", "ZIP",
];

export function FormatsMarquee() {
  return (
    <section id="formats" className="relative z-[2] mx-auto max-w-[1080px] px-4 sm:px-6 py-24">
      <Reveal className="mx-auto mb-14 max-w-[640px] text-center">
        {/* clean static badge */}
        <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-[14px] py-2 backdrop-blur-md">
          <span className="flex -space-x-1.5">
            {["#E74C3C", "#3B82F6", "#22C55E", "#9B59B6", "#4ECDC4"].map((c) => (
              <span key={c} className="h-3.5 w-3.5 rounded-full ring-2 ring-bg" style={{ background: c }} />
            ))}
          </span>
          <span className="text-[13px] font-semibold tracking-tight text-white/90">
            Works with everything
          </span>
        </div>

        <h2 className="m-0 font-display text-[clamp(38px,5.4vw,68px)] font-bold leading-[1.02] tracking-[-0.04em]">
          One stash for{" "}
          <span className="bg-gradient-to-r from-accent-cyan to-accent-violet bg-clip-text font-semibold italic text-transparent">
            every
          </span>{" "}
          file format.
        </h2>
        <p className="mx-auto mt-5 max-w-[460px] text-[17px] leading-[1.55] text-white/50">
          Store, preview and convert{" "}
          <span className="font-semibold text-white/[0.88]">12+ file types</span>{" "}
          — without a single extra app.
        </p>
      </Reveal>

      {/* clean static grid */}
      <StaggerGroup className="grid grid-cols-3 gap-3.5 sm:grid-cols-4 md:grid-cols-6">
        {FORMATS.map((f) => (
          <StaggerItem key={f}>
            <div className="group lq glow-card flex flex-col items-center gap-3.5 rounded-[18px] py-7 transition-colors duration-300 hover:border-white/20">
              <div className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-[1.06]">
                <FileGlyph format={f} size={48} showLabel={false} />
              </div>
              <span className="text-[13px] font-semibold tracking-wide text-white/70 transition-colors group-hover:text-white">
                {f}
              </span>
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>

      <p className="mt-8 text-center text-sm text-white/35">
        …and more added every month.
      </p>
    </section>
  );
}
