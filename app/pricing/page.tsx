import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";

import Pricing from "@/components/v1/pages/Pricing";

export const metadata: Metadata = generateMetadata({
  title: "Pricing",
  description:
    "Reliable workflows. Invisible infra. Scalable pricing. Start free, scale to enterprise — pricing that grows with your team.",
});

// Replaces the legacy /pricing route with the v1 redesigned page.
export default function Page() {
  return <Pricing />;
}
