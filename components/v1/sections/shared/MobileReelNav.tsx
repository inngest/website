"use client";

import { ChevronIcon } from "@/components/v1/sections/shared/ArrowPreviewButton";

/**
 * Mobile prev/next chevron row that pairs with a {@link useReelCarousel}.
 * Renders two 40×40 outlined chevron buttons on either side of the
 * active item's title — visible only below `lg`, where the desktop
 * ArrowPreviewButton chevrons hide.
 *
 * Consumers: AI/UseCases, Observability/FullObservability,
 * DurableExecution/Primitives, WebhooksEvents/DurabilityDefinedInCode,
 * BackgroundJobs/Reliability — each previously declared its own
 * `MobileNavButton` helper identical to this one.
 *
 * `itemNoun` is interpolated into the aria-labels ("Previous primitive",
 * "Next use case", etc.) so screen readers describe the row in the
 * section's own vocabulary instead of a generic "item".
 */
export interface MobileReelNavProps {
  /** Title of the active item — shown in the middle of the row. */
  activeTitle: string;
  /** Title of the previous item — used in the prev button's aria-label. */
  prevTitle: string;
  /** Title of the next item — used in the next button's aria-label. */
  nextTitle: string;
  /** Singular noun describing one item, e.g. "primitive" or "use case". */
  itemNoun: string;
  onPrev: () => void;
  onNext: () => void;
  className?: string;
}

export default function MobileReelNav({
  activeTitle,
  prevTitle,
  nextTitle,
  itemNoun,
  onPrev,
  onNext,
  className,
}: MobileReelNavProps) {
  return (
    <nav
      aria-label={`${itemNoun} navigation`}
      className={
        className ??
        "mb-4 mt-10 flex items-center justify-between gap-3 lg:hidden"
      }
    >
      <NavButton
        direction="prev"
        title={prevTitle}
        itemNoun={itemNoun}
        onClick={onPrev}
      />
      <span
        aria-hidden="true"
        className="truncate font-v1Mono text-[12px] uppercase leading-none text-v1-frost"
      >
        {activeTitle}
      </span>
      <NavButton
        direction="next"
        title={nextTitle}
        itemNoun={itemNoun}
        onClick={onNext}
      />
    </nav>
  );
}

function NavButton({
  direction,
  title,
  itemNoun,
  onClick,
}: {
  direction: "prev" | "next";
  title: string;
  itemNoun: string;
  onClick: () => void;
}) {
  const verb = direction === "prev" ? "Previous" : "Next";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${verb} ${itemNoun}: ${title}`}
      className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-v1-frost text-v1-frost"
    >
      <ChevronIcon direction={direction} />
    </button>
  );
}
