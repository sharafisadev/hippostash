"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useStorage } from "@/lib/hooks/useStorage";
import { FileGlyph } from "@/components/atoms/FileGlyph";
import { formatBytes, cn } from "@/lib/utils";

const FREE_LIMIT = 1024 * 1024 * 1024; // 1 GB

function glyphFor(name: string): string {
  return (name.split(".").pop() || "ZIP").toUpperCase();
}

export function StorageDashboard() {
  const { files, used, loading, error, upload, remove, preview } = useStorage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const pct = Math.min(100, Math.round((used / FREE_LIMIT) * 100));
  const notReady = error && /not found|does not exist|bucket/i.test(error);

  async function handleFiles(list: FileList | null) {
    const file = list?.[0];
    if (!file) return;
    setBusy(true);
    setMsg(null);
    try {
      await upload(file);
      setMsg(`${file.name} uploaded.`);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="lq relative overflow-hidden rounded-[24px] p-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-display text-[16px] font-bold">My Stash</span>
        <span className="rounded-full bg-accent-cyan/15 px-3 py-1 text-xs font-semibold text-accent-cyan">Open</span>
      </div>

      <input ref={inputRef} type="file" className="sr-only" aria-label="Upload file" onChange={(e) => handleFiles(e.target.files)} />

      {/* upload dropzone */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-[14px] border-2 border-dashed p-6 text-center transition-colors",
          dragging ? "border-accent-cyan/70 bg-accent-cyan/[0.06]" : "border-white/15 hover:border-white/25"
        )}
      >
        <div className="mb-2 grid h-10 w-10 place-items-center rounded-[12px] bg-[linear-gradient(135deg,var(--a1),var(--a2))]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0B0B14" strokeWidth="2.2"><path d="M12 16V4M7 9l5-5 5 5M5 20h14" /></svg>
        </div>
        <div className="text-sm font-medium text-white">{busy ? "Uploading…" : "Add a file to your stash"}</div>
        <div className="mt-0.5 text-xs text-white/40">Drag &amp; drop or click to browse</div>
      </div>

      {msg && <p className="mt-3 rounded-[10px] bg-white/[0.05] px-3 py-2 text-xs text-white/70">{msg}</p>}

      {notReady && (
        <p className="mt-3 rounded-[10px] bg-amber-400/10 px-3 py-2 text-xs text-amber-300">
          Storage isn&apos;t enabled on this project yet — ask the owner to create the <code>user-files</code> bucket.
        </p>
      )}

      {/* file list */}
      <div className="mt-4 flex flex-col gap-2">
        {loading ? (
          <div className="py-6 text-center text-sm text-white/40">Loading your files…</div>
        ) : files.length === 0 ? (
          <div className="py-6 text-center text-sm text-white/40">Your stash is empty — upload your first document.</div>
        ) : (
          files.map((f) => (
            <motion.div
              key={f.path}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 rounded-[12px] border border-white/[0.06] bg-white/[0.03] px-3 py-2.5"
            >
              <FileGlyph format={glyphFor(f.name)} size={30} showLabel={false} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{f.name}</div>
                <div className="text-xs text-white/45">{formatBytes(f.size)}</div>
              </div>
              <div className="flex items-center gap-0.5">
                <button title="Preview" aria-label="Preview" onClick={() => preview(f.path)} className="grid h-7 w-7 place-items-center rounded-[8px] text-white/45 transition-colors hover:bg-white/10 hover:text-white">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>
                </button>
                <button title="Delete" aria-label="Delete" onClick={() => remove(f.path)} className="grid h-7 w-7 place-items-center rounded-[8px] text-white/45 transition-colors hover:bg-white/10 hover:text-file-pdf">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" /></svg>
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* storage meter */}
      <div className="mt-5">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="font-medium text-white/80">Storage</span>
          <span className="text-white/50">{formatBytes(used)} <span className="text-white/30">of 1 GB</span></span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/[0.08]">
          <div className="h-full rounded-full bg-gradient-to-r from-accent-cyan via-accent-violet to-accent-blue" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}
