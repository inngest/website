"use client";

import { motion } from "motion/react";
import Link from "@/components/v1/Link";
import { appendRef } from "@/utils/v1/ref";
import {
  Accordion,
  AccordionDot,
  AccordionItem,
} from "@/components/v1/sections/shared/Accordion";
import { reveals } from "@/utils/v1/reveals";
import { cn } from "@/utils/v1/cn";
import Section from "@/components/v1/sections/shared/Section";
import { V1_SECTION_TITLE } from "@/components/v1/sections/shared/sectionTitle";

/**
 * AI page "FAQ" section — display headline on the left (1/3) paired
 * with a single-open accordion on the right (2/3). Each row's
 * disclosure dot turns salmon when expanded, grey when collapsed —
 * same dot vocabulary as Home's TrustedInBigLeagues and AI's
 * UseCases. Only one row is open at a time; clicking the active row
 * collapses it.
 */

export interface Faq {
  id: string;
  question: string;
  /**
   * Optional designer-locked breaks. Rendered as `lg:block
   * lg:whitespace-nowrap` spans at lg+ so the breaks land exactly
   * here; below lg the spans collapse to inline flow and wrap
   * naturally. `question` stays the single-string fallback +
   * SR text source of truth.
   */
  questionLines?: string[];
  answer: string;
  link?: { label: string; href: string };
}

const FAQS: Faq[] = [
  {
    id: "orchestrate",
    question: "How do I orchestrate AI workflows without managing infrastructure?",
    questionLines: [
      "How do I orchestrate AI workflows without managing",
      "infrastructure?",
    ],
    answer:
      "Inngest orchestrates AI workflows by invoking your functions via HTTP between steps. You write workflows as normal async functions and wrap logic in step.run(). Inngest handles retry logic, state, and scheduling between steps — no extra queues, workers, or stateful backends required.",
    link: { label: "Quick-start guide", href: "/docs/getting-started/nextjs-quick-start" },
  },
  {
    id: "rate-limits",
    question: "How does Inngest handle LLM rate limits in production?",
    answer:
      "Inngest handles LLM rate limits through built-in throttling and concurrency controls. You can cap simultaneous LLM calls, set per-user or per-tenant rate limits, and queue excess requests rather than dropping them. This prevents hitting provider rate limits at scale without custom infrastructure.",
  },
  {
    id: "fail-mid-execution",
    question: "What happens when an agentic workflow fails mid-execution?",
    answer:
      "When an agentic workflow fails mid-execution, only the failed step retries — not the entire workflow. Inngest tracks completed steps and resumes from the point of failure. No work is duplicated and no state is lost.",
  },
  {
    id: "serverless",
    question: "How does Inngest work with serverless platforms like Vercel or AWS Lambda?",
    questionLines: [
      "How does Inngest work with serverless platforms like Vercel or",
      "AWS Lambda?",
    ],
    answer:
      "Inngest works with serverless platforms by invoking functions via HTTP, so they run on any platform that serves HTTP requests. step.ai.infer offloads LLM inference to Inngest's infrastructure, pausing your function during the request so you don't pay for idle serverless execution time.",
  },
  {
    id: "debug-locally",
    question: "Can I debug AI workflows locally before deploying?",
    answer:
      "Yes, Inngest's Dev Server runs locally and provides full step-by-step execution traces, the ability to replay runs, and re-trigger functions — all before deploying to production.",
  },
  {
    id: "durable",
    question: "Is Inngest suitable for durable agentic workflows that run for hours or days?",
    questionLines: [
      "Is Inngest suitable for durable agentic workflows that run for",
      "hours or days?",
    ],
    answer:
      "Yes. Inngest supports workflows that run for hours or days. Functions can pause indefinitely — waiting for human input, external events, or slow inference — and resume exactly where they left off with no timeout constraints on workflow duration.",
  },
];

/**
 * Reusable across landing pages. Defaults to the AI-page FAQ set
 * (`FAQS`) so existing call sites work unchanged; pass `faqs` to
 * override for other pages (e.g. /scheduled-jobs).
 */
export default function Faq({
  faqs = FAQS,
  heading = "FAQ",
  refTag = "ai",
}: {
  faqs?: Faq[];
  heading?: string;
  refTag?: string;
} = {}) {
  return (
    <Section
      aria-label="Frequently asked questions"
      className="relative"
      containerClassName="grid grid-cols-1 gap-x-4 gap-y-12 lg:grid-cols-3 lg:items-start"
    >
      <motion.h2
        {...reveals.heading}
        className={cn(V1_SECTION_TITLE, "lg:sticky lg:top-[22vh] lg:self-start")}
      >
        {heading}
      </motion.h2>

      <Accordion defaultOpenId={faqs[0]?.id ?? null}>
        <ul className="flex flex-col lg:col-span-2">
          {faqs.map((faq, i) => (
            <motion.li key={faq.id} {...reveals.item(i)}>
              <FaqRow faq={faq} refTag={refTag} />
            </motion.li>
          ))}
        </ul>
      </Accordion>
    </Section>
  );
}

function FaqRow({ faq, refTag }: { faq: Faq; refTag: string }) {
  return (
    <AccordionItem
      id={faq.id}
      // Horizontal chrome only — the spotlight sheen, group, transition,
      // baseline hover fill, and vertical rhythm come from the styled
      // AccordionItem.
      className="px-4"
      triggerClassName="gap-[10px]"
      bodyClassName="mt-4 flex flex-col gap-6 pl-[34px] pr-[45px] pb-1.5"
      trigger={(open) => (
        <>
          {/* Box reserves a 24px gutter and inherits the title's
              font-size + 1.45 line-height, so the dot centers on the
              first line for both single- and multi-line questions. */}
          <AccordionDot
            open={open}
            className="w-[24px] text-[18px] leading-[1.45] [height:1.45em] lg:[font-size:clamp(1rem,1.4vw,1.375rem)]"
          />
          <span className="flex-1 text-balance font-v1Heading text-[18px] leading-[1.45] tracking-[-0.01em] lg:[font-size:clamp(1rem,1.4vw,1.375rem)]">
            {faq.questionLines ? (
              faq.questionLines.map((line, i) => (
                <span key={i} className="lg:block lg:whitespace-nowrap">
                  {line}
                  {i < (faq.questionLines?.length ?? 0) - 1 ? " " : ""}
                </span>
              ))
            ) : (
              faq.question
            )}
          </span>
        </>
      )}
    >
      <p className="text-pretty text-v1-body-sm">{faq.answer}</p>
      {faq.link && (
        <Link
          href={appendRef(faq.link.href, refTag)}
          underline={false}
          // Same exact "Get Started →" treatment as Home/
          // StartBuilding's QuickstartCard. Color shift uses
          // `hover:` directly on the anchor (an element can't
          // be its own group-hover descendant — that was the
          // earlier bug); arrow translate keeps `group-hover/cta`
          // since the arrow IS a descendant of the group.
          // Closed-row links drop out of tab order via the panel's
          // `inert`, so no per-link tabIndex needed.
          className="text-v1-label-md group/cta inline-flex w-fit items-center uppercase motion-safe:transition-colors motion-safe:duration-300 hover:text-v1-accent-salmon"
        >
          <span>{faq.link.label}</span>
          <span
            aria-hidden="true"
            className="ml-2 inline-block motion-safe:transition-transform motion-safe:duration-[400ms] motion-safe:ease-v1-in group-hover/cta:translate-x-[6px]"
          >
            →
          </span>
        </Link>
      )}
    </AccordionItem>
  );
}
