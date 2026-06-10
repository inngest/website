"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/utils/v1/cn";
import { V1_SECTION_TITLE } from "@/components/v1/sections/shared/sectionTitle";
import { V1_SECTION_PADDING_Y } from "@/components/v1/sections/shared/sectionShell";
import { reveals } from "@/utils/v1/reveals";
import { useIsDesktop } from "@/utils/v1/hooks/useIsDesktop";

/**
 * Page-closing CTA chrome: animated Inngest-logomark stipple watermark
 * filling the right half, with headline + body + button row stacked
 * on the left rail. Callers supply heading + body strings and pass the
 * button row as children; everything else (canvas placement, typography,
 * reveal cadence) lives here.
 *
 * Sections opt in by passing `headingId`, `heading`, `body`, plus one or
 * more `<ButtonLink>` children. Use `containerClassName` / `bodyClassName`
 * when the copy needs a different max-width than the defaults.
 */

const InngestLogoCanvas = dynamic(
  () => import("@/components/v1/sections/shared/InngestLogoCanvas"),
  { ssr: false },
);

export interface StippleCtaSectionProps {
  /** Wires aria-labelledby + h2 id. */
  headingId: string;
  heading: ReactNode;
  body: ReactNode;
  /** Button row — typically two `<ButtonLink>` instances. */
  children: ReactNode;
  /**
   * Overrides the outer stack's max-width. Use when the heading copy
   * needs more room than the default (720px). Tailwind `cn()` merges so
   * the consumer class wins.
   */
  containerClassName?: string;
  /**
   * Overrides the heading's type. Use when a page's CTA headline needs
   * a different line-height / size than the shared default (e.g. a
   * two-line display lockup).
   */
  headingClassName?: string;
  /**
   * Overrides the body paragraph's constraints. Use when the body copy
   * should sit at a tighter width than the heading container — common
   * when the heading runs long but the body should remain compact.
   */
  bodyClassName?: string;
  /**
   * Optional caption rendered below the button row (e.g. "No credit
   * card required · Free tier"). Small, dimmed reassurance copy.
   */
  footnote?: ReactNode;
}

export default function StippleCtaSection({
  headingId,
  heading,
  body,
  children,
  containerClassName,
  headingClassName,
  bodyClassName,
  footnote,
}: StippleCtaSectionProps) {
  const isDesktop = useIsDesktop();
  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative flex w-full items-center text-v1-frost",
        V1_SECTION_PADDING_Y,
      )}
    >
      {/* Animated Inngest-logomark stipple — same canvas the homepage
          Quote section uses, sized full-width (capped 1424px) and
          placed via `x`/`originX`: desktop centres it (`x="50%"`,
          origin 200px in) so the watermark fills the right half;
          mobile parks it at 88%.
          Mobile parks the canvas low (`top-[85%]`) so the logo sits
          below the headline/body/buttons stack instead of behind
          them; desktop centres it (`lg:top-1/2`) so the watermark
          fills the right half. `-translate-y-1/2` anchors the canvas
          midpoint to whichever vertical position is active. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute h-[100vw] w-full -translate-y-1/2 top-[85%] opacity-30 lg:top-1/2 lg:opacity-40 -z-10"
      >
        <InngestLogoCanvas
          enterRange={1.3}
          exitRange={1.3}
          maxParticles={isDesktop ? undefined : 4000}
          particleSize={isDesktop ? 2 : 1}
          width="100%"
          maxWidth="1080px"
          x={isDesktop ? "50%" : "88%"}
          originX={isDesktop ? "200px" : "50%"}
        />
      </div>
      <div className="relative mx-auto w-full max-w-[1440px] px-6 sm:px-9 lg:px-8">
        <div
          className={cn(
            "flex max-w-[720px] flex-col items-start gap-v1-stack",
            containerClassName,
          )}
        >
          <motion.h2
            {...reveals.heading}
            id={headingId}
            className={cn(
              // Shared section-title style (cap-trimmed Display/Sm token).
              // Below sm, drop any author-supplied <br> so the title wraps
              // naturally instead of breaking at a desktop-tuned point.
              V1_SECTION_TITLE,
              "text-balance max-sm:[&_br]:hidden",
              headingClassName,
            )}
          >
            {heading}
          </motion.h2>
          {/* Heading → body = 48 (v1-stack); body → button row sits a step
              tighter at 40. */}
          <div className="flex flex-col items-start gap-10">
            <motion.p
              {...reveals.body}
              className={cn(
                "text-v1-body-lg-loose",
                bodyClassName,
              )}
            >
              {body}
            </motion.p>
            <motion.div
              {...reveals.item(2)}
              className="flex w-full flex-col items-start gap-5 sm:w-auto"
            >
              {/* Buttons stack full-width on mobile (flex-col + stretch +
                  w-full), then sit side-by-side, content-width, at sm+. */}
              <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
                {children}
              </div>
              {footnote && (
                <p className="font-v1Body text-[12px] leading-[1.5] text-v1-frost/70">
                  {footnote}
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
