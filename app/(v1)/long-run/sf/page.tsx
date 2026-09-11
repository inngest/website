import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import LongRun from "@/components/v1/pages/LongRun";

/** step.run/sf → the San Francisco cut: community programming, after hours. */
export const metadata: Metadata = {
  ...generateMetadata({
    title: "Build for the long run · San Francisco",
    description:
      "It's good to see you, San Francisco. Inngest is durable execution for work that runs for hours, days, or years — retry the step, not the chain.",
  }),
  robots: { index: false, follow: false },
};

export default function Page() {
  return <LongRun market="sf" />;
}
