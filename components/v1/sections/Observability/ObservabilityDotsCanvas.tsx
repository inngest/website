"use client";

import StippleCanvas, {
  type StippleCanvasProps,
} from "@/components/v1/StippleCanvas";

// Observability hero wireframe-perspective fan — "image 77", node
// 2:47831 in the v1 design. The manifest is trimmed to the fan's own
// bounds (no source padding) so object-fit cover bleeds it edge-to-edge
// across the portrait panel, cropping the longer axis symmetrically.
//
// The framing + motion tuning is this hero's fixed identity; only
// presentation hooks are exposed so a caller can't mis-frame it.
type Props = Pick<StippleCanvasProps, "className" | "style" | "onReady">;

export default function ObservabilityDotsCanvas(props: Props) {
  return (
    <StippleCanvas
      {...props}
      manifestInlineId="ob-dots-data"
      manifestSrc="/assets/v1/observability-hero/dots.json"
      fit="cover"
      // Static + crisp: the pattern is straight perspective lines, so
      // independent per-dot ambient drift reads as a squiggle and the
      // orbiting crater would warp the lines.
      ambientAmpPx={0}
      craterStrengthPx={0}
    />
  );
}
