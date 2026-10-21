import { type Metadata } from "next";
import {
  generateMetadata,
  getLongRunOpenGraphImagePath,
} from "src/utils/social";
import TwelveDaysOfWorkflows from "@/components/v1/pages/TwelveDaysOfWorkflows";

/**
 * Not indexed yet: the page is still in review, so it sends
 * `noindex, nofollow` and is excluded from the sitemap. To list it
 * publicly, drop the robots block below and remove the
 * "/12-days-of-workflows" line from next-sitemap.config.js.
 */
export const metadata: Metadata = {
  ...generateMetadata({
    title: "The 12 days of workflows",
    image: getLongRunOpenGraphImagePath({
      title: "The 12 days of workflows.",
      eyebrow: "Inngest × CodeTV · December 1–12",
      city: "sf",
    }),
    description:
      "Inngest × CodeTV: twelve short video lessons, one Inngest primitive a day, behind an advent calendar that unlocks at midnight Pacific, December 1 through 12.",
  }),
  robots: { index: false, follow: false },
};

export default function Page() {
  return <TwelveDaysOfWorkflows />;
}
