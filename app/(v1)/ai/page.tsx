import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import AIPageV1 from "@/components/v1/pages/AIPage";
import { AI_PAGE_FAQS } from "@/components/v1/sections/AI/faqData";
import {
  JsonLdScript,
  buildFaqPageSchema,
} from "@/utils/v1/structuredData";

export const metadata: Metadata = generateMetadata({
  title: "AI Workflow Orchestration & Agent Infrastructure",
  description:
    "Build durable AI workflows and agents that survive rate limits and LLM failures. Automatic retries, step-level tracing, serverless-first. No extra infra.",
});

export default function Page() {
  const faqSchema = buildFaqPageSchema(
    AI_PAGE_FAQS.map((faq) => ({
      question: faq.question,
      answer: faq.answer,
    })),
  );

  return (
    <>
      <JsonLdScript data={faqSchema} />
      <AIPageV1 />
    </>
  );
}
