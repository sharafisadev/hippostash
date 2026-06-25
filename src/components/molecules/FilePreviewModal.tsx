"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FileGlyph } from "@/components/atoms/FileGlyph";
import { useScrollLock } from "@/lib/hooks/useScrollLock";
import { cn } from "@/lib/utils";

export type PreviewKind = "image" | "pdf" | "other";

interface Props {
  open: boolean;
  onClose: () => void;
  url: string;
  name: string;
  kind: PreviewKind;
  loading?: boolean;
}

const MIN = 0.25;
const MAX = 6;
const glyphFor = (name: string) => (name.split(".").pop() || "FILE").toUpperCase();

export function FilePreviewModal({ open, onClose, url, name, kind, loading }: Props) {
  const [mounted, setMounted] = useState(false);
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  useEffect(() => setMounted(true), []);
  useScrollLock(open);

  const reset = useCallback(() => { setScale(1); setPos({ x: 0, y: 0 }); }, []);

  // Reset zoom whenever a new file opens.
  useEffect(() => { if (open) reset(); }, [open, url, reset]);

  const zoomBy = useCallback((delta: number) => {
    setScale((s) => Math.min(MAX, Math.max(MIN, +(s + delta).toFixed(2))));
  }, []);

  // Keyboard: Esc closes, +/- zoom, 0 resets.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "+" || e.key === "=") zoomBy(0.25);
      else if (e.key === "-" || e.key === "_") zoomBy(-0.25);
      else if (e.key === "0") reset();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, zoomBy, reset]);

  if (!mounted) return null;

  const isImage = kind === "image";

  function onWheel(e: React.WheelEvent) {
    if (!isImage) return;
    e.preventDefault();
    zoomBy(e.deltaY < 0 ? 0.2 : -0.2);
  }
  function onPointerDown(e: React.PointerEvent) {
    if (!isImage || scale <= 1) return;
    drag.current = { x: e.clientX, y: e.clientY, ox: pos.x, oy: pos.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current) return;
    setPos({ x: drag.current.ox + (e.clientX - drag.current.x), y: drag.current.oy + (e.clientY - drag.current.y) });
  }
  function onPointerUp() { drag.current = null; }

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] grid place-items-center p-4 sm:p-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
        >
          <div
            className="absolute inset-0 backdrop-blur-[42px] [-webkit-backdrop-filter:blur(42px)] [background:radial-gradient(120%_120%_at_50%_0%,rgba(28,26,46,0.82),rgba(10,10,18,0.9))]"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Contained modal card */}
          <motion.div
            role="dialog" aria-modal="true" aria-label={name}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="relative z-10 flex max-h-[82vh] w-full max-w-[560px] flex-col overflow-hidden rounded-[18px] border border-white/10 bg-[#0d0d16]/95 shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
          >
            {/* Toolbar */}
            <div className="flex flex-none items-center gap-2 border-b border-white/[0.08] px-3 py-2.5">
              <span className="min-w-0 flex-1 truncate font-mono text-[12px] text-white/70">{name}</span>

              {isImage && (
                <div className="flex items-center gap-0.5 rounded-full border border-white/12 bg-white/[0.04] px-0.5 py-0.5">
                  <button onClick={() => zoomBy(-0.25)} disabled={scale <= MIN} aria-label="Zoom out"
                    className="grid h-7 w-7 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14" strokeLinecap="round" /></svg>
                  </button>
                  <button onClick={reset} className="min-w-[42px] rounded-full px-1 font-mono text-[11px] text-white/70 transition-colors hover:text-white" aria-label="Reset zoom">
                    {Math.round(scale * 100)}%
                  </button>
                  <button onClick={() => zoomBy(0.25)} disabled={scale >= MAX} aria-label="Zoom in"
                    className="grid h-7 w-7 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg>
                  </button>
                </div>
              )}

              <a href={url} download={name} title="Download" aria-label="Download"
                className="grid h-8 w-8 flex-none place-items-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 4v12m0 0l-4-4m4 4l4-4M5 20h14" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </a>
              <button onClick={onClose} title="Close" aria-label="Close"
                className="grid h-8 w-8 flex-none place-items-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" /></svg>
              </button>
            </div>

            {/* Stage */}
            <div
              className="relative flex min-h-[240px] flex-1 items-center justify-center overflow-hidden bg-black/20 p-3"
              onWheel={onWheel}
            >
              {loading || !url ? (
                <span className="h-9 w-9 animate-spin rounded-full border-2 border-white/20 border-t-accent-cyan" />
              ) : isImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={url} alt={name} draggable={false}
                  onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}
                  onDoubleClick={() => (scale > 1 ? reset() : setScale(2))}
                  className={cn("max-h-full max-w-full select-none rounded-[6px]",
                    scale > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in")}
                  style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`, transition: drag.current ? "none" : "transform 0.12s ease-out" }}
                />
              ) : kind === "pdf" ? (
                <iframe src={url} title={name} className="h-[60vh] max-h-full w-full rounded-[8px] bg-white" />
              ) : (
                <div className="px-6 py-8 text-center">
                  <FileGlyph format={glyphFor(name)} size={56} showLabel={false} className="mx-auto" />
                  <p className="mt-4 text-sm text-white/55">No inline preview for this file type.</p>
                  <a href={url} download={name} className="btn-primary mt-4 inline-flex rounded-[12px] px-5 py-2.5 text-sm">Download</a>
                </div>
              )}
            </div>

            {isImage && (
              <div className="flex-none border-t border-white/[0.06] py-2 text-center font-mono text-[10px] text-white/30">
                scroll or +/− to zoom · drag to pan · double-click to toggle
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
