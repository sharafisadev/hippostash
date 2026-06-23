"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Footer } from "@/components/organisms/Footer";
import { HUBS, type HubId } from "@/lib/hubs";

export interface HubContentSection {
  id: string;
  content: React.ReactNode;
}

interface InfoHubProps {
  eyebrow: string;
  title: string;
  intro: string;
  /** Every section; the active topic decides which are shown. */
  sections: HubContentSection[];
}

/** Which topic owns a given section id. */
const groupOf = (sectionId: string): HubId =>
  HUBS.find((h) => h.sections.some((s) => s.id === sectionId))?.id ?? HUBS[0]!.id;

/**
 * Topic-switching info layout: Company / Resources / Legal each open their own
 * view inside the same shell. Only one topic is shown at a time — no continuous
 * scroll across everything.
 */
export function InfoHub({ eyebrow, title, intro, sections }: InfoHubProps) {
  const [groupId, setGroupId] = useState<HubId>(HUBS[0]!.id);
  const group = HUBS.find((h) => h.id === groupId)!;
  const [active, setActive] = useState(group.sections[0]!.id);
  const lockUntil = useRef(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const visibleSections = useMemo(() => {
    const ids = new Set(group.sections.map((s) => s.id));
    return sections.filter((s) => ids.has(s.id));
  }, [group, sections]);

  // Open the topic that owns the URL hash and scroll to it — on arrival and
  // whenever the hash changes (e.g. footer links while already on the page).
  useEffect(() => {
    const go = (smooth: boolean) => {
      const id = window.location.hash.slice(1);
      if (!id || !sections.some((s) => s.id === id)) return;
      setGroupId(groupOf(id));
      setActive(id);
      lockUntil.current = Date.now() + 1100;
      // The topic's content mounts after the exit animation, so poll until the
      // target section exists, then scroll to it.
      let tries = 0;
      const tryScroll = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
        } else if (tries++ < 50) {
          requestAnimationFrame(tryScroll);
        }
      };
      requestAnimationFrame(tryScroll);
    };
    go(false);
    const onHash = () => go(true);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [sections]);

  // Scroll-spy within the active topic only.
  useEffect(() => {
    const els = group.sections
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
  }, [group]);

  const switchTopic = (id: HubId) => {
    if (id === groupId) return;
    const g = HUBS.find((h) => h.id === id)!;
    setGroupId(id);
    setActive(g.sections[0]!.id);
    lockUntil.current = Date.now() + 700;
    // bring the topic's content into view without a jarring jump
    requestAnimationFrame(() => {
      const top = (contentRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY - 96;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    });
  };

  const selectSection = (id: string) => {
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

        {/* mobile topic switcher */}
        <div className="mb-7 lg:hidden">
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {HUBS.map((h) => (
              <button
                key={h.id}
                onClick={() => switchTopic(h.id)}
                className={`flex-none rounded-full border px-4 py-1.5 text-[13px] font-semibold transition-colors ${
                  h.id === groupId
                    ? "border-accent-cyan/45 bg-accent-cyan/[0.14] text-accent-cyan"
                    : "border-white/10 bg-white/[0.04] text-white/65"
                }`}
              >
                {h.group}
              </button>
            ))}
          </div>
          {/* sub-section pills for the active topic */}
          <div className="-mx-4 mt-2 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {group.sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={() => selectSection(s.id)}
                className={`flex-none rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${
                  active === s.id ? "text-white" : "text-white/45"
                }`}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div className="grid gap-9 lg:grid-cols-[232px_1fr] lg:gap-14">
          {/* desktop topic + section index */}
          <aside className="hidden lg:block">
            <nav className="sticky top-[110px] flex flex-col gap-2" aria-label="Topics">
              {HUBS.map((h) => {
                const isCurrent = h.id === groupId;
                return (
                  <div key={h.id}>
                    <button
                      onClick={() => switchTopic(h.id)}
                      aria-current={isCurrent ? "true" : undefined}
                      className={`flex w-full items-center justify-between rounded-[10px] px-3 py-2 text-left text-sm font-semibold transition-colors ${
                        isCurrent ? "bg-white/[0.06] text-white" : "text-white/55 hover:text-white/85"
                      }`}
                    >
                      {h.group}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform ${isCurrent ? "rotate-90 text-accent-cyan" : "text-white/30"}`}><path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                    <AnimatePresence initial={false}>
                      {isCurrent && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden pl-2"
                        >
                          {h.sections.map((s) => {
                            const isActive = active === s.id;
                            return (
                              <li key={s.id}>
                                <a
                                  href={`#${s.id}`}
                                  onClick={() => selectSection(s.id)}
                                  className={`relative flex items-center rounded-[8px] px-3 py-1.5 text-[13px] transition-colors ${
                                    isActive ? "text-white" : "text-white/50 hover:text-white/80"
                                  }`}
                                >
                                  {isActive && (
                                    <motion.span
                                      layoutId="hub-active"
                                      className="absolute inset-0 rounded-[8px] border border-accent-cyan/30 bg-accent-cyan/[0.12]"
                                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                                    />
                                  )}
                                  <span className="relative">{s.label}</span>
                                </a>
                              </li>
                            );
                          })}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>
          </aside>

          {/* content — only the active topic */}
          <div ref={contentRef} className="min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={groupId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-14"
              >
                {visibleSections.map((s) => (
                  <section key={s.id} id={s.id} className="scroll-mt-[104px]">
                    {s.content}
                  </section>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

/** A top-level section inside a topic. */
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
