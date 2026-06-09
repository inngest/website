import { type Metadata } from "next";

import { generateMetadata } from "src/utils/social";
import { isV1Enabled } from "@/utils/v1/routes";
import Customers from "@/components/v1/pages/Customers";
import CustomersLegacy from "./CustomersLegacy";

export const metadata: Metadata = generateMetadata({
  title: "Customer Stories - Teams Built on Inngest",
  description:
    "See how startups and scale-ups like Resend, SoundCloud, and Cohere build reliable workflows and AI agents with Inngest.",
});

// Canonical /customers index. Flag on -> the v1 story grid (its own
// PageShell chrome; /customers is a v1 route); flag off -> the ported
// legacy directory inside the layout's legacy chrome.
export default function Page() {
  if (isV1Enabled()) return <Customers />;
  return <CustomersLegacy />;
}
