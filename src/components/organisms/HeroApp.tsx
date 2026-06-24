"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, animate, motion } from "framer-motion";
import { FileGlyph } from "@/components/atoms/FileGlyph";
import { useAuth } from "@/components/providers/AuthProvider";

// Files that cycle through the live "uploading" slot.
const UPLOADS = [
  { name: "passport-scan.jpg", fmt: "JPG", meta: "1.1 MB" },
  { name: "electric-bill.xlsx", fmt: "XLSX", meta: "88 KB" },
  { name: "lease-agreement.pdf", fmt: "PDF", meta: "2.4 MB" },
  { name: "tax-return-2024.pdf", fmt: "PDF", meta: "3.2 MB" },
];

const RECENT = [
  { name: "id-card.png", fmt: "PNG", meta: "640 KB" },
  { name: "invoice-q3.pdf", fmt: "PDF", meta: "1.8 MB" },
];

function go(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function CountUp({ to, decimals = 0, suffix = "" }: { to: number; decimals?: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const controls = animate(0, to, { duration: 1.6, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setVal(v) });
    return () => controls.stop();
  }, [to]);
  return <>{val.toFixed(decimals)}{suffix}</>;
}

export function HeroApp() {
  const { user, open } = useAuth();
  const gate = (reason: string) => (user ? go("storage") : open("login", { reason }));

  // ── Live upload cycle: fill 0→100, hold, advance to next file, repeat ──
  const [idx, setIdx] = useState(0);
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setPct((p) => (p >= 100 ? 100 : Math.min(100, p + 3))), 70);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    if (pct < 100) return;
    const t = setTimeout(() => { setIdx((i) => (i + 1) % UPLOADS.length); setPct(0); }, 1100);
    return () => clearTimeout(t);
  }, [pct]);
  const cur = UPLOADS[idx]!;
  const done = pct >= 100;

  return (
    <div className="relative">
      {/* Rotating gradient glow ring */}
      <div className="pointer-events-none absolute -inset-[1.5px] overflow-hidden rounded-[26px] opacity-70">
        <div className="absolute left-1/2 top-1/2 h-[220%] w-[220%] -translate-x-1/2 -translate-y-1/2 animate-spin blur-[3px] [animation-duration:9s] [background:conic-gradient(from_0deg,transparent_0deg,var(--a1)_40deg,transparent_120deg,var(--a2)_200deg,transparent_280deg,var(--a3)_330deg,transparent_360deg)]" />
      </div>

      <div className="lq relative overflow-hidden rounded-[26px] p-5 text-left sm:p-6">
        {/* sweeping shimmer */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-[linear-gradient(105deg,transparent,rgba(255,255,255,0.07),transparent)]"
          animate={{ left: ["-33%", "133%"] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.5 }}
        />

        {/* window header */}
        <div className="relative mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <motion.span
              className="grid h-8 w-8 place-items-center rounded-[10px] bg-[linear-gradient(135deg,var(--a1),var(--a2))] shadow-[0_6px_18px_-4px_var(--a2)]"
              animate={{ y: [0, -3, 0], rotate: [0, -4, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0B0B14" strokeWidth="2.2"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" /></svg>
            </motion.span>
            <span className="font-display text-[16px] font-bold">My Stash</span>
          </div>
          <span className="flex items-center gap-1.5 rounded-full border border-accent-cyan/25 bg-accent-cyan/10 px-2.5 py-1 text-[11px] font-semibold text-accent-cyan">
            <motion.span className="h-1.5 w-1.5 rounded-full bg-accent-cyan"
              animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }} transition={{ duration: 1.4, repeat: Infinity }} />
            {user ? "Synced" : "Live"}
          </span>
        </div>

        {/* ── Stat chips ── */}
        <div className="relative mb-4 grid grid-cols-3 gap-2">
          {[
            { label: "Files", node: <CountUp to={24} /> },
            { label: "Stored", node: <CountUp to={6.2} decimals={1} suffix=" GB" /> },
            { label: "Converts", node: <CountUp to={18} /> },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -3 }}
              className="rounded-[14px] border border-white/[0.08] bg-white/[0.03] px-3 py-2.5"
            >
              <div className="font-display text-[19px] font-bold leading-none tracking-tight">{s.node}</div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.12em] text-white/40">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* ── Live upload slot ── */}
        <div className="relative mb-2 overflow-hidden rounded-[14px] border border-accent-cyan/25 bg-accent-cyan/[0.05] p-3">
          <div className="flex items-center gap-3">
            <FileGlyph format={cur.fmt} size={30} showLabel={false} />
            <div className="min-w-0 flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={cur.name}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="truncate text-sm font-semibold"
                >
                  {cur.name}
                </motion.div>
              </AnimatePresence>
              <div className="text-[11px] font-medium">
                {done
                  ? <span className="text-accent-cyan">Added to stash ✓</span>
                  : <span className="text-white/55">Uploading… {Math.round(pct)}%</span>}
              </div>
            </div>
            {done ? (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 18 }}
                className="grid h-7 w-7 place-items-center rounded-full bg-accent-cyan text-[#0b0b14]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </motion.span>
            ) : (
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-accent-cyan/25 border-t-accent-cyan" />
            )}
          </div>
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
            <div className="h-full rounded-full bg-[linear-gradient(90deg,var(--a1),var(--a2))] transition-[width] duration-75 ease-linear" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* ── Recent files ── */}
        <div className="relative flex flex-col gap-2">
          {RECENT.map((f, i) => (
            <motion.div
              key={f.name}
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.12, duration: 0.45 }}
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
              className="flex items-center gap-3 rounded-[12px] border border-white/[0.06] bg-white/[0.025] px-3 py-2.5"
            >
              <FileGlyph format={f.fmt} size={26} showLabel={false} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-medium">{f.name}</div>
                <div className="text-[11px] text-white/40">{f.meta}</div>
              </div>
              <button title="Preview" aria-label="Preview" onClick={() => gate("Sign in to preview documents")}
                className="grid h-7 w-7 place-items-center rounded-[8px] text-white/40 transition-colors hover:bg-white/10 hover:text-white">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>
              </button>
            </motion.div>
          ))}
        </div>

        {/* ── Storage bar ── */}
        <div className="relative mt-4">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-medium text-white/80">Storage</span>
            <span className="text-white/50"><CountUp to={6.2} decimals={1} suffix=" GB" /> <span className="text-white/30">of 25 GB</span></span>
          </div>
          <div className="relative h-2 overflow-hidden rounded-full bg-white/[0.08]">
            <motion.div
              className="h-full rounded-full bg-[linear-gradient(90deg,var(--a1),var(--a2),var(--a3),var(--a1))] bg-[length:200%_100%] animate-grad-move"
              initial={{ width: 0 }} animate={{ width: "25%" }} transition={{ delay: 0.7, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>

        {/* divider */}
        <div className="relative my-5 h-px bg-white/[0.07]" />

        {/* ── CONVERT pipeline ── */}
        <div className="relative mb-2.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">
          <motion.svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--a2)" strokeWidth="2"
            animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
            <path d="M4 12a8 8 0 0 1 14-5m2-3v4h-4M20 12a8 8 0 0 1-14 5m-2 3v-4h4" />
          </motion.svg>
          Convert
        </div>
        <div className="relative flex items-center gap-3 rounded-[12px] border border-white/[0.06] bg-white/[0.03] p-3">
          <div className="flex items-center gap-2.5">
            <FileGlyph format="DOCX" size={30} showLabel={false} />
            {/* flowing dot pipeline */}
            <div className="relative h-4 w-9">
              <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/15" />
              {[0, 0.5, 1].map((d) => (
                <motion.span key={d} className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-accent-cyan"
                  animate={{ left: ["0%", "100%"], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: d }} />
              ))}
            </div>
            <FileGlyph format="PDF" size={30} showLabel={false} />
          </div>
          <div className="hidden min-w-0 flex-1 truncate text-xs text-white/45 sm:block">
            contract.docx → <span className="text-white/75">contract.pdf</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
            onClick={() => go("convert")}
            className="btn-primary ml-auto shrink-0 rounded-[10px] px-3.5 py-2 text-xs sm:ml-0"
          >
            Convert a file
          </motion.button>
        </div>
      </div>
    </div>
  );
}
