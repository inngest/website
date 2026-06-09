"use client";

import { useEffect } from "react";

/**
 * Opts the v1 page out of the browser's scroll restoration. Refreshes
 * (and back/forward to a previously-visited URL) now land at scroll
 * 0 — same behaviour as a fresh navigation. Without this the browser
 * can refresh into the middle of the page (typically the testimonials
 * carousel), the IntersectionObserver fires immediately, and the
 * auto-cycle is already on slide 2 by the time the user looks.
 *
 * Hash links are unaffected: the browser still resolves
 * `#some-id` anchors on first paint via the URL fragment.
 */
export function ScrollResetOnLoad() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("scrollRestoration" in window.history)) return;
    // Save the previous value so we can restore it if the v1 chrome
    // unmounts (e.g. the user navigates to a legacy non-v1 page).
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);
  return null;
}
