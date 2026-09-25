import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import LongRun from "@/components/v1/pages/LongRun";

/** step.run/sf → inngest.com/sf-long-run — the San Francisco cut. */
export const metadata: Metadata = {
  ...generateMetadata({
    title: "Build for the long run · San Francisco",
    description:
      "Build apps and agents that run for days. Wrap functions in steps that pause for events, retry, fan-out, and handle everything production throws at you — without touching infra.",
  }),
  robots: { index: false, follow: false },
};

export default function Page() {
  return <LongRun market="sf" />;
}
