"use client";

import type { MouseEvent } from "react";

/**
 * Click handler for in-page anchor CTAs on the campaign pages.
 *
 * The v1 marketing pages don't get `scroll-behavior: smooth` — that rule is
 * scoped to `html.docs` in styles/globals.css — so an anchor CTA jumps. This
 * adds the smooth scroll locally rather than changing a global rule that
 * every other page would inherit.
 *
 * Deliberately layered on top of a real `<a href="#…">` rather than
 * replacing it: the link still works without JS, is focusable, announces as
 * a link, and updates the address bar. This only upgrades the motion.
 *
 * Reduced motion is honoured directly (`behavior: "auto"`), because this
 * scroll is driven by script rather than CSS, so the media query can't
 * intercept it. Modified clicks (cmd/ctrl/shift/alt, middle-click) are left
 * to the browser so "open in new tab" still works.
 */
export function handleAnchorClick(targetId: string) {
  return (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }
    const el = document.getElementById(targetId);
    if (!el) return; // Let the browser handle it rather than swallow the click.

    event.preventDefault();
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    el.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "start",
    });

    // Keep the URL and focus in sync with where the page actually went, so
    // the jump is reflected in history and the next Tab continues from the
    // target rather than from the CTA.
    history.pushState(null, "", `#${targetId}`);
    el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  };
}
