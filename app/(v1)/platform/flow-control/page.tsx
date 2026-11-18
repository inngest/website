import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import QueuesFlowControl from "@/components/v1/pages/QueuesFlowControl";
import qfcDotsData from "@/public/assets/v1/queues-flow-control-hero/dots.json";
import {
  JsonLdScript,
  pageSchemas,
  schemaGraph,
} from "@/utils/v1/structuredData";

// QueuesFlowControlDotsCanvas reads this manifest on mount; inline it
// in the SSR HTML so the pattern paints on the first frame.
const QFC_DOTS_JSON = JSON.stringify(qfcDotsData);

const title = "Queues & Flow Control for Background Jobs";
const description =
  "Define concurrency, throttling, rate limits, and priority queues in code. Inngest keeps your pipelines stable as event volume scales.";

const structuredData = schemaGraph(
  pageSchemas({
    path: "/platform/flow-control",
    title,
    description,
    crumb: "Flow Control",
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
        id="qfc-dots-data"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: QFC_DOTS_JSON }}
      />
      <QueuesFlowControl />
    </>
  );
}
