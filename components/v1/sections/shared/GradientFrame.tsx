import { cn } from "@/utils/v1/cn";
import { GRADIENT_RING_FILL, GRADIENT_RING_MASK } from "@/utils/v1/gradientRing";

/**
 * 1px gradient-bordered frame. The outer paints a true hollow ring via
 * `mask-composite`, so the border behaves like a real border —
 * whatever sits behind shows through the inner if the fill has alpha.
 * Set `rounded-X` on `className`; the inner inherits the radius.
 */

export type GradientFrameVariant =
  | "charcoal"
  | "black"
  | "charcoal-horizontal"
  | "black-horizontal";

const VARIANT_FILL: Record<GradientFrameVariant, string> = {
  charcoal: "bg-v1-gradient-charcoal",
  black: "bg-v1-gradient-black",
  "charcoal-horizontal": "bg-v1-gradient-charcoal-horizontal",
  "black-horizontal": "bg-v1-gradient-black-horizontal",
};

interface GradientFrameProps {
  children: React.ReactNode;
  variant?: GradientFrameVariant;
  className?: string;
  innerClassName?: string;
  ref?: React.Ref<HTMLDivElement>;
}

export default function GradientFrame({
  children,
  variant = "charcoal",
  className,
  innerClassName,
  ref,
}: GradientFrameProps) {
  return (
    <div ref={ref} className={cn("relative", className)}>
      <div
        className={cn(
          "overflow-hidden [border-radius:inherit]",
          VARIANT_FILL[variant],
          innerClassName,
        )}
      >
        {children}
      </div>
      {/* Ring rendered AFTER the inner so it paints on top of the fill. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 p-[1px] [border-radius:inherit]"
        style={{ background: GRADIENT_RING_FILL, ...GRADIENT_RING_MASK }}
      />
    </div>
  );
}
