"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStorage, type StoredFile } from "@/lib/hooks/useStorage";
import { FileGlyph } from "@/components/atoms/FileGlyph";
import { HippoLoader } from "@/components/atoms/HippoLoader";
import { Modal } from "@/components/molecules/Modal";
import { fileKindFromName, formatBytes, cn } from "@/lib/utils";
import type { FileKind } from "@/lib/types";

const FREE_LIMIT = 1024 * 1024 * 1024; // 1 GB

function glyphFor(name: string): string {
  return (name.split(".").pop() || "ZIP").toUpperCase();
}

const TABS: { id: "all" | FileKind; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pdf", label: "PDFs" },
  { id: "image", label: "Images" },
  { id: "doc", label: "Docs" },
  { id: "other", label: "Other" },
];

const Eye = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>
);
const Pencil = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" /></svg>
);
const Trash = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" /></svg>
);

export function StorageDashboard() {
  const { files, used, loading, error, upload, remove, rename, previewUrl } = useStorage();
  const inputRef = useRef<HTMLInputElement>(null);

  const [tab, setTab] = useState<"all" | FileKind>("all");
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState<{ done: number; total: number } | null>(null);
  const [busyPath, setBusyPath] = useState<string | null>(null);
  const [renaming, setRenaming] = useState<StoredFile | null>(null);
  const [renameVal, setRenameVal] = useState("");
  const [preview, setPreview] = useState<{ file: StoredFile; url: string } | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: files.length, pdf: 0, image: 0, doc: 0, other: 0 };
    files.forEach((f) => (c[fileKindFromName(f.name)] = (c[fileKindFromName(f.name)] ?? 0) + 1));
    return c;
  }, [files]);

  const visible = useMemo(
    () => (tab === "all" ? files : files.filter((f) => fileKindFromName(f.name) === tab)),
    [files, tab]
  );

  const pct = Math.min(100, Math.round((used / FREE_LIMIT) * 100));
  const notReady = error && /not found|does not exist|bucket/i.test(error);

  async function handleFiles(list: FileList | null) {
    const arr = Array.from(list ?? []);
    if (!arr.length) return;
    setMsg(null);
    setUploading({ done: 0, total: arr.length });
    let ok = 0;
    for (let i = 0; i < arr.length; i++) {
      try {
        await upload(arr[i]!);
        ok++;
      } catch (e) {
        setMsg(e instanceof Error ? e.message : "Upload failed.");
      }
      setUploading({ done: i + 1, total: arr.length });
    }
    setUploading(null);
    if (ok) setMsg(`${ok} file${ok === 1 ? "" : "s"} added.`);
  }

  async function openPreview(f: StoredFile) {
    setPreviewLoading(true);
    setPreview({ file: f, url: "" });
    const url = await previewUrl(f.path);
    if (url) setPreview({ file: f, url });
    else setPreview(null);
    setPreviewLoading(false);
  }

  async function handleDelete(f: StoredFile) {
    setBusyPath(f.path);
    try {
      await remove(f.path);
    } finally {
      setBusyPath(null);
    }
  }

  async function submitRename() {
    if (!renaming) return;
    const target = renaming;
    setRenaming(null);
    setBusyPath(target.path);
    try {
      await rename(target.path, renameVal);
      setMsg("File renamed.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Rename failed.");
    } finally {
      setBusyPath(null);
    }
  }

  const previewKind = preview ? fileKindFromName(preview.file.name) : "other";

  return (
    <div className="lq relative overflow-hidden rounded-[24px] p-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-display text-[16px] font-bold">My Stash</span>
        <span className="rounded-full bg-accent-cyan/15 px-3 py-1 text-xs font-semibold text-accent-cyan">Open</span>
      </div>

      <input ref={inputRef} type="file" multiple className="sr-only" aria-label="Upload files" onChange={(e) => handleFiles(e.target.files)} />

      {/* upload dropzone */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => !uploading && inputRef.current?.click()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        className={cn(
          "flex min-h-[112px] cursor-pointer flex-col items-center justify-center rounded-[14px] border-2 border-dashed p-5 text-center transition-colors",
          dragging ? "border-accent-cyan/70 bg-accent-cyan/[0.06]" : "border-white/15 hover:border-white/25"
        )}
      >
        {uploading ? (
          <div className="w-full">
            <HippoLoader size={44} label={`Uploading ${uploading.done}/${uploading.total}…`} />
            <div className="mx-auto mt-3 h-1.5 w-3/4 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-accent-cyan to-accent-violet"
                animate={{ width: `${(uploading.done / uploading.total) * 100}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="mb-2 grid h-10 w-10 place-items-center rounded-[12px] bg-[linear-gradient(135deg,var(--a1),var(--a2))]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0B0B14" strokeWidth="2.2"><path d="M12 16V4M7 9l5-5 5 5M5 20h14" /></svg>
            </div>
            <div className="text-sm font-medium text-white">Add files to your stash</div>
            <div className="mt-0.5 text-xs text-white/40">Drag &amp; drop, or click — multiple at once</div>
          </>
        )}
      </div>

      {msg && <p className="mt-3 rounded-[10px] bg-white/[0.05] px-3 py-2 text-xs text-white/70">{msg}</p>}
      {notReady && (
        <p className="mt-3 rounded-[10px] bg-amber-400/10 px-3 py-2 text-xs text-amber-300">
          Storage isn&apos;t enabled on this project yet — the <code>user-files</code> bucket is missing.
        </p>
      )}

      {/* tabs */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {TABS.map((t) => {
          const on = tab === t.id;
          const n = counts[t.id] ?? 0;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                on ? "border-accent-cyan/50 bg-accent-cyan/10 text-white" : "border-white/10 text-white/55 hover:text-white"
              )}
            >
              {t.label} <span className={on ? "text-accent-cyan" : "text-white/35"}>{n}</span>
            </button>
          );
        })}
      </div>

      {/* file list */}
      <div className="mt-3 flex min-h-[120px] flex-col gap-2">
        {loading ? (
          <div className="grid place-items-center py-8"><HippoLoader size={48} label="Loading your files…" /></div>
        ) : visible.length === 0 ? (
          <div className="grid place-items-center py-8 text-center text-sm text-white/40">
            {files.length === 0 ? "Your stash is empty — upload your first document." : "No files in this category."}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {visible.map((f) => (
              <motion.div
                key={f.path}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: busyPath === f.path ? 0.5 : 1, y: 0 }}
                exit={{ opacity: 0, x: -16, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-3 rounded-[12px] border border-white/[0.06] bg-white/[0.03] px-3 py-2.5"
              >
                <FileGlyph format={glyphFor(f.name)} size={30} showLabel={false} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{f.name}</div>
                  <div className="text-xs text-white/45">{formatBytes(f.size)}</div>
                </div>
                <div className="flex items-center gap-0.5">
                  <button title="Preview" aria-label="Preview" onClick={() => openPreview(f)} className="grid h-7 w-7 place-items-center rounded-[8px] text-white/45 transition-colors hover:bg-white/10 hover:text-white"><Eye /></button>
                  <button title="Rename" aria-label="Rename" onClick={() => { setRenaming(f); setRenameVal(f.name); }} className="grid h-7 w-7 place-items-center rounded-[8px] text-white/45 transition-colors hover:bg-white/10 hover:text-white"><Pencil /></button>
                  <button title="Delete" aria-label="Delete" onClick={() => handleDelete(f)} className="grid h-7 w-7 place-items-center rounded-[8px] text-white/45 transition-colors hover:bg-white/10 hover:text-file-pdf"><Trash /></button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* storage meter */}
      <div className="mt-5">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="font-medium text-white/80">Storage</span>
          <span className="text-white/50">{formatBytes(used)} <span className="text-white/30">of 1 GB</span></span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/[0.08]">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-accent-cyan via-accent-violet to-accent-blue" animate={{ width: `${pct}%` }} transition={{ ease: "easeOut" }} />
        </div>
      </div>

      {/* rename modal */}
      <Modal open={!!renaming} onClose={() => setRenaming(null)} title="Rename file">
        <form onSubmit={(e) => { e.preventDefault(); submitRename(); }}>
          <input
            value={renameVal}
            onChange={(e) => setRenameVal(e.target.value)}
            autoFocus
            className="h-11 w-full rounded-[12px] border border-white/10 bg-black/30 px-3.5 text-sm text-white focus:border-accent-cyan/60 focus:outline-none"
          />
          <div className="mt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setRenaming(null)} className="rounded-[12px] border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white">Cancel</button>
            <button type="submit" className="btn-primary rounded-[12px] px-5 py-2.5 text-sm">Save</button>
          </div>
        </form>
      </Modal>

      {/* preview modal */}
      <Modal open={!!preview} onClose={() => setPreview(null)} title={preview?.file.name} size="lg">
        <div className="grid min-h-[300px] place-items-center bg-black/30 p-3">
          {previewLoading || !preview?.url ? (
            <HippoLoader size={52} label="Opening preview…" />
          ) : previewKind === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview.url} alt={preview.file.name} className="max-h-[70vh] w-auto rounded-[10px]" />
          ) : previewKind === "pdf" ? (
            <iframe src={preview.url} title={preview.file.name} className="h-[70vh] w-full rounded-[10px] bg-white" />
          ) : (
            <div className="p-10 text-center">
              <FileGlyph format={glyphFor(preview.file.name)} size={56} showLabel={false} className="mx-auto" />
              <p className="mt-4 text-sm text-white/55">Preview isn&apos;t available for this file type.</p>
              <a href={preview.url} download={preview.file.name} className="btn-primary mt-4 inline-flex rounded-[12px] px-5 py-2.5 text-sm">Download</a>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
