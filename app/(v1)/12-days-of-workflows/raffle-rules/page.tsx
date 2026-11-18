import { type Metadata } from "next";
import TwelveDaysRaffleRules from "@/components/v1/pages/TwelveDaysRaffleRules";

/**
 * Official rules for the 12 Days daily raffle. Not indexed, like the
 * rest of 12 Days, and kept out of the sitemap by "/12-days-of-workflows/*".
 */
export const metadata: Metadata = {
  title: "Raffle rules · 12 Days of Workflows",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <TwelveDaysRaffleRules />;
}
