"use client";

import StippleCanvas, {
  type StippleCanvasProps,
} from "@/components/v1/StippleCanvas";

// Background-jobs hero stippled-mountains field — thin wrapper over the
// shared StippleCanvas. The square manifest fills the panel via
// object-fit cover (centred, cropping symmetrically). Olive fill +
// uniform dots, crater off (matches the live hero). Previously a
// standalone canvas with its own copy of the resize/entry/ambient loop;
// folded in once StippleCanvas gained the `particleFill` prop.

// Slight olive tint (B=111 vs R=G=114) the neutral carbon ramp doesn't
// carry — pinned to the AI cube's original stipple hue.
const OLIVE = "rgb(114, 114, 111)";

type Props = Pick<StippleCanvasProps, "className" | "style" | "onReady">;

export default function HillsDotsCanvas(props: Props) {
  return (
    <StippleCanvas
      {...props}
      manifestInlineId="bg-jobs-dots-data"
      manifestSrc="/assets/v1/background-jobs-hero/dots.json"
      fit="cover"
      particleFill={OLIVE}
      // Denser field than the frost heroes; 1px keeps dots legible
      // without fusing into solid masses.
      particleRadiusCss={1}
      // Static field — no ambient drift or crater (no perpetual dot motion).
      ambientAmpPx={0}
      craterStrengthPx={0}
      zoom={1.4}
    />
  );
}
