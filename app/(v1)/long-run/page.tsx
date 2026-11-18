import { type Metadata } from "next";
import {
  generateMetadata,
  getLongRunOpenGraphImagePath,
} from "src/utils/social";
import LongRun from "@/components/v1/pages/LongRun";

/**
 * step.run → inngest.com/long-run. (The step.run redirect itself is set
 * in Vercel's domain settings, not in this repo.)
 *
 * Publicly indexable and in the sitemap, like /sf-long-run and
 * /nyc-long-run. To pull it out of search, add
 * `robots: { index: false, follow: true }` below and add "/long-run" to
 * the sitemap exclude list in next-sitemap.config.js — both are needed,
 * since a sitemap entry and a noindex tag contradict each other.
 */
export const metadata: Metadata = {
  ...generateMetadata({
    title: "Build for the lonng run",
    // Campaign social card rather than the default salmon one.
    image: getLongRunOpenGraphImagePath({
      title: "Build for the lonng run.",
      eyebrow: "step.run",
      city: "sf",
    }),
    description:
      "Build apps and agents that run for days. Wrap functions in steps that pause for events, retry, fan-out, and handle everything production throws at you — without touching infra.",
  }),
};

export default function Page() {
  return <LongRun />;
}
