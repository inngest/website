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

// "IN PRACTICE / Write the handler. Inngest does the rest."
// Two-column showcase card — heading + body + CTA on the left,
// syntax-highlighted payment-failed snippet on the right.

const SEE_DOCS_URL = "/docs?ref=webhooks-events";

// Custom syntax palette — overrides CodeBlock's VSCode-dark default.
// Comments and punctuation deliberately share the same muted grey.
const MUTED = "#7c7c7c";
const FIGMA_TOKEN_COLORS: Partial<Record<TokenKind, string>> = {
  kw: "#fb5536",
  fn: "#5f7df0",
  id: "#0bdd48",
  str: "#77f19a",
  cmt: MUTED,
  punc: MUTED,
};

const PAYMENT_FAILED_SNIPPET: Line[] = [
  [["// Triggered by a Stripe webhook OR inngest.send() — same code either way", "cmt"]],
  [
    ["export", "kw"],
    [" const ", "kw"],
    ["onPaymentFailed", "id"],
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
    ['"on-payment-failed"', "str"],
    [" },", "punc"],
  ],
  [
    ["  { ", "punc"],
    ["event", "fn"],
    [": ", "punc"],
    ['"stripe/invoice.payment_failed"', "str"],
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
  [],
  [
    ["    const ", "kw"],
    ["user", "id"],
    [" ", "punc"],
    ["= ", "punc"],
    ["await ", "kw"],
    ["step", "id"],
    [".", "punc"],
    ["run", "fn"],
    ["(", "punc"],
    ['"load-user"', "str"],
    [", ", "punc"],
    ["async ", "kw"],
    ["() => ", "punc"],
  ],
  [
    ["      ", "punc"],
    ["getUserByStripeId", "fn"],
    ["(", "punc"],
    ["event", "id"],
    [".", "punc"],
    ["data", "id"],
    [".", "punc"],
    ["customer", "id"],
    [")", "punc"],
  ],
  [["    );", "punc"]],
  [],
  [
    ["    await ", "kw"],
    ["step", "id"],
    [".", "punc"],
    ["run", "fn"],
    ["(", "punc"],
    ['"downgrade-plan"', "str"],
    [", ", "punc"],
    ["async ", "kw"],
    ["() => ", "punc"],
  ],
  [
    ["      ", "punc"],
    ["billing", "id"],
    [".", "punc"],
    ["downgrade", "fn"],
    ["(", "punc"],
    ["user", "id"],
    [".", "punc"],
    ["id", "id"],
    [")", "punc"],
  ],
  [["    );", "punc"]],
  [],
  [
    ["    await ", "kw"],
    ["step", "id"],
    [".", "punc"],
    ["run", "fn"],
    ["(", "punc"],
    ['"send-email"', "str"],
    [", ", "punc"],
    ["async ", "kw"],
    ["() => ", "punc"],
  ],
  [
    ["      ", "punc"],
    ["sendPaymentFailedEmail", "fn"],
    ["(", "punc"],
    ["user", "id"],
    [".", "punc"],
    ["email", "id"],
    [")", "punc"],
  ],
  [["    );", "punc"]],
  [],
  [["    // If send-email fails — only that step retries. User is not double-downgraded.", "cmt"]],
  [["  }", "punc"]],
  [[");", "punc"]],
  [],
  [["// A second function on the same event. Fan-out, zero config.", "cmt"]],
  [
    ["export", "kw"],
    [" const ", "kw"],
    ["alertSlack", "id"],
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
    ['"alert-slack-payment-failed"', "str"],
    [" },", "punc"],
  ],
  [
    ["  { ", "punc"],
    ["event", "fn"],
    [": ", "punc"],
    ['"stripe/invoice.payment_failed"', "str"],
    [" },", "punc"],
  ],
  [
    ["  async ", "kw"],
    ["({ ", "punc"],
    ["event", "id"],
    [" }) => ", "punc"],
  ],
  [
    ["    ", "punc"],
    ["slack", "id"],
    [".", "punc"],
    ["notify", "fn"],
    ["(", "punc"],
    ["`Payment failed: ${event.data.customer}`", "str"],
    [")", "punc"],
  ],
  [[");", "punc"]],
];

export default function InPractice() {
  return (
    <Section
      aria-labelledby="we-in-practice-heading"
      className="relative"
      // Intentional wider gutter for this showcase card: 70px at
      // lg instead of the standard 32px (px-8). Off-scale but deliberate.
      containerClassName="lg:!px-[70px]"
    >
      <GradientFrame
        variant="charcoal"
        className="rounded-md"
        innerClassName="grid grid-cols-1 gap-x-4 gap-y-10 px-6 py-12 sm:gap-y-12 sm:px-8 sm:py-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-stretch lg:gap-x-4 lg:px-8 lg:py-16"
      >
        <SectionHeader
          id="we-in-practice-heading"
          className="lg:pr-8"
          eyebrow="In Practice"
          title="Write the handler. Inngest does the rest."
          body="No queue setup. No worker process. No retry logic to write. Just a function that reacts to an event."
          actions={
            <ButtonLink href={SEE_DOCS_URL} variant="primary">
              See the docs
            </ButtonLink>
          }
        />

        <motion.div {...reveals.body} className="min-w-0">
          <CodeBlock
            label="inngest/functions/payment-failed.ts"
            lines={PAYMENT_FAILED_SNIPPET}
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
