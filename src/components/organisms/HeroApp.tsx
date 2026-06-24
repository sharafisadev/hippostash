"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, animate, motion } from "framer-motion";
import { FileGlyph } from "@/components/atoms/FileGlyph";
import { useAuth } from "@/components/providers/AuthProvider";

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

// Circular storage ring that sweeps to 25% on load.
function StorageRing() {
  const r = 30;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-[88px] w-[88px]">
      <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
        <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="7" />
        <motion.circle
          cx="40" cy="40" r={r} fill="none" stroke="url(#ring-grad)" strokeWidth="7" strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * 0.75 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        />
        <defs>
          <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--a1)" />
            <stop offset="1" stopColor="var(--a2)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="font-display text-[18px] font-bold leading-none">
            <CountUp to={25} suffix="%" />
          </div>
          <div className="mt-0.5 text-[9px] uppercase tracking-[0.1em] text-white/40">used</div>
        </div>
      </div>
    </div>
  );
}

const MORPH = ["JPG", "PNG", "WEBP", "PDF", "DOCX"];

export function HeroApp() {
  const { user, open } = useAuth();
  const gate = (reason: string) => (user ? go("storage") : open("login", { reason }));

  // Cycling format for the convert tile.
  const [mi, setMi] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setMi((i) => (i + 1) % MORPH.length), 1400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative">
      {/* Rotating gradient glow ring */}
      <div className="pointer-events-none absolute -inset-[1.5px] overflow-hidden rounded-[26px] opacity-60">
        <div className="absolute left-1/2 top-1/2 h-[220%] w-[220%] -translate-x-1/2 -translate-y-1/2 animate-spin blur-[3px] [animation-duration:10s] [background:conic-gradient(from_0deg,transparent_0deg,var(--a1)_40deg,transparent_120deg,var(--a2)_200deg,transparent_280deg,var(--a3)_330deg,transparent_360deg)]" />
      </div>

      <div className="lq relative overflow-hidden rounded-[26px] p-4 sm:p-5">
        {/* header */}
        <div className="mb-3.5 flex items-center justify-between">
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

        {/* ── Bento grid ── */}
        <div className="grid grid-cols-2 gap-3">

          {/* Vault tile (tall) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -3 }}
            className="relative row-span-2 flex flex-col justify-between overflow-hidden rounded-[18px] border border-white/[0.08] bg-[radial-gradient(120%_90%_at_30%_0%,rgba(155,89,182,0.18),transparent_60%)] p-4"
          >
            <div className="relative grid h-24 place-items-center">
              {/* pulsing rings */}
              {[0, 1, 2].map((i) => (
                <motion.span key={i} className="absolute rounded-full border border-accent-violet/40"
                  initial={{ width: 28, height: 28, opacity: 0.6 }}
                  animate={{ width: 96, height: 96, opacity: 0 }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", delay: i * 0.8 }} />
              ))}
              <motion.span
                className="relative grid h-12 w-12 place-items-center rounded-[14px] bg-[linear-gradient(135deg,var(--a2),var(--a3))] shadow-[0_10px_30px_-8px_var(--a2)]"
                animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0B0B14" strokeWidth="2.2">
                  <rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" />
                </svg>
              </motion.span>
            </div>
            <div>
              <div className="font-display text-[15px] font-bold">Bank-grade vault</div>
              <div className="mt-1 text-[11px] leading-snug text-white/45">256-bit encrypted · biometric lock</div>
              <div className="mt-2 flex gap-1">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <motion.span key={i} className="h-1 flex-1 rounded-full bg-accent-violet/50"
                    animate={{ opacity: [0.25, 1, 0.25] }}
                    transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }} />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Storage ring tile */}
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -3 }}
            className="flex items-center gap-3 rounded-[18px] border border-white/[0.08] bg-white/[0.03] p-3.5"
          >
            <StorageRing />
            <div className="min-w-0">
              <div className="font-display text-[15px] font-bold leading-tight">
                <CountUp to={6.2} decimals={1} /> GB
              </div>
              <div className="text-[11px] text-white/40">of 25 GB used</div>
            </div>
          </motion.div>

          {/* Convert tile */}
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -3 }}
            className="flex items-center gap-3 overflow-hidden rounded-[18px] border border-white/[0.08] bg-white/[0.03] p-3.5"
          >
            <div className="relative grid h-12 w-12 flex-none place-items-center">
              <AnimatePresence mode="wait">
                <motion.div key={mi}
                  initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.6, rotate: 12 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <FileGlyph format={MORPH[mi]!} size={44} showLabel={false} />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="min-w-0">
              <div className="font-display text-[15px] font-bold leading-tight">Convert</div>
              <div className="text-[11px] text-white/40">any format, instantly</div>
            </div>
          </motion.div>

          {/* Action bar (full width) */}
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-2 flex items-center gap-3 rounded-[18px] border border-white/[0.08] bg-white/[0.03] p-3"
          >
            {/* stacked file chips */}
            <div className="flex -space-x-2">
              {["JPG", "PDF", "XLSX"].map((f, i) => (
                <motion.span key={f}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.25 }}
                  style={{ zIndex: 3 - i }}
                >
                  <FileGlyph format={f} size={28} showLabel={false} />
                </motion.span>
              ))}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-semibold">
                <CountUp to={24} /> files secured
              </div>
              <div className="text-[11px] text-white/40">synced across all devices</div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
              onClick={() => gate("Sign in to open your stash")}
              className="btn-primary shrink-0 rounded-[11px] px-4 py-2.5 text-xs"
            >
              Open Stash
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
