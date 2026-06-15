"use client";

import StippleCanvas, {
  type StippleCanvasProps,
} from "@/components/v1/StippleCanvas";

// DE hero pattern — "Inngest.Particle46". Source SVG is a 1000×1000
// viewBox of stroked paths that render dots via `stroke-dasharray: 0 15;
// stroke-linecap: round` (see scripts/extract-durable-execution-dots.mjs).
// The swirl fills the panel via object-fit cover and is tilted ~37°
// clockwise so the vortex eye reads from the upper-left rather than
// dead-centre.
//
// The framing + motion tuning is this hero's fixed identity; only
// presentation hooks are exposed so a caller can't mis-frame it.
type Props = Pick<StippleCanvasProps, "className" | "style" | "onReady">;

export default function DurableExecutionDotsCanvas(props: Props) {
  return (
    <StippleCanvas
      {...props}
      manifestInlineId="de-dots-data"
      manifestSrc="/assets/v1/durable-execution-hero/dots.json"
      fit="cover"
      // Particle46 is a structured field (smooth long arcs); ambient
      // drift would shimmer the lines into a squiggle and the orbiting
      // crater would warp them.
      ambientAmpPx={0}
      craterStrengthPx={0}
      // Source SVG ships horizontal; the swirl is composed at a ~30°
      // clockwise tilt so the vortex eye reads from the upper-left
      // rather than dead-centre.
      rotateDeg={37}
    />
  );
}
