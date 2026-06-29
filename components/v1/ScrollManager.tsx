"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Scroll behaviour for v1 pages:
 *
 *   - Forward navigation (clicking a link) -> reset to the top
 *   - Back / forward button (popstate)     -> restore the offset the
 *                                             user left the page at
 *   - Hard refresh                         -> load at the top
 *   - Hash links (#anchor)                 -> left untouched
 *
 * We take over scroll restoration (`history.scrollRestoration =
 * "manual"`) so neither the browser nor the App Router fights us, then
 * persist each history entry's scroll offset in sessionStorage and
 * replay it on back/forward. Refreshes start at the top because manual
 * restoration means the browser no longer restores anything on its own
 * — this keeps refreshes from landing mid-page (e.g. inside the
 * testimonials carousel, where the auto-cycle would already be on slide
 * 2 by the time the user looks).
 */
function scrollKey() {
  return `v1-scroll:${window.location.pathname}${window.location.search}`;
}

export function ScrollManager() {
  const pathname = usePathname();
  const isFirstRef = useRef(true);
  // Offset to replay on the next pathname change, or null when the
  // upcoming navigation is a forward nav that should land at the top.
  const pendingRestoreRef = useRef<number | null>(null);

  // Opt out of browser / App Router scroll restoration; we manage it here.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("scrollRestoration" in window.history)) return;
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  // Continuously persist the current entry's scroll offset, except while a
  // restore is in flight — a restore briefly scrolls the page and we don't
  // want that transient to overwrite a still-pending saved offset.
  useEffect(() => {
    const save = () => {
      if (pendingRestoreRef.current !== null) return;
      sessionStorage.setItem(scrollKey(), String(window.scrollY));
    };
    window.addEventListener("scroll", save, { passive: true });
    return () => window.removeEventListener("scroll", save);
  }, []);

  // On back/forward the URL has already updated by the time popstate fires,
  // so we read the destination's saved offset now — before any reset can
  // clobber it — and stash it for the pathname effect to replay on rerender.
  useEffect(() => {
    const onPopState = () => {
      const saved = sessionStorage.getItem(scrollKey());
      pendingRestoreRef.current = saved !== null ? parseInt(saved, 10) : 0;
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (isFirstRef.current) {
      isFirstRef.current = false;
      return;
    }
    if (typeof window === "undefined") return;
    if (window.location.hash) return;

    const pending = pendingRestoreRef.current;
    if (pending !== null) {
      // Back/forward: replay the saved offset once the new view has painted.
      requestAnimationFrame(() => {
        window.scrollTo({
          top: pending,
          left: 0,
          behavior: "instant" as ScrollBehavior,
        });
        pendingRestoreRef.current = null;
      });
      return;
    }

    // Forward navigation: start at the top.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return null;
}
