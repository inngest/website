import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import SfLongRun from "@/components/v1/pages/SfLongRun";

/**
 * step.run/sf → inngest.com/sf-long-run.
 *
 * Unlisted rather than gated: `noindex, nofollow` here, excluded from
 * the sitemap in next-sitemap.config.js, and unlinked from the site.
 * Remove the robots block and the sitemap entry to list it publicly.
 */
export const metadata: Metadata = {
  ...generateMetadata({
    title: "Build for the long run · San Francisco",
    description:
      "Build apps and agents that run for days. Wrap functions in steps that pause for events, retry, fan-out, and handle everything production throws at you — without touching infra.",
  }),
  robots: { index: false, follow: false },
};

export default function Page() {
  return <SfLongRun />;
}
