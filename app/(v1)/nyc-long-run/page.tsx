import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import NycLongRun from "@/components/v1/pages/NycLongRun";

/**
 * step.run/nyc → inngest.com/nyc-long-run.
 *
 * Not indexed yet, unlike the SF page: this one is still in review, so
 * it sends `noindex, nofollow` and is excluded from the sitemap. To list
 * it publicly, drop the robots block below and remove the
 * "/nyc-long-run" line from next-sitemap.config.js — both are needed,
 * since a sitemap entry and a noindex tag contradict each other.
 */
export const metadata: Metadata = {
  ...generateMetadata({
    title: "Build for the lonng run · New York City",
    description:
      "Build apps and agents that run for days. Wrap functions in steps that pause for events, retry, fan-out, and handle everything production throws at you — without touching infra.",
  }),
  robots: { index: false, follow: false },
};

export default function Page() {
  return <NycLongRun />;
}
