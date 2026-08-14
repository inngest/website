"use client";

import { motion } from "motion/react";
import { cn } from "@/utils/v1/cn";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import {
  LIFECYCLE_GLYPHS,
  type LifecycleGlyphId,
} from "@/components/v1/sections/DurableExecution/LifecycleGlyphs";
import { reveals } from "@/utils/v1/reveals";

/**
 * Five plain-English outcomes along the Inngest lifecycle — write
 * durable steps, fan out, control flow, wait when needed, observe.
 * Icons are lightweight inline SVG glyphs (no PNG payloads).
 */

interface Outcome {
  id: LifecycleGlyphId;
  label: string;
}

const OUTCOMES: Outcome[] = [
  { id: "retries", label: "Automatic retries" },
  { id: "fan-out", label: "Fan out events" },
  { id: "noisy-neighbor", label: "Solve noisy neighbors" },
  { id: "wait", label: "Wait without polling" },
  { id: "observability", label: "Get deep observability" },
];

export default function Problems() {
  return (
    <Section
      aria-labelledby="de-problems-headline"
      className="relative"
      containerClassName="flex flex-col gap-v1-stack-lg"
    >
      <SectionHeader
        id="de-problems-headline"
        eyebrow="The problem"
        title={
          <>
            <span className="block">Your workflows will fail.</span>
            <span className="block">Then what?</span>
          </>
        }
        body="Hand-rolled queues break under real load. With Inngest you retry from checkpoints, fan out work, control noisy tenants, wait for the real world, and see every step — without another worker fleet to babysit."
        bodyClassName="max-w-[655px]"
      />

      <ul className="grid list-none grid-cols-1 gap-y-12 pl-0 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-5 lg:items-end lg:gap-y-0">
        {OUTCOMES.map((item, i) => (
          <OutcomeCard key={item.id} item={item} index={i} />
        ))}
      </ul>
    </Section>
  );
}

function OutcomeCard({
  item,
  index: i,
}: {
  item: Outcome;
  index: number;
}) {
  const Glyph = LIFECYCLE_GLYPHS[item.id];
  return (
    <motion.li
      {...reveals.item(i)}
      className="group relative flex list-none flex-col items-stretch gap-10 sm:gap-[60px] lg:gap-[83px]"
    >
      <div className="relative flex h-[148px] items-center justify-center motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-safe:group-hover:scale-105">
        <Glyph />
      </div>

      <div
        className={cn(
          "flex h-[97px] flex-col items-center justify-center gap-2 border border-v1-frost px-3 pb-4 pt-3 text-center uppercase",
          i > 0 && "lg:-ml-px",
        )}
      >
        <span className="text-v1-label-md text-v1-frost">{item.label}</span>
      </div>
    </motion.li>
  );
}
