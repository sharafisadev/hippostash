"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Footer } from "@/components/organisms/Footer";
import { HUBS } from "@/lib/hubs";

export interface HubContentSection {
  id: string;
  content: React.ReactNode;
}

interface InfoHubProps {
  eyebrow: string;
  title: string;
  intro: string;
  /** All sections, in order, rendered on this single page. */
  sections: HubContentSection[];
}

/**
 * A single, stable page that presents every info section (Company / Resources /
 * Legal) with a sticky grouped side index. All navigation is in-page smooth
 * scroll — no route changes, so there are no height jumps or scroll glitches.
 */
export function InfoHub({ eyebrow, title, intro, sections }: InfoHubProps) {
  const [active, setActive] = useState(sections[0]?.id ?? "");
  // Ignore scroll-spy briefly after a click so the indicator jumps straight to
  // the target instead of chasing every section it scrolls past.
  const lockUntil = useRef(0);

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => !!el);
    if (!els.length) return;

    let raf = 0;
    const compute = () => {
      raf = 0;
      if (Date.now() < lockUntil.current) return;
      const offset = 140;
      let id = els[0]!.id;
      for (const el of els) {
        if (el.getBoundingClientRect().top - offset <= 0) id = el.id;
      }
      setActive(id);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [sections]);

  // Land on the right section when arriving with a hash.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id && document.getElementById(id)) {
      requestAnimationFrame(() =>
        document.getElementById(id)?.scrollIntoView({ behavior: "auto", block: "start" })
      );
    }
  }, []);

  const select = (id: string) => {
    setActive(id);
    lockUntil.current = Date.now() + 900;
  };

  return (
    <div className="relative min-h-screen">
      {/* top bar */}
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
        <div className="lq mx-auto flex max-w-[1180px] items-center justify-between rounded-[18px] py-2.5 pl-4 pr-3 sm:rounded-[20px] sm:py-[11px] sm:pl-[22px] sm:pr-[14px]">
          <Link href="/" aria-label="Hippo Stash home" className="inline-flex items-center gap-2.5">
            <Image src="/hippo-icon.png" alt="" width={30} height={30} className="rounded-[8px]" />
            <span className="font-display text-[17px] font-bold tracking-[-0.02em] text-white sm:text-[19px]">Hippo Stash</span>
          </Link>
          <Link href="/" className="inline-flex items-center gap-1.5 rounded-[12px] border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/[0.08] sm:px-4">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M11 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Home
          </Link>
        </div>
      </header>

      <main className="relative z-[2] mx-auto max-w-[1080px] px-4 pb-24 pt-[104px] sm:px-6 sm:pt-[132px]">
        {/* hero */}
        <div className="mb-8 sm:mb-10">
          <div className="mb-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-accent-cyan sm:text-[13px]">{eyebrow}</div>
          <h1 className="m-0 max-w-[760px] font-display text-[clamp(30px,4.6vw,50px)] font-bold leading-[1.06] tracking-[-0.03em]">{title}</h1>
          <p className="mt-4 max-w-[680px] text-[16px] leading-[1.6] text-white/55 sm:mt-5 sm:text-[18px]">{intro}</p>
        </div>

        {/* mobile pill index */}
        <MobileIndex active={active} onSelect={select} />

        <div className="grid gap-9 lg:grid-cols-[232px_1fr] lg:gap-14">
          {/* desktop grouped side index */}
          <aside className="hidden lg:block">
            <nav className="sticky top-[110px] flex flex-col gap-6" aria-label="Section navigation">
              {HUBS.map((h) => (
                <div key={h.id}>
                  <div className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/35">{h.group}</div>
                  <ul className="flex flex-col gap-0.5">
                    {h.sections.map((s) => {
                      const isActive = active === s.id;
                      return (
                        <li key={s.id}>
                          <a
                            href={`#${s.id}`}
                            onClick={() => select(s.id)}
                            className={`relative flex items-center rounded-[10px] px-3 py-2 text-sm transition-colors ${
                              isActive ? "text-white" : "text-white/55 hover:text-white/85"
                            }`}
                          >
                            {isActive && (
                              <motion.span
                                layoutId="hub-active"
                                className="absolute inset-0 rounded-[10px] border border-accent-cyan/30 bg-accent-cyan/[0.12]"
                                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                              />
                            )}
                            <span className="relative">{s.label}</span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>
          </aside>

          {/* content */}
          <div className="min-w-0">
            <div className="flex flex-col gap-14">
              {sections.map((s) => (
                <section key={s.id} id={s.id} className="scroll-mt-[104px]">
                  {s.content}
                </section>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

/** Horizontal, scrollable index for small screens. */
function MobileIndex({ active, onSelect }: { active: string; onSelect: (id: string) => void }) {
  return (
    <div className="mb-7 lg:hidden">
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {HUBS.flatMap((h) => h.sections).map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            onClick={() => onSelect(s.id)}
            className={`flex-none rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
              active === s.id
                ? "border-accent-cyan/40 bg-accent-cyan/[0.14] text-accent-cyan"
                : "border-white/10 bg-white/[0.04] text-white/65"
            }`}
          >
            {s.label}
          </a>
        ))}
      </div>
    </div>
  );
}

/** A top-level section inside the info page. */
export function HubSection({ title, lead, updated, children }: { title: string; lead?: string; updated?: string; children?: React.ReactNode }) {
  return (
    <div>
      <h2 className="m-0 font-display text-[clamp(23px,3vw,32px)] font-bold tracking-[-0.02em] text-white">{title}</h2>
      {updated && <p className="mt-2 text-sm text-white/35">Last updated: {updated}</p>}
      {lead && <p className="mt-4 text-[16px] leading-[1.65] text-white/60 sm:text-[17px]">{lead}</p>}
      {children && <div className="mt-6 flex flex-col gap-7">{children}</div>}
    </div>
  );
}

/** A sub-point within a section. */
export function Sub({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="m-0 mb-2 font-display text-[18px] font-semibold tracking-[-0.01em] text-white">{title}</h3>
      <div className="flex flex-col gap-3 text-[15px] leading-[1.75] text-white/65">{children}</div>
    </div>
  );
}
