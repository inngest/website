import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import AgentEvals from "@/components/v1/pages/AgentEvals";
import {
  JsonLdScript,
  pageSchemas,
  schemaGraph,
} from "@/utils/v1/structuredData";

const title = "Agent Evals - Score Agents on Real Outcomes";
const description =
  "Judge agents on outcomes, not output. Score variants against live production traffic, track every run, and build datasets for evals — no extra instrumentation required.";

const structuredData = schemaGraph(
  pageSchemas({
    path: "/platform/agent-evals",
    title,
    description,
    crumb: "Agent Evals",
  })
);

export const metadata: Metadata = generateMetadata({
  title,
  description,
});

export default function Page() {
  return (
    <>
      <JsonLdScript data={structuredData} />
      <AgentEvals />
    </>
  );
}
