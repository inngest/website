"use client";

import StippleCanvas, {
  type StippleCanvasProps,
} from "@/components/v1/StippleCanvas";

// Scheduled-jobs (cron) hero swirl — "Inngest.Particle10". Dots are
// extracted straight from the source SVG (a 500×500 viewBox of white
// circles + filled-circle paths on black) into the manifest, so position,
// the per-dot size fade (`rs`), and the `#fff` fill all come baked in (see
// scripts/extract-scheduled-jobs-dots.mjs). `fit="cover"` scales the
// square field to fill the portrait panel, cropping symmetrically.

// Only presentation hooks are exposed so a caller can't mis-frame the hero.
type Props = Pick<StippleCanvasProps, "className" | "style" | "onReady">;

export default function ScheduledJobsDotsCanvas(props: Props) {
  return (
    <StippleCanvas
      {...props}
      manifestInlineId="sj-dots-data"
      manifestSrc="/assets/v1/scheduled-jobs-hero/dots.json"
      fit="cover"
      // Opaque white (the manifest also bakes #fff; kept explicit).
      particleFill="#fff"
      // Literal SVG dot sizes: the manifest's max `rs` is 0.25 (source
      // units), and rDot = particleRadiusCss · (rs / maxRs) · coverScale,
      // so setting this to maxRs paints each dot at the SVG's true radius
      // (no legibility scale-up) — a fine, faint stipple.
      particleRadiusCss={0.25}
      // Static + crisp: a structured field, so per-dot ambient drift would
      // shimmer the arcs into a squiggle and the orbiting crater would warp
      // them.
      ambientAmpPx={0}
      craterStrengthPx={0}
      zoom={2}
    />
  );
}
