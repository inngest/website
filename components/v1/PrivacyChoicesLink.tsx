"use client";

import { type MouseEvent, type ReactNode } from "react";

// Layer ID of the DataGrail "Customize your choices" layer (set in the
// DataGrail layout editor; it can't be changed after creation). Each
// layout's categories layer should use this same ID.
const DATAGRAIL_CHOICES_LAYER = "categories-layer";

/**
 * "Your Privacy Choices" footer link. Opens the DataGrail consent
 * preferences so visitors can change or withdraw consent at any time
 * (required by CPRA's opt-out link rules and GDPR's "as easy to withdraw
 * as to give").
 *
 * DataGrail's consent.js is loaded through GTM and exposes
 * `window.DG_BANNER_API`. If it isn't on the page (blocked by an
 * extension, or GTM not configured in this environment), the click falls
 * through to the privacy policy instead of doing nothing.
 */
export default function PrivacyChoicesLink({
  className,
  children = "Your Privacy Choices",
}: {
  className?: string;
  children?: ReactNode;
}) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    const dg = (window as any).DG_BANNER_API;
    if (!dg) return; // let the link navigate to /privacy
    event.preventDefault();
    try {
      if (typeof dg.showLayer === "function") {
        dg.showLayer(DATAGRAIL_CHOICES_LAYER);
      } else {
        dg.showConsentBanner?.();
      }
    } catch {
      dg.showConsentBanner?.();
    }
  }

  return (
    <a
      href="/privacy"
      onClick={handleClick}
      aria-haspopup="dialog"
      className={className}
    >
      {children}
    </a>
  );
}
