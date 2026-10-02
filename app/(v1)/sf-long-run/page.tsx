import { type Metadata } from "next";
import {
  generateMetadata,
  getLongRunOpenGraphImagePath,
} from "src/utils/social";
import SfLongRun from "@/components/v1/pages/SfLongRun";

/**
 * step.run/sf → inngest.com/sf-long-run.
 *
 * Publicly indexable: no robots block here, and the route is in the
 * sitemap. To pull it back out of search, add
 * `robots: { index: false, follow: false }` below and re-add the
 * "/sf-long-run" line to next-sitemap.config.js — both are needed,
 * since a sitemap entry and a noindex tag contradict each other.
 */
export const metadata: Metadata = {
  ...generateMetadata({
    title: "Build for the lonng run · San Francisco",
    // Campaign social card rather than the default salmon one.
    image: getLongRunOpenGraphImagePath({
      title: "Build for the lonng run.",
      eyebrow: "San Francisco",
      city: "sf",
    }),
    description:
      "Build apps and agents that run for days. Wrap functions in steps that pause for events, retry, fan-out, and handle everything production throws at you — without touching infra.",
  }),
};

export default function Page() {
  return <SfLongRun />;
}
