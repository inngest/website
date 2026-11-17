import { type Metadata } from "next";
import {
  generateMetadata,
  getLongRunOpenGraphImagePath,
} from "src/utils/social";
import TwelveDaysLivestream from "@/components/v1/pages/TwelveDaysLivestream";

/**
 * Not indexed yet, like the rest of 12 Days: `noindex, nofollow`, and
 * kept out of the sitemap by "/12-days-of-workflows/*".
 */
export const metadata: Metadata = {
  ...generateMetadata({
    title: "Register for the livestream · 12 Days of Workflows",
    image: getLongRunOpenGraphImagePath({
      title: "Watch us pick the winners live.",
      eyebrow: "12 Days of Workflows · Live on CodeTV",
      city: "sf",
    }),
    description:
      "Join Inngest and CodeTV live as we build a Rube Goldberg machine out of all twelve lessons and pick the build-a-thon winners on air.",
  }),
  robots: { index: false, follow: false },
};

export default function Page() {
  return <TwelveDaysLivestream />;
}
