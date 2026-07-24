"use client";

import StippleCanvas, {
  type StippleCanvasProps,
} from "@/components/v1/StippleCanvas";

// Only presentation hooks are exposed; the framing is this backdrop's
// fixed identity so a caller can't mis-frame it.
type Props = Pick<StippleCanvasProps, "className" | "style" | "onReady">;

export default function EventsHeroDotsCanvas(props: Props) {
  return (
    <StippleCanvas
      {...props}
      manifestInlineId="events-dots-data"
      manifestSrc="/assets/v1/events-hero/dots.json"
      width={5400}
      anchor="top"
      originX="52%"
      originY="44%"
      particleRadiusCss={1}
    />
  );
}
