import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import AgentEvals from "@/components/v1/pages/AgentEvals";

export const metadata: Metadata = generateMetadata({
  title: "Agent Evals - Score Agents on Real Outcomes",
  description:
    "Judge agents on outcomes, not output. Score variants against live production traffic, track every run, and build datasets for evals — no extra instrumentation required.",
});

export default function Page() {
  return <AgentEvals />;
}
