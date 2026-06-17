import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import NoHalfBakedAgentsBreakfast from "@/components/v1/pages/NoHalfBakedAgentsBreakfast";

export const metadata: Metadata = generateMetadata({
  title: "No Half-Baked Agents: Breakfast with Inngest & Nebius",
  description:
    "Breakfast tacos, coffee & matcha with Inngest and Nebius on the final day of AI Engineer World's Fair. Thursday, July 2, 2026 · 8–9:30 AM PT at the Inngest Office.",
});

export default function Page() {
  return <NoHalfBakedAgentsBreakfast />;
}
