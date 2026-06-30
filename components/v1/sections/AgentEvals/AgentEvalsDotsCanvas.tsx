"use client";

import StippleCanvas, {
  type StippleCanvasProps,
} from "@/components/v1/StippleCanvas";

/**
 * Agent Evals hero stipple shape. Manifest is generated from
 * scripts/assets/agentevals-particle.svg via `pnpm v1:extract-ae-dots`
 * (full 1000×1600 frame). `cover` fills the portrait hero panel, cropping
 * the long axis minimally since the artboard matches the panel aspect.
 */
type Props = Pick<StippleCanvasProps, "className" | "style" | "onReady">;

export default function AgentEvalsDotsCanvas(props: Props) {
  return (
    <StippleCanvas
      {...props}
      manifestInlineId="agent-evals-dots-data"
      manifestSrc="/assets/v1/agent-evals-hero/dots.json"
      fit="cover"
      // The 1000×1600 manifest covers the ~475px-wide panel at ~0.5×, and
      // the painted dot radius tracks that fit scale. The default 0.6 CSS
      // radius lands sub-pixel (≈0.3px → invisible), so bump it: 2.1 × ~0.5
      // ≈ 1px dots, visible without overpowering the field.
      particleRadiusCss={2.1}
    />
  );
}
