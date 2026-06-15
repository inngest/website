import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import DurableExecution from "@/components/v1/pages/DurableExecution";
import deDotsData from "@/public/assets/v1/durable-execution-hero/dots.json";

// DurableExecutionDotsCanvas reads this manifest on mount; inline it
// in the SSR HTML so the pattern paints on the first frame.
const DE_DOTS_JSON = JSON.stringify(deDotsData);

export const metadata: Metadata = generateMetadata({
  title: "Durable Execution - Reliable Workflows",
  description:
    "Make any function durable with step.run, step.sleep, and waitForEvent. Inngest retries, resumes, and traces your workflows - no extra workers required.",
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
