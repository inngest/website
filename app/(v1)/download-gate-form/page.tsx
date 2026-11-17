import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import DownloadGateForm from "@/components/v1/pages/DownloadGateForm";

// Unlisted second sign-up form for the report. The public write-up
// (/blog/ai-in-production-report-2026) is the page that should rank, so this
// one stays out of search. It must stay crawlable (no robots.txt Disallow)
// for search engines to see the noindex.
export const metadata: Metadata = {
  ...generateMetadata({
    title: "AI in Production: The 2026 Benchmark Report",
    description:
      "How engineering teams are building, breaking, and scaling AI in production. A survey of 130 backend, full-stack, and AI engineers.",
  }),
  robots: { index: false, follow: true },
};

export default function Page() {
  return <DownloadGateForm />;
}
