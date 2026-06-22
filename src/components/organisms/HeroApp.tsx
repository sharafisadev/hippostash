"use client";

import { FileGlyph } from "@/components/atoms/FileGlyph";
import { useAuth } from "@/components/providers/AuthProvider";

const files = [
  { name: "passport-scan.jpg", fmt: "JPG", meta: "1.1 MB" },
  { name: "electric-bill.xlsx", fmt: "XLSX", meta: "88 KB" },
  { name: "lease-agreement.pdf", fmt: "PDF", meta: "2.4 MB" },
];

function go(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function Label({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mb-2.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">
      {icon}
      {children}
    </div>
  );
}

const FolderIc = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--a1)" strokeWidth="2"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" /></svg>
);
const ConvertIc = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--a2)" strokeWidth="2"><path d="M4 12a8 8 0 0 1 14-5m2-3v4h-4M20 12a8 8 0 0 1-14 5m-2 3v-4h4" /></svg>
);

export function HeroApp() {
  const { user, open } = useAuth();
  const gate = (reason: string) => (user ? go("storage") : open("login", { reason }));

  return (
    <div className="lq rounded-[24px] p-5 text-left sm:p-6">
      {/* window header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-[8px] bg-[linear-gradient(135deg,var(--a1),var(--a2))]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0B0B14" strokeWidth="2.2"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" /></svg>
          </span>
          <span className="font-display text-[15px] font-bold">My Stash</span>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${user ? "bg-accent-cyan/15 text-accent-cyan" : "bg-white/[0.06] text-white/55"}`}>
          {user ? "Open" : "Preview"}
        </span>
      </div>

      {/* ── STORAGE ── */}
      <Label icon={FolderIc}>Storage</Label>
      <div className="mb-3 flex items-center gap-2">
        <div className="flex flex-1 items-center gap-2.5 rounded-[12px] border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>
          <span className="text-[13px] text-white/40">Search files</span>
        </div>
        <button onClick={() => gate("Sign in to add files to your stash")} className="btn-primary flex h-[42px] items-center gap-1.5 rounded-[12px] px-3.5 text-xs">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M12 5v14M5 12h14" /></svg>
          Add
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {files.map((f) => (
          <div key={f.name} className="flex items-center gap-3 rounded-[12px] border border-white/[0.06] bg-white/[0.03] px-3 py-2.5">
            <FileGlyph format={f.fmt} size={28} showLabel={false} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{f.name}</div>
              <div className="text-xs text-white/45">{f.meta}</div>
            </div>
            <div className="flex items-center gap-0.5">
              <button title="Preview" aria-label="Preview" onClick={() => gate("Sign in to preview documents")} className="grid h-7 w-7 place-items-center rounded-[8px] text-white/45 transition-colors hover:bg-white/10 hover:text-white">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>
              </button>
              <button title="Rename" aria-label="Rename" onClick={() => gate("Sign in to manage files")} className="grid h-7 w-7 place-items-center rounded-[8px] text-white/45 transition-colors hover:bg-white/10 hover:text-white">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" /></svg>
              </button>
              <button title="Delete" aria-label="Delete" onClick={() => gate("Sign in to manage files")} className="grid h-7 w-7 place-items-center rounded-[8px] text-white/45 transition-colors hover:bg-white/10 hover:text-file-pdf">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" /></svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3.5">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="font-medium text-white/80">Storage</span>
          <span className="text-white/50">6.2 GB <span className="text-white/30">of 25 GB</span></span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/[0.08]">
          <div className="h-full w-1/4 rounded-full bg-gradient-to-r from-accent-cyan via-accent-violet to-accent-blue" />
        </div>
      </div>

      {/* divider */}
      <div className="my-5 h-px bg-white/[0.07]" />

      {/* ── CONVERT ── */}
      <Label icon={ConvertIc}>Convert</Label>
      <div className="flex items-center gap-3 rounded-[12px] border border-white/[0.06] bg-white/[0.03] p-3">
        <div className="flex items-center gap-2">
          <FileGlyph format="DOCX" size={30} showLabel={false} />
          <svg width="22" height="14" viewBox="0 0 24 14" fill="none"><path d="M2 7h14" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeDasharray="3 3" /><path d="M16 2l5 5-5 5" stroke="var(--a1)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <FileGlyph format="PDF" size={30} showLabel={false} />
        </div>
        <div className="hidden min-w-0 flex-1 truncate text-xs text-white/45 sm:block">
          contract.docx → <span className="text-white/75">contract.pdf</span>
        </div>
        <button onClick={() => go("convert")} className="ml-auto shrink-0 rounded-[10px] border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/[0.1] sm:ml-0">
          Convert a file
        </button>
      </div>
    </div>
  );
}
