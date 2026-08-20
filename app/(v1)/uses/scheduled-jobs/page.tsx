import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import ScheduledJobs from "@/components/v1/pages/ScheduledJobs";
import sjDotsData from "@/public/assets/v1/scheduled-jobs-hero/dots.json";

// ScheduledJobsDotsCanvas reads this manifest on mount; inline it in
// the SSR HTML so the swirl paints on the first frame.
const SJ_DOTS_JSON = JSON.stringify(sjDotsData);

export const metadata: Metadata = generateMetadata({
  title: "Serverless Workflow Orchestration for Cron Jobs",
  description:
    "Run reliable cron and scheduled jobs with Inngest. Automatic retries, fan-out, timezone support, and step-level observability, all in one function.",
});

export default function Page() {
  return (
    <>
      <script
        id="sj-dots-data"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: SJ_DOTS_JSON }}
      />
      <ScheduledJobs />
    </>
  );
}
