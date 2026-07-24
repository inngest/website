import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import Observability from "@/components/v1/pages/Observability";
import cubeDotsData from "@/public/assets/v1/ai-hero/cube-dots.json";

const CUBE_DOTS_JSON = JSON.stringify(cubeDotsData);

export const metadata: Metadata = generateMetadata({
  title: "Observability - Step-Level Traces",
  description:
    "Debug faster with waterfall traces, run search, metrics dashboards, and SQL insights. No extra instrumentation required. Find the failure in seconds.",
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
