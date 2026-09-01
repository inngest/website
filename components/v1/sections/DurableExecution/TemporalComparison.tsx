"use client";

import { motion } from "motion/react";
import ButtonLink from "@/components/v1/ButtonLink";
import Logo from "@/components/v1/Logo";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import { cn } from "@/utils/v1/cn";
import { reveals } from "@/utils/v1/reveals";

/**
 * Capability comparison: traditional queues vs Temporal vs Inngest.
 * Placed directly under the problem section on /platform/durable-execution.
 * Table chrome mirrors BackgroundJobs/QueueComparison.
 *
 * Check balance (fair, not all-or-nothing):
 *   Traditional queues — a couple (basic retries, quick start, any language)
 *   Temporal — more (retries, checkpointing, waits, multi-step, languages)
 *   Inngest — most (above + serverless + scoring + experiments + zero workers)
 *
 * Temporal setup copy grounded in Temporal docs / Cloud FAQ: Cloud
 * removes the cluster but you still run workers; self-host adds K8s +
 * Cassandra/PostgreSQL + ongoing ops.
 */

interface Cell {
  text?: string;
  cross?: boolean;
  check?: boolean;
}

interface ComparisonRow {
  capability: string;
  queues: Cell;
  temporal: Cell;
  inngest: Cell;
}

const ROWS: ComparisonRow[] = [
  {
    capability: "Automatic retries",
    queues: { check: true, text: "Job-level / limited" },
    temporal: { check: true, text: "Per activity" },
    inngest: { check: true, text: "Per-step, built in" },
  },
  {
    capability: "Step-level checkpointing",
    queues: { cross: true },
    temporal: { check: true, text: "Activity results cached" },
    inngest: { check: true, text: "Every step memoized" },
  },
  {
    capability: "Long sleeps / wait for events",
    queues: { cross: true, text: "Polling or custom infra" },
    temporal: { check: true, text: "Signals + timers" },
    inngest: { check: true, text: "Native sleep + waitForEvent" },
  },
  {
    capability: "Multi-step durable workflows",
    queues: { cross: true, text: "Hand-rolled" },
    temporal: { check: true, text: "Core strength" },
    inngest: { check: true, text: "First-class in code" },
  },
  {
    capability: "Any language / runtime",
    queues: { check: true, text: "Whatever talks to the queue" },
    temporal: { check: true, text: "Go, Java, TS, Python — Go strongest" },
    inngest: { check: true, text: "TS, Python, Go — any HTTP runtime" },
  },
  {
    capability: "Works in serverless / edge",
    queues: { cross: true, text: "Difficult" },
    temporal: { cross: true, text: "Persistent workers required" },
    inngest: { check: true, text: "Native HTTP model" },
  },
  {
    capability: "Native run & group scoring",
    queues: { cross: true },
    temporal: { cross: true, text: "DIY / external tools" },
    inngest: { check: true, text: "step.score — runs or groups" },
  },
  {
    capability: "In-code experiments",
    queues: { cross: true },
    temporal: { cross: true, text: "Custom traffic splitting" },
    inngest: { check: true, text: "group.experiment() built in" },
  },
  {
    capability: "Time to first durable workflow",
    queues: { check: true, text: "Minutes for a basic job" },
    temporal: {
      cross: true,
      text: "Days — workers + cluster/DB (Cloud still needs a worker fleet)",
    },
    inngest: { check: true, text: "Minutes — wrap existing code" },
  },
  {
    capability: "Infrastructure to own",
    queues: { text: "Queue, workers, DLQ" },
    temporal: { text: "Workers always; self-host adds server + DB" },
    inngest: { check: true, text: "Zero — fully managed" },
  },
];

const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M5 12.5 L 10 17 L 19 7"
      stroke="rgb(var(--color-v1-green-200))"
      strokeWidth="1.75"
      fill="none"
      strokeLinecap="square"
    />
  </svg>
);

const CrossIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M7 7 17 17 M17 7 7 17"
      stroke="rgb(var(--color-v1-carbon-300))"
      strokeWidth="1.75"
      fill="none"
      strokeLinecap="square"
    />
  </svg>
);

export default function TemporalComparison() {
  return (
    <Section aria-labelledby="de-temporal-comparison-heading" className="relative">
      <SectionHeader
        id="de-temporal-comparison-heading"
        eyebrow="Compare"
        title={
          <>
            What is durable execution—
            <br className="hidden lg:inline" />
            {" and how does Inngest compare?"}
          </>
        }
        body="Durable execution keeps long-running workflows reliable with automatic retries and checkpoints when steps fail. Temporal gets you there if you can absorb the worker fleet and platform setup; traditional queues don't. Inngest delivers the same durability guarantees from the code you already run — no workers, no cluster, no separate orchestration fleet."
        bodyClassName="max-w-[760px]"
        actions={
          <div className="flex flex-wrap gap-6">
            <ButtonLink
              href="/compare-to-temporal?ref=durable-execution"
              variant="primary"
            >
              Compare to Temporal →
            </ButtonLink>
            <ButtonLink href="/sign-up?ref=durable-execution-compare" variant="secondary">
              Start building free
            </ButtonLink>
          </div>
        }
      />

      <div className="-mx-6 mt-v1-stack overflow-x-auto sm:-mx-9 lg:mx-0 lg:overflow-visible">
        <motion.div
          {...reveals.item(3)}
          role="table"
          aria-label="Capability comparison between traditional queues, Temporal, and Inngest"
          className="min-w-[960px] px-6 sm:px-9 lg:min-w-0 lg:px-0"
        >
          <div
            role="row"
            className="grid grid-cols-4 border-b border-solid border-v1-strong"
          >
            <HeaderCell tone="frost">Capability</HeaderCell>
            <HeaderCell tone="dim">Traditional queues</HeaderCell>
            <HeaderCell tone="dim">Temporal</HeaderCell>
            <HeaderCell
              tone="frost"
              icon={<Logo logomarkOnly width={30} />}
              iconGap={6}
              highlight
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
              <CapabilityCell>{row.capability}</CapabilityCell>
              <FeatureCell cell={row.queues} muted />
              <FeatureCell cell={row.temporal} muted />
              <FeatureCell cell={row.inngest} highlight />
            </div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

function HeaderCell({
  children,
  tone,
  icon,
  iconGap = 8,
  highlight,
}: {
  children: React.ReactNode;
  tone: "frost" | "dim";
  icon?: React.ReactNode;
  iconGap?: number;
  /** Inngest column only - subtle green wash + hairline sides so the
   * "us" lane reads with more contrast against the reference columns. */
  highlight?: boolean;
}) {
  return (
    <div
      role="columnheader"
      className={cn(
        "flex h-[52px] items-center px-4 lg:px-6",
        highlight &&
          "border-x border-solid border-v1-accent-green/25 bg-v1-accent-green/[0.06]",
      )}
      style={{ columnGap: iconGap }}
    >
      {icon}
      <span
        className={cn(
          "font-v1Mono text-[12px] uppercase leading-[14px] whitespace-nowrap lg:text-[16px] lg:leading-[18px]",
          highlight && "font-medium",
        )}
        style={{
          color:
            tone === "dim"
              ? "rgb(var(--color-v1-carbon-100) / 0.55)"
              : "rgb(var(--color-v1-frost))",
        }}
      >
        {children}
      </span>
    </div>
  );
}

function CapabilityCell({ children }: { children: React.ReactNode }) {
  return (
    <div role="cell" className="flex min-h-[52px] items-center px-4 py-3 lg:px-6">
      <span className="font-v1Body text-[13px] leading-[18px] text-v1-frost lg:text-[15px] lg:leading-[22px]">
        {children}
      </span>
    </div>
  );
}

function FeatureCell({
  cell,
  muted,
  highlight,
}: {
  cell: Cell;
  muted?: boolean;
  /** Inngest column only - see HeaderCell. */
  highlight?: boolean;
}) {
  const { text, cross, check } = cell;
  return (
    <div
      role="cell"
      className={cn(
        "flex min-h-[52px] items-center gap-1 px-4 py-3 lg:gap-[10px] lg:px-6",
        highlight &&
          "border-x border-solid border-v1-accent-green/25 bg-v1-accent-green/[0.06]",
      )}
    >
      {check && <CheckIcon />}
      {cross && <CrossIcon />}
      {text && (
        <span
          className={cn(
            "font-v1Body text-[13px] leading-[18px] lg:text-[15px] lg:leading-[22px]",
            highlight && "font-medium",
          )}
          style={{
            color: muted
              ? "rgb(var(--color-v1-carbon-100) / 0.55)"
              : "rgb(var(--color-v1-frost))",
          }}
        >
          {text}
        </span>
      )}
    </div>
  );
}
