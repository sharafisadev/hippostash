"use client";

import { useEffect } from "react";

/**
 * Intercepts in-page anchor clicks (href="#id") and scrolls smoothly WITHOUT
 * writing the hash to the URL — keeps URLs clean (no #features etc.).
 */
export function SmoothScroll() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      const anchor = (e.target as HTMLElement)?.closest?.(
        'a[href^="#"]'
      ) as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href") || "";
      e.preventDefault();

      const id = href.slice(1);
      const target = id ? document.getElementById(id) : null;
      (target ?? document.body).scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
