"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/molecules/Reveal";
import { FileGlyph } from "@/components/atoms/FileGlyph";
import { formatBytes, cn } from "@/lib/utils";

const IMAGE_FORMATS = ["PNG", "JPEG", "WEBP", "PDF", "BMP", "ICO"] as const;
const DOC_FORMATS = ["PDF", "DOCX", "PNG", "JPG", "TXT"] as const;

const EXT: Record<string, string> = {
  PNG: "png", JPEG: "jpg", JPG: "jpg", WEBP: "webp",
  PDF: "pdf", BMP: "bmp", ICO: "ico", DOCX: "docx", TXT: "txt",
};

const ACCEPT = "image/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.rtf,.odt,.csv";

type Stage = "idle" | "converting" | "done";
interface Result {
  url: string;
  name: string;
  size: number;
  serverStored: boolean;
}

function glyphFor(name: string): string {
  return (name.split(".").pop() || "ZIP").toUpperCase();
}

const checklist = [
  "Convert between PDF, DOCX, JPG, PNG, XLSX and more",
  "Original quality preserved, every time",
  "Download or share the moment it's done",
];

export function ConverterSection() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<string>("PNG");
  const [stage, setStage] = useState<Stage>("idle");
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  const isImage = !!file && file.type.startsWith("image/");
  const formats = isImage ? IMAGE_FORMATS : DOC_FORMATS;

  const reset = useCallback(() => {
    if (result?.url.startsWith("blob:")) URL.revokeObjectURL(result.url);
    setFile(null);
    setResult(null);
    setStage("idle");
    setProgress(0);
    setError(null);
  }, [result]);

  function selectFile(f: File | null | undefined) {
    if (!f) return;
    setError(null);
    setResult(null);
    setStage("idle");
    setFile(f);
    const next = f.type.startsWith("image/") ? IMAGE_FORMATS : DOC_FORMATS;
    setFormat(next[0]);
  }

  async function convert() {
    if (!file) return;
    setStage("converting");
    setProgress(0);
    setError(null);

    const timer = setInterval(() => setProgress((p) => (p < 85 ? p + 7 : p)), 150);
    const useClient = isImage && (IMAGE_FORMATS as readonly string[]).includes(format);

    try {
      const baseName = file.name.replace(/\.[^.]+$/, "") || "converted";
      let res: Result;
      if (useClient) {
        const blob = await convertImage(file, format);
        res = { url: URL.createObjectURL(blob), name: `${baseName}.${EXT[format]}`, size: blob.size, serverStored: false };
      } else {
        res = await convertViaServer(file, format);
      }
      clearInterval(timer);
      setProgress(100);
      setResult(res);
      setTimeout(() => setStage("done"), 350);
    } catch (e) {
      clearInterval(timer);
      setStage("idle");
      setProgress(0);
      setError(e instanceof Error ? e.message : "Conversion failed.");
    }
  }

  return (
    <section id="convert" className="relative z-[2] mx-auto max-w-[1180px] px-6 py-16">
      {/* distinct gradient field behind the console */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 mx-auto h-[480px] max-w-[900px] -translate-y-1/2 rounded-[40px] bg-[radial-gradient(60%_60%_at_30%_50%,rgba(78,205,196,0.10),transparent_70%),radial-gradient(60%_60%_at_80%_50%,rgba(155,89,182,0.12),transparent_70%)]" />

      <div className="grid items-center gap-16 md:grid-cols-[1.05fr_0.95fr]">
        {/* Left — converter as an app window (distinct from glass cards) */}
        <Reveal>
          <div className="relative overflow-hidden rounded-[20px] border border-white/10 bg-[#0a0a12]/95 shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
            {/* gradient top accent */}
            <div className="h-[3px] w-full bg-[linear-gradient(90deg,var(--a1),var(--a2),var(--a3))]" />
            {/* window title bar */}
            <div className="flex items-center gap-2 border-b border-white/[0.07] px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              <span className="ml-2 font-mono text-xs text-white/40">hippo-convert</span>
              <span className="ml-auto flex items-center gap-1.5 text-[11px] text-accent-cyan">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-cyan" /> ready
              </span>
            </div>

            <input
              ref={inputRef}
              type="file"
              accept={ACCEPT}
              className="sr-only"
              aria-label="Select a file to convert"
              onChange={(e) => selectFile(e.target.files?.[0])}
            />

            <div className="p-6">
              {stage === "done" && result ? (
                <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                  <div className="mx-auto mb-3.5 grid h-[52px] w-[52px] place-items-center rounded-[14px] bg-[linear-gradient(135deg,var(--a1),var(--a2))]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0B0B14" strokeWidth="2.4"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  <div className="font-display text-[18px] font-semibold">Your file is ready!</div>
                  <div className="mt-1 text-[13px] text-white/45">
                    {result.name} · {formatBytes(result.size)}
                    {result.serverStored && " · saved to your stash"}
                  </div>
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <a href={result.url} download={result.name} className="btn-primary inline-flex h-11 items-center rounded-[12px] px-5 text-sm">Download</a>
                    <button onClick={reset} className="inline-flex h-11 items-center rounded-[12px] border border-white/10 bg-white/[0.04] px-5 text-sm font-semibold text-white hover:bg-white/[0.08]">Convert another</button>
                  </div>
                </motion.div>
              ) : (
                <div>
                  {/* dropzone */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => inputRef.current?.click()}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => { e.preventDefault(); setDragging(false); selectFile(e.dataTransfer.files?.[0]); }}
                    className={cn(
                      "cursor-pointer rounded-[14px] border border-dashed p-8 text-center transition-colors",
                      dragging ? "border-accent-cyan/70 bg-accent-cyan/[0.06]" : "border-white/15 bg-white/[0.02] hover:border-white/25"
                    )}
                  >
                    {file ? (
                      <div className="flex items-center justify-center gap-3">
                        <FileGlyph format={glyphFor(file.name)} size={40} showLabel={false} />
                        <div className="text-left">
                          <div className="text-sm font-semibold">{file.name}</div>
                          <div className="text-xs text-white/45">{formatBytes(file.size)}{!isImage && " · converts in the cloud"}</div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="mx-auto mb-3 grid h-[52px] w-[52px] animate-bob place-items-center rounded-[14px] bg-[linear-gradient(135deg,var(--a1),var(--a2))]">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0B0B14" strokeWidth="2.2"><path d="M12 16V4M7 9l5-5 5 5M5 20h14" /></svg>
                        </div>
                        <div className="font-mono text-[13px] text-white/70">drop a file to convert</div>
                        <div className="mt-1 font-mono text-[11px] text-white/35">pdf · docx · jpg · png · xlsx · …</div>
                      </>
                    )}
                  </div>

                  {error && <p className="mt-4 rounded-[10px] bg-amber-400/10 px-3 py-2 text-sm text-amber-300">{error}</p>}

                  {/* format selector — mono chips */}
                  <div className="mt-5">
                    <div className="mb-2 font-mono text-[11px] uppercase tracking-wider text-white/40">output format</div>
                    <div className="flex flex-wrap gap-2">
                      {formats.map((f) => (
                        <button
                          key={f}
                          onClick={() => setFormat(f)}
                          className={cn(
                            "rounded-[8px] border px-3.5 py-1.5 font-mono text-[13px] transition-colors",
                            format === f ? "border-accent-cyan/60 bg-accent-cyan/10 text-accent-cyan" : "border-white/10 text-white/55 hover:text-white"
                          )}
                        >
                          .{EXT[f] ?? f.toLowerCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {stage === "converting" ? (
                    <div className="mt-5">
                      <div className="mb-2 flex items-center justify-between font-mono text-xs text-white/55">
                        <span>converting…</span><span className="text-accent-cyan">{progress}%</span>
                      </div>
                      <div className="h-[7px] overflow-hidden rounded-full bg-white/[0.07]">
                        <motion.div className="h-full rounded-full bg-gradient-to-r from-accent-cyan to-accent-violet" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  ) : (
                    <button onClick={convert} disabled={!file} className="btn-primary mt-5 w-full rounded-[12px] py-[13px] text-[15px] disabled:cursor-not-allowed disabled:opacity-50">
                      {file ? `Convert → .${EXT[format] ?? format.toLowerCase()}` : "Select a file"}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </Reveal>

        {/* Right — copy */}
        <Reveal>
          <div className="mb-4 text-[13px] font-semibold uppercase tracking-[0.14em] text-accent-violet">Convert with ease</div>
          <h2 className="m-0 mb-[18px] font-display text-[clamp(30px,3.8vw,46px)] font-bold leading-[1.06] tracking-[-0.03em]">
            Change any document into the format you need.
          </h2>
          <p className="m-0 mb-7 text-[17px] leading-[1.6] text-white/55">
            Select a file, choose a format, and Hippo Stash handles the rest —
            images convert instantly in your browser, documents securely in the cloud.
          </p>
          <div className="flex flex-col gap-4">
            {checklist.map((c) => (
              <div key={c} className="flex items-center gap-[13px]">
                <span className="grid h-6 w-6 flex-none place-items-center rounded-full border border-accent-cyan/40 bg-accent-cyan/[0.18]">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--a1)" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
                </span>
                <span className="text-[16px] text-white/[0.82]">{c}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Server path (documents) ── */
async function convertViaServer(file: File, format: string): Promise<Result> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("format", format);
  const res = await fetch("/api/convert", { method: "POST", body: fd });
  const data = (await res.json()) as { url?: string; name?: string; size?: number; error?: string };
  if (!res.ok || !data.url) throw new Error(data.error ?? "Conversion failed.");
  return { url: data.url, name: data.name ?? `converted.${EXT[format] ?? "bin"}`, size: data.size ?? 0, serverStored: true };
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
