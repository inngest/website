import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import BuildLongRun from "@/components/v1/pages/BuildLongRun";

/**
 * step.run/build → inngest.com/build-long-run.
 *
 * The city-agnostic cut of the campaign, for placements that aren't tied
 * to New York or San Francisco. Right now it is a straight copy of the
 * San Francisco page with its own runner, so the copy it inherits still
 * names that city — see the note in
 * `components/v1/sections/BuildLongRun/data.ts`.
 *
 * Not indexed: `noindex, nofollow` here plus a "/build-long-run" line in
 * next-sitemap.config.js. Both are needed, since a sitemap entry and a
 * noindex tag contradict each other. Drop both to list it publicly.
 */
export const metadata: Metadata = {
  ...generateMetadata({
    title: "Build for the lonng run",
    description:
      "Build apps and agents that run for days. Wrap functions in steps that pause for events, retry, fan-out, and handle everything production throws at you — without touching infra.",
  }),
  robots: { index: false, follow: false },
};

export default function Page() {
  return <BuildLongRun />;
}
