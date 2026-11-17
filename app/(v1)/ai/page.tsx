import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import AIPageV1 from "@/components/v1/pages/AIPage";
import {
  JsonLdScript,
  pageSchemas,
  schemaGraph,
} from "@/utils/v1/structuredData";

const title = "AI Workflow Orchestration & Agent Infrastructure";
const description =
  "Build durable AI workflows and agents that survive rate limits and LLM failures. Automatic retries, step-level tracing, serverless-first. No extra infra.";

const structuredData = schemaGraph(
  pageSchemas({ path: "/ai", title, description, crumb: "AI" })
);

export const metadata: Metadata = generateMetadata({
  title,
  description,
});

export default function Page() {
  return (
    <>
      <JsonLdScript data={structuredData} />
      <AIPageV1 />
    </>
  );
}
