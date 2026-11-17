import { type Metadata } from "next";
import TwelveDaysOfWorkflows from "@/components/v1/pages/TwelveDaysOfWorkflows";

/**
 * Employee preview of /12-days-of-workflows. Password-gated in
 * middleware.ts (TWELVE_DAYS_TEAM_PASSWORD), never indexed, and excluded
 * from the sitemap by "/12-days-of-workflows/*". The day switcher works
 * here on production so the team can open every door early.
 */
export const metadata: Metadata = {
  title: "12 Days of Workflows · Team preview",
  robots: { index: false, follow: false },
};

// Rendered per request, so the password check in middleware is never
// skipped by a statically cached copy.
export const dynamic = "force-dynamic";

export default function Page() {
  return <TwelveDaysOfWorkflows employeePreview />;
}
