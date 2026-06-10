"use client";

import CaseStudiesCarousel, {
  type CaseStudyItem,
} from "@/components/v1/sections/shared/CaseStudiesCarousel";
import InlineCode from "@/components/v1/sections/shared/InlineCode";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";

// "WHAT TEAMS HAVE BUILT WITH INNGEST TO HANDLE CRON & SCHEDULED
// JOBS" — heading + "See all customers" CTA above the shared
// CaseStudiesCarousel. Mirrors BackgroundJobs/CaseStudies so both
// pages share the same carousel shell, hover/active styling, and
// pagination chrome.

const HEADING_ID = "cron-customers-heading";

// TODO(scheduled-jobs): wire up real per-case-study URLs once the
// docs/example pages exist. Placeholder `#` left in to preserve
// layout; clicking should not ship like this.
const TODO_HREF = "#";

const STUDIES: CaseStudyItem[] = [
  {
    id: "digest-emails",
    title: "Digest emails",
    body: (
      <>
        Weekly or daily summaries sent to users. Fan-out from a
        single cron to thousands of individual sends, each retried
        independently.
      </>
    ),
    logo: { src: "/assets/v1/logos/outtake.svg", alt: "Outtake", width: 136, height: 24 },
    cta: { label: "See the example", href: TODO_HREF },
  },
  {
    id: "data-sync",
    title: "Data sync & imports",
    body: (
      <>
        Periodic syncs with third-party APIs, database imports, and
        report generation — with full observability into every run.
      </>
    ),
    logo: { src: "/assets/customers/tripadvisor.svg", alt: "Tripadvisor", width: 157, height: 24 },
    cta: { label: "Read the pattern", href: TODO_HREF },
  },
  {
    id: "user-reminders",
    title: "User reminders",
    body: (
      <>
        Schedule reminders at a user-defined time with{" "}
        <InlineCode>step.sleepUntil()</InlineCode>. Cancel
        automatically if the user acts first.
      </>
    ),
    logo: { src: "/assets/v1/logos/resend.svg", alt: "Resend", width: 96, height: 24 },
    cta: { label: "See the example", href: TODO_HREF },
  },
  {
    id: "scheduled-content",
    title: "Scheduled content",
    body: (
      <>
        Publish blog posts, send announcements, go live with
        features at a specific time. Cancel if plans change — no
        code needed.
      </>
    ),
    logo: { src: "/assets/v1/logos/soundcloud.svg", alt: "SoundCloud", width: 202, height: 24 },
    cta: { label: "Read the pattern", href: TODO_HREF },
  },
  {
    id: "trial-lifecycle",
    title: "Trial & subscription lifecycle",
    body: (
      <>
        Fire a trial expiry at the exact moment it ends. Cancel
        automatically if the user upgrades before the deadline.
      </>
    ),
    logo: { src: "/assets/customers/zamp-logo.svg", alt: "Zamp", width: 157, height: 24 },
    cta: { label: "See the example", href: TODO_HREF },
  },
];

export default function Customers() {
  return (
    <CaseStudiesCarousel
      ariaLabelledBy={HEADING_ID}
      studies={STUDIES}
      header={
        <SectionHeader
          id={HEADING_ID}
          className="px-6 lg:px-8"
          title="What teams have built with Inngest to handle cron & scheduled jobs"
        />
      }
      footerCta={{
        label: "See all customers →",
        href: "/customers?ref=scheduled-jobs",
      }}
    />
  );
}
