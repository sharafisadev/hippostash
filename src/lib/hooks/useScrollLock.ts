import { useEffect } from "react";

/**
 * Fully locks page scroll while `active` is true by pinning <body> in place,
 * then restores the exact scroll position on release. More robust than
 * `overflow: hidden` (which doesn't hold on iOS or when the scroll lives on the
 * document element).
 */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const scrollY = window.scrollY;
    const body = document.body;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    };
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";
    return () => {
      // Restore scroll BEFORE removing position:fixed to avoid the 1-frame
      // snap-to-top that happens when fixed is removed with a negative top.
      body.style.top = prev.top;
      body.style.position = prev.position;
      body.style.left = prev.left;
      body.style.right = prev.right;
      body.style.width = prev.width;
      body.style.overflow = prev.overflow;
      window.scrollTo({ top: scrollY, behavior: "instant" as ScrollBehavior });
    };
  }, [active]);
}
