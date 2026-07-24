"use client";

import { motion } from "motion/react";
import Button from "@/components/v1/Button";
import { reveals } from "@/utils/v1/reveals";
import { HERO_SECTION } from "@/components/v1/sections/DownloadGateForm/layout";
import { useOpenDownload } from "@/components/v1/sections/DownloadGateForm/DownloadModalProvider";

export default function Hero() {
  const openDownload = useOpenDownload();
  return (
    <section
      aria-labelledby="benchmark-hero-heading"
      className={`${HERO_SECTION} pb-[60px] pt-20 text-v1-frost sm:pb-20 sm:pt-[100px] lg:pb-[60px] lg:pt-[136px]`}
    >
      <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-2 lg:items-center lg:gap-x-[56px]">
        {/* Left column — text inset 32px on the right. */}
        <div className="flex flex-col gap-16 lg:pr-8">
          {/* Title + subtitle group. */}
          <div className="flex flex-col gap-[31px]">
            <motion.h1
              id="benchmark-hero-heading"
              {...reveals.heading}
              // text-v1-heading-lg (Whyte 58/70, the token carries the
              // cap-trim + -0.01em tracking); size/lh overridden to scale
              // down on mobile.
              className="text-v1-heading-lg text-[40px] leading-[1.15] text-v1-frost sm:text-[48px] lg:text-[58px] lg:leading-[70px]"
            >
              <span className="block whitespace-normal lg:whitespace-nowrap">AI in Production: The</span>
              <span className="block whitespace-normal lg:whitespace-nowrap">2026 Benchmark</span>
              <span className="block whitespace-normal lg:whitespace-nowrap">Report</span>
            </motion.h1>

            <motion.p {...reveals.body} className="text-v1-body-sm-loose text-v1-frost">
              How engineering teams are building, breaking, and scaling AI in production.
            </motion.p>
          </div>

          {/* Description + CTA group. */}
          <div className="flex flex-col gap-[56px]">
            <motion.div {...reveals.body} className="flex flex-col gap-[26px]">
              <p className="text-v1-label-md uppercase text-v1-frost">
                Description
              </p>
              <div className="flex flex-col gap-3 text-v1-body-lg text-v1-frost">
                <p>
                  We surveyed 130 backend, full-stack, and AI engineers
                  about what it takes to run reliable AI workflows in
                  production. We wanted to know what&apos;s causing
                  failures, and which infrastructure choices—across
                  orchestration, observability, evals, and agent
                  frameworks—actually reduce the burden of reliability.
                </p>
                <p>Explore the patterns that predict scaling confidence.</p>
              </div>
            </motion.div>

            <motion.div {...reveals.item(2)} className="flex">
              <Button onClick={openDownload} variant="accent">
                Download content
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Right column — 660×421 cover card. */}
        <motion.div {...reveals.body} className="w-full">
          <ReportCover />
        </motion.div>
      </div>
    </section>
  );
}

function ReportCover() {
  // 660×421 card, white fill, 5px radius, the cover image object-contain.
  // The asset is 1320×842 (the same 660:421 aspect), so it fills the card
  // edge-to-edge.
  return (
    <div className="aspect-[660/421] w-full overflow-hidden rounded-[5px] bg-white">
      <img
        src="/assets/v1/download-gate-form/gate-cover-inngest.png"
        alt="AI in Production: The 2026 Benchmark Report — cover"
        width={1320}
        height={842}
        decoding="async"
        className="h-full w-full object-contain"
      />
    </div>
  );
}
