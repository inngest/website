import type { ReactNode } from "react";

type Breakpoint = "sm" | "md" | "lg";

interface Props {
  scale: number;
  natural: { w: number; h: number };
  /** Breakpoint at and above which the widget renders at natural size.
   *  Below it, the widget is scaled by `scale` with a wrapper sized
   *  to the post-scale bounding box. Defaults to "lg". */
  fullSizeFrom?: Breakpoint;
  children: ReactNode;
}

// Static lookup so Tailwind JIT can see every variant string.
const RESET_CLASSES: Record<Breakpoint, string> = {
  sm: "sm:!w-auto sm:!h-auto sm:!transform-none",
  md: "md:!w-auto md:!h-auto md:!transform-none",
  lg: "lg:!w-auto lg:!h-auto lg:!transform-none",
};

// Renders a fixed-size widget at `scale` below `fullSizeFrom` and
// unscaled at that breakpoint and above. Uses transform: scale()
// (cross-engine reliable, unlike `zoom`) with a wrapper sized to
// the post-scale bounding box so flex parents lay out around the
// visible content, not the natural one.
export default function ScaledWidget({
  scale,
  natural,
  fullSizeFrom = "lg",
  children,
}: Props) {
  return (
    <div
      className={RESET_CLASSES[fullSizeFrom]}
      style={{
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        width: natural.w * scale,
        height: natural.h * scale,
      }}
    >
      {children}
    </div>
  );
}
