"use client";

import { motion } from "motion/react";
import ButtonLink from "@/components/v1/ButtonLink";
import GradientFrame from "@/components/v1/sections/shared/GradientFrame";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import { reveals } from "@/utils/v1/reveals";

// "Know why your AI loops."
// Outer charcoal GradientFrame card wraps a nested black GradientFrame
// holding the diagram illustration (723x219 SVG)
// on the left, plus the eyebrow/heading/body/CTA copy column on the right.

const SEE_DOCS_URL = "/docs/platform/monitor/insights?ref=observability-ai";
const DIAGRAM_SRC = "/assets/v1/observability/ai-loops-diagram.svg";

export default function AILoops() {
  return (
    <Section aria-labelledby="ob-ailoops-heading" className="relative">
      <GradientFrame
        variant="charcoal-horizontal"
        className="rounded-md"
        innerClassName="grid grid-cols-1 items-center gap-x-7 gap-y-10 px-5 py-10 sm:px-8 sm:py-12 lg:grid-cols-[minmax(0,778fr)_minmax(0,447fr)] lg:px-8 lg:py-16"
      >
        {/* Diagram panel — nested black-horizontal GradientFrame. The
            card is pinned to 541px tall, leaving generous vertical air
            around the 723x219 illustration. `min-h` (not fixed `h`) so
            the card grows gracefully if the right column ever exceeds
            541px — keeps the side-by-side cards visually paired. */}
        <motion.div
          {...reveals.body}
          className="h-full w-full lg:min-h-[541px]"
        >
          <GradientFrame
            variant="black-horizontal"
            className="h-full w-full rounded-lg"
            innerClassName="flex h-full items-center justify-center px-5 py-8 sm:px-6 sm:py-8"
          >
            {/* Scale the diagram to fit the column at every breakpoint —
                no horizontal scroll. The SVG keeps its aspect via `h-auto`
                and caps at its native 723px max-width on `lg`. */}
            <div className="w-full">
              <img
                src={DIAGRAM_SRC}
                alt=""
                aria-hidden="true"
                draggable={false}
                className="block h-auto w-full max-w-[723px]"
              />
            </div>
          </GradientFrame>
        </motion.div>

        {/* Right column — eyebrow/title/body/CTA via SectionHeader
            (mirrors DurableExecution/Observability's card column). */}
        <SectionHeader
          className="lg:pr-8"
          id="ob-ailoops-heading"
          eyebrow="AI & Insights"
          title="Know why your AI loops."
          titleClassName="max-w-[415px]"
          body="An agent running as a single function call is completely opaque. You see it started. You see it failed. You have no idea what prompts went in, what came back, or where it went wrong."
          actions={
            <ButtonLink
              href={SEE_DOCS_URL}
              variant="primary"
              className="!w-full sm:!w-auto"
            >
              See docs
            </ButtonLink>
          }
        />
      </GradientFrame>
    </Section>
  );
}
