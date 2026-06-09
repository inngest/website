"use client";

import ButtonLink from "@/components/v1/ButtonLink";
import CaseStudiesCarousel, {
  type CaseStudyItem,
} from "@/components/v1/sections/shared/CaseStudiesCarousel";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";

const HEADING_ID = "bg-jobs-case-studies-heading";

const CTA_LABEL = "Read the full case study";

const STUDIES: CaseStudyItem[] = [
  {
    id: "soundcloud",
    title: "Post-signup & onboarding",
    body: "The code is just business logic. You read it and immediately know what steps will execute.",
    logo: { src: "/assets/v1/logos/soundcloud.svg", alt: "SoundCloud", width: 202, height: 24 },
    cta: { label: CTA_LABEL, href: "/customers/soundcloud?ref=background-jobs" },
  },
  {
    id: "otto",
    title: "AI & ML Workloads",
    body: "Built-in multi-tenant concurrency and flow control let us scale without the complexity of other tools.",
    logo: { src: "/assets/v1/logos/otto.svg", alt: "Otto", width: 72, height: 24 },
    cta: { label: CTA_LABEL, href: "/customers/otto?ref=background-jobs" },
  },
  {
    id: "resend",
    title: "Notifications & Communications",
    body: "The DX and visibility with Inngest is really incredible. Faster to develop locally than with our previous queue.",
    logo: { src: "/assets/v1/logos/resend.svg", alt: "Resend", width: 96, height: 24 },
    cta: { label: CTA_LABEL, href: "/customers/resend?ref=background-jobs" },
  },
  {
    id: "outtake",
    title: "Data processing & sync",
    body: "Import/export pipelines, third-party sync, file processing, and report generation — all reliable by default.",
    logo: { src: "/assets/v1/logos/outtake.svg", alt: "Outtake", width: 136, height: 24 },
    cta: { label: CTA_LABEL, href: "/customers/outtake?ref=background-jobs" },
  },
  {
    id: "replit",
    title: "Billing & payments",
    body: "Stripe webhooks, invoice generation, subscription lifecycle events, and reconciliation jobs.",
    logo: { src: "/assets/v1/logos/replit.svg", alt: "Replit", width: 112, height: 28 },
    cta: { label: CTA_LABEL, href: "/customers/replit?ref=background-jobs" },
  },
];

export default function CaseStudies() {
  return (
    <CaseStudiesCarousel
      ariaLabelledBy={HEADING_ID}
      studies={STUDIES}
      header={
        <SectionHeader
          id={HEADING_ID}
          className="px-6 lg:px-8"
          title="What teams have built with Inngest Background Jobs"
          actions={
            <ButtonLink href="/customers?ref=background-jobs" variant="primary">
              See all customers →
            </ButtonLink>
          }
        />
      }
    />
  );
}
