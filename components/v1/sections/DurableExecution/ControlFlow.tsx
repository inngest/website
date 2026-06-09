"use client";

import { motion } from "motion/react";
import { reveals } from "@/utils/v1/reveals";
import ButtonLink from "@/components/v1/ButtonLink";
import GradientFrame from "@/components/v1/sections/shared/GradientFrame";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";

// "Control flow through every event." Two-column layout: copy on the
// left (heading + body + feature bullets + CTA) distributed across the
// panel height, and the dashboard panel on the right exported as a
// single 555×431 SVG that already contains its own border, capacity
// bars, priority queue, and labels.

const DASHBOARD_SRC =
  "/assets/v1/durable-execution/control-flow/dashboard.svg";

const FEATURES: Array<{ name: string; description: string }> = [
  { name: "Concurrency", description: "Solve noisy neighbors" },
  { name: "RateLimit", description: "Control flow" },
  { name: "Idempotency", description: "Collapse event bursts" },
  { name: "Priority", description: "Express execution order" },
];

export default function ControlFlow() {
  return (
    <Section
      aria-labelledby="de-control-flow-heading"
      className="relative"
      containerClassName="flex flex-col gap-10 lg:h-[539px] lg:flex-row lg:items-stretch lg:gap-8"
    >
      <Copy />
        {/* Dashboard panel — black GradientFrame chrome (same one
            /observability uses) holding the exported 555×431 SVG.
            The SVG anchors to the top-left of the panel and the panel
            breathes to the row's full 539px height. */}
        <motion.div {...reveals.body} className="w-full lg:flex-1">
          <GradientFrame
            variant="black"
            className="h-full rounded-md"
            innerClassName="h-full"
          >
            <div className="flex h-full items-center justify-center p-6 lg:px-6 lg:py-8">
              <img
                src={DASHBOARD_SRC}
                alt="Flow control dashboard: concurrency caps per tenant — Acme Corp 5/5, Initech 3/5, Globex 1/5 — with a global limit of 50 split into a per-tenant cap of 5, plus a priority queue showing Sarah's new-account event ranked HIGH and two bulk-sync entries ranked NORMAL."
                width={555}
                height={431}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="block h-auto w-full max-w-[555px] select-none"
              />
            </div>
          </GradientFrame>
        </motion.div>
    </Section>
  );
}

function Copy() {
  return (
    <div className="flex flex-col gap-8 lg:flex-1 lg:pr-8">
      {/* Title + body via SectionHeader (48px between them). The feature
          list sits 40px below the body; the CTA 32px below the list. */}
      <div className="flex flex-col gap-10">
        <SectionHeader
          id="de-control-flow-heading"
          title="Control flow through every event."
          body="Left to a queue, work piles up, noisy tenants starve others, and APIs get hammered. Flow control is how you stay in control as volume grows."
        />
        {/* The design renders the list as plain text paragraphs
            ("– **Name** — description"); we render a semantic <ul> with
            the same visual glyph but skip list-style-type so the dash
            stays aligned with the copy width. */}
        <motion.ul
          {...reveals.body}
          className="flex list-none flex-col pl-0 text-v1-body-lg-loose"
        >
          {FEATURES.map((f) => (
            <li key={f.name} className="list-none">
              <span aria-hidden="true">– </span>
              <strong className="font-bold">{f.name}</strong>
              <span> — {f.description}</span>
            </li>
          ))}
        </motion.ul>
      </div>
      <motion.div {...reveals.body}>
        <ButtonLink
          href="/docs/guides/flow-control?ref=durable-execution"
          variant="primary"
        >
          Learn more about Flow Control
        </ButtonLink>
      </motion.div>
    </div>
  );
}
