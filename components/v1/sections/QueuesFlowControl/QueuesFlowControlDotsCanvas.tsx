"use client";

import StippleCanvas, {
  type StippleCanvasProps,
} from "@/components/v1/StippleCanvas";

// QFC hero pattern — dots extracted directly from the Particle04 SVG
// (`<circle>` centres in a 500×500 viewBox). The cube fills the panel
// via object-fit cover, then `zoom`/`offset`/`rotateDeg` oversize and
// nudge it so the cube fills the panel height and the off-axis corners
// crop out horizontally.
//
// The framing (manifest, fit, zoom, rotation, offsets, radii) is the
// hero's fixed identity — only presentation hooks are exposed so a
// caller can't accidentally mis-frame the cube.
type Props = Pick<StippleCanvasProps, "className" | "style" | "onReady">;

export default function QueuesFlowControlDotsCanvas(props: Props) {
  return (
    <StippleCanvas
      {...props}
      manifestInlineId="qfc-dots-data"
      manifestSrc="/assets/v1/queues-flow-control-hero/dots.json"
      fit="cover"
      // Static + crisp: Particle04 is a structured field; ambient drift
      // would shimmer the curves into a squiggle and the orbiting
      // crater would warp them.
      ambientAmpPx={0}
      craterStrengthPx={0}
      // Larger base radius so the outer cube edges (max-r in the SVG)
      // read as solid dots and the inner shrinking ring still fades
      // visibly toward the cube's vanishing point.
      particleRadiusCss={0.7}
      particleRadiusMinFactor={0.04}
      zoom={1.9}
      rotateDeg={1.1}
      offsetX="22%"
      offsetY="9%"
    />
  );
}
