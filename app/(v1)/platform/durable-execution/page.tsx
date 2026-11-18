import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import DurableExecution from "@/components/v1/pages/DurableExecution";
import deDotsData from "@/public/assets/v1/durable-execution-hero/dots.json";
import {
  JsonLdScript,
  pageSchemas,
  schemaGraph,
} from "@/utils/v1/structuredData";

// DurableExecutionDotsCanvas reads this manifest on mount; inline it
// in the SSR HTML so the pattern paints on the first frame.
const DE_DOTS_JSON = JSON.stringify(deDotsData);

const title = "Durable Execution Platform for Reliable Workflows";
const description =
  "Durable execution keeps functions running through failures, retries, and restarts. Add step.run, step.sleep, and waitForEvent to any code. No extra workers required.";

const structuredData = schemaGraph(
  pageSchemas({
    path: "/platform/durable-execution",
    title,
    description,
    crumb: "Durable Execution",
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
      <script
        id="de-dots-data"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: DE_DOTS_JSON }}
      />
      <DurableExecution />
    </>
  );
}
