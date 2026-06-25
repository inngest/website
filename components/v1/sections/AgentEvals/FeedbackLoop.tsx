"use client";

import BeforeAfterSlider from "@/components/v1/sections/shared/BeforeAfterSlider";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";

/**
 * "A tighter feedback loop for agents" — same layout as the flow-control
 * page's "Solve noisy neighbors" (Fairness) section: a 1fr/2fr grid with
 * a copy column on the left and a 2-col-wide before/after slider on the
 * right.
 *
 * PLACEHOLDER VISUAL: the real art is a <BEFORE / AFTER SLIDER> (left =
 * the custom pipelines you build to capture/ship/store data; right =
 * group.experiment + step.score). Until those assets land, the two panels
 * are styled stand-ins. TODO(jb): drop in the real before/after images.
 */
export default function FeedbackLoop() {
  return (
    <Section
      aria-labelledby="agent-evals-feedback-headline"
      className="relative"
      containerClassName="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_2fr] lg:items-stretch lg:gap-4"
    >
      <SectionHeader
        id="agent-evals-feedback-headline"
        className="lg:pb-8"
        title="A tighter feedback loop for agents"
        body="The data needed to make code durable is the same data needed to judge variant effectiveness—how long it takes to run, why it fails, how much it costs. Inngest captures all of this by default, without added instrumentation."
        bodyClassName="sm:max-w-[420px] lg:max-w-[362px]"
      />
      <BeforeAfterSlider
        ariaLabel="Before: custom pipelines to capture, ship, and store data. After: group.experiment plus step.score."
        aspectClassName="aspect-[912/455]"
        className="border-2 border-v1-frost"
        beforeLabel="Before"
        afterLabel="After"
        before={
          <div className="absolute inset-0 flex items-center justify-center bg-v1-jetBlack p-8">
            <p className="max-w-[70%] text-center font-v1Mono text-sm uppercase tracking-wide text-v1-frost/70">
              Custom pipelines to capture, ship, and store data
            </p>
          </div>
        }
        after={
          <div className="absolute inset-0 flex items-center justify-center bg-v1-accent-blue p-8">
            <p className="max-w-[70%] text-center font-v1Mono text-sm text-white">
              group.experiment() + step.score()
            </p>
          </div>
        }
      />
    </Section>
  );
}
