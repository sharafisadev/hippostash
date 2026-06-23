"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type ToastType = "success" | "error" | "info";
interface Toast {
  id: number;
  msg: string;
  type: ToastType;
}

const ToastContext = createContext<{ toast: (msg: string, type?: ToastType) => void } | null>(null);

/** Graceful — returns a no-op if used outside the provider. */
export function useToast() {
  return useContext(ToastContext) ?? { toast: () => {} };
}

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--a1)" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>,
  error: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff6b6b" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>,
  info: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg>,
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((msg: string, type: ToastType = "info") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        className="pointer-events-none fixed bottom-5 right-5 z-[300] flex w-[min(92vw,360px)] flex-col gap-2"
        role="region"
        aria-live="polite"
      >
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 18, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 32, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="lq pointer-events-auto flex items-center gap-2.5 rounded-[14px] px-4 py-3 text-sm text-white shadow-[0_18px_48px_rgba(0,0,0,0.5)]"
            >
              {ICONS[t.type]}
              <span className="flex-1">{t.msg}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
