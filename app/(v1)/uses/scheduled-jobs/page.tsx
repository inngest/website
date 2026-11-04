import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import ScheduledJobs from "@/components/v1/pages/ScheduledJobs";
import sjDotsData from "@/public/assets/v1/scheduled-jobs-hero/dots.json";
import {
  JsonLdScript,
  pageSchemas,
  schemaGraph,
} from "@/utils/v1/structuredData";

// ScheduledJobsDotsCanvas reads this manifest on mount; inline it in
// the SSR HTML so the swirl paints on the first frame.
const SJ_DOTS_JSON = JSON.stringify(sjDotsData);

const title = "Serverless Workflow Orchestration for Cron Jobs";
const description =
  "Run reliable cron and scheduled jobs with Inngest. Automatic retries, fan-out, timezone support, and step-level observability, all in one function.";

const structuredData = schemaGraph(
  pageSchemas({
    path: "/uses/scheduled-jobs",
    title,
    description,
    crumb: "Scheduled Jobs",
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
      <script
        id="sj-dots-data"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: SJ_DOTS_JSON }}
      />
      <ScheduledJobs />
    </>
  );
}
