import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/components/organisms/Footer";

interface PageShellProps {
  eyebrow?: string;
  title: string;
  intro?: string;
  updated?: string;
  children: React.ReactNode;
}

export function PageShell({ eyebrow, title, intro, updated, children }: PageShellProps) {
  return (
    <div className="relative min-h-screen">
      {/* simple top bar */}
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

      <main className="relative z-[2] mx-auto max-w-[780px] px-4 pb-24 pt-[128px] sm:px-6 sm:pt-[150px]">
        {eyebrow && (
          <div className="mb-4 text-[13px] font-semibold uppercase tracking-[0.14em] text-accent-cyan">
            {eyebrow}
          </div>
        )}
        <h1 className="m-0 font-display text-[clamp(34px,5vw,52px)] font-bold leading-[1.05] tracking-[-0.03em]">
          {title}
        </h1>
        {intro && <p className="mt-5 text-[18px] leading-[1.6] text-white/55">{intro}</p>}
        {updated && <p className="mt-3 text-sm text-white/35">Last updated: {updated}</p>}

        <div className="mt-10 flex flex-col gap-9">{children}</div>
      </main>

      <Footer />
    </div>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="m-0 mb-3 font-display text-[22px] font-bold tracking-[-0.01em] text-white">
        {title}
      </h2>
      <div className="flex flex-col gap-3 text-[15px] leading-[1.75] text-white/65">{children}</div>
    </section>
  );
}
