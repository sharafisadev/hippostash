"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Footer } from "@/components/organisms/Footer";
import { HUBS, getHub, type HubId } from "@/lib/hubs";

export interface HubContentSection {
  id: string;
  content: React.ReactNode;
}

interface InfoHubProps {
  current: HubId;
  eyebrow: string;
  title: string;
  intro: string;
  sections: HubContentSection[];
}

export function InfoHub({ current, eyebrow, title, intro, sections }: InfoHubProps) {
  const hub = getHub(current);
  const [active, setActive] = useState(sections[0]?.id ?? "");
  // Ignore scroll-spy briefly after a click so the indicator jumps straight to
  // the target instead of chasing every section it scrolls past.
  const lockUntil = useRef(0);

  // Scroll-spy: highlight the section nearest the top of the viewport.
  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => !!el);
    if (!els.length) return;

    let raf = 0;
    const compute = () => {
      raf = 0;
      if (Date.now() < lockUntil.current) return;
      const offset = 160; // clear the top bar
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

  const selectSection = (id: string) => {
    setActive(id);
    lockUntil.current = Date.now() + 900;
  };

  // Land on the right section when arriving with a hash.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id && document.getElementById(id)) {
      requestAnimationFrame(() =>
        document.getElementById(id)?.scrollIntoView({ behavior: "auto", block: "start" })
      );
    }
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* top bar */}
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
        <div className="lq mx-auto flex max-w-[1180px] items-center justify-between rounded-[18px] py-2.5 pl-4 pr-3 sm:rounded-[20px] sm:py-[11px] sm:pl-[22px] sm:pr-[14px]">
          <Link href="/" aria-label="Hippo Stash home" className="inline-flex items-center gap-2.5">
            <Image src="/hippo-icon.png" alt="" width={30} height={30} className="rounded-[8px]" />
            <span className="font-display text-[19px] font-bold tracking-[-0.02em] text-white">Hippo Stash</span>
          </Link>
          <Link href="/" className="inline-flex items-center gap-1.5 rounded-[12px] border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/[0.08]">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M11 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Home
          </Link>
        </div>
      </header>

      <main className="relative z-[2] mx-auto max-w-[1080px] px-4 pb-24 pt-[112px] sm:px-6 sm:pt-[136px]">
        {/* hero */}
        <div className="mb-9">
          <div className="mb-4 text-[13px] font-semibold uppercase tracking-[0.14em] text-accent-cyan">{eyebrow}</div>
          <h1 className="m-0 max-w-[760px] font-display text-[clamp(32px,4.6vw,50px)] font-bold leading-[1.05] tracking-[-0.03em]">{title}</h1>
          <p className="mt-5 max-w-[680px] text-[18px] leading-[1.6] text-white/55">{intro}</p>
        </div>

        {/* mobile group/section pills */}
        <MobileIndex current={current} active={active} onSelect={selectSection} />

        <div className="grid gap-10 lg:grid-cols-[232px_1fr] lg:gap-14">
          {/* desktop grouped side index */}
          <aside className="hidden lg:block">
            <nav className="sticky top-[120px] flex flex-col gap-6" aria-label="Section navigation">
              {HUBS.map((h) => {
                const isCurrent = h.id === current;
                return (
                  <div key={h.id}>
                    <div className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/35">{h.group}</div>
                    <ul className="flex flex-col gap-0.5">
                      {h.sections.map((s) => {
                        const isActive = isCurrent && active === s.id;
                        const href = isCurrent ? `#${s.id}` : `${h.route}#${s.id}`;
                        return (
                          <li key={s.id}>
                            <Link
                              href={href}
                              onClick={() => isCurrent && selectSection(s.id)}
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
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </nav>
          </aside>

          {/* content */}
          <div className="min-w-0 scroll-smooth">
            <div className="flex flex-col gap-12">
              {sections.map((s) => (
                <section key={s.id} id={s.id} className="scroll-mt-[120px]">
                  {s.content}
                </section>
              ))}
            </div>

            {/* onward nav */}
            <OnwardNav current={current} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

/** Horizontal, scrollable index for small screens. */
function MobileIndex({ current, active, onSelect }: { current: HubId; active: string; onSelect: (id: string) => void }) {
  const hub = getHub(current);
  return (
    <div className="mb-8 lg:hidden">
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {hub.sections.map((s) => (
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
        {HUBS.filter((h) => h.id !== current).map((h) => (
          <Link
            key={h.id}
            href={`${h.route}`}
            className="flex-none rounded-full border border-white/10 bg-white/[0.02] px-3.5 py-1.5 text-[13px] font-medium text-white/45 transition-colors hover:text-white/75"
          >
            {h.group} →
          </Link>
        ))}
      </div>
    </div>
  );
}

/** "Explore more" cards linking to the other hubs. */
function OnwardNav({ current }: { current: HubId }) {
  const others = HUBS.filter((h) => h.id !== current);
  return (
    <div className="mt-16 border-t border-white/[0.08] pt-8">
      <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/35">Explore more</div>
      <div className="grid gap-3 sm:grid-cols-2">
        {others.map((h) => (
          <Link
            key={h.id}
            href={h.route}
            className="lq group flex items-center justify-between rounded-[16px] px-5 py-4 transition-colors hover:border-accent-cyan/40"
          >
            <span>
              <span className="block text-sm font-semibold text-white">{h.group}</span>
              <span className="block text-xs text-white/45">{h.sections.map((s) => s.label).join(" · ")}</span>
            </span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-none text-white/40 transition-transform group-hover:translate-x-1 group-hover:text-accent-cyan"><path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
        ))}
      </div>
    </div>
  );
}

/** A top-level section inside a hub. */
export function HubSection({ title, lead, updated, children }: { title: string; lead?: string; updated?: string; children?: React.ReactNode }) {
  return (
    <div>
      <h2 className="m-0 font-display text-[clamp(24px,3vw,32px)] font-bold tracking-[-0.02em] text-white">{title}</h2>
      {updated && <p className="mt-2 text-sm text-white/35">Last updated: {updated}</p>}
      {lead && <p className="mt-4 text-[17px] leading-[1.65] text-white/60">{lead}</p>}
      {children && <div className="mt-6 flex flex-col gap-7">{children}</div>}
    </div>
  );
}

/** A sub-point within a hub section. */
export function Sub({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="m-0 mb-2 font-display text-[18px] font-semibold tracking-[-0.01em] text-white">{title}</h3>
      <div className="flex flex-col gap-3 text-[15px] leading-[1.75] text-white/65">{children}</div>
    </div>
  );
}
