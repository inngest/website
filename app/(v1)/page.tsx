import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import HomeV1 from "@/components/v1/pages/Home";
import { planOffers } from "@/components/v1/sections/Pricing/planOffers";
import {
  JsonLdScript,
  organizationSchema,
  schemaGraph,
  softwareApplicationSchema,
  websiteSchema,
} from "@/utils/v1/structuredData";

export const metadata: Metadata = generateMetadata({
  title: "Durable Execution for Workflows & AI",
  description:
    "Build reliable background jobs, workflows, and AI agents without extra infrastructure. Automatic retries, flow control, and step-level observability.",
  image: "/assets/homepage/open-graph-2026.png",
});

const structuredData = schemaGraph(
  websiteSchema(),
  organizationSchema(),
  softwareApplicationSchema(planOffers())
);

export default function Page() {
  return (
    <>
      <JsonLdScript data={structuredData} />
      <HomeV1 />
    </>
  );
}
