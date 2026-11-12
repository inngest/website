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
    title: "12 Days of [weird] workflows",
    image: getLongRunOpenGraphImagePath({
      title: "12 Days of [weird] workflows.",
      eyebrow: "Inngest × CodeTV · December 3–18",
      city: "sf",
    }),
    description:
      "Twelve doors. Twelve lessons to make all your weird workflows durable. A new door opens every weekday, December 3–18.",
  }),
  robots: { index: false, follow: false },
};

export default function Page() {
  return <TwelveDaysOfWorkflows />;
}
