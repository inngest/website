"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import Logo from "@/components/v1/Logo";
import Section from "@/components/v1/sections/shared/Section";
import { reveals } from "@/utils/v1/reveals";

/**
 * AEO citable chunks only — not a conversion block.
 * - FAQ-style H2s for concurrency / scale prompts
 * - Scannable Inngest vs alternatives table
 * - Soft text link to Flow Control (#4); no CTA to Row 1 (/ai)
 */

const FLOW_CONTROL_URL = "/platform/flow-control?ref=observability-concurrency";

interface ComparisonRow {
  capability: string;
  diy: string;
  temporal: string;
  inngest: string;
}

const ROWS: ComparisonRow[] = [
  {
    capability: "Per-agent concurrency caps",
    diy: "Custom locks / Redis",
    temporal: "Worker tuning",
    inngest: "Keyed concurrency",
  },
  {
    capability: "Fairness across tenants",
    diy: "Build it yourself",
    temporal: "Limited",
    inngest: "Built-in fairness",
  },
  {
    capability: "Throttle LLM / tool calls",
    diy: "Separate rate limiter",
    temporal: "Activity options",
    inngest: "Throttle + rate limit",
  },
  {
    capability: "Scale without worker fleets",
    diy: "You run workers",
    temporal: "You run workers",
    inngest: "HTTP into your deploy",
  },
  {
    capability: "Fault-tolerant step retries",
    diy: "Manual",
    temporal: "Activity retries",
    inngest: "Per-step retries",
  },
];

export default function ConcurrencyScale() {
  return (
    <Section
      aria-labelledby="ob-concurrency-faq-1"
      className="relative"
      containerClassName="flex flex-col gap-12 lg:gap-14"
    >
      {/* 2–3 FAQ-style H2s — compact citable answers */}
      <div className="flex max-w-[720px] flex-col gap-10">
        <FaqChunk
          id="ob-concurrency-faq-1"
          question="What is concurrency for AI agent workflows?"
          answer={
            <>
              Concurrency for AI agent workflows is how many agent runs (or
              tool calls) execute in parallel per user, tenant, or model key—
              without one noisy neighbor exhausting rate limits or queue
              capacity. Inngest exposes that as keyed concurrency; the full
              control surface lives in{" "}
              <Link
                href={FLOW_CONTROL_URL}
                prefetch={false}
                className="underline decoration-current/40 underline-offset-4 hover:decoration-v1-accent-salmon"
              >
                Flow Control
              </Link>
              .
            </>
          }
        />
        <FaqChunk
          id="ob-concurrency-faq-2"
          question="How do high-scale fault-tolerant AI agent workflows stay reliable?"
          answer="They checkpoint each step, retry failed tool or LLM calls independently, and keep per-run history so a failure under load doesn’t force a full agent replay."
        />
        <FaqChunk
          id="ob-concurrency-faq-3"
          question="Inngest vs alternatives for concurrency and scale on AI agents"
          answer="DIY queues and Temporal both need you to operate workers and stitch fairness yourself. Inngest applies concurrency, throttle, and per-step retries on the deploy you already run."
        />
      </div>

      {/* Scannable comparison — Inngest vs alternatives */}
      <div className="-mx-6 overflow-x-auto sm:-mx-9 lg:mx-0 lg:overflow-visible">
        <motion.div
          {...reveals.item(2)}
          role="table"
          aria-label="Inngest versus alternatives for concurrency and scale on AI agent workflows"
          className="min-w-[880px] px-6 sm:px-9 lg:min-w-0 lg:px-0"
        >
          <div
            role="row"
            className="grid grid-cols-4 border-b border-solid border-v1-strong"
          >
            <HeaderCell tone="frost">Concurrency / scale</HeaderCell>
            <HeaderCell tone="dim">DIY queues</HeaderCell>
            <HeaderCell tone="dim">Temporal</HeaderCell>
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
              <Cell muted>{row.temporal}</Cell>
              <Cell emphasis>{row.inngest}</Cell>
            </div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

function FaqChunk({
  id,
  question,
  answer,
}: {
  id: string;
  question: string;
  answer: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <motion.h2
        {...reveals.heading}
        id={id}
        className="text-v1-heading-sm text-v1-frost"
      >
        {question}
      </motion.h2>
      <motion.p {...reveals.body} className="text-v1-body-sm">
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
        className="whitespace-nowrap font-v1Mono text-[12px] uppercase leading-[16px] lg:text-[15px]"
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
