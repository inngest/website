import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import LightningLabShipYourFirstEval from "@/components/v1/pages/LightningLabShipYourFirstEval";

export const metadata: Metadata = generateMetadata({
  title: "Inngest Lightning Lab: Ship Your First Eval",
  description:
    "Join Mitchell Alderson live on August 12, 2026 to turn the runs you're already producing on Inngest into continuous online scores — no second SDK or system required.",
});

export default function Page() {
  return <LightningLabShipYourFirstEval />;
}
