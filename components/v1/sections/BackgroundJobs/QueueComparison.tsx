"use client";

import { motion } from "motion/react";
import ButtonLink from "@/components/v1/ButtonLink";
import Logo from "@/components/v1/Logo";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import { reveals } from "@/utils/v1/reveals";

/**
 * "A queue was never enough" — capability comparison table.
 *
 * Layout
 *   - Standard <Section> box (px-8 gutter / 160px vertical at lg).
 *   - Header lockup via <SectionHeader> — title + body + the two CTAs
 *     below the body (standard rhythm).
 *   - Table: 3 equal columns × 11 rows. Header row has a solid
 *     `carbon/300` (#7c7c7c) bottom border; every data row has a
 *     `rgba(124,124,124,0.4)` bottom border. Each row is 52 px tall
 *     with 24 px horizontal cell padding.
 *
 * Typography
 *   - Headline: Display/Sm — 64 px Inktrap, leading 1.25, tracking
 *     -0.01em, uppercase.
 *   - Body: Body/Lg — 18 px Circular, leading 1.5.
 *   - Headers: 18 px Whyte Mono, uppercase, frost / opacity-70.
 *   - Cells: 16 px Circular, leading 1.5.
 *
 * Buttons are a filled-white + outlined-white pair.
 */

interface ComparisonRow {
  capability: string;
  /** Non-inngest cell — can be plain text, an `x` icon, or both. */
  legacy: { text?: string; cross?: boolean };
  /** Inngest cell — always shows a green check + label. */
  inngest: string;
}

const ROWS: ComparisonRow[] = [
  {
    capability: "Infrastructure to provision",
    legacy: { text: "Queue server + worker process" },
    inngest: "None — HTTP only",
  },
  {
    capability: "Works in serverless / edge",
    legacy: { cross: true, text: "Difficult" },
    inngest: "Native HTTP model",
  },
  {
    capability: "Automatic retries",
    legacy: { text: "Manual / limited" },
    inngest: "Per-step, configurable",
  },
  {
    capability: "Step-level checkpointing",
    legacy: { cross: true },
    inngest: "Built in",
  },
  {
    capability: "Full run traces and logs",
    legacy: { text: "DIY or third-party tooling" },
    inngest: "Included",
  },
  {
    capability: "Local development UI",
    legacy: { cross: true },
    inngest: "One CLI command",
  },
  {
    capability: "Per-user/tenant concurrency",
    legacy: { text: "Complex to implement" },
    inngest: "One line of config",
  },
  {
    capability: "Bulk replay failed jobs",
    legacy: { cross: true },
    inngest: "Replay from UI",
  },
  {
    capability: "Dead letter queue management",
    legacy: { text: "Required" },
    inngest: "Not needed",
  },
  {
    capability: "Event fan-out (1 event → N jobs)",
    legacy: { text: "Manual" },
    inngest: "Multiple subscribers",
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
  // Thin × in muted carbon/300.
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

export default function QueueComparison() {
  return (
    <Section aria-labelledby="bg-jobs-comparison-heading" className="relative">
      <SectionHeader
        id="bg-jobs-comparison-heading"
        title={
          <>
            A queue was never
            <br className="hidden lg:inline" />
            {" enough."}
          </>
        }
        body="Inngest replaces the entire background job stack — the queue, the worker, the DLQ, and the observability layer — with a single SDK you drop into your existing codebase."
        bodyClassName="max-w-[760px]"
        actions={
          <div className="flex flex-wrap gap-6">
            <ButtonLink href="/docs/quick-start?ref=background-jobs" variant="primary">
              Quick start guide →
            </ButtonLink>
            <ButtonLink href="/docs?ref=background-jobs" variant="secondary">
              Browse the docs
            </ButtonLink>
          </div>
        }
      />

      {/* Comparison table — 3 equal columns, 11 rows × 52 px.
          Below lg the table scrolls horizontally so the cells keep
          their natural widths instead of squishing two-word phrases
          into three-line stacks. `-mx-6 sm:-mx-9 lg:mx-0` cancels the
          section's horizontal padding to bleed the scroll track to
          the viewport edge; `min-w-[720px]` on the inner table holds
          the three columns at readable widths inside the scroll. */}
      <div className="-mx-6 mt-v1-stack overflow-x-auto sm:-mx-9 lg:mx-0 lg:overflow-visible">
        <motion.div
          {...reveals.item(3)}
          role="table"
          aria-label="Capability comparison between traditional queues and Inngest"
          className="min-w-[800px] px-6 sm:px-9 lg:min-w-0 lg:px-0"
        >
          {/* Header row */}
          <div
            role="row"
            className="grid grid-cols-3 border-b border-solid border-v1-strong"
          >
            <HeaderCell tone="frost">Capability</HeaderCell>
            <HeaderCell tone="dim">Redis / SQS / RabbitMQ</HeaderCell>
            <HeaderCell
              tone="frost"
              icon={<Logo logomarkOnly width={30} />}
              iconGap={6}
            >
              Inngest
            </HeaderCell>
          </div>
          {/* Data rows */}
          {ROWS.map((row) => (
            <div
              key={row.capability}
              role="row"
              className="grid grid-cols-3 border-b border-solid border-v1-strong/[0.4]"
            >
              <CapabilityCell>{row.capability}</CapabilityCell>
              <LegacyCell row={row} />
              <InngestCell>{row.inngest}</InngestCell>
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
  children: React.ReactNode;
  tone: "frost" | "dim";
  icon?: React.ReactNode;
  /** Gap between the logomark and the "Inngest" label is 3 px;
   * the unadorned columns default to 8 px for natural breathing room. */
  iconGap?: number;
}) {
  // 52 px tall, px-24, 18 px mono uppercase. The two outer
  // columns (Capability / Inngest) render at full white; the middle
  // column (Redis / SQS / RabbitMQ) renders at opacity-70 on
  // carbon/100 to read as a slightly de-emphasised reference.
  return (
    <div
      role="columnheader"
      className="flex h-[52px] items-center px-6"
      style={{ columnGap: iconGap }}
    >
      {icon}
      <span
        className="font-v1Mono text-[14px] uppercase leading-[16px] whitespace-nowrap lg:text-[18px]"
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

function CapabilityCell({ children }: { children: React.ReactNode }) {
  return (
    <div role="cell" className="flex h-[52px] items-center px-6">
      <span className="font-v1Body text-[14px] leading-[20px] text-v1-frost lg:text-[16px] lg:leading-[24px]">
        {children}
      </span>
    </div>
  );
}

function LegacyCell({ row }: { row: ComparisonRow }) {
  const { text, cross } = row.legacy;
  return (
    <div role="cell" className="flex h-[52px] items-center gap-1 px-6">
      {cross && <CrossIcon />}
      {text && (
        <span
          className="font-v1Body text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]"
          style={{ color: "rgb(var(--color-v1-carbon-100) / 0.7)" }}
        >
          {text}
        </span>
      )}
    </div>
  );
}

function InngestCell({ children }: { children: React.ReactNode }) {
  return (
    <div role="cell" className="flex h-[52px] items-center gap-[10px] px-6">
      <CheckIcon />
      <span className="font-v1Body text-[14px] leading-[20px] text-v1-frost lg:text-[16px] lg:leading-[24px]">
        {children}
      </span>
    </div>
  );
}
