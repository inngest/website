import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import Sandboxes from "@/components/v1/pages/Sandboxes";
import {
  JsonLdScript,
  pageSchemas,
  schemaGraph,
} from "@/utils/v1/structuredData";

const title = "Sandboxes - Durable machines for code that has to run";
const description =
  "A sandbox is a step in your function, not a separate service. It retries, takes the same flow control, and lands on the trace beside experiments and scoring. Open beta.";

const structuredData = schemaGraph(
  pageSchemas({
    path: "/platform/sandboxes",
    title,
    description,
    crumb: "Sandboxes",
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
      <Sandboxes />
    </>
  );
}
