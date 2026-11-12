import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";

import BackgroundJobs from "@/components/v1/pages/BackgroundJobs";
import {
  JsonLdScript,
  pageSchemas,
  schemaGraph,
} from "@/utils/v1/structuredData";

const title = "Background Jobs Without the Boilerplate";
const description =
  "Run background jobs without queues or boilerplate. Wrap your code in steps for automatic retries, concurrency, and observability on any runtime.";

const structuredData = schemaGraph(
  pageSchemas({
    path: "/uses/serverless-node-background-jobs",
    title,
    description,
    crumb: "Background Jobs",
  })
);

export const metadata: Metadata = generateMetadata({
  title,
  description,
});

// Static route — takes precedence over /uses/[case] for this slug,
// so the new v1 page replaces the legacy use-case template here.
export default function Page() {
  return (
    <>
      <JsonLdScript data={structuredData} />
      <BackgroundJobs />
    </>
  );
}
