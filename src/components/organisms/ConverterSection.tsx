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

// Image inputs convert to these in-browser (instant, free); everything else
// goes to the cloud converter.
const CLIENT_FORMATS = ["PNG", "JPEG", "WEBP", "BMP", "ICO", "PDF"];

const FORMAT_GROUPS = [
  { label: "To image", formats: ["PNG", "JPEG", "WEBP", "GIF", "BMP", "ICO"] },
  { label: "To document", formats: ["PDF", "DOCX", "TXT"] },
];

const ACCEPT = "image/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.rtf,.odt,.csv";

type ItemStatus = "queued" | "converting" | "done" | "error";
interface QueueItem {
  id: string;
  file: File;
  status: ItemStatus;
  result?: { url: string; name: string; size: number };
  error?: string;
}

function glyphFor(name: string): string {
  return (name.split(".").pop() || "ZIP").toUpperCase();
}
const isImageFile = (f: File) => f.type.startsWith("image/");
const Q_SIZE = 4; // queue page size — ~2 rows, then paginate

export function ConverterSection() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<QueueItem[]>([]);
  const [format, setFormat] = useState("PNG");
  const [converting, setConverting] = useState(false);
  const [convPct, setConvPct] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [qPage, setQPage] = useState(0);
  const { toast } = useToast();

  // When all queued files are images, restrict to image-compatible output formats only
  const allImages = items.length > 0 && items.every((i) => isImageFile(i.file));
  const isFormatEnabled = (f: string) => !allImages || CLIENT_FORMATS.includes(f);
  // If the selected format becomes disabled, fall back to PNG
  useEffect(() => {
    if (allImages && !CLIENT_FORMATS.includes(format)) setFormat("PNG");
  }, [allImages, format]);

  const addFiles = useCallback((list: FileList | null) => {
    const arr = Array.from(list ?? []);
    if (!arr.length) return;
    setItems((prev) => {
      const next = [
        ...prev,
        ...arr.map((file) => ({
          id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 7)}`,
          file,
          status: "queued" as ItemStatus,
        })),
      ];
      setQPage(Math.ceil(next.length / Q_SIZE) - 1); // reveal newly added files
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

  async function convertAll() {
    const pending = items.filter((i) => i.status === "queued" || i.status === "error");
    if (!pending.length) return;
    setConverting(true);
    setConvPct(5);
    let ok = 0;
    let fail = 0;

    for (let idx = 0; idx < pending.length; idx++) {
      const item = pending[idx]!;
      setItems((prev) => prev.map((p) => (p.id === item.id ? { ...p, status: "converting", error: undefined } : p)));
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
        setItems((prev) => prev.map((p) => (p.id === item.id ? { ...p, status: "done", result } : p)));
        const a = document.createElement("a");
        a.href = result.url;
        a.download = result.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        ok++;
      } catch (e) {
        fail++;
        const msg = e instanceof Error ? e.message : "Failed";
        setItems((prev) => prev.map((p) => (p.id === item.id ? { ...p, status: "error", error: msg } : p)));
      }
      setConvPct(Math.round(5 + ((idx + 1) / pending.length) * 95));
    }
    setConvPct(100);
    await new Promise((r) => setTimeout(r, 500));
    setConverting(false);
    setConvPct(0);
    if (ok) toast(`Converted ${ok} file${ok === 1 ? "" : "s"} ✓`, "success");
    if (fail) toast(`${fail} file${fail === 1 ? "" : "s"} couldn't be converted.`, "error");
  }

  function downloadAll() {
    const ready = items.filter((i) => i.result);
    if (ready.length) toast(`Downloading ${ready.length} file${ready.length === 1 ? "" : "s"}…`, "info");
    ready.forEach((i, idx) => {
      setTimeout(() => {
        const a = document.createElement("a");
        a.href = i.result!.url;
        a.download = i.result!.name;
        a.click();
      }, idx * 250);
    });
  }

  const doneCount = items.filter((i) => i.status === "done").length;
  const pendingCount = items.filter((i) => i.status === "queued" || i.status === "error").length;
  const convertingCount = items.filter((i) => i.status === "converting").length;

  const qPageCount = Math.max(1, Math.ceil(items.length / Q_SIZE));
  const qPageSafe = Math.min(qPage, qPageCount - 1);
  const pageItems = items.slice(qPageSafe * Q_SIZE, qPageSafe * Q_SIZE + Q_SIZE);

  return (
    <section id="convert" className="relative z-[2] mx-auto max-w-[1180px] px-4 py-16 sm:px-6">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 mx-auto h-[420px] max-w-[820px] -translate-y-1/2 rounded-[40px] bg-[radial-gradient(60%_60%_at_30%_50%,rgba(78,205,196,0.10),transparent_70%),radial-gradient(60%_60%_at_80%_50%,rgba(155,89,182,0.12),transparent_70%)]" />

      <Reveal className="mx-auto mb-10 max-w-[620px] text-center">
        <div className="mb-4 text-[13px] font-semibold uppercase tracking-[0.14em] text-accent-violet">Convert with ease</div>
        <h2 className="m-0 font-display text-[clamp(30px,4.4vw,50px)] font-bold leading-[1.05] tracking-[-0.03em]">
          Convert any file — even a batch.
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

          <div className="grid md:grid-cols-[1.45fr_1fr]">
            {/* left — dropzone + queue */}
            <div className="border-b border-white/[0.06] p-5 md:border-b-0 md:border-r">
              <div
                role="button"
                tabIndex={0}
                onClick={() => inputRef.current?.click()}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
                className={cn(
                  "flex cursor-pointer flex-col items-center justify-center rounded-[14px] border border-dashed p-6 text-center transition-colors",
                  dragging ? "border-accent-cyan/70 bg-accent-cyan/[0.06]" : "border-white/15 bg-white/[0.02] hover:border-white/25"
                )}
              >
                <div className="mb-2 grid h-10 w-10 place-items-center rounded-[12px] bg-[linear-gradient(135deg,var(--a1),var(--a2))]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0B0B14" strokeWidth="2.2"><path d="M12 16V4M7 9l5-5 5 5M5 20h14" /></svg>
                </div>
                <div className="font-mono text-[13px] text-white/70">drop files to convert</div>
                <div className="mt-1 font-mono text-[11px] text-white/35">images · pdf · docx · xlsx · …</div>
              </div>

              {/* queue */}
              <div className="mt-4 flex flex-col gap-2">
                <AnimatePresence mode="popLayout">
                  {pageItems.map((it) => (
                    <motion.div
                      key={it.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -16, height: 0 }}
                      transition={{ duration: 0.22 }}
                      className="flex h-[58px] items-center gap-3 rounded-[12px] border border-white/[0.06] bg-white/[0.03] px-3"
                    >
                      <FileGlyph format={glyphFor(it.file.name)} size={28} showLabel={false} />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">{it.file.name}</div>
                        <div className="text-xs text-white/45">
                          {it.status === "converting" ? (
                            <span className="text-accent-cyan">Converting…</span>
                          ) : it.status === "done" ? (
                            <span className="text-file-image">Done · {formatBytes(it.result!.size)}</span>
                          ) : it.status === "error" ? (
                            <span className="text-file-pdf">{it.error}</span>
                          ) : (
                            formatBytes(it.file.size)
                          )}
                        </div>
                      </div>
                      {it.status === "converting" ? (
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-accent-cyan" />
                      ) : it.status === "done" ? (
                        <a href={it.result!.url} download={it.result!.name} title="Download" className="grid h-7 w-7 place-items-center rounded-[8px] text-accent-cyan transition-colors hover:bg-white/10">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 4v12m0 0l-4-4m4 4l4-4M5 20h14" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </a>
                      ) : (
                        <button onClick={() => removeItem(it.id)} aria-label="Remove" className="grid h-7 w-7 place-items-center rounded-[8px] text-white/40 transition-colors hover:bg-white/10 hover:text-file-pdf">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" /></svg>
                        </button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {qPageCount > 1 && Array.from({ length: Math.max(0, Q_SIZE - pageItems.length) }).map((_, i) => (
                  <div key={`qph-${i}`} aria-hidden className="h-[58px]" />
                ))}
                {items.length === 0 && (
                  <p className="py-6 text-center font-mono text-xs text-white/30">no files queued yet</p>
                )}
                {qPageCount > 1 && (
                  <div className="mt-1 flex items-center justify-between font-mono text-[11px] text-white/45">
                    <button
                      onClick={() => setQPage((p) => Math.max(0, p - 1))}
                      disabled={qPageSafe === 0}
                      className="rounded-[8px] border border-white/10 px-2.5 py-1 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      ← prev
                    </button>
                    <span>{qPageSafe + 1} / {qPageCount} · {items.length} files</span>
                    <button
                      onClick={() => setQPage((p) => Math.min(qPageCount - 1, p + 1))}
                      disabled={qPageSafe >= qPageCount - 1}
                      className="rounded-[8px] border border-white/10 px-2.5 py-1 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      next →
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* right — format + actions */}
            <div className="flex flex-col p-5">
              <div className="mb-1 font-mono text-[11px] uppercase tracking-wider text-white/40">output format</div>
              <div className="flex flex-col gap-3">
                {FORMAT_GROUPS.map((g) => (
                  <div key={g.label}>
                    <div className="mb-1.5 text-[11px] text-white/35">{g.label}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {g.formats.map((f) => {
                        const enabled = isFormatEnabled(f);
                        return (
                          <button
                            key={f}
                            onClick={() => enabled && setFormat(f)}
                            disabled={!enabled}
                            title={enabled ? undefined : "Not supported for image files"}
                            className={cn(
                              "rounded-[8px] border px-3 py-1.5 font-mono text-[12px] transition-colors",
                              !enabled ? "cursor-not-allowed border-white/[0.05] text-white/20" :
                              format === f ? "border-accent-cyan/60 bg-accent-cyan/10 text-accent-cyan" : "border-white/10 text-white/55 hover:text-white"
                            )}
                          >
                            .{EXT[f] ?? f.toLowerCase()}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-5">
                {converting && (
                  <div className="mb-3 overflow-hidden rounded-[12px] border border-accent-cyan/20 bg-accent-cyan/[0.04] px-4 py-3">
                    <div className="mb-2 flex items-center justify-between text-xs">
                      <span className="font-medium text-white/70">
                        Converting {doneCount + convertingCount}/{doneCount + convertingCount + pendingCount}…
                      </span>
                      <span className="font-semibold tabular-nums text-accent-cyan">{convPct}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08]">
                      <div
                        className="h-full rounded-full bg-accent-cyan transition-all duration-300 ease-out"
                        style={{ width: `${convPct}%` }}
                      />
                    </div>
                  </div>
                )}
                {!converting ? (
                  <button
                    onClick={convertAll}
                    disabled={pendingCount === 0}
                    className="btn-primary w-full rounded-[12px] py-[13px] text-[15px] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {pendingCount === 0
                      ? doneCount > 0 ? "All converted ✓" : "Add files to convert"
                      : `Convert ${pendingCount} → .${EXT[format] ?? format.toLowerCase()}`}
                  </button>
                ) : null}

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

/* ── Server path (documents) ── */
async function convertViaServer(file: File, format: string): Promise<{ url: string; name: string; size: number }> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("format", format);
  const res = await fetch("/api/convert", { method: "POST", body: fd });
  // Guard against HTML error pages (Next.js 500/404) being parsed as JSON
  const ct = res.headers.get("content-type") ?? "";
  if (!ct.includes("application/json")) {
    throw new Error(`Server error (${res.status}) — please try again.`);
  }
  const data = (await res.json()) as { url?: string; name?: string; size?: number; error?: string };
  if (!res.ok || !data.url) throw new Error(data.error ?? "Conversion failed.");
  return { url: data.url, name: data.name ?? `converted.${EXT[format] ?? "bin"}`, size: data.size ?? 0 };
}

/* ── Client path (images), dependency-free ── */
const CLIENT_MIME: Record<string, string> = { PNG: "image/png", JPEG: "image/jpeg", WEBP: "image/webp" };

async function convertImage(file: File, format: string): Promise<Blob> {
  const img = await loadImage(file);
  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;
  switch (format) {
    case "PNG":
    case "WEBP":
      return canvasToBlob(drawCanvas(img, w, h), CLIENT_MIME[format]!);
    case "JPEG":
      return canvasToBlob(drawCanvas(img, w, h, "#ffffff"), "image/jpeg", 0.92);
    case "BMP":
      return encodeBMP(drawCanvas(img, w, h).getContext("2d")!.getImageData(0, 0, w, h));
    case "PDF": {
      const jpeg = await canvasToBlob(drawCanvas(img, w, h, "#ffffff"), "image/jpeg", 0.92);
      return encodePDF(new Uint8Array(await jpeg.arrayBuffer()), w, h);
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
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  if (background) { ctx.fillStyle = background; ctx.fillRect(0, 0, w, h); }
  ctx.drawImage(img, 0, 0, w, h);
  return canvas;
}

function canvasToBlob(canvas: HTMLCanvasElement, mime: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Encode failed"))), mime, quality)
  );
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
    const srcY = height - 1 - y;
    let p = 54 + y * rowSize;
    for (let x = 0; x < width; x++) {
      const i = (srcY * width + x) * 4;
      bytes[p++] = data[i + 2]!; bytes[p++] = data[i + 1]!; bytes[p++] = data[i]!;
    }
  }
  return new Blob([buf], { type: "image/bmp" });
}

function encodePDF(jpeg: Uint8Array, width: number, height: number): Blob {
  const enc = new TextEncoder();
  const chunks: Uint8Array[] = [];
  const offsets: number[] = [];
  let length = 0;
  const push = (d: string | Uint8Array) => { const b = typeof d === "string" ? enc.encode(d) : d; chunks.push(b); length += b.length; };
  const obj = () => offsets.push(length);
  push("%PDF-1.4\n");
  obj(); push("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");
  obj(); push("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n");
  obj(); push(`3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${width} ${height}] /Resources << /XObject << /Im0 5 0 R >> >> /Contents 4 0 R >>\nendobj\n`);
  const content = `q ${width} 0 0 ${height} 0 0 cm /Im0 Do Q`;
  obj(); push(`4 0 obj\n<< /Length ${content.length} >>\nstream\n${content}\nendstream\nendobj\n`);
  obj(); push(`5 0 obj\n<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`);
  push(jpeg); push("\nendstream\nendobj\n");
  const xrefStart = length;
  const size = offsets.length + 1;
  let xref = `xref\n0 ${size}\n0000000000 65535 f \n`;
  for (const off of offsets) xref += `${String(off).padStart(10, "0")} 00000 n \n`;
  push(xref);
  push(`trailer\n<< /Size ${size} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`);
  const out = new Uint8Array(length);
  let pos = 0;
  for (const c of chunks) { out.set(c, pos); pos += c.length; }
  return new Blob([out], { type: "application/pdf" });
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
