import React from "react";

/**
  Hide the page banner on specific pages by including this at the top of page.tsx:

  <style global>{`
    .page-banner {
      display: none;
    }
  `}</style>
 */

// Matches the v1 feature card salmon: bg-v1-accent-salmon-gradient = rgb(247, 98, 70)
const BANNER_BG = "rgb(247, 98, 70)";

// Inline SVG feTurbulence noise — zero network request, seamlessly tileable at any scale.
// Replaces the 203KB noise-dark.webp which pixelates badly on a thin full-width strip.
const NOISE_BG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.18'/%3E%3C/svg%3E\")";

export default function AnnouncementBanner() {
  return (
    // hidden on mobile/tablet, flex on desktop (lg+). Server-rendered — no CLS, no LCP impact.
    <div
      className="page-banner relative hidden lg:flex w-full items-center justify-center overflow-hidden px-6 py-1.5 font-v1Heading text-sm text-white"
      style={{ backgroundColor: BANNER_BG }}
    >
      {/* Inline SVG noise overlay — soft-light grain with zero added bytes or requests */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: NOISE_BG,
          backgroundSize: "200px 200px",
          mixBlendMode: "soft-light",
        }}
      />
      <span className="relative">
        Introducing{" "}
        <a
          href="/blog/introducing-agent-evals?ref=site-banner"
          className="font-semibold underline underline-offset-2 transition-opacity hover:opacity-80"
        >
          Agent Evals
        </a>
        : Score your agents on real outcomes.
      </span>
    </div>
  );
}
