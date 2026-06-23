"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/components/providers/AuthProvider";
import { getSupabase } from "@/lib/supabase/client";
import { Modal } from "@/components/molecules/Modal";

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function ProfileMenu() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(false);

  const fullName = (user?.user_metadata?.full_name as string) || user?.email?.split("@")[0] || "Hippo";
  const initials = fullName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  if (!user) return null;

  const item = "flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/[0.06] hover:text-white";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Account menu"
        aria-expanded={open}
        className="grid h-10 w-10 place-items-center rounded-full bg-[linear-gradient(135deg,var(--a1),var(--a2))] text-sm font-bold text-[#0b0b14]"
      >
        {initials}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="lq absolute right-0 z-20 mt-2 w-60 origin-top-right rounded-[16px] p-2"
            >
              <div className="flex items-center gap-3 rounded-[12px] px-2 py-2">
                <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-[linear-gradient(135deg,var(--a1),var(--a2))] text-xs font-bold text-[#0b0b14]">{initials}</span>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-white">{fullName}</div>
                  <div className="truncate text-xs text-white/45">{user.email}</div>
                </div>
              </div>
              <div className="my-1 h-px bg-white/[0.07]" />
              <button className={item} onClick={() => { setOpen(false); scrollTo("storage"); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" /></svg>
                My Stash
              </button>
              <button className={item} onClick={() => { setOpen(false); setSettings(true); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a7.4 7.4 0 0 0 0-6l2-1.6-2-3.4-2.4 1a7.3 7.3 0 0 0-2.6-1.5L13.5 1h-3l-.4 2.5A7.3 7.3 0 0 0 7.5 5l-2.4-1-2 3.4 2 1.6a7.4 7.4 0 0 0 0 6l-2 1.6 2 3.4 2.4-1a7.3 7.3 0 0 0 2.6 1.5l.4 2.5h3l.4-2.5a7.3 7.3 0 0 0 2.6-1.5l2.4 1 2-3.4z" /></svg>
                Account &amp; preferences
              </button>
              <div className="my-1 h-px bg-white/[0.07]" />
              <button className={`${item} hover:!text-file-pdf`} onClick={() => signOut()}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 17l5-5-5-5M21 12H9M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /></svg>
                Sign out
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Modal open={settings} onClose={() => setSettings(false)} title="Account & preferences">
        <ProfileSettings onSignOut={() => { setSettings(false); signOut(); }} />
      </Modal>
    </div>
  );
}

function ProfileSettings({ onSignOut }: { onSignOut: () => void }) {
  const { user } = useAuth();
  const [name, setName] = useState((user?.user_metadata?.full_name as string) ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);

  async function save() {
    setSaving(true);
    setSaved(false);
    await getSupabase().auth.updateUser({ data: { full_name: name } });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-white/40">Profile</div>
        <label className="mb-1 block text-xs text-white/50">Full name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="h-11 w-full rounded-[12px] border border-white/10 bg-black/30 px-3.5 text-sm text-white focus:border-accent-cyan/60 focus:outline-none" />
        <label className="mb-1 mt-3 block text-xs text-white/50">Email</label>
        <input value={user?.email ?? ""} readOnly className="h-11 w-full cursor-default rounded-[12px] border border-white/10 bg-black/20 px-3.5 text-sm text-white/60" />
        <div className="mt-3 flex items-center gap-3">
          <button onClick={save} disabled={saving} className="btn-primary rounded-[12px] px-5 py-2.5 text-sm disabled:opacity-60">{saving ? "Saving…" : "Save"}</button>
          {saved && <span className="text-xs text-file-image">Saved ✓</span>}
        </div>
      </div>

      <div className="border-t border-white/[0.07] pt-4">
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-white/40">Preferences</div>
        <div className="flex items-center justify-between py-1.5">
          <span className="text-sm text-white/80">Email notifications</span>
          <button
            onClick={() => setEmailNotif((v) => !v)}
            className={`relative h-6 w-11 rounded-full transition-colors ${emailNotif ? "bg-accent-cyan" : "bg-white/15"}`}
            aria-pressed={emailNotif}
          >
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${emailNotif ? "translate-x-[22px]" : "translate-x-0.5"}`} />
          </button>
        </div>
        <div className="flex items-center justify-between py-1.5 text-white/40">
          <span className="text-sm">Theme</span>
          <span className="text-xs">Dark (light mode coming soon)</span>
        </div>
      </div>

      <button onClick={onSignOut} className="rounded-[12px] border border-file-pdf/30 bg-file-pdf/[0.08] py-2.5 text-sm font-semibold text-file-pdf transition-colors hover:bg-file-pdf/15">
        Sign out
      </button>
    </div>
  );
}
