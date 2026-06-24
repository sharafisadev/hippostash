"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "@/components/molecules/Reveal";
import { FileGlyph } from "@/components/atoms/FileGlyph";
import { useToast } from "@/components/providers/ToastProvider";
import { formatBytes, cn } from "@/lib/utils";

const EXT: Record<string, string> = {
  PNG: "png", JPEG: "jpg", JPG: "jpg", WEBP: "webp", GIF: "gif",
  BMP: "bmp", ICO: "ico", PDF: "pdf", DOCX: "docx", TXT: "txt",
};
const CLIENT_FORMATS = ["PNG", "JPEG", "WEBP", "BMP", "ICO", "PDF"];
const FORMAT_GROUPS = [
  { label: "To image", formats: ["PNG", "JPEG", "WEBP", "GIF", "BMP", "ICO"] },
  { label: "To document", formats: ["PDF", "DOCX", "TXT"] },
];
const ACCEPT = "image/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.rtf,.odt,.csv";
const Q_SIZE = 3;

type ItemStatus = "queued" | "converting" | "done" | "error";
interface QueueItem {
  id: string;
  file: File;
  status: ItemStatus;
  result?: { url: string; name: string; size: number };
  error?: string;
}

const isImageFile = (f: File) => f.type.startsWith("image/");
const isPDFFile  = (f: File) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf");

function glyphFor(name: string) { return (name.split(".").pop() || "ZIP").toUpperCase(); }
function triggerDownload(url: string, name: string) {
  const a = document.createElement("a");
  a.href = url; a.download = name;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

export function ConverterSection() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems]       = useState<QueueItem[]>([]);
  const [format, setFormat]     = useState("PNG");
  const [converting, setConverting] = useState(false);
  const [convPct, setConvPct]   = useState(0);
  const [dragging, setDragging] = useState(false);
  const [qPage, setQPage]       = useState(0);
  const [preview, setPreview]   = useState<{ url: string; type: "image" | "pdf" | "other"; name: string } | null>(null);
  const { toast } = useToast();

  const allImages = items.length > 0 && items.every((i) => isImageFile(i.file));
  const allPDFs   = items.length > 0 && items.every((i) => isPDFFile(i.file));

  type MergeMode = "images-to-pdf" | "pdfs-to-pdf" | null;
  const mergeMode: MergeMode =
    allImages && format === "PDF" && items.length > 1 ? "images-to-pdf" :
    allPDFs   && format === "PDF" && items.length > 1 ? "pdfs-to-pdf"   : null;

  const isFormatEnabled = (f: string) => !allImages || CLIENT_FORMATS.includes(f);

  useEffect(() => {
    if (allImages && !CLIENT_FORMATS.includes(format)) setFormat("PNG");
  }, [allImages, format]);

  // revoke preview URL when items list changes size (item removed/added)
  useEffect(() => {
    if (preview) { URL.revokeObjectURL(preview.url); setPreview(null); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  const addFiles = useCallback((list: FileList | null) => {
    const arr = Array.from(list ?? []);
    if (!arr.length) return;
    setItems((prev) => {
      const next = [...prev, ...arr.map((file) => ({
        id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 7)}`,
        file,
        status: "queued" as ItemStatus,
      }))];
      setQPage(Math.ceil(next.length / Q_SIZE) - 1);
      return next;
    });
  }, []);

  function removeItem(id: string) {
    setItems((prev) => {
      const it = prev.find((p) => p.id === id);
      if (it?.result?.url.startsWith("blob:")) URL.revokeObjectURL(it.result.url);
      return prev.filter((p) => p.id !== id);
    });
  }

  function clearAll() {
    items.forEach((i) => i.result?.url.startsWith("blob:") && URL.revokeObjectURL(i.result.url));
    setItems([]);
  }

  function openPreview(item: QueueItem) {
    if (preview) URL.revokeObjectURL(preview.url);
    const url = URL.createObjectURL(item.file);
    const type = isImageFile(item.file) ? "image" : isPDFFile(item.file) ? "pdf" : "other";
    setPreview({ url, type, name: item.file.name });
  }

  function closePreview() {
    if (preview) URL.revokeObjectURL(preview.url);
    setPreview(null);
  }

  async function convertAll() {
    const pending = items.filter((i) => i.status === "queued" || i.status === "error");
    if (!pending.length) return;
    setConverting(true);
    setConvPct(5);

    // ── Combine multiple images into one PDF ──
    if (mergeMode === "images-to-pdf") {
      try {
        setConvPct(20);
        const blob = await combineImagesToPDF(pending.map((i) => i.file));
        setConvPct(90);
        const result = { url: URL.createObjectURL(blob), name: "combined.pdf", size: blob.size };
        const ids = new Set(pending.map((p) => p.id));
        setItems((prev) => [
          ...prev.filter((p) => !ids.has(p.id)),
          { id: `merged-${Date.now()}`, file: new File([blob], "combined.pdf", { type: "application/pdf" }), status: "done", result },
        ]);
        triggerDownload(result.url, result.name);
        toast(`${pending.length} images combined into one PDF`, "success");
      } catch (e) {
        toast(e instanceof Error ? e.message : "Combine failed.", "error");
      }
      setConvPct(100);
      await new Promise((r) => setTimeout(r, 400));
      setConverting(false); setConvPct(0);
      return;
    }

    // ── Merge multiple PDFs into one ──
    if (mergeMode === "pdfs-to-pdf") {
      try {
        setConvPct(15);
        const result = await mergePDFsViaServer(pending.map((i) => i.file));
        setConvPct(90);
        const ids = new Set(pending.map((p) => p.id));
        setItems((prev) => [
          ...prev.filter((p) => !ids.has(p.id)),
          { id: `merged-${Date.now()}`, file: new File([], result.name, { type: "application/pdf" }), status: "done", result },
        ]);
        triggerDownload(result.url, result.name);
        toast(`${pending.length} PDFs merged into one`, "success");
      } catch (e) {
        toast(e instanceof Error ? e.message : "PDF merge failed.", "error");
      }
      setConvPct(100);
      await new Promise((r) => setTimeout(r, 400));
      setConverting(false); setConvPct(0);
      return;
    }

    // ── Normal per-file conversion ──
    let ok = 0; let fail = 0;
    for (let idx = 0; idx < pending.length; idx++) {
      const item = pending[idx]!;
      setItems((prev) => prev.map((p) => p.id === item.id ? { ...p, status: "converting", error: undefined } : p));
      try {
        const baseName = item.file.name.replace(/\.[^.]+$/, "") || "converted";
        const useClient = isImageFile(item.file) && CLIENT_FORMATS.includes(format);
        let result: { url: string; name: string; size: number };
        if (useClient) {
          const blob = await convertImage(item.file, format);
          result = { url: URL.createObjectURL(blob), name: `${baseName}.${EXT[format]}`, size: blob.size };
        } else {
          result = await convertViaServer(item.file, format);
        }
        setItems((prev) => prev.map((p) => p.id === item.id ? { ...p, status: "done", result } : p));
        triggerDownload(result.url, result.name);
        ok++;
      } catch (e) {
        fail++;
        setItems((prev) => prev.map((p) => p.id === item.id ? { ...p, status: "error", error: e instanceof Error ? e.message : "Failed" } : p));
      }
      setConvPct(Math.round(5 + ((idx + 1) / pending.length) * 95));
    }
    setConvPct(100);
    await new Promise((r) => setTimeout(r, 500));
    setConverting(false); setConvPct(0);
    if (ok)   toast(`Converted ${ok} file${ok === 1 ? "" : "s"} ✓`, "success");
    if (fail) toast(`${fail} couldn't be converted.`, "error");
  }

  function downloadAll() {
    const ready = items.filter((i) => i.result);
    ready.forEach((i, idx) => setTimeout(() => triggerDownload(i.result!.url, i.result!.name), idx * 250));
    if (ready.length) toast(`Downloading ${ready.length} file${ready.length === 1 ? "" : "s"}...`, "info");
  }

  const doneCount      = items.filter((i) => i.status === "done").length;
  const pendingCount   = items.filter((i) => i.status === "queued" || i.status === "error").length;
  const convertingItem = items.filter((i) => i.status === "converting").length;

  const qPageCount = Math.max(1, Math.ceil(items.length / Q_SIZE));
  const qPageSafe  = Math.min(qPage, qPageCount - 1);
  const pageItems  = items.slice(qPageSafe * Q_SIZE, qPageSafe * Q_SIZE + Q_SIZE);

  const convertLabel =
    mergeMode === "images-to-pdf" ? `Combine ${pendingCount} images → PDF` :
    mergeMode === "pdfs-to-pdf"   ? `Merge ${pendingCount} PDFs → PDF` :
    pendingCount === 0 ? (doneCount > 0 ? "All converted ✓" : "Add files to convert") :
    `Convert ${pendingCount} → .${EXT[format] ?? format.toLowerCase()}`;

  return (
    <section id="convert" className="relative z-[2] mx-auto max-w-[1180px] px-4 py-16 sm:px-6">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 mx-auto h-[420px] max-w-[820px] -translate-y-1/2 rounded-[40px] bg-[radial-gradient(60%_60%_at_30%_50%,rgba(78,205,196,0.10),transparent_70%),radial-gradient(60%_60%_at_80%_50%,rgba(155,89,182,0.12),transparent_70%)]" />

      <Reveal className="mx-auto mb-10 max-w-[620px] text-center">
        <div className="mb-4 text-[13px] font-semibold uppercase tracking-[0.14em] text-accent-violet">Convert with ease</div>
        <h2 className="m-0 font-display text-[clamp(30px,4.4vw,50px)] font-bold leading-[1.05] tracking-[-0.03em]">
          Convert any file &mdash; even a batch.
        </h2>
        <p className="mx-auto mt-4 max-w-[460px] text-[16px] leading-[1.6] text-white/55">
          Drop in one file or many, pick a format, and Hippo Stash converts them
          all. Images convert instantly; documents in the cloud.
        </p>
      </Reveal>

      <Reveal>
        <div className="mx-auto max-w-[960px] overflow-hidden rounded-[20px] border border-white/10 bg-[#0a0a12]/95 shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
          <div className="h-[3px] w-full bg-[linear-gradient(90deg,var(--a1),var(--a2),var(--a3))]" />
          <div className="flex items-center gap-2 border-b border-white/[0.07] px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            <span className="ml-2 font-mono text-xs text-white/40">hippo-convert</span>
            <span className="ml-auto font-mono text-[11px] text-white/40">{items.length} file{items.length === 1 ? "" : "s"}</span>
          </div>

          <input ref={inputRef} type="file" accept={ACCEPT} multiple className="sr-only" aria-label="Select files to convert" onChange={(e) => addFiles(e.target.files)} />

          {/* Fixed-height inner grid — height never changes as files are added/removed */}
          <div className="grid md:grid-cols-[1.45fr_1fr] md:h-[456px]">

            {/* ── Left: dropzone + queue (or preview) ── */}
            <div className="flex flex-col overflow-hidden border-b border-white/[0.06] p-5 md:border-b-0 md:border-r">

              <AnimatePresence mode="wait" initial={false}>
                {preview ? (
                  /* ── Preview pane ── */
                  <motion.div key="preview" className="flex flex-1 flex-col min-h-0"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                    <div className="mb-3 flex flex-none items-center gap-2">
                      <button onClick={closePreview} className="flex items-center gap-1 rounded-[8px] border border-white/10 px-2.5 py-1 font-mono text-[11px] text-white/50 transition-colors hover:text-white">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" strokeLinecap="round" /></svg>
                        Back
                      </button>
                      <span className="flex-1 truncate text-right font-mono text-[11px] text-white/40">{preview.name}</span>
                    </div>
                    <div className="flex-1 min-h-0 overflow-hidden rounded-[12px] border border-white/[0.06] bg-white/[0.02]">
                      {preview.type === "image" ? (
                        <img src={preview.url} alt={preview.name} className="h-full w-full object-contain p-2" />
                      ) : preview.type === "pdf" ? (
                        <embed src={preview.url} type="application/pdf" className="h-full w-full" />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <FileGlyph format={glyphFor(preview.name)} size={80} showLabel />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  /* ── Queue view ── */
                  <motion.div key="queue" className="flex flex-1 flex-col min-h-0"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>

                    {/* Compact dropzone */}
                    <div
                      role="button" tabIndex={0}
                      onClick={() => inputRef.current?.click()}
                      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
                      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                      onDragLeave={() => setDragging(false)}
                      onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
                      className={cn(
                        "flex flex-none cursor-pointer flex-col items-center justify-center gap-3 rounded-[14px] border border-dashed px-6 py-8 text-center transition-colors",
                        dragging ? "border-accent-cyan/70 bg-accent-cyan/[0.06]" : "border-white/15 bg-white/[0.02] hover:border-white/25"
                      )}
                    >
                      <div className="grid h-12 w-12 flex-none place-items-center rounded-[12px] bg-[linear-gradient(135deg,var(--a1),var(--a2))]">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0B0B14" strokeWidth="2.4"><path d="M12 16V4M7 9l5-5 5 5M5 20h14" /></svg>
                      </div>
                      <div>
                        <div className="font-mono text-[15px] text-white/80">Drop files to convert</div>
                        <div className="mt-1 font-mono text-[12px] text-white/40">images &middot; pdf &middot; docx &middot; xlsx &middot; &hellip;</div>
                      </div>
                    </div>

                    {/* Merge mode banner */}
                    <AnimatePresence>
                      {mergeMode && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: "auto", marginTop: 10 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex-none overflow-hidden rounded-[9px] border border-accent-cyan/25 bg-accent-cyan/[0.05] px-3 py-2 text-[11px] text-accent-cyan"
                        >
                          {mergeMode === "images-to-pdf"
                            ? `These ${items.length} images will be combined into one PDF`
                            : `These ${items.length} PDFs will be merged into one`}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* File list — always exactly Q_SIZE slots */}
                    <div className="relative mt-3 flex flex-1 flex-col min-h-0">
                      <div className="flex flex-col gap-2">
                        <AnimatePresence>
                          {pageItems.map((it) => (
                            <motion.div
                              key={it.id}
                              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                              transition={{ duration: 0.15 }}
                              className="flex h-[58px] items-center gap-2.5 rounded-[12px] border border-white/[0.06] bg-white/[0.03] px-3"
                            >
                              <FileGlyph format={glyphFor(it.file.name)} size={30} showLabel={false} />
                              <div className="min-w-0 flex-1">
                                <div className="truncate text-sm font-medium">{it.file.name}</div>
                                <div className="text-xs text-white/45">
                                  {it.status === "converting" ? <span className="text-accent-cyan">Converting&hellip;</span>
                                   : it.status === "done"      ? <span className="text-file-image">Done &middot; {formatBytes(it.result!.size)}</span>
                                   : it.status === "error"     ? <span className="text-file-pdf truncate">{it.error}</span>
                                   : formatBytes(it.file.size)}
                                </div>
                              </div>
                              <div className="flex items-center gap-0.5">
                                {/* Preview */}
                                <button onClick={() => openPreview(it)} title="Preview" aria-label="Preview"
                                  className="grid h-7 w-7 place-items-center rounded-[8px] text-white/35 transition-colors hover:bg-white/10 hover:text-white">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>
                                </button>
                                {/* Converting spinner / download / remove */}
                                {it.status === "converting" ? (
                                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-accent-cyan" />
                                ) : it.status === "done" ? (
                                  <a href={it.result!.url} download={it.result!.name} title="Download"
                                    className="grid h-7 w-7 place-items-center rounded-[8px] text-accent-cyan transition-colors hover:bg-white/10">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 4v12m0 0l-4-4m4 4l4-4M5 20h14" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                  </a>
                                ) : (
                                  <button onClick={() => removeItem(it.id)} aria-label="Remove"
                                    className="grid h-7 w-7 place-items-center rounded-[8px] text-white/35 transition-colors hover:bg-white/10 hover:text-file-pdf">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" /></svg>
                                  </button>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                        {/* Ghost slots — keep height stable */}
                        {Array.from({ length: Math.max(0, Q_SIZE - pageItems.length) }).map((_, i) => (
                          <div key={`g-${i}`} aria-hidden className="h-[58px] rounded-[12px] border border-white/[0.03]" />
                        ))}
                      </div>

                      {/* Empty state overlay */}
                      {items.length === 0 && (
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                          <p className="font-mono text-xs text-white/25">no files queued yet</p>
                        </div>
                      )}
                    </div>

                    {/* Pagination row — always occupies space */}
                    <div className="mt-2 flex h-[32px] flex-none items-center">
                      {qPageCount > 1 ? (
                        <div className="flex w-full items-center justify-between font-mono text-[11px] text-white/45">
                          <button onClick={() => setQPage((p) => Math.max(0, p - 1))} disabled={qPageSafe === 0}
                            className="rounded-[7px] border border-white/10 px-2.5 py-1 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-40">
                            &larr; prev
                          </button>
                          <span>{qPageSafe + 1} / {qPageCount} &middot; {items.length} files</span>
                          <button onClick={() => setQPage((p) => Math.min(qPageCount - 1, p + 1))} disabled={qPageSafe >= qPageCount - 1}
                            className="rounded-[7px] border border-white/10 px-2.5 py-1 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-40">
                            next &rarr;
                          </button>
                        </div>
                      ) : items.length > 0 ? (
                        <span className="font-mono text-[11px] text-white/30">{items.length} file{items.length === 1 ? "" : "s"} &mdash; add more or convert</span>
                      ) : null}
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Right: format picker + actions ── */}
            <div className="flex flex-col overflow-hidden p-5">
              <div className="mb-1 font-mono text-[11px] uppercase tracking-wider text-white/40">output format</div>
              <div className="flex flex-col gap-3">
                {FORMAT_GROUPS.map((g) => (
                  <div key={g.label}>
                    <div className="mb-1.5 text-[11px] text-white/35">{g.label}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {g.formats.map((f) => {
                        const enabled = isFormatEnabled(f);
                        return (
                          <button key={f} onClick={() => enabled && setFormat(f)} disabled={!enabled}
                            title={enabled ? undefined : "Not supported for image files"}
                            className={cn(
                              "rounded-[8px] border px-3 py-1.5 font-mono text-[12px] transition-colors",
                              !enabled ? "cursor-not-allowed border-white/[0.05] text-white/20" :
                              format === f ? "border-accent-cyan/60 bg-accent-cyan/10 text-accent-cyan" : "border-white/10 text-white/55 hover:text-white"
                            )}>
                            .{EXT[f] ?? f.toLowerCase()}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-4">
                {/* Progress bar */}
                {converting && (
                  <div className="mb-3 overflow-hidden rounded-[11px] border border-accent-cyan/20 bg-accent-cyan/[0.04] px-4 py-3">
                    <div className="mb-2 flex items-center justify-between text-xs">
                      <span className="font-medium text-white/70">
                        {mergeMode ? "Merging files…" : `Converting ${doneCount + convertingItem}/${doneCount + convertingItem + pendingCount}…`}
                      </span>
                      <span className="font-semibold tabular-nums text-accent-cyan">{convPct}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08]">
                      <div className="h-full rounded-full bg-accent-cyan transition-all duration-300 ease-out" style={{ width: `${convPct}%` }} />
                    </div>
                  </div>
                )}

                {!converting && (
                  <button onClick={convertAll} disabled={pendingCount === 0}
                    className="btn-primary w-full rounded-[12px] py-[13px] text-[15px] disabled:cursor-not-allowed disabled:opacity-50">
                    {convertLabel}
                  </button>
                )}

                {doneCount > 0 && !converting && (
                  <div className="mt-2 flex gap-2">
                    {doneCount > 1 && (
                      <button onClick={downloadAll} className="flex-1 rounded-[12px] border border-white/10 bg-white/[0.04] py-2.5 text-sm font-semibold text-white hover:bg-white/[0.08]">
                        Download all ({doneCount})
                      </button>
                    )}
                    <button onClick={clearAll} className="flex-1 rounded-[12px] border border-white/10 bg-white/[0.04] py-2.5 text-sm font-semibold text-white hover:bg-white/[0.08]">
                      Clear
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────── server paths ── */

async function convertViaServer(file: File, format: string): Promise<{ url: string; name: string; size: number }> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("format", format);
  const res = await fetch("/api/convert", { method: "POST", body: fd });
  const ct = res.headers.get("content-type") ?? "";
  if (!ct.includes("application/json")) throw new Error(`Server error (${res.status}) — please try again.`);
  const data = (await res.json()) as { url?: string; name?: string; size?: number; error?: string };
  if (!res.ok || !data.url) throw new Error(data.error ?? "Conversion failed.");
  return { url: data.url, name: data.name ?? `converted.${format.toLowerCase()}`, size: data.size ?? 0 };
}

async function mergePDFsViaServer(files: File[]): Promise<{ url: string; name: string; size: number }> {
  const fd = new FormData();
  files.forEach((f) => fd.append("file", f));
  const res = await fetch("/api/merge", { method: "POST", body: fd });
  const ct = res.headers.get("content-type") ?? "";
  if (!ct.includes("application/json")) throw new Error(`Server error (${res.status}) — please try again.`);
  const data = (await res.json()) as { url?: string; name?: string; size?: number; error?: string };
  if (!res.ok || !data.url) throw new Error(data.error ?? "PDF merge failed.");
  return { url: data.url, name: data.name ?? "merged.pdf", size: data.size ?? 0 };
}

/* ─────────────────────────────────────────────────── client-side converters ── */

async function combineImagesToPDF(files: File[]): Promise<Blob> {
  const pages: Array<{ jpeg: Uint8Array; w: number; h: number }> = [];
  for (const file of files) {
    const img = await loadImage(file);
    const w = img.naturalWidth || img.width;
    const h = img.naturalHeight || img.height;
    const jpeg = await canvasToBlob(drawCanvas(img, w, h, "#ffffff"), "image/jpeg", 0.88);
    pages.push({ jpeg: new Uint8Array(await jpeg.arrayBuffer()), w, h });
  }
  return encodePDFPages(pages);
}

async function convertImage(file: File, format: string): Promise<Blob> {
  const img = await loadImage(file);
  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;
  switch (format) {
    case "PNG":
    case "WEBP":
      return canvasToBlob(drawCanvas(img, w, h), format === "PNG" ? "image/png" : "image/webp");
    case "JPEG":
      return canvasToBlob(drawCanvas(img, w, h, "#ffffff"), "image/jpeg", 0.92);
    case "BMP":
      return encodeBMP(drawCanvas(img, w, h).getContext("2d")!.getImageData(0, 0, w, h));
    case "PDF": {
      const jpeg = await canvasToBlob(drawCanvas(img, w, h, "#ffffff"), "image/jpeg", 0.92);
      const bytes = new Uint8Array(await jpeg.arrayBuffer());
      return encodePDFPages([{ jpeg: bytes, w, h }]);
    }
    case "ICO": {
      const scale = Math.min(1, 256 / Math.max(w, h));
      const iw = Math.max(1, Math.round(w * scale));
      const ih = Math.max(1, Math.round(h * scale));
      const png = await canvasToBlob(drawCanvas(img, iw, ih), "image/png");
      return encodeICO(new Uint8Array(await png.arrayBuffer()), iw, ih);
    }
    default:
      throw new Error(`Unsupported image target: ${format}`);
  }
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Could not load image")); };
    img.src = url;
  });
}

function drawCanvas(img: HTMLImageElement, w: number, h: number, background?: string): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  if (background) { ctx.fillStyle = background; ctx.fillRect(0, 0, w, h); }
  ctx.drawImage(img, 0, 0, w, h);
  return canvas;
}

function canvasToBlob(canvas: HTMLCanvasElement, mime: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Encode failed")), mime, quality)
  );
}

/** Multi-page PDF encoder — one JPEG image per page, no external deps. */
function encodePDFPages(pages: Array<{ jpeg: Uint8Array; w: number; h: number }>): Blob {
  const enc = new TextEncoder();
  const chunks: Uint8Array[] = [];
  const offsets: number[] = [];
  let length = 0;
  const push = (d: string | Uint8Array) => { const b = typeof d === "string" ? enc.encode(d) : d; chunks.push(b); length += b.length; };
  const obj  = () => offsets.push(length);

  // Object layout:  1=Catalog  2=Pages  [3+i*3=Page  4+i*3=Content  5+i*3=Image] per page
  const n = pages.length;
  push("%PDF-1.4\n");
  obj(); push(`1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`);
  obj(); push(`2 0 obj\n<< /Type /Pages /Kids [${pages.map((_, i) => `${3 + i * 3} 0 R`).join(" ")}] /Count ${n} >>\nendobj\n`);
  for (let i = 0; i < n; i++) {
    const { jpeg, w, h } = pages[i]!;
    const [pn, cn, xn] = [3 + i * 3, 4 + i * 3, 5 + i * 3];
    obj(); push(`${pn} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${w} ${h}] /Resources << /XObject << /Im0 ${xn} 0 R >> >> /Contents ${cn} 0 R >>\nendobj\n`);
    const content = `q ${w} 0 0 ${h} 0 0 cm /Im0 Do Q`;
    obj(); push(`${cn} 0 obj\n<< /Length ${content.length} >>\nstream\n${content}\nendstream\nendobj\n`);
    obj(); push(`${xn} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${w} /Height ${h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`);
    push(jpeg); push("\nendstream\nendobj\n");
  }
  const xrefStart = length;
  const size = 2 + n * 3 + 1;
  let xref = `xref\n0 ${size}\n0000000000 65535 f \n`;
  for (const off of offsets) xref += `${String(off).padStart(10, "0")} 00000 n \n`;
  push(xref);
  push(`trailer\n<< /Size ${size} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`);
  const out = new Uint8Array(length);
  let pos = 0;
  for (const c of chunks) { out.set(c, pos); pos += c.length; }
  return new Blob([out], { type: "application/pdf" });
}

function encodeBMP(image: ImageData): Blob {
  const { width, height, data } = image;
  const rowSize = Math.floor((24 * width + 31) / 32) * 4;
  const pixelArraySize = rowSize * height;
  const fileSize = 54 + pixelArraySize;
  const buf = new ArrayBuffer(fileSize);
  const dv = new DataView(buf);
  const bytes = new Uint8Array(buf);
  dv.setUint8(0, 0x42); dv.setUint8(1, 0x4d);
  dv.setUint32(2, fileSize, true); dv.setUint32(10, 54, true);
  dv.setUint32(14, 40, true); dv.setInt32(18, width, true); dv.setInt32(22, height, true);
  dv.setUint16(26, 1, true); dv.setUint16(28, 24, true); dv.setUint32(34, pixelArraySize, true);
  dv.setInt32(38, 2835, true); dv.setInt32(42, 2835, true);
  for (let y = 0; y < height; y++) {
    const srcY = height - 1 - y; let p = 54 + y * rowSize;
    for (let x = 0; x < width; x++) {
      const i = (srcY * width + x) * 4;
      bytes[p++] = data[i + 2]!; bytes[p++] = data[i + 1]!; bytes[p++] = data[i]!;
    }
  }
  return new Blob([buf], { type: "image/bmp" });
}

function encodeICO(png: Uint8Array, width: number, height: number): Blob {
  const header = new ArrayBuffer(22);
  const dv = new DataView(header);
  dv.setUint16(0, 0, true); dv.setUint16(2, 1, true); dv.setUint16(4, 1, true);
  dv.setUint8(6, width >= 256 ? 0 : width); dv.setUint8(7, height >= 256 ? 0 : height);
  dv.setUint8(8, 0); dv.setUint8(9, 0); dv.setUint16(10, 1, true); dv.setUint16(12, 32, true);
  dv.setUint32(14, png.length, true); dv.setUint32(18, 22, true);
  return new Blob([header, png as BlobPart], { type: "image/x-icon" });
}
