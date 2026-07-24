import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import InngestSupperClub from "@/components/v1/pages/InngestSupperClub";

export const metadata: Metadata = generateMetadata({
  title: "Inngest Supper Club",
  description:
    "An intimate dinner in Peasant's wine cellar in Nolita, New York on Wednesday, July 29, 2026. No decks, no pitch — just food, wine, and conversation.",
});

export default function Page() {
  return <InngestSupperClub />;
}
