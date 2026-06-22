"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/components/providers/AuthProvider";
import { StorageDashboard } from "@/components/organisms/StorageDashboard";

const EASE = [0.16, 1, 0.3, 1] as const;

const points = [
  "End-to-end encrypted, tied to your account",
  "Two-factor & biometric lock available",
  "Access your stash from any device",
];

const lockedFiles = [
  { fmt: "PDF", w: "w-2/3" },
  { fmt: "XLSX", w: "w-1/2" },
  { fmt: "JPG", w: "w-3/5" },
];

function LockIcon({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#0B0B14" strokeWidth="2">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

export function StorageSpotlight() {
  const { open, user } = useAuth();

  const enter = {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -18 },
    transition: { duration: 0.45, ease: EASE },
  };

  return (
    <section id="storage" className="relative z-[2] mx-auto max-w-[1180px] overflow-hidden px-4 sm:px-6 py-16">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[420px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[60px]"
        style={{ background: user ? "radial-gradient(circle,rgba(78,205,196,0.14),transparent 70%)" : "radial-gradient(circle,rgba(155,89,182,0.14),transparent 70%)" }}
      />

      <AnimatePresence mode="wait">
        {user ? (
          <motion.div key="open" {...enter} className="grid items-center gap-16 md:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent-cyan/30 bg-accent-cyan/[0.08] px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-accent-cyan">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-cyan" /> Signed in
              </div>
              <h2 className="m-0 mb-[18px] font-display text-[clamp(30px,3.8vw,46px)] font-bold leading-[1.06] tracking-[-0.03em]">
                Your stash is open.
              </h2>
              <p className="m-0 mb-7 text-[17px] leading-[1.6] text-white/55">
                Welcome back. Upload, preview and manage your documents right here —
                private to your account and synced to the cloud.
              </p>
              <div className="flex flex-col gap-3.5">
                {points.map((p) => (
                  <div key={p} className="flex items-center gap-3">
                    <span className="grid h-6 w-6 flex-none place-items-center rounded-full border border-accent-cyan/40 bg-accent-cyan/[0.18]">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--a1)" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
                    </span>
                    <span className="text-[16px] text-white/[0.82]">{p}</span>
                  </div>
                ))}
              </div>
            </div>
            <StorageDashboard />
          </motion.div>
        ) : (
          <motion.div key="locked" {...enter} className="grid items-center gap-16 md:grid-cols-2">
            {/* copy */}
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-accent-violet">
                <LockIconSmall /> Members only
              </div>
              <h2 className="m-0 mb-[18px] font-display text-[clamp(30px,3.8vw,46px)] font-bold leading-[1.06] tracking-[-0.03em]">
                Your stash, locked to you.
              </h2>
              <p className="m-0 mb-7 text-[17px] leading-[1.6] text-white/55">
                Storage is private by design. Create a free account or sign in to
                upload, organize and convert your documents — only you ever hold
                the key.
              </p>
              <div className="mb-8 flex flex-col gap-3.5">
                {points.map((p) => (
                  <div key={p} className="flex items-center gap-3">
                    <span className="grid h-6 w-6 flex-none place-items-center rounded-full border border-accent-violet/40 bg-accent-violet/[0.18]">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--a2)" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
                    </span>
                    <span className="text-[16px] text-white/[0.82]">{p}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => open("register")} className="btn-primary inline-flex items-center rounded-[13px] px-6 py-3 text-sm">
                  Create free account
                </button>
                <button onClick={() => open("login")} className="lq inline-flex items-center rounded-[13px] px-6 py-3 text-sm font-semibold text-white">
                  Sign in
                </button>
              </div>
            </div>

            {/* locked vault visual (not a login form) */}
            <div className="lq relative overflow-hidden rounded-[24px] p-7">
              <div className="pointer-events-none absolute -right-10 -top-12 h-[240px] w-[260px] rounded-full bg-[radial-gradient(circle,rgba(155,89,182,0.3),transparent_65%)] blur-[34px]" />

              <div className="relative flex flex-col items-center text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="mb-5 grid h-[72px] w-[72px] place-items-center rounded-[22px] bg-[linear-gradient(135deg,var(--a1),var(--a2))] shadow-[0_16px_40px_rgba(120,120,200,0.45)]"
                >
                  <LockIcon />
                </motion.div>
                <h3 className="m-0 font-display text-[20px] font-bold">Your vault is locked</h3>
                <p className="mt-1 text-[14px] text-white/50">Sign in to unlock and manage your documents.</p>
                <button onClick={() => open("login")} className="btn-primary mt-5 rounded-[13px] px-6 py-3 text-sm">
                  Unlock my stash
                </button>
              </div>

              {/* dimmed, locked file rows hint at the content behind the lock */}
              <div className="relative mt-7 space-y-2">
                {lockedFiles.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-[12px] border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 opacity-55">
                    <div className="h-7 w-6 rounded-[6px] bg-white/10" />
                    <div className={`h-2.5 rounded-full bg-white/12 ${f.w}`} />
                    <svg className="ml-auto" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function LockIconSmall() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}
