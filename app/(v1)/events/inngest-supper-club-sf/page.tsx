import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import InngestSupperClubSF from "@/components/v1/pages/InngestSupperClubSF";

export const metadata: Metadata = generateMetadata({
  title: "Inngest Supper Club: San Francisco",
  description:
    "A small, low-key dinner in San Francisco on Thursday, August 27, 2026 for people building agents, workflows, and the infra underneath them. No decks, no pitch.",
});

export default function Page() {
  return <InngestSupperClubSF />;
}
