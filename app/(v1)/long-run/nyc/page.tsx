import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import LongRun from "@/components/v1/pages/LongRun";

/** step.run/nyc → the New York cut: marathon weekend, borough course. */
export const metadata: Metadata = {
  ...generateMetadata({
    title: "Build for the long run · New York City",
    description:
      "You just walked past us in New York. Inngest is durable execution for work that runs for hours, days, or years — retry the step, not the chain.",
  }),
  robots: { index: false, follow: false },
};

export default function Page() {
  return <LongRun market="nyc" />;
}
