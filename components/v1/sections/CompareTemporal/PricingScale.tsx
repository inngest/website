"use client";

import { motion } from "motion/react";
import { reveals } from "@/utils/v1/reveals";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";

/**
 * "Cheap to start, then what?"
 *
 * One agent run, as written: 8 steps. Six are long enough to record one
 * heartbeat, one of those six is retried once, one sleeps, one waits.
 *
 * Inngest executions = runs × (steps + 1) = 9 per run.
 *   Pro is $99 with 1M included, then $50 / million.
 *   Business is $499 with 10M included, then $25 / million.
 *   The figure is whichever plan is cheaper.
 *
 * Temporal Actions per run = 16:
 *   1 workflow start + 6 activities + 1 retry + 6 heartbeats + 1 timer + 1 signal.
 *   Developer is $50 / million Actions at every volume, plus 10% support.
 *   Business includes 2.5M Actions, then the published overage tiers
 *   ($50, $45, $40, $35, $30, $25 per million) and a plan fee of the
 *   greater of $500 and 10% of usage.
 *   The figure is whichever plan is cheaper. Storage and workers are excluded.
 *
 * 100k runs → 0.9M executions ($99 Pro) and 1.6M Actions ($88 Developer).
 * 1M runs → 9M executions ($499 Pro or Business) and 16M Actions ($880 Developer).
 * 10M runs → 90M executions ($2,499 Business) and 160M Actions
 * ($4,862.50 overage + $500 plan fee = $5,362.50, shown as $5,360).
 */

const INNGEST_UNITS = 9;
const TEMPORAL_UNITS = 16;

const VOLUMES: {
  runs: string;
  label: string;
  temporal: string;
  inngest: string;
  note: string;
  painful?: boolean;
}[] = [
  {
    runs: "100,000 runs a month",
    label: "Where teams start",
    temporal: "$88",
    inngest: "$99",
    note: "Developer plan, no base fee. Temporal is the smaller invoice.",
  },
  {
    runs: "1 million runs a month",
    label: "Growth",
    temporal: "$880",
    inngest: "$499",
    note: "The bills cross. Temporal is still on Developer, and the invoice is already higher.",
    painful: true,
  },
  {
    runs: "10 million runs a month",
    label: "At scale",
    temporal: "$5,360",
    inngest: "$2,499",
    note: "Same run, a hundred times the volume. Workers and Active Storage for every open run are still not in Temporal’s number.",
    painful: true,
  },
];

function Meter({
  units,
  max,
  tone,
}: {
  units: number;
  max: number;
  tone: "frost" | "salmon";
}) {
  return (
    <span className="mt-3 block h-[6px] w-full bg-v1-frost/10">
      <span
        className={
          tone === "salmon"
            ? "block h-full bg-v1-accent-salmon"
            : "block h-full bg-v1-frost"
        }
        style={{ width: `${(units / max) * 100}%` }}
      />
    </span>
  );
}

export default function PricingScale() {
  return (
    <Section
      aria-labelledby="ct-pricing-heading"
      className="relative"
      containerClassName="flex flex-col"
    >
      <SectionHeader
        id="ct-pricing-heading"
        title="Cheap to start, then what?"
        titleClassName="lg:max-w-[1100px]"
        body="Temporal’s Actions conceal more than Inngest counts for the same work. Every workflow start, every activity attempt, every timer, signal, and heartbeat—all actions, all billed."
        bodyClassName="max-w-[640px]"
      />

      <div className="mt-6 flex flex-col gap-8 lg:mt-8">
        <motion.div
          {...reveals.item(0)}
          className="grid grid-cols-1 gap-8 border-2 border-v1-frost p-6 sm:grid-cols-2 sm:p-8"
        >
          <div>
            <p className="font-v1Label text-[13px] uppercase tracking-[0.04em] text-v1-frost/60">
              One run, Inngest
            </p>
            <p className="mt-3 font-v1Heading text-[40px] leading-none tracking-[-0.03em] text-v1-frost">
              {INNGEST_UNITS}
            </p>
            <Meter units={INNGEST_UNITS} max={TEMPORAL_UNITS} tone="frost" />
            <p className="text-v1-body-sm mt-4 text-v1-frost/70">
              Executions. The run, plus the eight steps you wrote.
            </p>
          </div>
          <div>
            <p className="font-v1Label text-[13px] uppercase tracking-[0.04em] text-v1-frost/60">
              The same run, Temporal
            </p>
            <p className="mt-3 font-v1Heading text-[40px] leading-none tracking-[-0.03em] text-v1-accent-salmon">
              {TEMPORAL_UNITS}
            </p>
            <Meter units={TEMPORAL_UNITS} max={TEMPORAL_UNITS} tone="salmon" />
            <p className="text-v1-body-sm mt-4 text-v1-frost/70">
              Actions. A workflow start, six long steps each as an activity and
              a heartbeat, one retry, a timer, and a signal.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {VOLUMES.map((volume, i) => (
            <motion.div
              key={volume.runs}
              {...reveals.item(i + 1)}
              className="flex flex-col gap-6 border-2 border-v1-frost p-6 sm:p-8"
            >
              <div className="flex flex-col gap-2">
                <p className="font-v1Label text-[13px] uppercase tracking-[0.04em] text-v1-accent-salmon">
                  {volume.label}
                </p>
                <h3 className="font-v1Heading text-[28px] leading-[1.15] tracking-[-0.02em] text-v1-frost">
                  {volume.runs}
                </h3>
              </div>
              <dl className="flex flex-col gap-4">
                <div className="flex items-baseline justify-between gap-4 border-b border-v1-frost/20 pb-4">
                  <dt className="text-v1-body-md text-v1-frost/60">Temporal</dt>
                  <dd
                    className={
                      volume.painful
                        ? "font-v1Heading text-[40px] leading-none tracking-[-0.03em] text-v1-accent-salmon"
                        : "font-v1Heading text-[40px] leading-none tracking-[-0.03em] text-v1-frost"
                    }
                  >
                    {volume.temporal}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-v1-body-md text-v1-frost">Inngest</dt>
                  <dd className="font-v1Heading text-[40px] leading-none tracking-[-0.03em] text-v1-frost">
                    {volume.inngest}
                  </dd>
                </div>
              </dl>
              <p className="text-v1-body-sm text-v1-frost/70">{volume.note}</p>
            </motion.div>
          ))}
        </div>

        <p className="max-w-[820px] font-v1Body text-[12px] leading-4 text-v1-frost/60">
          Cheaper published plan, platform invoice only. One 8-step run — six
          heartbeats, one retry, a sleep, and a wait — is 9 Inngest executions
          and 16 Temporal Actions. Temporal Developer is $50/M plus 10% support;
          Business includes 2.5M, then volume rates, and the greater of $500 and
          10% of usage. Inngest Pro is $99 with 1M then $50/M, Business is $499
          with 10M then $25/M, and storage and workers are excluded.
        </p>
      </div>
    </Section>
  );
}
