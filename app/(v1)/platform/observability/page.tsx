import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import Observability from "@/components/v1/pages/Observability";
import cubeDotsData from "@/public/assets/v1/ai-hero/cube-dots.json";

const CUBE_DOTS_JSON = JSON.stringify(cubeDotsData);

export const metadata: Metadata = generateMetadata({
  title: "Observability - Step-Level Traces",
  description:
    "Step-level traces for AI agent workflows at scale. See where runs fail under concurrency, then use Flow Control for keyed caps, fairness, and throttle.",
});

export default function Page() {
  return (
    <>
      <script
        id="cube-dots-data"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: CUBE_DOTS_JSON }}
      />
      <Observability />
    </>
  );
}
