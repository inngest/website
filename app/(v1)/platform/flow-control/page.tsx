import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import QueuesFlowControl from "@/components/v1/pages/QueuesFlowControl";
import qfcDotsData from "@/public/assets/v1/queues-flow-control-hero/dots.json";

// QueuesFlowControlDotsCanvas reads this manifest on mount; inline it
// in the SSR HTML so the pattern paints on the first frame.
const QFC_DOTS_JSON = JSON.stringify(qfcDotsData);

export const metadata: Metadata = generateMetadata({
  title: "Queues & Flow Control for Background Jobs",
  description:
    "Define concurrency, throttling, rate limits, and priority queues in code. Inngest keeps your pipelines stable as event volume scales.",
});

export default function Page() {
  return (
    <>
      <script
        id="qfc-dots-data"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: QFC_DOTS_JSON }}
      />
      <QueuesFlowControl />
    </>
  );
}
