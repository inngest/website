"use client";

import ButtonLink from "@/components/v1/ButtonLink";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import CaseStudiesCarousel, {
  type CaseStudyItem,
} from "@/components/v1/sections/shared/CaseStudiesCarousel";

const HEADING_ID = "de-case-studies-heading";
const CTA_LABEL = "Read the full case study";

const STUDIES: CaseStudyItem[] = [
  {
    id: "ai-agents-rag",
    title: "AI Agents and RAG",
    body: "Use Inngest to build AI agents and RAG.",
    cta: { label: "See example", href: "/docs/examples/ai-agents-and-rag" },
  },
  {
    id: "email-sequence",
    title: "Email sequence",
    body: "Build a dynamic drip campaign based on a user's behavior.",
    cta: { label: "See example", href: "/docs/examples/email-sequence" },
  },
  {
    id: "scheduling-one-off",
    title: "Scheduling a one-off function",
    body: "Schedule a function to run at a specific time.",
    cta: { label: "See example", href: "/docs/examples/scheduling-one-off-function" },
  },
  {
    id: "realtime",
    title: "Realtime",
    body: "Use Realtime to stream updates from one to multiple Inngest functions or to implement a Human in the Loop mechanism.",
    cta: { label: "Read the docs", href: "/docs/features/realtime" },
  },
  {
    id: "durable-endpoints",
    title: "Durable endpoints",
    body: "Make any API endpoint durable with automatic retries.",
    cta: { label: "Read the docs", href: "/docs/learn/durable-endpoints" },
  },
];

export default function CaseStudies() {
  return (
    <CaseStudiesCarousel
      ariaLabelledBy={HEADING_ID}
      studies={STUDIES}
      header={
        <SectionHeader
          id={HEADING_ID}
          className="px-6 lg:px-8"
          title={
            <>
              What teams are{" "}
              <br className="hidden lg:block" />
              building on Inngest.
            </>
          }
          body="Real users, real use cases."
          titleAside={
            <ButtonLink href="/customers?ref=durable-execution" variant="primary">
              See customer stories →
            </ButtonLink>
          }
        />
      }
    />
  );
}
