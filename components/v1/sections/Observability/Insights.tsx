"use client";

import { motion } from "motion/react";
import ButtonLink from "@/components/v1/ButtonLink";
import GradientFrame from "@/components/v1/sections/shared/GradientFrame";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import { reveals } from "@/utils/v1/reveals";

// "Query your runs like a database."
// One charcoal gradient card spans the section (copy column on the
// left, centered SQL editor on the right). The SQL editor itself sits
// inside a nested black gradient frame so it reads as a layered
// surface against the charcoal card.

const SEE_DOCS_URL = "/docs?ref=observability-insights";

const SYNTAX_GREEN = "#0bdd48";
const KEYWORD = "#2389F1";
const FUNCTION = "#FBADA7";
const IDENT = "#9CDCFE";
const STRING_LIT = "#DCDCAA";
const STRING_INNER = "#B5CEA8";
const ALIAS = "#4FC1FF";

export default function Insights() {
  return (
    <Section aria-labelledby="ob-insights-heading" className="relative">
      <GradientFrame
        variant="charcoal"
        className="rounded-md"
        innerClassName="grid grid-cols-1 gap-x-4 gap-y-10 px-5 py-10 sm:gap-y-[60px] sm:px-10 sm:py-[60px] lg:grid-cols-[minmax(0,447fr)_minmax(0,797fr)] lg:px-8 lg:py-16"
      >
        {/* Left: eyebrow + heading via SectionHeader, then the two-paragraph
            body + CTA (SectionHeader's single-<p> body can't hold two). */}
        <div className="flex flex-col gap-v1-stack">
          <SectionHeader
            id="ob-insights-heading"
            eyebrow="Insights"
            title="Query your runs like a database."
          />
          <div className="flex flex-col gap-8">
            <motion.div
              {...reveals.body}
              className="flex max-w-[415px] flex-col gap-6"
            >
              <p className="text-v1-body-lg-loose">
                Queues weren&apos;t built to query. BullMQ makes you export it
                first&mdash;ETL pipeline, warehouse, one-off scripts&mdash;just
                to answer basic questions about your own system.
              </p>
              <p className="text-v1-body-lg-loose">
                Insights makes it much easier. Query event and run data with
                SQL from the dashboard. *Which functions failed this hour?
                What&apos;s the error pattern across the last 7 days? What did
                a specific user&apos;s run return?* No plumbing required.
              </p>
            </motion.div>
            <motion.div {...reveals.item(2)} className="flex">
              <ButtonLink
                href={SEE_DOCS_URL}
                variant="primary"
                className="!w-full sm:!w-auto"
              >
                See Insights docs
              </ButtonLink>
            </motion.div>
          </div>
        </div>

        {/* Right: black gradient panel housing the SQL editor mock. */}
        <motion.div {...reveals.body} className="h-full w-full">
          <GradientFrame
            variant="black"
            className="h-full w-full rounded-md"
            innerClassName="flex h-full items-center justify-center p-6 sm:p-10 lg:p-12"
          >
            <SqlEditor />
          </GradientFrame>
        </motion.div>
      </GradientFrame>
    </Section>
  );
}

function SqlEditor() {
  const TABS = ["Failure Analysis", "Token Usage", "Latency Trends"];
  return (
    <div className="w-full max-w-[450px] border border-v1-frost text-v1-frost">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-v1-frost/30 px-4 py-2.5">
        <span
          aria-hidden="true"
          className="inline-block size-3 bg-v1-frost"
        />
        <p className="font-mono text-[11px] uppercase tracking-[0.04em] text-v1-frost">
          Insights &mdash; SQL Editor
        </p>
      </div>

      {/* Tabs row */}
      <div className="flex items-end gap-7 px-4 pt-3">
        {TABS.map((t, i) => (
          <span
            key={t}
            className={`block pb-[5px] font-mono text-[10px] uppercase tracking-[0.04em] ${
              i === 0
                ? "border-b text-[color:var(--syn-green)]"
                : "text-v1-frost/40"
            }`}
            style={
              i === 0
                ? ({
                    "--syn-green": SYNTAX_GREEN,
                    borderColor: SYNTAX_GREEN,
                  } as React.CSSProperties)
                : undefined
            }
          >
            {t}
          </span>
        ))}
      </div>

      {/* Inner white-bordered code area */}
      <div className="mx-4 mt-3 border border-v1-frost px-4 py-3">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.02em] text-v1-frost/40">
          -- What errors are causing the most failures today?
        </p>
        <pre className="overflow-x-auto whitespace-pre font-mono text-[10px] leading-[1.6]">
          <span style={{ color: KEYWORD }}>SELECT</span>
          {"\n  "}
          <span style={{ color: FUNCTION }}>simpleJSONExtractString</span>
          <span>(</span>
          <span style={{ color: IDENT }}>data</span>
          <span>, </span>
          <span style={{ color: STRING_INNER }}>&apos;message&apos;</span>
          <span>) </span>
          <span style={{ color: ALIAS }}>as error</span>
          <span>,</span>
          {"\n  "}
          <span style={{ color: FUNCTION }}>COUNT</span>
          <span>(*) as failed_count</span>
          {"\n"}
          <span style={{ color: KEYWORD }}>FROM</span>
          <span> </span>
          <span style={{ color: IDENT }}>events</span>
          {"\n"}
          <span style={{ color: KEYWORD }}>WHERE</span>
          <span> </span>
          <span style={{ color: IDENT }}>name</span>
          <span> = </span>
          <span style={{ color: STRING_LIT }}>
            &apos;inngest/function.failed&apos;
          </span>
          {"\n  "}
          <span style={{ color: KEYWORD }}>AND</span>
          <span> </span>
          <span style={{ color: IDENT }}>ts</span>
          <span> {">"} </span>
          <span style={{ color: FUNCTION }}>now</span>
          <span>() - </span>
          <span style={{ color: KEYWORD }}>INTERVAL</span>
          <span> </span>
          <span style={{ color: STRING_LIT }}>&apos;1 day&apos;</span>
          {"\n"}
          <span style={{ color: KEYWORD }}>GROUP BY </span>
          <span style={{ color: IDENT }}>error</span>
          {"\n"}
          <span style={{ color: KEYWORD }}>ORDER BY </span>
          <span style={{ color: IDENT }}>failed_count</span>
          <span> </span>
          <span style={{ color: KEYWORD }}>DESC</span>
        </pre>
      </div>

      {/* Bottom row: plain-english input + AI-ASSISTED pill. Stacks on
          narrow screens so the input doesn't squish the pill. */}
      <div className="flex flex-col items-stretch gap-2 px-4 py-3 sm:flex-row">
        <div className="flex flex-1 items-center border border-v1-frost/40 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.04em] text-v1-frost/40 sm:py-0">
          Ask in plain english &mdash; Insights AI writes the SQL
        </div>
        <span
          className="inline-flex items-center justify-center gap-1.5 self-start border px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.04em] text-[color:var(--syn-green)] sm:self-auto"
          style={
            {
              "--syn-green": SYNTAX_GREEN,
              borderColor: SYNTAX_GREEN,
            } as React.CSSProperties
          }
        >
          <span
            aria-hidden="true"
            className="inline-block size-[6px]"
            style={{ backgroundColor: SYNTAX_GREEN }}
          />
          AI-Assisted
        </span>
      </div>
    </div>
  );
}
