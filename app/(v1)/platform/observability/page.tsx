import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import Observability from "@/components/v1/pages/Observability";
import cubeDotsData from "@/public/assets/v1/ai-hero/cube-dots.json";
import {
  JsonLdScript,
  pageSchemas,
  schemaGraph,
} from "@/utils/v1/structuredData";

const CUBE_DOTS_JSON = JSON.stringify(cubeDotsData);

const title = "Observability - Step-Level Traces";
const description =
  "Debug faster with waterfall traces, run search, metrics dashboards, and SQL insights. No extra instrumentation required. Find the failure in seconds.";

const structuredData = schemaGraph(
  pageSchemas({
    path: "/platform/observability",
    title,
    description,
    crumb: "Observability",
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
        id="cube-dots-data"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: CUBE_DOTS_JSON }}
      />
      <Observability />
    </>
  );
}
