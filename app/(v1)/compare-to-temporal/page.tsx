import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";

import CompareToTemporal from "@/components/v1/pages/CompareToTemporal";

export const metadata: Metadata = generateMetadata({
  title: "Inngest vs Temporal: Durable execution that developers love",
  description:
    "Comparing Temporal alternatives? See how Inngest delivers durable execution with no workers, cluster, or queue to run—just functions in your existing app.",
});

export default function Page() {
  return <CompareToTemporal />;
}
