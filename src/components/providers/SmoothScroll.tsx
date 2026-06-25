"use client";

import { useEffect } from "react";

/**
 * Intercepts in-page anchor clicks (href="#id") and scrolls smoothly WITHOUT
 * writing the hash to the URL — keeps URLs clean (no #features etc.).
 */
export function SmoothScroll() {
  // On load, scroll to any #section then strip the hash so the URL stays clean.
  // Auth hashes (#access_token=… from OAuth) are cleaned after a short delay so
  // Supabase can read the session first.
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || hash.length < 2) return;

    const clean = () =>
      window.history.replaceState(null, "", window.location.pathname + window.location.search);

    if (/access_token|refresh_token|provider_token|[?&]error/.test(hash)) {
      const t = setTimeout(clean, 900);
      return () => clearTimeout(t);
    }

    const id = hash.slice(1).split(/[?&=]/)[0];
    const target = id ? document.getElementById(id) : null;
    if (target) target.scrollIntoView({ block: "start" });
    clean();
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      const anchor = (e.target as HTMLElement)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor || anchor.target === "_blank") return;

      const url = new URL(anchor.href, window.location.href);
      // Only handle hash links that point to the CURRENT page (e.g. "#pricing" or
      // "/#pricing" while already on "/"). Cross-page links (/#x from a subpage)
      // navigate normally, then the load effect above scrolls + cleans.
      if (!url.hash || url.pathname !== window.location.pathname) return;

      e.preventDefault();
      const id = url.hash.slice(1);
      const target = id ? document.getElementById(id) : null;
      (target ?? document.body).scrollIntoView({ behavior: "smooth", block: "start" });
      // Keep the URL clean — never write the hash, so it can't accumulate (#a#b).
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
