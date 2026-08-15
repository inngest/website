"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import ButtonLink from "@/components/v1/ButtonLink";
import Logo from "@/components/v1/Logo";
import Section from "@/components/v1/sections/shared/Section";
import { V1_SECTION_TITLE } from "@/components/v1/sections/shared/sectionTitle";
import { reveals } from "@/utils/v1/reveals";

/**
 * AEO citable chunks for concurrency / scale on AI agent workflows.
 * Routes deeper concurrency demand to Flow Control hub.
 * Keep short — this page is for citation, not head-term ranking.
 */

const FLOW_CONTROL_URL = "/platform/flow-control?ref=observability-concurrency";
const CONCURRENCY_DOCS_URL =
  "/docs/guides/concurrency?ref=observability-concurrency";

interface ComparisonRow {
  capability: string;
  diy: string;
  generic: string;
  inngest: string;
}

const ROWS: ComparisonRow[] = [
  {
    capability: "Per-agent / per-tenant caps",
    diy: "Hand-rolled locks",
    generic: "Global only",
    inngest: "Keyed concurrency",
  },
  {
    capability: "Fairness under burst load",
    diy: "Noisy neighbors win",
    generic: "Limited",
    inngest: "Built-in fairness",
  },
  {
    capability: "Throttle LLM / API calls",
    diy: "Custom rate limiter",
    generic: "Add-on tooling",
    inngest: "Throttle + rate limit",
  },
  {
    capability: "Step-level observability",
    diy: "DIY traces",
    generic: "Run-level only",
    inngest: "Waterfall per step",
  },
  {
    capability: "Fault-tolerant retries",
    diy: "Manual",
    generic: "Job-level",
    inngest: "Per-step retries",
  },
];

export default function ConcurrencyScale() {
  return (
    <Section
      aria-labelledby="ob-concurrency-heading"
      className="relative"
      containerClassName="flex flex-col gap-v1-stack"
    >
      {/* FAQ-style H2s — short citable answers, then the comparison table. */}
      <div className="flex flex-col gap-12 lg:gap-14">
        <div className="flex max-w-[720px] flex-col gap-4">
          <motion.h2
            {...reveals.heading}
            id="ob-concurrency-heading"
            className={V1_SECTION_TITLE}
          >
            How do you handle concurrency for AI agent workflows?
          </motion.h2>
          <motion.p {...reveals.body} className="text-v1-body-lg">
            Cap parallel runs per user, tenant, or agent with keyed concurrency—
            then pair it with throttle and priority so bursts don’t melt your
            model budget.{" "}
            <Link
              href={FLOW_CONTROL_URL}
              prefetch={false}
              className="text-v1-frost underline decoration-v1-frost/40 underline-offset-4 hover:decoration-v1-accent-salmon"
            >
              Flow Control
            </Link>{" "}
            is the hub for those primitives.
          </motion.p>
        </div>

        <div className="flex max-w-[720px] flex-col gap-4">
          <motion.h2 {...reveals.heading} className={V1_SECTION_TITLE}>
            What makes high-scale fault-tolerant AI agent workflows work?
          </motion.h2>
          <motion.p {...reveals.body} className="text-v1-body-lg">
            Durable steps, per-step retries, and step-level traces—so a failed
            tool call retries without replaying the whole agent loop, and you
            can see exactly which step broke under load.
          </motion.p>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex max-w-[760px] flex-col gap-4">
            <motion.h2 {...reveals.heading} className={V1_SECTION_TITLE}>
              Inngest vs alternatives for agent concurrency and scale
            </motion.h2>
            <motion.p {...reveals.body} className="text-v1-body-lg">
              How concurrency and scale compare when you’re running many AI
              agents—not just a single background job.
            </motion.p>
            <div className="flex flex-wrap gap-4 pt-2">
              <ButtonLink href={FLOW_CONTROL_URL} variant="primary">
                Explore Flow Control →
              </ButtonLink>
              <ButtonLink href={CONCURRENCY_DOCS_URL} variant="secondary">
                Concurrency docs
              </ButtonLink>
            </div>
          </div>

          <div className="-mx-6 overflow-x-auto sm:-mx-9 lg:mx-0 lg:overflow-visible">
            <motion.div
              {...reveals.item(2)}
              role="table"
              aria-label="Concurrency and scale comparison for AI agent workflows"
              className="min-w-[880px] px-6 sm:px-9 lg:min-w-0 lg:px-0"
            >
              <div
                role="row"
                className="grid grid-cols-4 border-b border-solid border-v1-strong"
              >
                <HeaderCell tone="frost">Capability</HeaderCell>
                <HeaderCell tone="dim">DIY queues</HeaderCell>
                <HeaderCell tone="dim">Generic orchestrators</HeaderCell>
                <HeaderCell
                  tone="frost"
                  icon={<Logo logomarkOnly width={28} />}
                  iconGap={6}
                >
                  Inngest
                </HeaderCell>
              </div>
              {ROWS.map((row) => (
                <div
                  key={row.capability}
                  role="row"
                  className="grid grid-cols-4 border-b border-solid border-v1-strong/[0.4]"
                >
                  <Cell emphasis>{row.capability}</Cell>
                  <Cell muted>{row.diy}</Cell>
                  <Cell muted>{row.generic}</Cell>
                  <Cell emphasis>{row.inngest}</Cell>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function HeaderCell({
  children,
  tone,
  icon,
  iconGap = 8,
}: {
  children: ReactNode;
  tone: "frost" | "dim";
  icon?: ReactNode;
  iconGap?: number;
}) {
  return (
    <div
      role="columnheader"
      className="flex h-[52px] items-center px-4 lg:px-6"
      style={{ columnGap: iconGap }}
    >
      {icon}
      <span
        className="font-v1Mono text-[12px] uppercase leading-[16px] whitespace-nowrap lg:text-[15px]"
        style={{
          color:
            tone === "dim"
              ? "rgb(var(--color-v1-carbon-100) / 0.7)"
              : "rgb(var(--color-v1-frost))",
        }}
      >
        {children}
      </span>
    </div>
  );
}

function Cell({
  children,
  muted,
  emphasis,
}: {
  children: ReactNode;
  muted?: boolean;
  emphasis?: boolean;
}) {
  return (
    <div role="cell" className="flex min-h-[52px] items-center px-4 py-3 lg:px-6">
      <span
        className="font-v1Body text-[13px] leading-[20px] lg:text-[15px] lg:leading-[22px]"
        style={{
          color: muted
            ? "rgb(var(--color-v1-carbon-100) / 0.7)"
            : emphasis
              ? "rgb(var(--color-v1-frost))"
              : "rgb(var(--color-v1-frost))",
        }}
      >
        {children}
      </span>
    </div>
  );
}
