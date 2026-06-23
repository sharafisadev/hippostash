"use client";

import { useRouter } from "next/navigation";
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
  sections: HubContentSection[];
  /** The section currently being viewed (matches a section id in HUBS). */
  currentSection: string;
}

/** Which hub owns a given section id. */
const groupOf = (sectionId: string) =>
  HUBS.find((h) => h.sections.some((s) => s.id === sectionId)) ?? HUBS[0]!;

export function InfoHub({ eyebrow, title, intro, sections, currentSection }: InfoHubProps) {
  const router = useRouter();

  const currentGroup = groupOf(currentSection);
  const activeContent = sections.find((s) => s.id === currentSection) ?? sections[0]!;

  const navigate = (sectionId: string) => {
    router.push(`/company/${sectionId}`);
  };

  const switchTopic = (hubId: HubId) => {
    const hub = HUBS.find((h) => h.id === hubId)!;
    router.push(`/company/${hub.sections[0]!.id}`);
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
                  h.id === currentGroup.id
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
            {currentGroup.sections.map((s) => (
              <button
                key={s.id}
                onClick={() => navigate(s.id)}
                className={`flex-none rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${
                  currentSection === s.id ? "text-white" : "text-white/45"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-9 lg:grid-cols-[232px_1fr] lg:gap-14">
          {/* desktop topic + section index */}
          <aside className="hidden lg:block">
            <nav className="sticky top-[110px] flex flex-col gap-2" aria-label="Topics">
              {HUBS.map((h) => {
                const isCurrent = h.id === currentGroup.id;
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
                            const isActive = currentSection === s.id;
                            return (
                              <li key={s.id}>
                                <button
                                  onClick={() => navigate(s.id)}
                                  className={`relative flex w-full items-center rounded-[8px] px-3 py-1.5 text-left text-[13px] transition-colors ${
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
                                </button>
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

          {/* content — only the active section */}
          <div className="min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSection}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              >
                {activeContent.content}
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
