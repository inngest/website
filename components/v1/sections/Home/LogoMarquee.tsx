"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useIsDesktop } from "@/utils/v1/hooks/useIsDesktop";

const InngestLogoCanvas = dynamic(
  () => import("@/components/v1/sections/shared/InngestLogoCanvas"),
  { ssr: false },
);

/**
 * Closing stippled "Inngest" lockup. The placeholder div reserves
 * vertical space in the layout so following content sits at the
 * right Y; the canvas sits absolute behind it spanning the full
 * viewport so particles can scatter past the lockup edges.
 */

const LOCKUP_W = 913.73;
const LOCKUP_H = 133.925;
const LOCKUP_SRC = "/assets/v1/logo-marquee/lockup.svg";
const LOCKUP_TOP_MOBILE = 40;
const LOCKUP_TOP_DESKTOP = 92;
const MOBILE_GUTTER_PX = 30;
// Lockup width on mobile = viewport − 60 px (30 gutter each side); height
// derives from the design ratio. Center Y = top padding + half-height.
const LOCKUP_RATIO_HALF = LOCKUP_H / LOCKUP_W / 2;
const LOCKUP_CENTER_DESKTOP = LOCKUP_TOP_DESKTOP + LOCKUP_H / 2;

export default function LogoMarquee() {
  const isDesktop = useIsDesktop();
  // Track viewport width so the mobile maxScale caps the formed
  // lockup at viewport − 60 px (30 px gutter each side) regardless
  // of resize.
  const [viewportW, setViewportW] = useState(0);
  useEffect(() => {
    const update = () => setViewportW(window.innerWidth);
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);
  const mobileMaxScale =
    viewportW > 0
      ? Math.max(0, viewportW - MOBILE_GUTTER_PX * 2) / LOCKUP_W
      : 0;
  return (
    <section
      aria-hidden="true"
      className="relative isolate overflow-x-clip -z-[1]"
    >
      <div className="mx-auto max-w-[1440px] px-6 py-10 lg:px-8 lg:pb-0 lg:pt-[92px]">
        <div className="mx-auto w-[calc(100vw-60px)] max-w-[913.73px]">
          <div
            className="w-full"
            style={{ aspectRatio: `${LOCKUP_W} / ${LOCKUP_H}` }}
          />
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 h-screen opacity-30 top-[calc(var(--lockup-c-mobile)-50vh)] lg:opacity-50 lg:top-[calc(var(--lockup-c-desktop)-50vh)]"
        style={{
          ["--lockup-c-mobile" as string]: `calc(${LOCKUP_TOP_MOBILE}px + (100vw - ${MOBILE_GUTTER_PX * 2}px) * ${LOCKUP_RATIO_HALF})`,
          ["--lockup-c-desktop" as string]: `${LOCKUP_CENTER_DESKTOP}px`,
        }}
      >
        <InngestLogoCanvas
          src={LOCKUP_SRC}
          designW={LOCKUP_W}
          designH={LOCKUP_H}
          anchor="center"
          // Sparser dot count so the entry volume matches the hero's
          // outgoing code particles instead of dumping a dense lockup.
          maxParticles={isDesktop ? 8500 : 1500}
          maxScale={isDesktop ? 1 : mobileMaxScale}
          // Frost-only scatter so the closing lockup doesn't compete
          // with the footer's blue dot field.
          scatterColor="#fefefe"
          // High threshold keeps anti-aliased glyph edges sharp.
          sampleThreshold={170}
          // Waits for the hero's code particles to be leaving before
          // forming — paired with the canvas's per-particle stagger.
          enterRange={0.9}
          // Closing image — no exit; scrolling back up reverses the
          // entry naturally.
          enableExit={false}
        />
      </div>
    </section>
  );
}
