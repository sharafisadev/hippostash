"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/atoms/Logo";
import { useAuth } from "@/components/providers/AuthProvider";
import { ProfileMenu } from "@/components/organisms/ProfileMenu";
import { cn } from "@/lib/utils";

const links = [
  { id: "features", label: "Features" },
  { id: "convert", label: "Convert" },
  { id: "storage", label: "Storage" },
  { id: "pricing", label: "Pricing" },
  { id: "faq", label: "FAQ" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const { user, open: openAuth, signOut } = useAuth();
  // While a click-initiated smooth scroll is in flight, ignore scroll-spy so
  // the indicator jumps straight to the target instead of chasing every
  // section it passes (which reads as shaking).
  const lockUntil = useRef(0);

  // scroll-spy: highlight the section currently in view
  useEffect(() => {
    const sections = links
      .map((l) => document.getElementById(l.id))
      .filter(Boolean) as HTMLElement[];
    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (Date.now() < lockUntil.current) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5] }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const selectLink = (id: string) => {
    setActive(id);
    lockUntil.current = Date.now() + 900;
  };

  return (
    <header className="fixed left-1/2 top-[14px] z-[60] w-[calc(100%-32px)] max-w-[1180px] -translate-x-1/2 sm:top-[18px] sm:w-[calc(100%-48px)]">
      <nav className="lq flex items-center justify-between rounded-[18px] border-white/10 !bg-transparent py-2.5 pl-4 pr-2.5 shadow-none sm:rounded-[20px] sm:py-[11px] sm:pl-[22px] sm:pr-[14px]">
        <Logo href="#top" />

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const on = active === l.id;
            return (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={() => selectLink(l.id)}
                className={cn(
                  "relative rounded-[10px] px-3.5 py-2 text-sm font-medium transition-colors",
                  on ? "text-white" : "text-white/55 hover:text-white"
                )}
              >
                {on && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 rounded-[10px] bg-white/[0.08]"
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
                {l.label}
              </a>
            );
          })}
        </div>

        <div className="hidden items-center gap-2.5 md:flex">
          {user ? (
            <>
              <a href="#storage" className="btn-primary inline-flex items-center gap-1.5 rounded-[13px] px-[18px] py-2.5 text-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" /></svg>
                My Stash
              </a>
              <ProfileMenu />
            </>
          ) : (
            <>
              <button onClick={() => openAuth("login")} className="px-1 py-2 text-sm font-medium text-white/60 transition-colors hover:text-white">
                Sign in
              </button>
              <button onClick={() => openAuth("register")} className="btn-primary animate-grad-move inline-flex items-center gap-[7px] rounded-[13px] px-[18px] py-2.5 text-sm">
                Get Started
              </button>
            </>
          )}
        </div>

        {/* burger */}
        <button
          className="grid h-9 w-9 place-items-center rounded-[10px] text-white md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" /> : <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />}
          </svg>
        </button>
      </nav>

      {/* mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="lq mt-2 origin-top rounded-[18px] p-2 md:hidden"
          >
            {links.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={() => { setOpen(false); selectLink(l.id); }}
                className={cn(
                  "block rounded-[12px] px-3.5 py-3 text-[16px] font-semibold transition-colors",
                  active === l.id ? "bg-white/[0.1] text-white" : "text-white/90 hover:bg-white/5 hover:text-white"
                )}
              >
                {l.label}
              </a>
            ))}
            <div className="my-1.5 h-px bg-white/[0.07]" />
            {user ? (
              <div className="grid gap-2 p-1">
                <a href="#storage" onClick={() => setOpen(false)} className="btn-primary rounded-[12px] py-3 text-center text-[15px]">Open My Stash</a>
                <button onClick={() => { setOpen(false); signOut(); }} className="rounded-[12px] border border-white/10 bg-white/[0.04] py-3 text-[15px] font-semibold text-white">Sign out</button>
              </div>
            ) : (
              <div className="grid gap-2 p-1">
                <button onClick={() => { setOpen(false); openAuth("register"); }} className="btn-primary rounded-[12px] py-3 text-[15px]">Get Started Free</button>
                <button onClick={() => { setOpen(false); openAuth("login"); }} className="rounded-[12px] border border-white/10 bg-white/[0.04] py-3 text-[15px] font-semibold text-white">Sign in</button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
