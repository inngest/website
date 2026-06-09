"use client";

import { motion } from "motion/react";
import ButtonLink from "@/components/v1/ButtonLink";
import CodeBlock, {
  type Line,
  type TokenKind,
} from "@/components/v1/sections/shared/CodeBlock";
import GradientFrame from "@/components/v1/sections/shared/GradientFrame";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import { reveals } from "@/utils/v1/reveals";

// "IN PRACTICE / Replace your setup with one line of code"
// Two-column showcase card — heading + body + CTA on the left,
// syntax-highlighted weekly-digest snippet on the right. Mirrors
// WebhooksEvents/InPractice so both pages share one outer shell
// (GradientFrame + CodeBlock + identical typography conventions).

const SEE_DOCS_URL = "/docs?ref=scheduled-jobs";

// Same syntax palette as the WebhooksEvents snippet —
// comments and punctuation share the muted grey, keywords salmon,
// function calls blue, identifiers green, strings light-green.
const MUTED = "#7c7c7c";
const FIGMA_TOKEN_COLORS: Partial<Record<TokenKind, string>> = {
  kw: "#fb5536",
  fn: "#5f7df0",
  id: "#0bdd48",
  str: "#77f19a",
  cmt: MUTED,
  punc: MUTED,
};

const WEEKLY_DIGEST_SNIPPET: Line[] = [
  [["// Runs every Friday at 12pm Paris time — with full observability and retries", "cmt"]],
  [
    ["export", "kw"],
    [" const ", "kw"],
    ["weeklyDigest", "id"],
    [" ", "punc"],
    ["= ", "punc"],
    ["inngest", "id"],
    [".", "punc"],
    ["createFunction", "fn"],
    ["(", "punc"],
  ],
  [
    ["  { ", "punc"],
    ["id", "fn"],
    [": ", "punc"],
    ['"weekly-digest"', "str"],
    [" },", "punc"],
  ],
  [
    ["  { ", "punc"],
    ["cron", "fn"],
    [": ", "punc"],
    ['"TZ=Europe/Paris 0 12 * * 5"', "str"],
    [" },", "punc"],
  ],
  [
    ["  async ", "kw"],
    ["({ ", "punc"],
    ["step", "id"],
    [" }) => {", "punc"],
  ],
  [],
  [["    // Load all users — this step retries independently if it fails", "cmt"]],
  [
    ["    const ", "kw"],
    ["users", "id"],
    [" ", "punc"],
    ["= ", "punc"],
    ["await ", "kw"],
    ["step", "id"],
    [".", "punc"],
    ["run", "fn"],
    ["(", "punc"],
    ['"load-users"', "str"],
    [", ", "punc"],
    ["async ", "kw"],
    ["() => ", "punc"],
  ],
  [
    ["      ", "punc"],
    ["db", "id"],
    [".", "punc"],
    ["query", "fn"],
    ["(", "punc"],
    ['"SELECT * FROM users"', "str"],
    [")", "punc"],
  ],
  [["    );", "punc"]],
  [],
  [["    // Fan-out: send one event per user, triggering parallel email jobs", "cmt"]],
  [
    ["    await ", "kw"],
    ["step", "id"],
    [".", "punc"],
    ["sendEvent", "fn"],
    ["(", "punc"],
  ],
  [
    ["      ", "punc"],
    ['"fan-out-digests"', "str"],
    [",", "punc"],
  ],
  [
    ["      ", "punc"],
    ["users", "id"],
    [".", "punc"],
    ["map", "fn"],
    ["(", "punc"],
    ["u", "id"],
    [" => ({", "punc"],
  ],
  [
    ["        ", "punc"],
    ["name", "fn"],
    [": ", "punc"],
    ['"app/send.weekly.digest"', "str"],
    [",", "punc"],
  ],
  [
    ["        ", "punc"],
    ["data", "fn"],
    [": { ", "punc"],
    ["user_id", "fn"],
    [": ", "punc"],
    ["u", "id"],
    [".", "punc"],
    ["id", "id"],
    [", ", "punc"],
    ["email", "fn"],
    [": ", "punc"],
    ["u", "id"],
    [".", "punc"],
    ["email", "id"],
    [" }", "punc"],
  ],
  [["      }))", "punc"]],
  [["    );", "punc"]],
  [],
  [["    // Done — each email job runs in parallel with its own retries", "cmt"]],
  [["  }", "punc"]],
  [[");", "punc"]],
  [],
  [["// Dynamic scheduling: run at a user-defined time", "cmt"]],
  [
    ["export", "kw"],
    [" const ", "kw"],
    ["sendReminder", "id"],
    [" ", "punc"],
    ["= ", "punc"],
    ["inngest", "id"],
    [".", "punc"],
    ["createFunction", "fn"],
    ["(", "punc"],
  ],
  [
    ["  { ", "punc"],
    ["id", "fn"],
    [": ", "punc"],
    ['"send-reminder"', "str"],
    [" },", "punc"],
  ],
  [
    ["  { ", "punc"],
    ["event", "fn"],
    [": ", "punc"],
    ['"reminder/scheduled"', "str"],
    [" },", "punc"],
  ],
  [
    ["  async ", "kw"],
    ["({ ", "punc"],
    ["event", "id"],
    [", ", "punc"],
    ["step", "id"],
    [" }) => {", "punc"],
  ],
  [["    // Sleep until the user-specified timestamp, then run", "cmt"]],
  [
    ["    await ", "kw"],
    ["step", "id"],
    [".", "punc"],
    ["sleepUntil", "fn"],
    ["(", "punc"],
    ['"wait-for-time"', "str"],
    [", ", "punc"],
    ["event", "id"],
    [".", "punc"],
    ["data", "id"],
    [".", "punc"],
    ["remindAt", "id"],
    [");", "punc"],
  ],
  [
    ["    await ", "kw"],
    ["step", "id"],
    [".", "punc"],
    ["run", "fn"],
    ["(", "punc"],
    ['"send-notification"', "str"],
    [", ", "punc"],
    ["() => ", "punc"],
  ],
  [
    ["      ", "punc"],
    ["notify", "fn"],
    ["(", "punc"],
    ["event", "id"],
    [".", "punc"],
    ["data", "id"],
    [".", "punc"],
    ["userId", "id"],
    [")", "punc"],
  ],
  [["    );", "punc"]],
  [["  }", "punc"]],
  [[");", "punc"]],
];

export default function InPractice() {
  return (
    <Section
      aria-labelledby="cron-in-practice-heading"
      className="relative"
      // Intentional wider gutter for this showcase card: 70px at
      // lg instead of the standard 32px (px-8). Off-scale but deliberate,
      // shared with WebhooksEvents/InPractice.
      containerClassName="lg:!px-[70px]"
    >
      <GradientFrame
        variant="charcoal"
        className="rounded-md"
        innerClassName="grid grid-cols-1 gap-x-4 gap-y-10 px-6 py-12 sm:gap-y-12 sm:px-8 sm:py-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-stretch lg:gap-x-4 lg:px-8 lg:py-16"
      >
        <SectionHeader
          id="cron-in-practice-heading"
          className="lg:pr-8"
          eyebrow="In Practice"
          title="Replace your setup with one line of code"
          body="A single trigger in your existing codebase can replace your entire cron setup. Inngest handles scheduling, retries, timezone support, and observability."
          bodyClassName="lg:max-w-[499px]"
          actions={
            <ButtonLink href={SEE_DOCS_URL} variant="primary">
              See the docs
            </ButtonLink>
          }
        />

        <motion.div {...reveals.body} className="min-w-0">
          <CodeBlock
            label="inngest/functions/weekly-digest.ts"
            lines={WEEKLY_DIGEST_SNIPPET}
            gutter={false}
            animate={false}
            fontSize="16px"
            maxHeight="530px"
            maxWidth="100%"
            lgUncapHeight={false}
            tokenColors={FIGMA_TOKEN_COLORS}
          />
        </motion.div>
      </GradientFrame>
    </Section>
  );
}
