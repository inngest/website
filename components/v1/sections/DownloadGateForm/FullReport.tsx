"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import Button from "@/components/v1/Button";
import { reveals } from "@/utils/v1/reveals";
import { useOpenDownload } from "@/components/v1/sections/DownloadGateForm/DownloadModalProvider";

// Decorative, below-the-fold stipple backdrop for the Full Report CTA.
// Lazy + client-only so the canvas bundle doesn't block initial paint.
const EventsHeroDotsCanvas = dynamic(
  () => import("@/components/v1/sections/Events/EventsHeroDotsCanvas"),
  { ssr: false },
);

export default function FullReport() {
  const openDownload = useOpenDownload();
  return (
    <section
      aria-labelledby="benchmark-full-report-heading"
      // Full-bleed band: the section spans the viewport (not the 800px
      // editorial column) so the dot backdrop reaches both edges; the
      // content below stays centered via its own max-w wrapper.
      className="relative w-full overflow-hidden px-6 py-[110px] text-center text-v1-frost sm:px-8"
    >
      {/* Events-style stipple dot field, faint at 15% and masked so it
          fades out top/bottom. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 select-none opacity-45 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]"
      >
        <EventsHeroDotsCanvas className="block h-full w-full" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-[800px] flex-col items-center gap-[42px]">
        <motion.h2
          {...reveals.heading}
          id="benchmark-full-report-heading"
          className="font-v1Heading v1-cap-trim uppercase leading-[1.25] tracking-[-0.01em] [font-size:clamp(2.5rem,6vw,4rem)]"
        >
          Get the full report.
        </motion.h2>
        <motion.p
          {...reveals.body}
          className="max-w-[455px] text-v1-body-lg-loose text-v1-frost"
        >
          Charts, breakouts by team size, and the patterns that predict
          scaling confidence — free PDF, instant access.
        </motion.p>
        <motion.div {...reveals.item(2)}>
          <Button onClick={openDownload} variant="accent">
            Download content
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
