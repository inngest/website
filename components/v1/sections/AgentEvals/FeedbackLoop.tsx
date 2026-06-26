"use client";

import BeforeAfterSlider from "@/components/v1/sections/shared/BeforeAfterSlider";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";

/**
 * "A tighter feedback loop for agents" — mirrors the SIZING of the home
 * "It doesn't have to be hard" section (362fr/912fr split, ~2:1 slider box,
 * object-cover) with this page's own matched before/after art (both
 * 1828×914, so the wipe lines up cleanly).
 */
const BEFORE_SRC = "/assets/v1/agent-evals/BEFORE.webp";
const AFTER_SRC = "/assets/v1/agent-evals/AFTER.webp";

export default function FeedbackLoop() {
  return (
    <Section
      aria-labelledby="agent-evals-feedback-headline"
      className="relative"
      containerClassName="
        grid grid-cols-1 gap-[29px]
        lg:grid-cols-[362fr_912fr] lg:items-stretch lg:gap-[102px]
      "
    >
      <SectionHeader
        id="agent-evals-feedback-headline"
        className="lg:pt-[65px]"
        title="A tighter feedback loop for agents"
        body="The data needed to make code durable is the same data needed to judge variant effectiveness—how long it takes to run, why it fails, how much it costs. Inngest captures all of this by default, without added instrumentation."
        bodyClassName="sm:max-w-[420px] lg:max-w-[362px]"
      />
      <BeforeAfterSlider
        ariaLabel="Before: custom pipelines to capture, ship, and store data. After: group.experiment plus step.score."
        before={
          <img
            src={BEFORE_SRC}
            alt="Before: the custom pipelines you build to capture, ship, and store data."
            className="absolute inset-0 block h-full w-full object-cover"
            draggable={false}
          />
        }
        after={
          <img
            src={AFTER_SRC}
            alt="With Inngest: group.experiment and step.score capture the data by default."
            className="absolute inset-0 block h-full w-full object-cover"
            draggable={false}
          />
        }
      />
    </Section>
  );
}
