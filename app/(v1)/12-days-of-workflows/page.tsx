import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
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
    // 16:9 share image from the "Luma - coral A" doors art in the Long
    // Running Campaign Figma file (1920 × 1080).
    image: "/assets/v1/12-days/og.jpg",
    description:
      "Twelve doors. Twelve lessons to make all your weird workflows durable. A new door opens every day, December 7–18.",
  }),
  robots: { index: false, follow: false },
};

export default function Page() {
  return <TwelveDaysOfWorkflows />;
}
