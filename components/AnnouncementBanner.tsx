import React from "react";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
};

/**
  Hide the page banner on specific pages by including this at the top of page.tsx:

  <style global>{`
    .page-banner {
      display: none;
    }
  `}</style>
 */

// Matches the v1 feature card salmon: bg-v1-accent-salmon-gradient = rgb(247, 98, 70).
// Set as a literal (not a Tailwind `bg-v1-*` utility) so it renders correctly on
// every caller of this shared component, including legacy/pages-router routes
// that don't load styles/v1.css (where `--color-v1-*` custom properties are undefined).
const BANNER_BG = "rgb(247, 98, 70)";

// Inline SVG feTurbulence noise — zero network request, seamlessly tileable at any scale.
const NOISE_BG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.18'/%3E%3C/svg%3E\")";

const Banner: React.FC<Props> = ({ href, children, className, target, rel }) => (
  <a
    href={href}
    target={target}
    rel={rel}
    // use the .page-banner class to hide it on select pages via CSS
    // hidden on mobile/tablet, flex on desktop (lg+) — matches the v1 redesign's
    // own banner breakpoint from the prior global-promo-banner work
    className={`page-banner group relative hidden lg:flex w-full items-center justify-center gap-1.5
                overflow-hidden px-6 py-1.5 font-v1Heading text-sm
                text-white transition-opacity hover:opacity-90 ${className}`}
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
    <span className="relative">{children}</span>
  </a>
);

export default function AnnouncementBanner() {
  return (
    <Banner
      href="https://luma.com/inngest-r614?utm_source=web-banner"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="font-normal underline underline-offset-2">
        Join us on August 12th for an Agent Evals Lightning Lab
      </span>{" "}
      →
    </Banner>
  );
}
