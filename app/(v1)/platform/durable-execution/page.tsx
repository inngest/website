import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import DurableExecution from "@/components/v1/pages/DurableExecution";
import deDotsData from "@/public/assets/v1/durable-execution-hero/dots.json";

// DurableExecutionDotsCanvas reads this manifest on mount; inline it
// in the SSR HTML so the pattern paints on the first frame.
const DE_DOTS_JSON = JSON.stringify(deDotsData);

export const metadata: Metadata = generateMetadata({
  title: "Durable Execution Explained: Automatic Retries & Checkpoints",
  description:
    "What is durable execution? Fault-tolerant code that finishes despite failures—via automatic retries and step checkpoints. Compare Inngest to Temporal and start building durable functions.",
});

export default function Page() {
  return (
    <>
      <script
        id="de-dots-data"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: DE_DOTS_JSON }}
      />
      <DurableExecution />
    </>
  );
}
