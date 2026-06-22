"use client";

import { Reveal } from "@/components/molecules/Reveal";
import { useAuth } from "@/components/providers/AuthProvider";
import { StorageDashboard } from "@/components/organisms/StorageDashboard";

const points = [
  "End-to-end encrypted, tied to your account",
  "Two-factor & biometric lock available",
  "Access your stash from any device",
];

function Field({ label, placeholder, type = "text" }: { label: string; placeholder: string; type?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-medium text-white/50">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        readOnly
        className="h-11 w-full cursor-default rounded-[12px] border border-white/10 bg-black/30 px-3.5 text-sm text-white/85 placeholder:text-white/30 focus:outline-none"
      />
    </label>
  );
}

export function StorageSpotlight() {
  const { open, user } = useAuth();

  // Signed in → the stash is "open": a real, functional storage dashboard.
  if (user) {
    return (
      <section id="storage" className="relative z-[2] mx-auto max-w-[1180px] px-6 py-16">
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[420px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(78,205,196,0.16),transparent_70%)] blur-[60px]" />
        <div className="grid items-center gap-16 md:grid-cols-2">
          <Reveal>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent-cyan/30 bg-accent-cyan/[0.08] px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-accent-cyan">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-cyan" /> Signed in
            </div>
            <h2 className="m-0 mb-[18px] font-display text-[clamp(30px,3.8vw,46px)] font-bold leading-[1.06] tracking-[-0.03em]">
              Your stash is open.
            </h2>
            <p className="m-0 mb-7 text-[17px] leading-[1.6] text-white/55">
              Welcome back. Upload, preview and manage your documents right here —
              everything is private to your account and synced to the cloud.
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
          </Reveal>
          <Reveal>
            <StorageDashboard />
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section id="storage" className="relative z-[2] mx-auto max-w-[1180px] px-6 py-16">
      {/* soft auth-tinted glow to set this section apart */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[420px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(155,89,182,0.16),transparent_70%)] blur-[60px]" />

      <div className="grid items-center gap-16 md:grid-cols-2">
        {/* copy */}
        <Reveal>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-accent-violet">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
            Members only
          </div>
          <h2 className="m-0 mb-[18px] font-display text-[clamp(30px,3.8vw,46px)] font-bold leading-[1.06] tracking-[-0.03em]">
            Your stash is locked to you.
          </h2>
          <p className="m-0 mb-7 text-[17px] leading-[1.6] text-white/55">
            Storage is private by design. Create a free account or sign in to
            upload, organize and convert your documents — only you ever hold the
            key.
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
        </Reveal>

        {/* login card mockup */}
        <Reveal>
          <div className="lq relative mx-auto w-full max-w-[380px] overflow-hidden rounded-[24px] p-7">
            <div className="pointer-events-none absolute -inset-px rounded-[24px] opacity-40 [background:linear-gradient(135deg,rgba(155,89,182,0.5),transparent_45%,transparent_55%,rgba(78,205,196,0.5))]" />
            <div className="relative text-center">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-[16px] bg-[linear-gradient(135deg,var(--a1),var(--a2))] shadow-[0_12px_30px_rgba(120,120,200,0.4)]">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0B0B14" strokeWidth="2"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
              </div>
              <h3 className="m-0 font-display text-[20px] font-bold">Welcome back</h3>
              <p className="mb-6 mt-1 text-[13px] text-white/45">Log in to access your stash</p>
            </div>

            <div className="relative flex flex-col gap-3.5">
              <Field label="Username or email" placeholder="you@example.com" />
              <div>
                <Field label="Password" placeholder="••••••••" type="password" />
                <div className="mt-1.5 text-right">
                  <button onClick={() => open("login")} className="text-[12px] text-accent-cyan hover:underline">Forgot your password?</button>
                </div>
              </div>

              <button onClick={() => open("login")} className="btn-primary mt-1 h-11 rounded-[12px] text-[15px]">Login</button>

              <div className="my-1 flex items-center gap-3 text-[11px] text-white/35">
                <span className="h-px flex-1 bg-white/10" /> or continue with
                <span className="h-px flex-1 bg-white/10" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => open("login")} className="flex h-10 items-center justify-center gap-2 rounded-[12px] border border-white/10 bg-white/[0.04] text-sm font-medium text-white/85 transition-colors hover:bg-white/[0.08]">
                  <svg width="15" height="15" viewBox="0 0 24 24"><path fill="#FFC107" d="M21.8 10.2H12v3.8h5.6C17 16.4 14.8 18 12 18a6 6 0 1 1 0-12c1.5 0 2.9.6 4 1.5l2.7-2.7A9.8 9.8 0 0 0 12 2a10 10 0 1 0 9.8 8.2z" /><path fill="#FF3D00" d="M3.2 7.3l3.1 2.3A6 6 0 0 1 12 6c1.5 0 2.9.6 4 1.5l2.7-2.7A9.8 9.8 0 0 0 12 2 10 10 0 0 0 3.2 7.3z" /><path fill="#4CAF50" d="M12 22c2.7 0 5.1-1 6.9-2.7l-3.2-2.7A6 6 0 0 1 6.4 14l-3.2 2.5A10 10 0 0 0 12 22z" /><path fill="#1976D2" d="M21.8 10.2H12v3.8h5.6a6 6 0 0 1-2 2.6l3.2 2.7c1.9-1.8 3-4.4 3-7.5 0-.6-.1-1.1-.2-1.6z" /></svg>
                  Google
                </button>
                <button onClick={() => open("login")} className="flex h-10 items-center justify-center gap-2 rounded-[12px] border border-white/10 bg-white/[0.04] text-sm font-medium text-white/85 transition-colors hover:bg-white/[0.08]">
                  <svg width="15" height="15" viewBox="0 0 24 24" className="fill-white"><path d="M16.4 12.7c0-2.2 1.8-3.3 1.9-3.4-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.6.8-3.3.8-.7 0-1.7-.8-2.8-.8-1.5 0-2.8.8-3.6 2.2-1.5 2.7-.4 6.7 1.1 8.9.7 1.1 1.6 2.3 2.7 2.2 1.1 0 1.5-.7 2.8-.7s1.7.7 2.8.7c1.2 0 1.9-1.1 2.6-2.1.8-1.2 1.2-2.4 1.2-2.4s-2.2-.9-2.2-3.4zM14.3 6c.6-.7 1-1.7.9-2.7-.9 0-1.9.6-2.5 1.3-.5.6-1 1.6-.9 2.6 1 0 1.9-.5 2.5-1.2z" /></svg>
                  Apple
                </button>
              </div>

              <p className="mt-2 text-center text-[13px] text-white/45">
                Don&apos;t have an account?{" "}
                <button onClick={() => open("register")} className="font-semibold text-white hover:underline">Register</button>
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
