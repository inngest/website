"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import ButtonLink from "@/components/v1/ButtonLink";
import Logo from "@/components/v1/Logo";
import Section from "@/components/v1/sections/shared/Section";
import { reveals } from "@/utils/v1/reveals";

/**
 * AEO quick-win on Observability: short FAQ-style H2s + a scannable
 * comparison for concurrency/scale on AI agents. This page cites;
 * deeper demand routes to Row 1 (/ai) and Flow Control (#4).
 */

const AI_HUB_URL = "/ai?ref=observability-concurrency";
const FLOW_CONTROL_URL = "/platform/flow-control?ref=observability-concurrency";

interface ComparisonRow {
  capability: string;
  logsApm: string;
  inngest: string;
}

const ROWS: ComparisonRow[] = [
  {
    capability: "See which agent hit the concurrency cap",
    logsApm: "Guess from rate-limit errors",
    inngest: "Per-run + step traces",
  },
  {
    capability: "Trace many agents under load",
    logsApm: "Trace IDs across tools",
    inngest: "One waterfall per run",
  },
  {
    capability: "Spot noisy-neighbor tenants",
    logsApm: "Custom metrics job",
    inngest: "Filter runs by user / tenant",
  },
  {
    capability: "Debug a failed tool call at scale",
    logsApm: "Opaque single span",
    inngest: "Step input / output / retries",
  },
];

export default function ConcurrencyScale() {
  return (
    <Section
      aria-labelledby="ob-concurrency-heading"
      className="relative"
      containerClassName="flex flex-col gap-12 lg:gap-16"
    >
      {/* Compact FAQ-style H2s — heading-sm, not display titles. */}
      <div className="grid list-none grid-cols-1 gap-10 pl-0 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-12">
        <FaqBlock
          id="ob-concurrency-heading"
          question="How do you observe concurrency for AI agent workflows?"
          answer={
            <>
              When hundreds of agents run in parallel, you need step-level
              traces—not just “the job failed.” See which run hit a cap, which
              tool call retried, and which tenant flooded the queue. Configure
              those caps in{" "}
              <Link
                href={FLOW_CONTROL_URL}
                prefetch={false}
                className="underline decoration-current/40 underline-offset-4 hover:decoration-v1-accent-salmon"
              >
                Flow Control
              </Link>
              ; build the agents on{" "}
              <Link
                href={AI_HUB_URL}
                prefetch={false}
                className="underline decoration-current/40 underline-offset-4 hover:decoration-v1-accent-salmon"
              >
                AI workflow orchestration
              </Link>
              .
            </>
          }
        />
        <FaqBlock
          question="What do high-scale fault-tolerant AI agent workflows need to show?"
          answer={
            <>
              Per-step timing, retries, and outputs under load—so a failed LLM
              or tool call is visible without replaying the whole loop. That’s
              observability for agents at scale, not another APM dashboard.
            </>
          }
        />
      </div>

      <div className="flex flex-col gap-8">
        <div className="flex max-w-[640px] flex-col gap-4">
          <motion.h2
            {...reveals.heading}
            className="text-v1-heading-sm text-v1-frost"
          >
            Inngest vs logs/APM for agent concurrency and scale
          </motion.h2>
          <motion.p {...reveals.body} className="text-v1-body-sm">
            A quick look at how you see concurrent AI agents when something
            breaks—not how you configure the limits (that’s Flow Control).
          </motion.p>
          <div className="flex flex-wrap gap-4 pt-1">
            <ButtonLink href={AI_HUB_URL} variant="primary">
              AI orchestration →
            </ButtonLink>
            <ButtonLink href={FLOW_CONTROL_URL} variant="secondary">
              Flow Control
            </ButtonLink>
          </div>
        </div>

        <div className="-mx-6 overflow-x-auto sm:-mx-9 lg:mx-0 lg:overflow-visible">
          <motion.div
            {...reveals.item(2)}
            role="table"
            aria-label="Observability comparison for concurrent AI agent workflows"
            className="min-w-[720px] px-6 sm:px-9 lg:min-w-0 lg:px-0"
          >
            <div
              role="row"
              className="grid grid-cols-3 border-b border-solid border-v1-strong"
            >
              <HeaderCell tone="frost">When agents run concurrently</HeaderCell>
              <HeaderCell tone="dim">Logs / APM</HeaderCell>
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
                className="grid grid-cols-3 border-b border-solid border-v1-strong/[0.4]"
              >
                <Cell emphasis>{row.capability}</Cell>
                <Cell muted>{row.logsApm}</Cell>
                <Cell emphasis>{row.inngest}</Cell>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </Section>
  );
}

function FaqBlock({
  id,
  question,
  answer,
}: {
  id?: string;
  question: string;
  answer: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-t border-v1-carbon-100 pt-6">
      <motion.h2
        {...reveals.heading}
        id={id}
        className="text-v1-heading-sm text-v1-frost"
      >
        {question}
      </motion.h2>
      <motion.p {...reveals.body} className="text-v1-body-sm max-w-[520px]">
        {answer}
      </motion.p>
    </div>
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
        className="font-v1Mono text-[12px] uppercase leading-[16px] lg:text-[15px]"
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
