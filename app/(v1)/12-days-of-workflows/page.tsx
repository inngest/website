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
    title: "12 Days of Workflows",
    image: getLongRunOpenGraphImagePath({
      title: "12 Days of Workflows.",
      eyebrow: "Inngest × CodeTV · December 3–18",
      city: "sf",
    }),
    description:
      "Twelve doors. Twelve weird workflows. One very long-running holiday season. A new Inngest lesson unlocks every weekday at midnight Eastern, December 3–18.",
  }),
  robots: { index: false, follow: false },
};

export default function Page() {
  return <TwelveDaysOfWorkflows />;
}
