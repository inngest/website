"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import ButtonLink from "@/components/v1/ButtonLink";
import Logo from "@/components/v1/Logo";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import { reveals } from "@/utils/v1/reveals";

/**
 * Serverless orchestration comparison: Step Functions vs Temporal vs Inngest.
 * Layout mirrors BackgroundJobs/QueueComparison (scrollable table on mobile).
 */

interface ComparisonRow {
  capability: string;
  stepFunctions: string;
  temporal: string;
  inngest: string;
}

const ROWS: ComparisonRow[] = [
  {
    capability: "Infrastructure model",
    stepFunctions: "AWS-managed state machine",
    temporal: "Cluster + worker fleet",
    inngest: "HTTP into your deploy",
  },
  {
    capability: "Serverless / edge fit",
    stepFunctions: "AWS Lambda–centric",
    temporal: "Workers required",
    inngest: "Native serverless",
  },
  {
    capability: "Vendor lock-in",
    stepFunctions: "AWS-only",
    temporal: "Worker runtime ops",
    inngest: "Infrastructure-agnostic",
  },
  {
    capability: "Workflow definition",
    stepFunctions: "ASL / visual builder",
    temporal: "Code (SDK workflows)",
    inngest: "Code in your repo",
  },
  {
    capability: "Cron + events together",
    stepFunctions: "Separate patterns",
    temporal: "Custom schedules",
    inngest: "One function",
  },
  {
    capability: "Human-in-the-loop waits",
    stepFunctions: "Task tokens / callbacks",
    temporal: "Signals / updates",
    inngest: "waitForEvent / sleep",
  },
  {
    capability: "Distributed retries",
    stepFunctions: "State transitions",
    temporal: "Activity retries",
    inngest: "Per-step retries",
  },
  {
    capability: "Local DX",
    stepFunctions: "Emulators / console",
    temporal: "Local Temporal stack",
    inngest: "One CLI command",
  },
];

export default function OrchestrationComparison() {
  return (
    <Section
      aria-labelledby="sj-orchestration-comparison-heading"
      className="relative"
    >
      <SectionHeader
        id="sj-orchestration-comparison-heading"
        title={
          <>
            Inngest vs Step Functions
            <br className="hidden lg:inline" />
            {" vs Temporal for serverless"}
          </>
        }
        body="Step Functions lock you into AWS and often a visual builder. Temporal needs workers and a cluster. Inngest is infrastructure-agnostic: serverless orchestration on the deploy you already run."
        bodyClassName="max-w-[760px]"
        actions={
          <div className="flex flex-wrap gap-6">
            <ButtonLink
              href="/sign-up?ref=scheduled-jobs-orchestration"
              variant="primary"
            >
              Start building →
            </ButtonLink>
            <ButtonLink
              href="/docs/guides/scheduled-functions?ref=scheduled-jobs-orchestration"
              variant="secondary"
            >
              Serverless cron docs
            </ButtonLink>
          </div>
        }
      />

      <div className="-mx-6 mt-v1-stack overflow-x-auto sm:-mx-9 lg:mx-0 lg:overflow-visible">
        <motion.div
          {...reveals.item(3)}
          role="table"
          aria-label="Comparison of AWS Step Functions, Temporal, and Inngest for serverless workflow orchestration"
          className="min-w-[960px] px-6 sm:px-9 lg:min-w-0 lg:px-0"
        >
          <div
            role="row"
            className="grid grid-cols-4 border-b border-solid border-v1-strong"
          >
            <HeaderCell tone="frost">Capability</HeaderCell>
            <HeaderCell tone="dim">Step Functions</HeaderCell>
            <HeaderCell tone="dim">Temporal</HeaderCell>
            <HeaderCell
              tone="frost"
              icon={<Logo logomarkOnly width={30} />}
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
              <Cell muted>{row.stepFunctions}</Cell>
              <Cell muted>{row.temporal}</Cell>
              <Cell emphasis>{row.inngest}</Cell>
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
        className="font-v1Mono text-[12px] uppercase leading-[16px] whitespace-nowrap lg:text-[16px]"
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
