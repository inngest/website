import { type Metadata } from "next";

import { generateMetadata } from "src/utils/social";
import Customers from "@/components/v1/pages/Customers";
import {
  JsonLdScript,
  pageSchemas,
  schemaGraph,
} from "@/utils/v1/structuredData";

const title = "Customer Stories - Teams Built on Inngest";
const description =
  "See how startups and scale-ups like Resend, SoundCloud, and Cohere build reliable workflows and AI agents with Inngest.";

const structuredData = schemaGraph(
  pageSchemas({
    path: "/customers",
    title,
    description,
    crumb: "Customers",
    type: "CollectionPage",
  })
);

export const metadata: Metadata = generateMetadata({
  title,
  description,
});

export default function Page() {
  return (
    <>
      <JsonLdScript data={structuredData} />
      <Customers />
    </>
  );
}
