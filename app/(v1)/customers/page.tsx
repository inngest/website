import { type Metadata } from "next";

import { generateMetadata } from "src/utils/social";
import Customers from "@/components/v1/pages/Customers";

export const metadata: Metadata = generateMetadata({
  title: "Customer Stories - Teams Built on Inngest",
  description:
    "See how startups and scale-ups like Resend, SoundCloud, and Cohere build reliable workflows and AI agents with Inngest.",
});

export default function Page() {
  return <Customers />;
}
