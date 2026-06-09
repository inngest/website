import { forwardRef } from "react";
import type { ReactNode, ComponentPropsWithoutRef } from "react";
import { cn } from "@/utils/v1/cn";
import {
  V1_SECTION_GUTTER_X,
  V1_SECTION_PADDING_Y,
} from "@/components/v1/sections/shared/sectionShell";

/**
 * Standard v1 section box. Applies the canonical vertical padding to the
 * `<section>` and the gutters + width to an inner container, so every
 * section shares one spacing source of truth (see docs/v1-design-system.md).
 *
 *   <Section aria-labelledby="x-heading">…</Section>            // contained 1440
 *   <Section width="full">…</Section>                            // full-bleed width
 *   <Section className="bg-v1-jetBlack">…</Section>              // edge-to-edge bg, contained content
 *   <Section containerClassName="flex flex-col gap-v1-stack">…   // inner layout
 *   <Section containerClassName="!max-w-[1100px]">…              // override width (rare 1100/1280)
 *
 * Full-bleed media that wants no gutters: `containerClassName="!px-0"`.
 * Sections with a bespoke skeleton (e.g. the stipple CTA's centered flex +
 * canvas watermark) can keep their own markup — this is for the common case.
 */
export interface SectionProps extends ComponentPropsWithoutRef<"section"> {
  /** `contained` (default) caps the inner container at 1440px; `full`
   *  removes the cap (gutters still apply). */
  width?: "contained" | "full";
  /** Classes for the inner container (layout, or `!max-w-[…]` to override). */
  containerClassName?: string;
  children: ReactNode;
}

const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  { width = "contained", className, containerClassName, children, ...rest },
  ref,
) {
  return (
    <section ref={ref} className={cn(V1_SECTION_PADDING_Y, className)} {...rest}>
      <div
        className={cn(
          "mx-auto w-full",
          V1_SECTION_GUTTER_X,
          width === "contained" ? "max-w-[1440px]" : "max-w-none",
          containerClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
});

export default Section;
