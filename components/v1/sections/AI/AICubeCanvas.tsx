"use client";

import StippleCanvas, {
  type StippleCanvasProps,
} from "@/components/v1/StippleCanvas";

// AI hero stipple cube — thin wrapper over the shared StippleCanvas.
// The cube manifest (`cube-dots.json`, 800×1223, 2-tuple source-px)
// fills the panel via object-fit:cover, so dots scale with the panel.
// Ambient drift on, crater off (/ai ran with
// craterStrengthPx={0}); pour-in entrance + onReady gating come from
// StippleCanvas. Previously a standalone canvas with its own copy of
// the resize/cover/entry/ambient loop — folded in once StippleCanvas
// gained the `cover` fit.

// onReady lets AIPage gate its overlay reveal on the cube's first paint.
type Props = Pick<StippleCanvasProps, "className" | "style" | "onReady">;

export default function AICubeCanvas(props: Props) {
  return (
    <StippleCanvas
      {...props}
      manifestInlineId="cube-dots-data"
      manifestSrc="/assets/v1/ai-hero/cube-dots.json"
      fit="cover"
      // Source-space radius under `cover` (tracks the cover scale), so
      // it matches the standalone canvas's `ctx.scale`d 1px dot.
      particleRadiusCss={1}
      // No crater: both live consumers ran with it disabled. Ambient
      // drift stays at the shared default for subtle life.
      craterStrengthPx={0}
    />
  );
}
