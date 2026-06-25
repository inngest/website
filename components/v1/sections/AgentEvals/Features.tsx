"use client";

import { motion } from "motion/react";
import { reveals } from "@/utils/v1/reveals";
import GradientFrame from "@/components/v1/sections/shared/GradientFrame";
import Section from "@/components/v1/sections/shared/Section";
import { V1_SECTION_TITLE } from "@/components/v1/sections/shared/sectionTitle";
import AnimatedEvals from "@/components/v1/sections/AgentEvals/AnimatedEvals";

/**
 * "Everything you need to safely test in production" — same layout as the
 * home page's "Durability belongs in code" (ScaleInstantly): a charcoal
 * panel with the heading on top, a 448fr/774fr row (intro copy left,
 * dashboard video right), then a 3-up capability tile grid.
 *
 * PLACEHOLDERS (TODO jb): the dashboard video reuses the home tour clip,
 * and the tile icons reuse the scale-instantly set by index.
 */
interface Feature {
  title: string;
  body: string;
  icon: string;
  iconWidth: number;
  iconHeight: number;
}

const FEATURES: Feature[] = [
  {
    title: "Scoring",
    body: "One shot was never enough. We let you use real production outcomes to eval variants.",
    icon: "/assets/v1/scale-instantly/ai-agents.svg",
    iconWidth: 27.77,
    iconHeight: 32,
  },
  {
    title: "Live Experiments",
    body: "Test what works against live production traffic, or in a sandbox.",
    icon: "/assets/v1/scale-instantly/api-endpoints.svg",
    iconWidth: 30.02,
    iconHeight: 25.71,
  },
  {
    title: "100% not 1%",
    body: "Track outcomes across every run, without needing to sample.",
    icon: "/assets/v1/scale-instantly/workflows.svg",
    iconWidth: 32,
    iconHeight: 32,
  },
  {
    title: "Datasets",
    body: "Generate datasets of good and bad runs for evals and offline replay.",
    icon: "/assets/v1/scale-instantly/serverless.svg",
    iconWidth: 32,
    iconHeight: 20.52,
  },
  {
    title: "Sessions",
    body: "Group multiple agent loops or turns as a single conversation, thread, or however you choose.",
    icon: "/assets/v1/scale-instantly/events.svg",
    iconWidth: 21.65,
    iconHeight: 32,
  },
];

export default function Features() {
  return (
    <Section
      aria-label="Everything you need to safely test in production"
      className="relative"
    >
      <GradientFrame
        variant="charcoal"
        className="rounded-md"
        innerClassName="relative flex flex-col gap-[29px] px-4 pb-[72px] pt-11 lg:gap-20 lg:px-11 lg:pt-16"
      >
        <div className="flex flex-col gap-12">
          <motion.h2 {...reveals.heading} className={V1_SECTION_TITLE}>
            Everything you need to safely test in production
          </motion.h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[448fr_774fr] lg:items-start lg:gap-x-4 lg:gap-y-10">
            <div className="flex flex-col gap-6 lg:pr-8 lg:pt-11">
              <motion.p
                {...reveals.body}
                className="text-v1-heading-sm !text-[clamp(1.25rem,4vw,1.625rem)] !leading-[1.2] text-v1-frost"
              >
                Inngest makes your code durable and observable by default.
              </motion.p>
              <motion.p
                {...reveals.body}
                className="text-v1-body-lg-loose !text-[clamp(1rem,3vw,1.125rem)] !leading-[1.45] text-v1-frost"
              >
                No added infrastructure or instrumentation.
              </motion.p>
            </div>
            <GradientFrame
              className="relative overflow-hidden rounded-md"
              variant="charcoal"
              innerClassName="p-4 lg:p-6"
            >
              <AnimatedEvals />
            </GradientFrame>
          </div>
        </div>

        <ul className="grid grid-cols-1 gap-[22px] lg:grid-cols-3 lg:gap-[58px]">
          {FEATURES.map((f, i) => (
            <motion.li
              key={f.title}
              {...reveals.item(i)}
              className="flex flex-col gap-2"
            >
              <div className="flex items-center gap-[10px]">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center">
                  <img
                    src={f.icon}
                    alt=""
                    aria-hidden="true"
                    width={f.iconWidth}
                    height={f.iconHeight}
                    className="block"
                  />
                </span>
                <h3 className="text-v1-heading-xs text-v1-frost lg:text-v1-heading-card">
                  {f.title}
                </h3>
              </div>
              <p className="text-v1-heading-xs-loose text-pretty text-[#B3B3B3]">
                {f.body}
              </p>
            </motion.li>
          ))}
        </ul>
      </GradientFrame>
    </Section>
  );
}
