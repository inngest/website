import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";

import Pricing from "@/components/v1/pages/Pricing";
import { planOffers } from "@/components/v1/sections/Pricing/planOffers";
import {
  JsonLdScript,
  pageSchemas,
  schemaGraph,
  softwareApplicationSchema,
} from "@/utils/v1/structuredData";

const title = "Pricing";
const description =
  "Reliable workflows. Invisible infra. Scalable pricing. Start free, scale to enterprise — pricing that grows with your team.";

export const metadata: Metadata = generateMetadata({ title, description });

// One Offer per plan, from the same data as the pricing cards.
const structuredData = schemaGraph(
  pageSchemas({ path: "/pricing", title, description, crumb: "Pricing" }),
  softwareApplicationSchema(planOffers())
);

// Replaces the legacy /pricing route with the v1 redesigned page.
export default function Page() {
  return (
    <>
      <JsonLdScript data={structuredData} />
      <Pricing />
    </>
  );
}
