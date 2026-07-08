import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import VoiceDemoToProductionAgentWebinar from "@/components/v1/pages/VoiceDemoToProductionAgentWebinar";

export const metadata: Metadata = generateMetadata({
  title: "From Voice Demo to Production Agent: Building Reliable AI Workflows",
  description:
    "Join Amanda Martin (Vapi) and Sterling Chin (Inngest) live on July 29, 2026 as they build a production-ready AI voice agent, covering durable workflows, retries, and evaluations.",
});

export default function Page() {
  return <VoiceDemoToProductionAgentWebinar />;
}
