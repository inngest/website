"use client";

import StippleCanvas, {
  type StippleCanvasProps,
} from "@/components/v1/StippleCanvas";

// WebhooksEvents hero torus — image node 888:89303 in the v1 design.
// The square torus manifest fills the portrait panel via object-fit
// cover (centred, cropping symmetrically), so the round 3D donut never
// reads as a squashed stretch.
//
// The framing + motion tuning is this hero's fixed identity; only
// presentation hooks are exposed so a caller can't mis-frame it.
type Props = Pick<StippleCanvasProps, "className" | "style" | "onReady">;

export default function WebhooksEventsDotsCanvas(props: Props) {
  return (
    <StippleCanvas
      {...props}
      manifestInlineId="we-dots-data"
      manifestSrc="/assets/v1/webhooks-events-hero/dots.json"
      fit="cover"
      // No crater: the orbiting attractor would visibly chew a hole in
      // the torus. Ambient drift off too — the re-extracted dots are
      // larger and opaque, so the shimmer that was once imperceptible now
      // reads as jitter; the field stays static after the entrance (and
      // the render loop halts, saving the perpetual repaint).
      craterStrengthPx={0}
      ambientAmpPx={0}
      particleRadiusCss={1}
    />
  );
}
