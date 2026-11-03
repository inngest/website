import { type Metadata } from "next";
import {
  generateMetadata,
  getLongRunOpenGraphImagePath,
} from "src/utils/social";
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
    // Campaign social card rather than the default salmon one.
    image: getLongRunOpenGraphImagePath({
      title: "Build for the lonng run.",
      eyebrow: "New York City",
      city: "nyc",
    }),
    description:
      "26.2 is one kind of lonng run. Another happens in production. If you're building agents, you know they might have to wait hours or days for user input. Wrap code in APIs that tell it when to stop, start, fan-out, and retry, so your app picks up where it left off, not back at the starting line.",
  }),
  robots: { index: false, follow: false },
};

export default function Page() {
  return <NycLongRun />;
}
