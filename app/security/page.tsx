import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import { isV1Enabled } from "@/utils/v1/routes";
import Security from "@/components/v1/pages/Security";
import SecurityLegacy from "./SecurityLegacy";

export const metadata: Metadata = generateMetadata({
  title: "Security",
  description: "Information on our platform security",
});

// v1 redesign serves at the canonical /security when the flag is on; the
// legacy page renders when it's off. Header/Footer come from the app
// layout (legacy chrome), so the legacy branch renders body only — same
// pattern as /terms and /privacy.
export default function Page() {
  if (isV1Enabled()) return <Security />;
  return <SecurityLegacy />;
}
