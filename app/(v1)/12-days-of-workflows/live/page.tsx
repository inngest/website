import { type Metadata } from "next";
import {
  generateMetadata,
  getLongRunOpenGraphImagePath,
} from "src/utils/social";
import TwelveDaysLive from "@/components/v1/pages/TwelveDaysLive";

/**
 * Not indexed yet, like the rest of 12 Days: `noindex, nofollow`, and
 * kept out of the sitemap by "/12-days-of-workflows/*".
 */
export const metadata: Metadata = {
  ...generateMetadata({
    title: "Watch live · 12 Days of Workflows",
    image: getLongRunOpenGraphImagePath({
      title: "Watch us pick the winners live.",
      eyebrow: "12 Days of Workflows · Live on CodeTV",
      city: "sf",
    }),
    description:
      "The 12 Days of Workflows finale, live on CodeTV: one Rube Goldberg machine built from all twelve lessons, and the build-a-thon winners picked on air.",
  }),
  robots: { index: false, follow: false },
};

export default function Page() {
  return <TwelveDaysLive />;
}
