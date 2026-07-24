"use client";

import dynamic from "next/dynamic";
import {
  LOGOMARK_DESIGN_WIDTH,
  LOGOMARK_DESIGN_X,
} from "@/components/v1/sections/shared/logomarkPlacement";

const InngestLogoCanvas = dynamic(
  () => import("@/components/v1/sections/shared/InngestLogoCanvas"),
  { ssr: false },
);

export default function NotFoundBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 -bottom-[35vh] top-0 opacity-15 lg:opacity-50"
    >
      <InngestLogoCanvas
        width={LOGOMARK_DESIGN_WIDTH}
        x={LOGOMARK_DESIGN_X}
        originX={0}
        enterRange={1.8}
        exitRange={1.3}
      />
    </div>
  );
}
