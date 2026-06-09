"use client";

/**
 * Background-jobs "Wrap your code. Send an event. That's it." — the
 * left column stretches to match the steps column's height and lays
 * its contents out as a flex column: the headline sticks at the top
 * (within its own flex-1 wrapper so it releases before "That's it."
 * arrives) and "That's it." anchors at the bottom, naturally lining
 * up with the final step's body.
 */

import { motion } from "motion/react";
import { cn } from "@/utils/v1/cn";
import { reveals } from "@/utils/v1/reveals";
import { V1_SECTION_TITLE } from "@/components/v1/sections/shared/sectionTitle";

interface Step {
  number: string;
  title: string;
  bodyLines: string[];
}

const STEPS: Step[] = [
  {
    number: "01",
    title: "Install the SDK",
    bodyLines: [
      "One package. Works with Next.js, Node.js,",
      "Express, FastAPI, Go, and more.",
    ],
  },
  {
    number: "02",
    title: "Add steps",
    bodyLines: [
      "One call to createFunction and you can",
      "start adding atomic steps and retries.",
    ],
  },
  {
    number: "03",
    title: "Send an event",
    bodyLines: [
      "Call inngest.send() from anywhere — an API",
      "route, a webhook, a cron. The job fires instantly.",
    ],
  },
];

export default function HowItWorks() {
  return (
    <section
      aria-labelledby="bg-jobs-how-heading"
      className="relative isolate mx-auto w-full max-w-[1440px] overflow-x-clip px-8 py-4 text-v1-frost lg:py-40"
    >
      <div className="relative grid grid-cols-1 gap-[60px] lg:grid-cols-[3fr_2fr] lg:gap-x-4 lg:gap-y-0">
        <div className="relative lg:flex lg:flex-col lg:self-stretch">
          <div className="lg:flex-1">
            <h2
              id="bg-jobs-how-heading"
              className={cn(V1_SECTION_TITLE, "relative z-10 lg:sticky lg:top-[22vh]")}
            >
              {["Wrap your code.", "Send an event."].map((line, i) => (
                <motion.span key={i} {...reveals.item(i)} className="block">
                  {line}
                </motion.span>
              ))}
            </h2>
          </div>
          <motion.p {...reveals.item(3)} className={V1_SECTION_TITLE}>
            That&rsquo;s it.
          </motion.p>
        </div>

        <ol className="flex flex-col gap-[60px] lg:[gap:max(58px,14vh)]">
          {STEPS.map((step, i) => (
            <StepRow key={step.number} step={step} index={i} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function StepRow({ step, index }: { step: Step; index: number }) {
  return (
    <motion.li
      {...reveals.item(index)}
      className="flex flex-col gap-[7px]"
    >
      <p className="font-v1Mono text-[20.54px] leading-[41px] tracking-[-0.01em]">
        {step.number}
      </p>
      <p className="font-v1Heading text-[28px] leading-[1.17] tracking-[-0.01em] lg:leading-[1.05] lg:[font-size:clamp(1.5rem,1.95vw,2.05rem)]">
        {step.title}
      </p>
      <p className="text-v1-body-lg leading-[1.5] text-v1-frost lg:[font-size:clamp(0.875rem,1.05vw,1.125rem)]">
        {step.bodyLines.map((line, j) => (
          <span key={j} className="lg:block lg:whitespace-nowrap">
            {line}
          </span>
        ))}
      </p>
    </motion.li>
  );
}
