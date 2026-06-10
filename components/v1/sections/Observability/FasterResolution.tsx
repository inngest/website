"use client";

import { motion } from "motion/react";
import ButtonLink from "@/components/v1/ButtonLink";
import BeforeAfterSlider from "@/components/v1/sections/shared/BeforeAfterSlider";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import { reveals } from "@/utils/v1/reveals";

// "Observability closer to code, not deeper in
// infrastructure." Reuses the shared BeforeAfterSlider (same component
// the home page's /it-doesnt-have-to-be-hard uses); the BEFORE/AFTER
// panels are WebP exports of the design's two debugging-workflow cards
// (1828×914, q82) so we don't have to hand-rebuild the typography in
// HTML — ~320KB combined vs 4.2MB as JPG.

const SEE_DOCS_URL = "/docs/guides/concurrency?ref=observability";

const BEFORE_SRC = "/assets/v1/observability/faster-resolution-before.webp";
const AFTER_SRC = "/assets/v1/observability/faster-resolution-after.webp";

export default function FasterResolution() {
  return (
    <Section aria-labelledby="ob-faster-heading" className="relative">
      <SectionHeader
        id="ob-faster-heading"
        title={
          <>
            Observability closer to code,
            <br aria-hidden="true" />
            not deeper in infrastructure.
          </>
        }
      />

      {/* 448px copy column / 912px slider column at 1440 width
          (~1:2). Stacks on narrow viewports. */}
      <div className="mt-12 grid grid-cols-1 gap-x-12 gap-y-12 lg:mt-16 lg:grid-cols-[minmax(0,448fr)_minmax(0,912fr)] lg:items-center lg:gap-x-16">
        <div className="flex flex-col gap-8">
          <motion.p
            {...reveals.body}
            className="text-v1-body-lg-loose max-w-[448px]"
          >
            Debugging in APM tools means starting with a trace ID, finding the
            span, mapping to a job, then looking up the input data.
          </motion.p>
          <motion.p
            {...reveals.body}
            className="text-v1-body-lg-loose max-w-[448px]"
          >
            With Inngest, the data lives where execution happens&mdash;the
            failed step, its input, its output, its retry history, all in the
            same place you manage the function.
          </motion.p>
          <motion.div {...reveals.item(2)} className="flex">
            <ButtonLink
              href={SEE_DOCS_URL}
              variant="primary"
              className="!w-full sm:!w-auto"
            >
              See observability docs
            </ButtonLink>
          </motion.div>
        </div>

        <motion.div {...reveals.body}>
          <BeforeAfterSlider
            ariaLabel="Drag to compare the before and after debugging workflows"
            // Native ~2:1 aspect at every breakpoint (matching the 1828×914
            // panel WebPs and the home/fairness sliders). A taller mobile
            // aspect made object-cover crop the wide cards off-screen.
            aspectClassName="aspect-[912/455]"
            className="border border-v1-frost/20"
            before={<PanelImage src={BEFORE_SRC} alt="" />}
            after={<PanelImage src={AFTER_SRC} alt="" />}
          />
        </motion.div>
      </div>
    </Section>
  );
}

// The slider's `before` / `after` slots are absolute inset-0 stage
// elements (per BeforeAfterSlider's contract); render the JPG as
// object-cover so it fills the stage at any aspect.
function PanelImage({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      aria-hidden={alt === "" || undefined}
      draggable={false}
      decoding="async"
      loading="lazy"
      className="absolute inset-0 h-full w-full select-none object-cover"
    />
  );
}
