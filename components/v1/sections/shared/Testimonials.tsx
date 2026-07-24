"use client";

import { type ComponentProps, useId } from "react";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { cn } from "@/utils/v1/cn";
import TestimonialsCarousel from "./TestimonialsCarousel";
import { reveals } from "@/utils/v1/reveals";

// Lazy + client-only. The watermark pulls in InngestLogoCanvas /
// StippleCanvas; code-splitting it keeps that bundle off the
// testimonials pages that don't use it (AI, webhooks, flow-control,
// download-gate). It's a decorative, aria-hidden canvas, so skipping
// SSR costs nothing.
const BrandMarkWatermark = dynamic(() => import("./BrandMarkWatermark"), {
  ssr: false,
});

type CarouselProps = ComponentProps<typeof TestimonialsCarousel>;

export interface TestimonialsProps extends Omit<CarouselProps, "slides"> {
  slides: CarouselProps["slides"];
  /**
   * Optional section title above the rail. Omit to render no heading.
   * Rendered in the home-page "For humans and agents…" display style;
   * use "\n" to control line breaks.
   */
  title?: string;
  /** Render the animated brand-mark watermark behind the carousel
   *  (home / background-jobs layout). */
  watermark?: boolean;
  /** Section padding/width classes; overrides the default. */
  className?: string;
}

// Matches every existing wrapper's outer padding (px-6 lg:px-8) and the
// most common vertical rhythm; pages with different `py` pass `className`.
const DEFAULT_PADDING = "px-6 py-20 lg:px-8 lg:py-40";

/** The standard testimonials title shared by the home + download-gate
 *  sections. "\n" forces the two-line break. */
export const EDGE_TESTIMONIALS_TITLE =
  "For humans and agents\nthat want to keep their edge";

/**
 * Shared testimonials section — the single wrapper around
 * `TestimonialsCarousel` used across the site (home, AI, webhooks,
 * background-jobs, queues/flow-control, download-gate). Carousel
 * behaviour props (`portraitClassName`, `directionMode`,
 * `bylineStaggerMs`, `disablePortraitReveal`) pass straight through.
 * Set `watermark` for the brand-mark backdrop variant and `title` for a
 * heading above the rail (which also wires up `aria-labelledby`).
 *
 * Pages whose heading differs from the standard testimonials title
 * (e.g. compare-to-temporal's `SectionHeading`) compose
 * `TestimonialsCarousel` directly instead.
 */
export default function Testimonials({
  slides,
  title,
  watermark = false,
  className,
  ...carousel
}: TestimonialsProps) {
  const headingId = useId();

  const heading = title ? (
    <motion.h2
      {...reveals.heading}
      id={headingId}
      // mb (not a wrapper gap) so the heading drops into both the
      // watermark and plain layouts; matches the home page's
      // gap-2 / lg:gap-24 between title and rail.
      // Ignore the forced "\n" on mobile (let the title wrap naturally
      // instead of breaking awkwardly after "agents"); honor the two-line
      // break only at lg+ where it fits cleanly.
      className="mb-2 whitespace-normal font-v1Display uppercase leading-[1.25] tracking-[-0.01em] text-v1-frost lg:mb-24 lg:whitespace-pre-line"
      style={{ fontSize: "clamp(2rem, 4.6vw, 4rem)" }}
    >
      {title}
    </motion.h2>
  ) : null;

  const labelProps = title
    ? { "aria-labelledby": headingId }
    : { "aria-label": "Customer testimonials" };

  const carouselEl = <TestimonialsCarousel slides={slides} {...carousel} />;

  if (watermark) {
    return (
      <section {...labelProps} className="relative isolate overflow-x-clip">
        <BrandMarkWatermark />
        <div
          className={cn(
            "relative z-10 mx-auto max-w-[1440px]",
            className ?? DEFAULT_PADDING,
          )}
        >
          {heading}
          {carouselEl}
        </div>
      </section>
    );
  }

  return (
    <section
      {...labelProps}
      className={cn(
        "relative mx-auto w-full max-w-[1440px]",
        className ?? DEFAULT_PADDING,
      )}
    >
      {heading}
      {carouselEl}
    </section>
  );
}
