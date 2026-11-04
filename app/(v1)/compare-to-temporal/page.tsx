import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";

import CompareToTemporal from "@/components/v1/pages/CompareToTemporal";
import {
  JsonLdScript,
  pageSchemas,
  schemaGraph,
} from "@/utils/v1/structuredData";

const title = "Inngest vs Temporal: Durable execution that developers love";
const description =
  "Comparing Temporal alternatives? See how Inngest delivers durable execution with no workers, cluster, or queue to run—just functions in your existing app.";

const structuredData = schemaGraph(
  pageSchemas({
    path: "/compare-to-temporal",
    title,
    description,
    crumb: "Inngest vs Temporal",
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
      <CompareToTemporal />
    </>
  );
}
