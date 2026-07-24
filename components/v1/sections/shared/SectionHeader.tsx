"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/utils/v1/cn";
import { reveals } from "@/utils/v1/reveals";
import { V1_SECTION_TITLE } from "@/components/v1/sections/shared/sectionTitle";

/**
 * Section header lockup with the spacing rhythm baked in
 * (see docs/v1-design-system.md):
 *
 *   eyebrow → title          = 24px  (Spacing-6)
 *   title   → body / actions = 48px  (v1-stack)
 *   body    → actions        = 32px  (gap-8)
 *
 * The 48 vs 96 "header → content" gap is applied where the header and the
 * content are siblings (use `mt-v1-stack` when a body is present, or
 * `V1_HEADER_CONTENT_MT` — 48 mobile / 96 lg — when the title leads straight
 * into content).
 *
 *   <SectionHeader id="x-heading" eyebrow="The problem"
 *     title={<>Your pipelines will fail.</>}
 *     body="The best queues…" actions={<ButtonLink…/>} />
 *
 * For the "CTA beside the title" layout, pass the CTA as `titleAside`
 * (rendered in the title's row, vertically centered with it) instead of
 * `actions` — the body then sits below. Works standalone or inside a split
 * layout's text column. Reveal animations match the standard cadence.
 */
export interface SectionHeaderProps {
  /** id for the `<h2>` (wire the section's `aria-labelledby` to it). */
  id?: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  body?: ReactNode;
  actions?: ReactNode;
  /** Element in the title's row, centered with it (typically a CTA); body
   *  sits below. Right-aligned at lg, stacked under the title on mobile. */
  titleAside?: ReactNode;
  /** Override/extend the title type (e.g. `text-v1-display-md` for 80px). */
  titleClassName?: string;
  /** Extend the body paragraph (e.g. a `max-w-[…]` measure). */
  bodyClassName?: string;
  /** Gap between body and actions. Defaults to 32px (`gap-8`). */
  actionsGapClassName?: string;
  /** Classes on the outer wrapper. */
  className?: string;
}

export default function SectionHeader({
  id,
  eyebrow,
  title,
  body,
  actions,
  titleAside,
  titleClassName,
  bodyClassName,
  actionsGapClassName = "gap-8",
  className,
}: SectionHeaderProps) {
  const hasSub = Boolean(body || actions);
  const titleEl = (
    <motion.h2
      {...reveals.heading}
      id={id}
      className={cn(V1_SECTION_TITLE, titleClassName)}
    >
      {title}
    </motion.h2>
  );
  return (
    <div className={cn("flex flex-col gap-v1-stack", className)}>
      <div className="flex flex-col gap-6">
        {eyebrow && (
          <motion.p
            {...reveals.body}
            className="text-v1-eyebrow uppercase text-v1-frost"
          >
            {eyebrow}
          </motion.p>
        )}
        {titleAside ? (
          <div className="grid grid-cols-1 gap-v1-stack lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-x-12">
            {titleEl}
            <motion.div
              {...reveals.item(2)}
              className="lg:justify-self-end"
            >
              {titleAside}
            </motion.div>
          </div>
        ) : (
          titleEl
        )}
      </div>
      {hasSub && (
        <div className={cn("flex flex-col", actionsGapClassName)}>
          {body && (
            <motion.p
              {...reveals.body}
              className={cn("text-v1-body-lg-loose", bodyClassName)}
            >
              {body}
            </motion.p>
          )}
          {actions && <motion.div {...reveals.item(2)}>{actions}</motion.div>}
        </div>
      )}
    </div>
  );
}
