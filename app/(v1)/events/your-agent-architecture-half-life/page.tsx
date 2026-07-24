import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import AgentArchitectureHalfLifeTalk from "@/components/v1/pages/AgentArchitectureHalfLifeTalk";

export const metadata: Metadata = generateMetadata({
  title: "Your agent architecture has a half-life of 6 months",
  description:
    "Dan Farrelly, Inngest co-founder and CTO, speaks at AI Engineer World's Fair on July 1, 2026 · 12:05–12:25 PM PT at Expo Stage 1, Moscone West.",
});

export default function Page() {
  return <AgentArchitectureHalfLifeTalk />;
}
