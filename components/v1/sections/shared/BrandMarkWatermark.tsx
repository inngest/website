"use client";

import InngestLogoCanvas from "@/components/v1/sections/shared/InngestLogoCanvas";
import {
  LOGOMARK_DESIGN_WIDTH,
  LOGOMARK_DESIGN_X,
} from "@/components/v1/sections/shared/logomarkPlacement";
import { useIsDesktop } from "@/utils/v1/hooks/useIsDesktop";

/**
 * Animated Inngest brand-mark watermark, flush to the viewport's right
 * edge at every breakpoint (no inset). Used as a decorative backdrop
 * behind the home / background-jobs testimonials sections. Extracted
 * here since the same markup was duplicated across those sections.
 */
export default function BrandMarkWatermark() {
  const isDesktop = useIsDesktop();
  return (
    <div
      aria-hidden="true"
      className="
        pointer-events-none absolute overflow-hidden opacity-10 lg:opacity-15
        right-0
        h-[210px] w-[401px] bottom-[-90px]
        sm:h-[245px] sm:w-[468px] sm:bottom-[-110px]
        md:h-[300px] md:w-[573px] md:bottom-[-135px]
        lg:h-[471px] lg:w-[900px] lg:bottom-[-330px]
        xl:h-[1049px] xl:w-[1640px] xl:bottom-[-700px]
      "
    >
      <InngestLogoCanvas
        width={LOGOMARK_DESIGN_WIDTH}
        x={LOGOMARK_DESIGN_X}
        originX={0}
        enterRange={1.3}
        exitRange={1.3}
        maxParticles={isDesktop ? undefined : 3000}
      />
    </div>
  );
}
