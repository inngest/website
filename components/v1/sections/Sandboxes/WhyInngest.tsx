"use client";

import type { SVGProps } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import GradientFrame from "@/components/v1/sections/shared/GradientFrame";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import { V1_HEADER_CONTENT_MT } from "@/components/v1/sections/shared/sectionShell";
import { reveals } from "@/utils/v1/reveals";

const REASONS: { id: string; title: string; body: string; href: string }[] = [
  {
    id: "same-service",
    title: "step.sandbox",
    body: "Create the machine from the function you already deploy. No second account, client, or product to keep in step with your app.",
    href: "/docs/features/sandboxes?ref=sandboxes#run-a-command-in-an-inngest-function",
  },
  {
    id: "durability",
    title: "Durability",
    body: "Commands are steps. A failed run retries and resumes with the rest of the function, instead of dying in a box you have to poll.",
    href: "/docs/features/sandboxes/errors-and-retries?ref=sandboxes#understand-step-sandbox-replay",
  },
  {
    id: "flow-control",
    title: "Flow control",
    body: "Concurrency, throttle, and the other limits you already set apply to sandbox usage, the same way they protect the rest of your system.",
    href: "/docs/guides/flow-control?ref=sandboxes",
  },
  {
    id: "experiments",
    title: "Experiments and scoring",
    body: "The sandbox, the experiment, and the score are the same code. Grade generated output without handing the run to another product.",
    href: "/docs/learn/agent-evals?ref=sandboxes",
  },
  {
    id: "tracing",
    title: "Debugging and tracing",
    body: "The sandbox sits on the trace beside the rest of the function. The code and the business logic around it are one place to debug.",
    href: "/docs/platform/monitor/traces?ref=sandboxes",
  },
  {
    id: "processes",
    title: "Background processes",
    body: "Start a worker or server in the sandbox and wait for it from the function. It keeps running after the call that started it returns.",
    href: "/docs/features/sandboxes/managed-processes?ref=sandboxes",
  },
];

/**
 * Why Inngest sandboxes, against a standalone sandbox service.
 * Each card links to the docs section for that capability.
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

      <GradientFrame
        variant="black"
        className={`${V1_HEADER_CONTENT_MT} rounded-[8px]`}
        innerClassName="flex flex-col px-6 py-10 sm:px-8 lg:py-16 lg:pl-10 lg:pr-4"
      >
        <ul className="grid list-none grid-cols-1 gap-x-4 gap-y-10 pl-0 sm:grid-cols-2 sm:gap-y-12 lg:grid-cols-3 lg:gap-y-16">
          {REASONS.map((reason, i) => (
            <motion.li
              key={reason.id}
              {...reveals.item(i)}
              className="flex list-none sm:pr-8 lg:pr-16"
            >
              <Link
                href={reason.href}
                prefetch={false}
                className="group flex h-full flex-col gap-6"
              >
                <ReasonIcon id={reason.id} />
                <h3
                  className={
                    reason.id === "same-service"
                      ? "font-v1Mono text-[1.75rem] leading-none tracking-normal text-v1-frost group-hover:text-v1-accent-salmon motion-safe:transition-colors motion-safe:duration-200"
                      : "text-v1-heading-sm text-v1-frost group-hover:text-v1-accent-salmon motion-safe:transition-colors motion-safe:duration-200"
                  }
                >
                  {reason.title}
                </h3>
                <p className="text-v1-body-sm">{reason.body}</p>
                <span className="mt-auto inline-flex w-fit items-center gap-1 rounded border border-v1-frost/20 px-3 py-1 font-v1Mono text-[11px] uppercase tracking-[0.08em] text-v1-frost/70 group-hover:border-v1-accent-salmon group-hover:text-v1-accent-salmon motion-safe:transition-colors motion-safe:duration-200">
                  See docs
                </span>
              </Link>
            </motion.li>
          ))}
        </ul>
      </GradientFrame>
    </Section>
  );
}

function ReasonIcon({ id }: { id: string }) {
  const props: SVGProps<SVGSVGElement> = {
    width: 28,
    height: 28,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    className: "text-v1-frost",
  };

  switch (id) {
    case "same-service":
      return (
        <svg {...props}>
          <rect x="3.5" y="3.5" width="17" height="17" />
          <rect x="8.5" y="8.5" width="7" height="7" />
        </svg>
      );
    case "durability":
      return (
        <svg {...props}>
          <path d="M20 12a8 8 0 1 1-2.3-5.6" />
          <path d="M20 4.5V8h-3.5" />
        </svg>
      );
    case "flow-control":
      return (
        <svg {...props}>
          <path d="M4 7h16" />
          <path d="M4 17h16" />
          <circle cx="9" cy="7" r="2.25" fill="currentColor" stroke="none" />
          <circle cx="15" cy="17" r="2.25" fill="currentColor" stroke="none" />
        </svg>
      );
    case "experiments":
      return (
        <svg {...props}>
          <path d="M9 3.5h6" />
          <path d="M10 3.5v5.2L5.5 18.2A2.2 2.2 0 0 0 7.4 21.5h9.2a2.2 2.2 0 0 0 1.9-3.3L14 8.7V3.5" />
          <path d="M8.2 14.5h7.6" />
        </svg>
      );
    case "tracing":
      return (
        <svg {...props}>
          <path d="M4 6h10" />
          <path d="M4 12h16" />
          <path d="M4 18h7" />
          <circle cx="17" cy="6" r="2" />
          <circle cx="11" cy="18" r="2" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <rect x="3.5" y="4.5" width="17" height="15" />
          <path d="M3.5 9h17" />
          <path d="M7 13.5h5" />
          <path d="M7 16.5h3" />
        </svg>
      );
  }
}
