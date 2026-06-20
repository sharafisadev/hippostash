"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/molecules/Reveal";
import { Button } from "@/components/atoms/Button";
import { FileTypeIcon } from "@/components/atoms/FileTypeIcon";
import { GlowOrb } from "@/components/atoms/GlowOrb";
import { fileKindFromName, formatBytes, cn } from "@/lib/utils";

const FORMATS = [
  { id: "PNG", ext: "png" },
  { id: "JPEG", ext: "jpg" },
  { id: "WEBP", ext: "webp" },
  { id: "PDF", ext: "pdf" },
  { id: "BMP", ext: "bmp" },
  { id: "ICO", ext: "ico" },
] as const;

type FormatId = (typeof FORMATS)[number]["id"];
type Stage = "idle" | "converting" | "done";

interface Result {
  url: string;
  name: string;
  size: number;
}

export function ConverterSection() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<FormatId>("PNG");
  const [stage, setStage] = useState<Stage>("idle");
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  const reset = useCallback(() => {
    if (result) URL.revokeObjectURL(result.url);
    setFile(null);
    setResult(null);
    setStage("idle");
    setProgress(0);
    setError(null);
  }, [result]);

  function selectFile(f: File | null | undefined) {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError(
        "This live demo converts images. Full PDF & DOC document conversion lives in the app."
      );
      setFile(null);
      return;
    }
    setError(null);
    setResult(null);
    setStage("idle");
    setFile(f);
  }

  async function convert() {
    if (!file) return;
    setStage("converting");
    setProgress(0);
    setError(null);

    const timer = setInterval(
      () => setProgress((p) => (p < 80 ? p + 10 : p)),
      80
    );

    try {
      const target = FORMATS.find((f) => f.id === format)!;
      const blob = await convertImage(file, format);
      const url = URL.createObjectURL(blob);
      const baseName = file.name.replace(/\.[^.]+$/, "");
      clearInterval(timer);
      setProgress(100);
      setResult({ url, name: `${baseName}.${target.ext}`, size: blob.size });
      setTimeout(() => setStage("done"), 350);
    } catch {
      clearInterval(timer);
      setStage("idle");
      setProgress(0);
      setError("Couldn't convert that image. Try a different file.");
    }
  }

  return (
    <section id="convert" className="relative overflow-hidden px-4 py-24">
      <GlowOrb color="cyan" size={420} className="-left-10 top-20" />
      <div className="mx-auto max-w-3xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Convert files in seconds
          </h2>
          <p className="mt-4 text-text-secondary">
            Try it right here — drop an image and convert it in your browser. No
            upload, no sign-up.
          </p>
        </Reveal>

        <Reveal className="mt-10">
          <div className="glass-strong rounded-card p-6 sm:p-8">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              aria-label="Select an image to convert"
              onChange={(e) => selectFile(e.target.files?.[0])}
            />

            {stage === "done" && result ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-file-image/15">
                  <svg viewBox="0 0 24 24" className="h-7 w-7 text-file-image" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Your file is ready!
                </h3>
                <p className="mt-1 text-sm text-text-secondary">
                  {result.name} · {formatBytes(result.size)}
                </p>
                <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <a
                    href={result.url}
                    download={result.name}
                    className="btn-gradient inline-flex h-11 items-center justify-center rounded-btn px-5 text-sm"
                  >
                    Download
                  </a>
                  <Button variant="glass" onClick={reset}>
                    Convert another
                  </Button>
                </div>
              </motion.div>
            ) : (
              <>
                {/* Step 1 — Select */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => inputRef.current?.click()}
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") &&
                    inputRef.current?.click()
                  }
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    selectFile(e.dataTransfer.files?.[0]);
                  }}
                  className={cn(
                    "flex cursor-pointer flex-col items-center justify-center rounded-card border-2 border-dashed p-10 text-center transition-colors",
                    dragging
                      ? "border-accent-cyan/70 bg-accent-cyan/5"
                      : "border-hairline hover:border-white/25"
                  )}
                >
                  {file ? (
                    <div className="flex items-center gap-3">
                      <FileTypeIcon
                        kind={fileKindFromName(file.name, file.type)}
                        size={44}
                      />
                      <div className="text-left">
                        <p className="text-sm font-medium text-white">
                          {file.name}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {formatBytes(file.size)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mb-3 grid h-12 w-12 place-items-center rounded-btn bg-accent-gradient-soft">
                        <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 16V4m0 0L7 9m5-5 5 5M5 20h14" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-white">
                        Browse or drag &amp; drop an image
                      </p>
                      <p className="mt-1 text-xs text-text-secondary">
                        PNG, JPG, or WEBP
                      </p>
                    </>
                  )}
                </div>

                {error && (
                  <p className="mt-4 rounded-btn bg-amber-400/10 px-3 py-2 text-sm text-amber-300">
                    {error}
                  </p>
                )}

                {/* Step 2 — Format */}
                <div className="mt-6">
                  <p className="mb-2 text-sm font-medium text-text-secondary">
                    Convert to
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {FORMATS.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setFormat(f.id)}
                        className={cn(
                          "rounded-pill border px-4 py-2 text-sm transition-colors",
                          format === f.id
                            ? "border-accent-cyan/60 bg-accent-cyan/10 text-white"
                            : "border-hairline text-text-secondary hover:text-white"
                        )}
                      >
                        {f.id}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 3 — Convert / progress */}
                {stage === "converting" ? (
                  <div className="mt-6">
                    <div className="mb-1.5 flex justify-between text-xs text-text-secondary">
                      <span>Converting…</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-white/8">
                      <motion.div
                        className="h-full rounded-full bg-accent-gradient"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="gradient"
                    size="lg"
                    className="mt-6 w-full"
                    disabled={!file}
                    onClick={convert}
                  >
                    Convert to {format}
                  </Button>
                )}
              </>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   Conversion — all client-side, dependency-free.
   PNG/JPEG/WEBP use the canvas encoder; PDF/BMP/ICO are encoded
   by hand from the rasterized pixels.
   ───────────────────────────────────────────────────────────── */

const MIME: Record<FormatId, string> = {
  PNG: "image/png",
  JPEG: "image/jpeg",
  WEBP: "image/webp",
  PDF: "application/pdf",
  BMP: "image/bmp",
  ICO: "image/x-icon",
};

async function convertImage(file: File, format: FormatId): Promise<Blob> {
  const img = await loadImage(file);
  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;

  switch (format) {
    case "PNG":
    case "WEBP":
      return canvasToBlob(drawCanvas(img, w, h), MIME[format]);

    case "JPEG":
      return canvasToBlob(drawCanvas(img, w, h, "#ffffff"), MIME.JPEG, 0.92);

    case "BMP":
      return encodeBMP(
        drawCanvas(img, w, h).getContext("2d")!.getImageData(0, 0, w, h)
      );

    case "PDF": {
      const jpeg = await canvasToBlob(
        drawCanvas(img, w, h, "#ffffff"),
        "image/jpeg",
        0.92
      );
      return encodePDF(new Uint8Array(await jpeg.arrayBuffer()), w, h);
    }

    case "ICO": {
      // ICO dimensions are stored in a single byte → cap the longest side at 256.
      const scale = Math.min(1, 256 / Math.max(w, h));
      const iw = Math.max(1, Math.round(w * scale));
      const ih = Math.max(1, Math.round(h * scale));
      const png = await canvasToBlob(drawCanvas(img, iw, ih), "image/png");
      return encodeICO(new Uint8Array(await png.arrayBuffer()), iw, ih);
    }
  }
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not load image"));
    };
    img.src = url;
  });
}

function drawCanvas(
  img: HTMLImageElement,
  w: number,
  h: number,
  background?: string
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  if (background) {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, w, h);
  }
  ctx.drawImage(img, 0, 0, w, h);
  return canvas;
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mime: string,
  quality?: number
): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Encode failed"))),
      mime,
      quality
    )
  );
}

/** 24-bit uncompressed BMP (BITMAPINFOHEADER), bottom-up, BGR rows. */
function encodeBMP(image: ImageData): Blob {
  const { width, height, data } = image;
  const rowSize = Math.floor((24 * width + 31) / 32) * 4;
  const pixelArraySize = rowSize * height;
  const fileSize = 54 + pixelArraySize;
  const buf = new ArrayBuffer(fileSize);
  const dv = new DataView(buf);
  const bytes = new Uint8Array(buf);

  // BITMAPFILEHEADER
  dv.setUint8(0, 0x42);
  dv.setUint8(1, 0x4d);
  dv.setUint32(2, fileSize, true);
  dv.setUint32(10, 54, true);
  // BITMAPINFOHEADER
  dv.setUint32(14, 40, true);
  dv.setInt32(18, width, true);
  dv.setInt32(22, height, true); // positive → bottom-up
  dv.setUint16(26, 1, true);
  dv.setUint16(28, 24, true);
  dv.setUint32(34, pixelArraySize, true);
  dv.setInt32(38, 2835, true);
  dv.setInt32(42, 2835, true);

  for (let y = 0; y < height; y++) {
    const srcY = height - 1 - y;
    let p = 54 + y * rowSize;
    for (let x = 0; x < width; x++) {
      const i = (srcY * width + x) * 4;
      bytes[p++] = data[i + 2]!; // B
      bytes[p++] = data[i + 1]!; // G
      bytes[p++] = data[i]!; // R
    }
  }
  return new Blob([buf], { type: "image/bmp" });
}

/** Minimal PDF embedding the image as a JPEG (DCTDecode) on a single page. */
function encodePDF(jpeg: Uint8Array, width: number, height: number): Blob {
  const enc = new TextEncoder();
  const chunks: Uint8Array[] = [];
  const offsets: number[] = [];
  let length = 0;

  const push = (d: string | Uint8Array) => {
    const b = typeof d === "string" ? enc.encode(d) : d;
    chunks.push(b);
    length += b.length;
  };
  const obj = () => offsets.push(length);

  push("%PDF-1.4\n");
  obj();
  push("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");
  obj();
  push("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n");
  obj();
  push(
    `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${width} ${height}] ` +
      `/Resources << /XObject << /Im0 5 0 R >> >> /Contents 4 0 R >>\nendobj\n`
  );
  const content = `q ${width} 0 0 ${height} 0 0 cm /Im0 Do Q`;
  obj();
  push(`4 0 obj\n<< /Length ${content.length} >>\nstream\n${content}\nendstream\nendobj\n`);
  obj();
  push(
    `5 0 obj\n<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} ` +
      `/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`
  );
  push(jpeg);
  push("\nendstream\nendobj\n");

  const xrefStart = length;
  const size = offsets.length + 1;
  let xref = `xref\n0 ${size}\n0000000000 65535 f \n`;
  for (const off of offsets) xref += `${String(off).padStart(10, "0")} 00000 n \n`;
  push(xref);
  push(`trailer\n<< /Size ${size} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`);

  const out = new Uint8Array(length);
  let pos = 0;
  for (const c of chunks) {
    out.set(c, pos);
    pos += c.length;
  }
  return new Blob([out], { type: "application/pdf" });
}

/** Wrap PNG bytes in an ICO container (PNG-in-ICO, supported by modern targets). */
function encodeICO(png: Uint8Array, width: number, height: number): Blob {
  const header = new ArrayBuffer(22);
  const dv = new DataView(header);
  // ICONDIR
  dv.setUint16(0, 0, true); // reserved
  dv.setUint16(2, 1, true); // type: icon
  dv.setUint16(4, 1, true); // image count
  // ICONDIRENTRY
  dv.setUint8(6, width >= 256 ? 0 : width);
  dv.setUint8(7, height >= 256 ? 0 : height);
  dv.setUint8(8, 0); // palette
  dv.setUint8(9, 0); // reserved
  dv.setUint16(10, 1, true); // color planes
  dv.setUint16(12, 32, true); // bits per pixel
  dv.setUint32(14, png.length, true); // size of image data
  dv.setUint32(18, 22, true); // offset to image data

  return new Blob([header, png as BlobPart], { type: "image/x-icon" });
}
