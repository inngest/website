import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";

import CompareToTemporal from "@/components/v1/pages/CompareToTemporal";
import { COMPARE_TEMPORAL_FAQS } from "@/components/v1/sections/CompareTemporal/Faq";
import {
  JsonLdScript,
  buildFaqPageSchema,
} from "@/utils/v1/structuredData";

export const metadata: Metadata = generateMetadata({
  title: "Inngest vs Temporal: Durable execution that developers love",
  description:
    "Discover a serverless, event-driven platform that developers love. Build faster, debug easier, and scale effortlessly with Inngest.",
});

export default function Page() {
  const faqSchema = buildFaqPageSchema(
    COMPARE_TEMPORAL_FAQS.map((faq) => ({
      question: faq.question,
      answer: faq.answer,
    })),
  );

  return (
    <>
      <JsonLdScript data={faqSchema} />
      <CompareToTemporal />
    </>
  );
}
