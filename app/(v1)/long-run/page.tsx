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
 * Not indexed yet: it sends `noindex, nofollow` and is excluded from the
 * sitemap. To list it publicly, drop the robots block below and remove
 * the "/long-run" line from next-sitemap.config.js — both are needed,
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
  robots: { index: false, follow: false },
};

export default function Page() {
  return <LongRun />;
}
