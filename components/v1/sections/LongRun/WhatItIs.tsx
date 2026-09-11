"use client";

import { motion } from "motion/react";
import CodeBlock, {
  type Line,
  type TokenKind,
} from "@/components/v1/sections/shared/CodeBlock";
import Section from "@/components/v1/sections/shared/Section";
import { V1_SECTION_TITLE } from "@/components/v1/sections/shared/sectionTitle";
import { cn } from "@/utils/v1/cn";
import { reveals } from "@/utils/v1/reveals";
import { FACTS } from "@/components/v1/sections/LongRun/data";

/**
 * The whole explanation, in one screen.
 *
 * This page catches street traffic — someone who scanned a QR code and is
 * standing on a sidewalk — and the audience is technical. So the fastest
 * honest explanation of Inngest is the code itself: an agent run that takes
 * hours, with the steps that checkpoint it visible in the snippet. The
 * headline carries the product truth; three one-line facts sit beside it;
 * everything else the campaign deck argued is left out.
 */

// Matches the ScheduledJobs / WebhooksEvents snippets so code panels look
// the same everywhere: keywords salmon, calls blue, identifiers green,
// comments and punctuation muted grey.
const MUTED = "#7c7c7c";
const TOKEN_COLORS: Partial<Record<TokenKind, string>> = {
  kw: "#fb5536",
  fn: "#5f7df0",
  id: "#0bdd48",
  str: "#77f19a",
  cmt: MUTED,
  punc: MUTED,
};

// A real long-running agent function: a plan step, a crawl step, a wait
// that outlives any request, and a write step. The comments do the
// explaining so the surrounding prose doesn't have to.
const SNIPPET: Line[] = [
  [
    ["export", "kw"],
    [" const ", "kw"],
    ["research", "id"],
    [" = ", "punc"],
    ["inngest", "id"],
    [".", "punc"],
    ["createFunction", "fn"],
    ["(", "punc"],
  ],
  [
    ["  { ", "punc"],
    ["id", "id"],
    [": ", "punc"],
    ['"deep-research"', "str"],
    [", ", "punc"],
    ["retries", "id"],
    [": ", "punc"],
    ["4", "num"],
    [" },", "punc"],
  ],
  [
    ["  { ", "punc"],
    ["event", "id"],
    [": ", "punc"],
    ['"research/requested"', "str"],
    [" },", "punc"],
  ],
  [
    ["  ", "punc"],
    ["async", "kw"],
    [" ({ ", "punc"],
    ["event", "id"],
    [", ", "punc"],
    ["step", "id"],
    [" }) => {", "punc"],
  ],
  [["    // Each step checkpoints when it finishes.", "cmt"]],
  [
    ["    const ", "kw"],
    ["plan", "id"],
    [" = ", "punc"],
    ["await", "kw"],
    [" step.", "punc"],
    ["run", "fn"],
    ["(", "punc"],
    ['"plan"', "str"],
    [", ", "punc"],
    ["() => ", "punc"],
    ["llm", "id"],
    [".", "punc"],
    ["plan", "fn"],
    ["(", "punc"],
    ["event", "id"],
    [".", "punc"],
    ["data", "id"],
    ["));", "punc"],
  ],
  [["", "punc"]],
  [["    // Waits a week without holding a connection open.", "cmt"]],
  [
    ["    await", "kw"],
    [" step.", "punc"],
    ["waitForEvent", "fn"],
    ["(", "punc"],
    ['"approval"', "str"],
    [", {", "punc"],
  ],
  [
    ["      event", "id"],
    [": ", "punc"],
    ['"research/approved"', "str"],
    [", ", "punc"],
    ["timeout", "id"],
    [": ", "punc"],
    ['"7d"', "str"],
    [",", "punc"],
  ],
  [["    });", "punc"]],
  [["", "punc"]],
  [["    // Only this step retries if the model errors.", "cmt"]],
  [
    ["    return ", "kw"],
    ["step.", "punc"],
    ["run", "fn"],
    ["(", "punc"],
    ['"write"', "str"],
    [", ", "punc"],
    ["() => ", "punc"],
    ["llm", "id"],
    [".", "punc"],
    ["write", "fn"],
    ["(", "punc"],
    ["plan", "id"],
    ["));", "punc"],
  ],
  [["  }", "punc"]],
  [[");", "punc"]],
];

export default function WhatItIs() {
  return (
    <Section
      aria-labelledby="long-run-what-heading"
      containerClassName="grid grid-cols-1 items-start gap-v1-stack lg:grid-cols-2 lg:gap-16"
    >
      <div className="flex flex-col gap-v1-stack">
        <motion.h2
          {...reveals.heading}
          id="long-run-what-heading"
          className={cn(V1_SECTION_TITLE, "[line-height:1.12]")}
        >
          Retry the step.
          <br />
          <span className="text-v1-accent-salmon-light">Not the chain.</span>
        </motion.h2>

        <ul className="flex list-none flex-col gap-4 pl-0">
          {FACTS.map((f, i) => (
            <motion.li
              key={f}
              {...reveals.item(i)}
              className="flex list-none items-start gap-4 text-v1-body-lg-loose"
            >
              <span
                aria-hidden="true"
                className="mt-[0.6em] block h-[7px] w-[7px] shrink-0 rounded-full bg-v1-accent-salmon"
              />
              {f}
            </motion.li>
          ))}
        </ul>
      </div>

      <motion.div {...reveals.item(1)} className="w-full min-w-0">
        <CodeBlock
          label="inngest/functions/research.ts"
          lines={SNIPPET}
          gutter={false}
          animate={false}
          fontSize="14px"
          maxHeight="560px"
          maxWidth="100%"
          lgUncapHeight={false}
          tokenColors={TOKEN_COLORS}
        />
      </motion.div>
    </Section>
  );
}
