import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";

import BackgroundJobs from "@/components/v1/pages/BackgroundJobs";

export const metadata: Metadata = generateMetadata({
  title: "Background Jobs Without the Boilerplate",
  description:
    "Run background jobs without queues or boilerplate. Wrap your code in steps for automatic retries, concurrency, and observability on any runtime.",
});

// Static route — takes precedence over /uses/[case] for this slug,
// so the new v1 page replaces the legacy use-case template here.
export default function Page() {
  return <BackgroundJobs />;
}
