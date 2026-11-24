import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import TwelveDaysOfWorkflows from "@/components/v1/pages/TwelveDaysOfWorkflows";

/**
 * Live and indexable, and listed in the sitemap. Its subpages (/live,
 * /raffle-rules, /team) stay noindex in their own metadata and out of
 * the sitemap.
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
};

export default function Page() {
  return <TwelveDaysOfWorkflows />;
}
