"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/atoms/Logo";
import { useAuth } from "@/components/providers/AuthProvider";

const links = [
  { href: "#features", label: "Features" },
  { href: "#convert", label: "Convert" },
  { href: "#storage", label: "Storage" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, open: openAuth, signOut } = useAuth();

  // lock body scroll while the full-screen menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="fixed left-1/2 top-[14px] z-[60] w-[calc(100%-32px)] max-w-[1180px] -translate-x-1/2 sm:top-[18px] sm:w-[calc(100%-48px)]">
        <nav className="lq flex items-center justify-between rounded-[18px] py-2.5 pl-4 pr-2.5 sm:rounded-[20px] sm:py-[11px] sm:pl-[22px] sm:pr-[14px]">
          <Logo href="#top" />

          <div className="hidden items-center gap-7 md:flex lg:gap-[30px]">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-white/60 transition-colors hover:text-white"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-2.5 md:flex">
            {user ? (
              <>
                <a href="#storage" className="btn-primary inline-flex items-center gap-1.5 rounded-[13px] px-[18px] py-2.5 text-sm">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" /></svg>
                  My Stash
                </a>
                <button onClick={() => signOut()} className="lq rounded-[13px] px-[18px] py-2.5 text-sm font-semibold text-white">
                  Sign out
                </button>
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
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          </button>
        </nav>
      </header>

      {/* full-screen mobile menu (sibling of header → fixed covers viewport) */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[80] md:hidden"
          >
            <div className="absolute inset-0 bg-bg/95 backdrop-blur-2xl" />
            <div className="grid-dots pointer-events-none absolute inset-0 opacity-40" />

            <motion.div
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex h-full flex-col px-6 pb-10 pt-[22px]"
            >
              <div className="flex items-center justify-between">
                <Logo href="#top" />
                <button
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="grid h-10 w-10 place-items-center rounded-full text-white transition-colors hover:bg-white/10"
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" /></svg>
                </button>
              </div>

              <nav className="mt-12 flex flex-col">
                {links.map((l, i) => (
                  <motion.a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.06, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="border-b border-white/8 py-4 font-display text-[28px] font-bold tracking-[-0.02em] text-white"
                  >
                    {l.label}
                  </motion.a>
                ))}
              </nav>

              <div className="mt-auto flex flex-col gap-3">
                {user ? (
                  <>
                    <a href="#storage" onClick={() => setOpen(false)} className="btn-primary flex items-center justify-center gap-2 rounded-[14px] py-3.5 text-[15px]">
                      Open My Stash
                    </a>
                    <button onClick={() => { setOpen(false); signOut(); }} className="lq rounded-[14px] py-3.5 text-[15px] font-semibold text-white">
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { setOpen(false); openAuth("register"); }} className="btn-primary rounded-[14px] py-3.5 text-[15px]">
                      Get Started Free
                    </button>
                    <button onClick={() => { setOpen(false); openAuth("login"); }} className="lq rounded-[14px] py-3.5 text-[15px] font-semibold text-white">
                      Sign in
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
