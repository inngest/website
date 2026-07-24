import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";

import CompareToTemporal from "@/components/v1/pages/CompareToTemporal";

export const metadata: Metadata = generateMetadata({
  title: "Inngest vs Temporal: Durable execution that developers love",
  description:
    "Discover a serverless, event-driven platform that developers love. Build faster, debug easier, and scale effortlessly with Inngest.",
});

export default function Page() {
  return <CompareToTemporal />;
}
