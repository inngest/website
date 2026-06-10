"use client";

import { motion } from "motion/react";
import BeforeAfterSlider from "@/components/v1/sections/shared/BeforeAfterSlider";
import { ParaReveal } from "@/components/v1/sections/shared/ParaReveal";
import Section from "@/components/v1/sections/shared/Section";
import { V1_SECTION_TITLE } from "@/components/v1/sections/shared/sectionTitle";
import { reveals } from "@/utils/v1/reveals";

const BEFORE_SRC = "/assets/v1/it-doesnt-have-to-be-hard/before.webp";
const AFTER_SRC = "/assets/v1/it-doesnt-have-to-be-hard/after.webp";

export default function ItDoesntHaveToBeHard() {
  return (
    <Section
      aria-label="It doesn't have to be hard"
      className="relative"
      containerClassName="
        grid grid-cols-1 gap-[29px]
        lg:grid-cols-[362fr_912fr] lg:items-stretch lg:gap-[102px]
      "
    >
      <Copy />
        <BeforeAfterSlider
          ariaLabel="Drag to compare the before and after states"
          before={
            <img
              src={BEFORE_SRC}
              alt="Before: the tangle of infrastructure (queues, pubsub, idempotency, error handling, capacity management) you have to build yourself."
              className="absolute inset-0 block h-full w-full object-cover"
              draggable={false}
            />
          }
          after={
            <img
              src={AFTER_SRC}
              alt="After: a single step.run() call replacing all that infrastructure."
              className="absolute inset-0 block h-full w-full object-cover"
              draggable={false}
            />
          }
          beforeOverlay={
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.10) 60%, rgba(0,0,0,0) 100%)",
              }}
            />
          }
          afterOverlay={
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 90% at 80% 30%, rgba(255, 240, 230, 0.14), rgba(255, 240, 230, 0) 70%)",
              }}
            />
          }
        />
    </Section>
  );
}

function Copy() {
  return (
    <div className="flex flex-col gap-v1-stack lg:pt-[65px]">
      <motion.h2
        {...reveals.heading}
        aria-label="It doesn't have to be hard"
        className={V1_SECTION_TITLE}
      >
        <span aria-hidden="true" className="block lg:hidden">It doesn&rsquo;t have to</span>
        <span aria-hidden="true" className="hidden lg:block">It doesn&rsquo;t</span>
        <span aria-hidden="true" className="hidden lg:block">have to</span>
        <span aria-hidden="true" className="block">be hard</span>
      </motion.h2>
      {/* Body stays bespoke: it shrinks 18→14px at lg via the clamp so
          the two locked, no-wrap lines fit the narrow 362fr column —
          no body token expresses that column-fit responsive scale. */}
      <ParaReveal>
        <p
          className="font-v1Body text-[#B3B3B3] leading-[28px] text-[18px] tracking-[-0.01em] lg:text-[clamp(0.875rem,1.4vw,1.125rem)] lg:leading-[1.5]"
        >
          <span className="lg:block lg:whitespace-nowrap">
            Durability that runs on top of existing code,{" "}
          </span>
          <span className="lg:block lg:whitespace-nowrap">
            not alongside it in separate infrastructure.
          </span>
        </p>
      </ParaReveal>
    </div>
  );
}

