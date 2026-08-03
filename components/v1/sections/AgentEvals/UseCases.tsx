"use client";

import CaseStudiesCarousel, {
  type CaseStudyItem,
} from "@/components/v1/sections/shared/CaseStudiesCarousel";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";

/**
 * "Start scoring with Inngest" — five eval use cases in the shared
 * CaseStudiesCarousel (same shell as /uses/scheduled-jobs). No customer
 * logos and no per-card CTA, so the cards are text-only.
 */
const HEADING_ID = "agent-evals-usecases-heading";

const STUDIES: CaseStudyItem[] = [
  {
    id: "outcome-scoring",
    title: "Outcome-based scoring, even days later",
    body: (
      <>
        Wait to score based on a conversion event after the agent runs. No
        external pipeline, no trace ID threading.
      </>
    ),
    cta: {
      label: "Read the pattern",
      href: "/docs/patterns/ai-evals/score-agents-on-real-outcomes?ref=agent-evals-usecases",
    },
  },
  {
    id: "ab-test",
    title: "A/B test prompts and models in production",
    body: (
      <>
        Route live traffic between two variants and compare quality scores,
        cost, and latency across real users.
      </>
    ),
    cta: {
      label: "Read the pattern",
      href: "/docs/patterns/ai-evals/run-experiments-in-production?ref=agent-evals-usecases",
    },
  },
  {
    id: "llm-judge",
    title: "LLM-as-a-judge",
    body: <>Add this pattern to any experiment.</>,
    cta: {
      label: "Read the docs",
      href: "/docs/examples/ai-eval-scorer-quickstart?ref=agent-evals-usecases",
    },
  },
  {
    id: "cost",
    title: "Cost management",
    body: <>Learn how to instrument and measure costs across agents.</>,
    cta: {
      label: "Read the docs",
      href: "/docs/examples/ai-metadata-quickstart?ref=agent-evals-usecases",
    },
  },
  {
    id: "model-fallback",
    title: "Model fallback",
    body: (
      <>
        Design retry-based fallbacks to other model providers during an
        outage.
      </>
    ),
    cta: {
      label: "Read the docs",
      href: "/docs/features/inngest-functions/error-retries/rollbacks?ref=agent-evals-usecases",
    },
  },
];

export default function UseCases() {
  return (
    <CaseStudiesCarousel
      ariaLabelledBy={HEADING_ID}
      studies={STUDIES}
      header={
        <SectionHeader
          id={HEADING_ID}
          className="px-6 lg:px-8"
          title="Start scoring with Inngest"
        />
      }
    />
  );
}
