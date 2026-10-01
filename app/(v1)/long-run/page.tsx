import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import LongRun from "@/components/v1/pages/LongRun";

/**
 * step.run/build → the city-agnostic cut of the campaign page, for DOOH,
 * paid social, and anywhere there's no street context to play off.
 *
 * `noindex` while the page is gated behind `?unreleased=long-run` — a
 * sitemap entry for a gated page would contradict the gate. Drop the robots
 * block and the `/long-run` entries in next-sitemap.config.js when the
 * campaign goes live.
 */
export const metadata: Metadata = {
  ...generateMetadata({
    title: "Build for the long run",
    description:
      "Long running humans. Long running agents. Inngest is durable execution for work that runs for hours, days, or years — retry the step, not the chain.",
  }),
  robots: { index: false, follow: false },
};

export default function Page() {
  return <LongRun market="all" />;
}
