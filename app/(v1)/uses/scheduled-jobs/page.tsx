import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import ScheduledJobs from "@/components/v1/pages/ScheduledJobs";
import sjDotsData from "@/public/assets/v1/scheduled-jobs-hero/dots.json";

// ScheduledJobsDotsCanvas reads this manifest on mount; inline it in
// the SSR HTML so the swirl paints on the first frame.
const SJ_DOTS_JSON = JSON.stringify(sjDotsData);

export const metadata: Metadata = generateMetadata({
  title: "Cron Jobs & Scheduled Functions That Retry",
  description:
    "Replace fire-and-forget crons with Inngest. Automatic retries, fan-out, timezone support, step-level observability, and cancel-on-event - in one function.",
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
