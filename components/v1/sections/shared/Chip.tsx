import type { ReactNode } from "react";
import { cn } from "@/utils/v1/cn";
import { GRADIENT_RING_FILL, GRADIENT_RING_MASK } from "@/utils/v1/gradientRing";

/**
 * Pill-shaped status chip — carbon-elevated surface, uppercase Whyte
 * Mono label. Two visual variants:
 *
 * - `gradient` (default): 1–2 px gradient-stroke ring. Used by the
 *   Pricing hero "POPULAR" badge floating over the Pro card.
 * - `solid`: flat 1 px carbon-300/35 border. Used by the
 *   PricingCalculator's "Recommended Plan" tag.
 */

type ChipSize = "sm" | "md";
type ChipVariant = "gradient" | "solid";

interface ChipProps {
  children: ReactNode;
  size?: ChipSize;
  variant?: ChipVariant;
  className?: string;
}

const SIZE_CLASSES: Record<ChipSize, string> = {
  sm: "h-[28px] min-w-[50px] px-4 py-2 text-[12px] leading-[1.25]",
  md: "h-[51px] min-w-[140px] px-5 py-[10px] text-[16px] leading-[16px]",
};

// Ring thickness matches the solid-border weights (1 px
// for sm, 2 px for md). Applied as `padding` on the absolute ring
// overlay — the mask-composite carves the inner content-box out, so
// only the padding band paints.
const RING_PADDING: Record<ChipSize, string> = {
  sm: "p-px",
  md: "p-0.5",
};

export default function Chip({
  children,
  size = "md",
  variant = "gradient",
  className,
}: ChipProps) {
  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center whitespace-nowrap rounded-full bg-v1-surfaceElevated font-v1Label uppercase text-v1-frost",
        SIZE_CLASSES[size],
        variant === "solid" && "border border-v1-strong/[0.35]",
        className,
      )}
    >
      {children}
      {variant === "gradient" && (
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 rounded-full",
            RING_PADDING[size],
          )}
          style={{ background: GRADIENT_RING_FILL, ...GRADIENT_RING_MASK }}
        />
      )}
    </span>
  );
}
