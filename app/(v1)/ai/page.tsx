import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import AIPageV1 from "@/components/v1/pages/AIPage";

export const metadata: Metadata = generateMetadata({
  title: "AI Workflow Orchestration & Agent Infrastructure",
  description:
    "Build durable AI workflows and agents that survive rate limits and LLM failures. Automatic retries, step-level tracing, serverless-first. No extra infra.",
});

export default function Page() {
  return <AIPageV1 />;
}
