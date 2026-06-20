"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/atoms/Logo";

const links = [
  { href: "#features", label: "Features" },
  { href: "#convert", label: "Convert" },
  { href: "#pricing", label: "Pricing" },
  { href: "#trust", label: "Security" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <nav className="glass-strong mx-auto flex max-w-6xl items-center justify-between rounded-pill px-4 py-2.5 shadow-card">
        <Logo href="#top" />
        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-btn px-3.5 py-2 text-sm text-text-secondary transition-colors hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </div>
        <div className="hidden md:flex">
          <a
            href="#pricing"
            className="btn-gradient rounded-btn px-5 py-2.5 text-sm"
          >
            Get Started
          </a>
        </div>

        <button
          className="grid h-9 w-9 place-items-center rounded-btn text-white md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="glass-strong mx-auto mt-2 max-w-6xl rounded-card p-3 md:hidden"
          >
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-btn px-3 py-2.5 text-sm text-text-secondary hover:bg-white/5 hover:text-white"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#pricing"
              onClick={() => setOpen(false)}
              className="btn-gradient mt-2 block rounded-btn px-3 py-2.5 text-center text-sm"
            >
              Get Started
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
