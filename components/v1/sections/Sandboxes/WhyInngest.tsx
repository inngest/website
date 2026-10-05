"use client";

import { motion } from "motion/react";
import HoverCardShell from "@/components/v1/sections/shared/HoverCardShell";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import { V1_HEADER_CONTENT_MT } from "@/components/v1/sections/shared/sectionShell";
import { reveals } from "@/utils/v1/reveals";
import { cn } from "@/utils/v1/cn";

const REASONS: {
  id: string;
  title: string;
  body: string;
  href: string;
  /** Site line-art icon (white stroke), same family as the homepage
   *  use-case band. Shared concepts reuse the homepage's exact file. */
  icon: string;
}[] = [
  {
    id: "same-service",
    title: "step.sandbox",
    body: "Create the machine from the function you already deploy. No second account, client, or product to keep in step with your app.",
    href: "/docs/sandboxes/features/managed-lifecycle?ref=sandboxes#use-a-sandbox-in-a-durable-function",
    icon: "/assets/v1/primitives/icon-6-local-env.svg",
  },
  {
    id: "durability",
    title: "Durability",
    body: "Commands are steps. A failed run retries and resumes with the rest of the function, instead of dying in a box you have to poll.",
    href: "/docs/sandboxes/features/managed-lifecycle?ref=sandboxes#retries-and-uncertain-outcomes",
    icon: "/assets/v1/feature-cards/retries.svg",
  },
  {
    id: "flow-control",
    title: "Flow control",
    body: "Concurrency, throttle, and the other limits you already set apply to sandbox usage, the same way they protect the rest of your system.",
    href: "/docs/guides/flow-control?ref=sandboxes",
    icon: "/assets/v1/feature-cards/flow-control.svg",
  },
  {
    id: "experiments",
    title: "Experiments and scoring",
    body: "The sandbox, the experiment, and the score are the same code. Grade generated output without handing the run to another product.",
    href: "/docs/learn/agent-evals?ref=sandboxes",
    icon: "/assets/v1/primitives/icon-4-human-loop.svg",
  },
  {
    id: "tracing",
    title: "Debugging and tracing",
    body: "The sandbox sits on the trace beside the rest of the function. The code and the business logic around it are one place to debug.",
    href: "/docs/sandboxes/features/traces?ref=sandboxes",
    icon: "/assets/v1/feature-cards/observability.svg",
  },
  {
    id: "processes",
    title: "Background processes",
    body: "Start a worker or server in the sandbox and wait for it from the function. It keeps running after the call that started it returns.",
    href: "/docs/sandboxes/reference?ref=sandboxes#commands-processes-and-files",
    icon: "/assets/v1/primitives/icon-5-no-timeout.svg",
  },
];

/**
 * Why Inngest sandboxes, against a standalone sandbox service. Six
 * hover cards on the open grain (no outer frame), each the whole-card
 * link to its docs section, with the site's "See docs →" text cue —
 * the same card vocabulary as the homepage use-case band.
 */
export default function WhyInngest() {
  return (
    <Section aria-labelledby="sandboxes-why-heading" className="relative">
      <SectionHeader
        id="sandboxes-why-heading"
        eyebrow="Why Inngest"
        title={
          <>
            <span className="block">Same system.</span>
            <span className="block">Fewer services.</span>
          </>
        }
        body="A standalone sandbox is another client, another trace, and another run to operate. Here the machine is a step in the function you already ship."
        bodyClassName="max-w-[640px]"
      />

      <ul
        className={cn(
          V1_HEADER_CONTENT_MT,
          "grid list-none grid-cols-1 gap-x-6 gap-y-6 pl-0 sm:grid-cols-2 lg:grid-cols-3"
        )}
      >
        {REASONS.map((reason, i) => (
          <motion.li key={reason.id} {...reveals.item(i)} className="list-none">
            <HoverCardShell
              href={reason.href}
              className="-mx-4 gap-6 px-4 pb-6 pt-5 sm:mx-0 sm:p-5"
            >
              <div className="flex flex-col gap-4">
                <span className="flex h-9 items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={reason.icon}
                    alt=""
                    aria-hidden="true"
                    className="block h-auto max-h-9 w-auto max-w-[44px] object-contain object-left"
                  />
                </span>
                <h3
                  className={
                    reason.id === "same-service"
                      ? "font-v1Mono text-[1.5rem] leading-none tracking-normal text-v1-frost"
                      : "text-v1-heading-sm text-v1-frost"
                  }
                >
                  {reason.title}
                </h3>
                <p className="text-v1-body-sm">{reason.body}</p>
              </div>
              <span className="text-v1-label-md mt-auto inline-flex w-fit items-center uppercase text-v1-frost group-hover:text-v1-accent-salmon motion-safe:transition-colors motion-safe:duration-300">
                See docs
                <span
                  aria-hidden="true"
                  className="ml-2 inline-block group-hover:translate-x-[6px] motion-safe:transition-transform motion-safe:duration-[400ms] motion-safe:ease-v1-in"
                >
                  →
                </span>
              </span>
            </HoverCardShell>
          </motion.li>
        ))}
      </ul>
    </Section>
  );
}
