"use client";

import { motion } from "motion/react";
import Section from "@/components/v1/sections/shared/Section";
import { V1_SECTION_TITLE } from "@/components/v1/sections/shared/sectionTitle";
import { reveals } from "@/utils/v1/reveals";
import { cn } from "@/utils/v1/cn";
import { SF_DIFFERENCE } from "@/components/v1/sections/LongRun/data";

/**
 * Section 02 — the product difference.
 *
 * A plain two-column comparison: what you build yourself, and what Inngest
 * does instead. Explanatory only — no hover states, no toggling, nothing
 * to operate. The columns are equal height and the rows line up so the
 * contrast reads at a glance rather than through prose.
 *
 * On mobile they stack in reading order (before, then with) because the
 * argument depends on that sequence.
 */

// Matches the check/cross pair already used by DurableExecution's and
// BackgroundJobs' comparison tables (same paths, same stroke weight, same
// tokens) so comparisons look identical across the site. Kept local for
// the same reason those two are: there is no shared export for them.
function Mark({ kind }: { kind: "cross" | "check" }) {
  return kind === "check" ? (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="mt-[0.2em] shrink-0"
    >
      <path
        d="M5 12.5 L 10 17 L 19 7"
        stroke="rgb(var(--color-v1-green-200))"
        strokeWidth="1.75"
        fill="none"
        strokeLinecap="square"
      />
    </svg>
  ) : (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="mt-[0.2em] shrink-0"
    >
      <path
        d="M7 7 17 17 M17 7 7 17"
        stroke="rgb(var(--color-v1-carbon-300))"
        strokeWidth="1.75"
        fill="none"
        strokeLinecap="square"
      />
    </svg>
  );
}

function Column({
  label,
  headline,
  items,
  kind,
}: {
  label: string;
  headline: string;
  items: readonly string[];
  kind: "cross" | "check";
}) {
  const isInngest = kind === "check";
  return (
    <div
      className={cn(
        "flex h-full flex-col gap-6 rounded-lg border p-6 lg:p-8",
        // The Inngest column is the one to land on, so it carries the
        // brand accent; the other stays neutral rather than being
        // painted as an error state.
        isInngest
          ? "border-v1-accent-salmon/40 bg-v1-canvasSubtle"
          : "border-v1-subtle"
      )}
    >
      <p
        className={cn(
          "text-v1-label-md uppercase",
          isInngest ? "text-v1-accent-salmon-light" : "text-v1-frost/55"
        )}
      >
        {label}
      </p>
      <h3 className="text-v1-heading-xs text-v1-frost">{headline}</h3>
      <ul className="flex flex-1 list-none flex-col gap-4 pl-0">
        {items.map((item) => (
          <li
            key={item}
            className={cn(
              "text-v1-body-sm-loose flex list-none items-start gap-3",
              isInngest ? "text-v1-frost/85" : "text-v1-frost/65"
            )}
          >
            <Mark kind={kind} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SfDifference() {
  return (
    <Section
      aria-labelledby="long-run-difference-heading"
      containerClassName="flex flex-col gap-v1-stack"
    >
      <div className="flex flex-col gap-6">
        <motion.h2
          {...reveals.heading}
          id="long-run-difference-heading"
          className={V1_SECTION_TITLE}
        >
          {SF_DIFFERENCE.title.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </motion.h2>
        <motion.p
          {...reveals.body}
          className="text-v1-heading-xs uppercase text-v1-accent-salmon-light"
        >
          {SF_DIFFERENCE.supporting}
        </motion.p>
        <motion.p
          {...reveals.body}
          className="text-v1-body-lg-loose max-w-[640px]"
        >
          {SF_DIFFERENCE.body}
        </motion.p>
      </div>

      {/* `items-stretch` (grid default) keeps both columns the same height
          at lg; below that they stack in reading order. */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div {...reveals.item(0)} className="h-full">
          <Column
            label={SF_DIFFERENCE.before.label}
            headline={SF_DIFFERENCE.before.headline}
            items={SF_DIFFERENCE.before.items}
            kind="cross"
          />
        </motion.div>
        <motion.div {...reveals.item(1)} className="h-full">
          <Column
            label={SF_DIFFERENCE.after.label}
            headline={SF_DIFFERENCE.after.headline}
            items={SF_DIFFERENCE.after.items}
            kind="check"
          />
        </motion.div>
      </div>
    </Section>
  );
}
