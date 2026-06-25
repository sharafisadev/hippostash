"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getSupabase } from "@/lib/supabase/client";
import { useScrollLock } from "@/lib/hooks/useScrollLock";
import type { AuthMode } from "@/components/providers/AuthProvider";

// Google sign-in is hidden until a branded OAuth app is configured (its consent
// screen otherwise shows the raw Supabase project URL). Set
// NEXT_PUBLIC_GOOGLE_AUTH=1 once Google Cloud + Supabase are branded.
const GOOGLE_ENABLED = process.env.NEXT_PUBLIC_GOOGLE_AUTH === "1";

interface AuthModalProps {
  openState: boolean;
  mode: AuthMode;
  reason?: string;
  plan?: string;
  onClose: () => void;
  onModeChange: (m: AuthMode) => void;
  onSuccess: () => void;
}

export function AuthModal({
  openState,
  mode,
  reason,
  plan,
  onClose,
  onModeChange,
  onSuccess,
}: AuthModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // lock background scroll while the popup is open
  useScrollLock(openState);
  useEffect(() => {
    if (!openState) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openState, onClose]);

  function reset() {
    setError(null);
    setNotice(null);
    setBusy(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    const supabase = getSupabase();

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onSuccess();
      } else {
        if (password.length < 6) throw new Error("Password must be at least 6 characters.");
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name, plan: plan ?? "free" },
            emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
          },
        });
        if (error) throw error;
        if (data.session) {
          onSuccess(); // confirmations disabled → signed in immediately
        } else {
          setNotice("Almost there — check your inbox to confirm your email, then log in.");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function social(provider: "google" | "apple") {
    setError(null);
    const label = provider === "google" ? "Google" : "Apple";
    try {
      const { error } = await getSupabase().auth.signInWithOAuth({
        provider,
        options: { redirectTo: typeof window !== "undefined" ? window.location.origin : undefined },
      });
      if (error) throw error;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      setError(
        /not enabled|unsupported provider/i.test(msg)
          ? `${label} sign-in isn't set up yet — please continue with email.`
          : msg || `${label} sign-in is unavailable right now.`
      );
    }
  }

  const isLogin = mode === "login";
  const title = isLogin ? "Welcome back" : plan ? `Start your ${plan} plan` : "Create your account";
  const subtitle = reason ?? (isLogin ? "Log in to access your stash" : "Sign up to store and convert your documents");

  return (
    <AnimatePresence>
      {openState && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-[30px] [-webkit-backdrop-filter:blur(30px)]" onClick={onClose} aria-hidden="true" />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="lq relative z-10 w-full max-w-[400px] overflow-hidden rounded-[24px] p-7"
          >
            <div className="pointer-events-none absolute -inset-px rounded-[24px] opacity-40 [background:linear-gradient(135deg,rgba(78,205,196,0.5),transparent_45%,transparent_55%,rgba(155,89,182,0.5))]" />

            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 grid h-8 w-8 place-items-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" /></svg>
            </button>

            <div className="relative">
              <div className="mb-6 text-center">
                <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-[16px] bg-[linear-gradient(135deg,var(--a1),var(--a2))] shadow-[0_12px_30px_rgba(120,120,200,0.4)]">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0B0B14" strokeWidth="2"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
                </div>
                <h3 className="m-0 font-display text-[21px] font-bold">{title}</h3>
                <p className="mt-1 text-[13px] text-white/50">{subtitle}</p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                {!isLogin && (
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    autoComplete="name"
                    className="h-11 w-full rounded-[12px] border border-white/10 bg-black/30 px-3.5 text-sm text-white placeholder:text-white/30 focus:border-accent-cyan/60 focus:outline-none"
                  />
                )}
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  placeholder="Email"
                  autoComplete="email"
                  className="h-11 w-full rounded-[12px] border border-white/10 bg-black/30 px-3.5 text-sm text-white placeholder:text-white/30 focus:border-accent-cyan/60 focus:outline-none"
                />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                  placeholder="Password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  className="h-11 w-full rounded-[12px] border border-white/10 bg-black/30 px-3.5 text-sm text-white placeholder:text-white/30 focus:border-accent-cyan/60 focus:outline-none"
                />

                {error && <p className="rounded-[10px] bg-file-pdf/10 px-3 py-2 text-[13px] text-file-pdf">{error}</p>}
                {notice && <p className="rounded-[10px] bg-accent-cyan/10 px-3 py-2 text-[13px] text-accent-cyan">{notice}</p>}

                <button type="submit" disabled={busy} className="btn-primary mt-1 h-11 rounded-[12px] text-[15px] disabled:opacity-60">
                  {busy ? "Please wait…" : isLogin ? "Login" : "Create account"}
                </button>
              </form>

              {GOOGLE_ENABLED && (
                <>
                  <div className="my-4 flex items-center gap-3 text-[11px] text-white/35">
                    <span className="h-px flex-1 bg-white/10" /> or continue with
                    <span className="h-px flex-1 bg-white/10" />
                  </div>

                  <button onClick={() => social("google")} className="flex h-11 w-full items-center justify-center gap-2.5 rounded-[12px] border border-white/10 bg-white/[0.04] text-sm font-medium text-white/90 transition-colors hover:bg-white/[0.08]">
                    <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#FFC107" d="M21.8 10.2H12v3.8h5.6C17 16.4 14.8 18 12 18a6 6 0 1 1 0-12c1.5 0 2.9.6 4 1.5l2.7-2.7A9.8 9.8 0 0 0 12 2a10 10 0 1 0 9.8 8.2z" /><path fill="#FF3D00" d="M3.2 7.3l3.1 2.3A6 6 0 0 1 12 6c1.5 0 2.9.6 4 1.5l2.7-2.7A9.8 9.8 0 0 0 12 2 10 10 0 0 0 3.2 7.3z" /><path fill="#4CAF50" d="M12 22c2.7 0 5.1-1 6.9-2.7l-3.2-2.7A6 6 0 0 1 6.4 14l-3.2 2.5A10 10 0 0 0 12 22z" /><path fill="#1976D2" d="M21.8 10.2H12v3.8h5.6a6 6 0 0 1-2 2.6l3.2 2.7c1.9-1.8 3-4.4 3-7.5 0-.6-.1-1.1-.2-1.6z" /></svg>
                    Continue with Google
                  </button>
                </>
              )}

              <p className="mt-5 text-center text-[13px] text-white/45">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => { reset(); onModeChange(isLogin ? "register" : "login"); }}
                  className="font-semibold text-white hover:underline"
                >
                  {isLogin ? "Register" : "Log in"}
                </button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
