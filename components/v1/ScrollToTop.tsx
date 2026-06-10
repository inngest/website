"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Snaps the window to (0, 0) whenever the v1 pathname changes.
 *
 * App Router's default scroll behaviour + the browser's history
 * scroll-restoration occasionally lands a fresh navigation at the
 * previous page's saved scroll position (typically wherever the user
 * left off — often the footer). Layered on top of `html.scroll-smooth`
 * any programmatic scrollTo also animates as a slow climb, which made
 * the wrong landing position even more visible.
 *
 * This component skips the very first mount (so deep links / refreshes
 * still resolve at the URL's natural anchor) and skips any navigation
 * that targets a hash anchor. Every other route change gets a `behavior:
 * "instant"` reset that bypasses the smooth-scroll global.
 */
export function ScrollToTop() {
  const pathname = usePathname();
  const isFirstRef = useRef(true);

  useEffect(() => {
    if (isFirstRef.current) {
      isFirstRef.current = false;
      return;
    }
    if (typeof window === "undefined") return;
    if (window.location.hash) return;
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant" as ScrollBehavior,
    });
  }, [pathname]);

  return null;
}
