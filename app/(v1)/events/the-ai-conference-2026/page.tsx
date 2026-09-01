import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import TheAIConference2026 from "@/components/v1/pages/TheAIConference2026";

export const metadata: Metadata = generateMetadata({
  title: "Meet Inngest at The AI Conference 2026",
  description:
    "Inngest is agent infrastructure that lives in your codebase. Find us at booth #136 at Pier 48 in San Francisco, September 30 – October 1, 2026.",
});

export default function Page() {
  return <TheAIConference2026 />;
}
