import { type Metadata } from "next";
import {
  generateMetadata,
  getLongRunOpenGraphImagePath,
} from "src/utils/social";
import TwelveDaysBuildathon from "@/components/v1/pages/TwelveDaysBuildathon";

/**
 * Not indexed yet, like the 12 Days page it belongs to: it sends
 * `noindex, nofollow` and is excluded from the sitemap
 * ("/12-days-of-workflows/*" in next-sitemap.config.js).
 */
export const metadata: Metadata = {
  ...generateMetadata({
    title: "Build your weird workflow · 12 Days of Workflows",
    image: getLongRunOpenGraphImagePath({
      title: "Build your weird workflow.",
      eyebrow: "12 Days of Workflows · Build-a-thon",
      city: "sf",
    }),
    description:
      "Use all twelve primitives from the 12 Days of Workflows to build something simple in the most complicated way you can. Win cash prizes, picked live on CodeTV.",
  }),
  robots: { index: false, follow: false },
};

export default function Page() {
  return <TwelveDaysBuildathon />;
}
