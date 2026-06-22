"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/atoms/Logo";
import { useAuth } from "@/components/providers/AuthProvider";

const links = [
  { href: "#features", label: "Features" },
  { href: "#formats", label: "Formats" },
  { href: "#convert", label: "Convert" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, open: openAuth, signOut } = useAuth();

  return (
    <header className="fixed left-1/2 top-[18px] z-[60] w-[calc(100%-48px)] max-w-[1180px] -translate-x-1/2">
      <nav className="lq flex items-center justify-between rounded-[20px] py-[11px] pl-[22px] pr-[14px]">
        <Logo href="#top" />

        <div className="hidden items-center gap-[30px] md:flex">
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
              <span className="max-w-[160px] truncate px-1 text-sm text-white/70">
                {user.email}
              </span>
              <button
                onClick={() => signOut()}
                className="lq rounded-[13px] px-[18px] py-2.5 text-sm font-semibold text-white"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => openAuth("login")}
                className="px-1 py-2 text-sm font-medium text-white/60 transition-colors hover:text-white"
              >
                Sign in
              </button>
              <button
                onClick={() => openAuth("register")}
                className="btn-primary animate-grad-move inline-flex items-center gap-[7px] rounded-[13px] px-[18px] py-2.5 text-sm"
              >
                Get Started
              </button>
            </>
          )}
        </div>

        <button
          className="grid h-9 w-9 place-items-center rounded-[10px] text-white md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" /> : <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />}
          </svg>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="lq mt-2 rounded-[18px] p-3 md:hidden"
          >
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-[10px] px-3 py-2.5 text-sm text-white/60 hover:bg-white/5 hover:text-white"
              >
                {l.label}
              </a>
            ))}
            <button
              onClick={() => { setOpen(false); openAuth("register"); }}
              className="btn-primary mt-2 block w-full rounded-[10px] px-3 py-2.5 text-center text-sm"
            >
              Get Started
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
