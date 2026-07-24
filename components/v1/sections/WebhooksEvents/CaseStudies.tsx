"use client";

import ButtonLink from "@/components/v1/ButtonLink";
import CaseStudiesCarousel, {
  type CaseStudyItem,
} from "@/components/v1/sections/shared/CaseStudiesCarousel";
import InlineCode from "@/components/v1/sections/shared/InlineCode";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";

const HEADING_ID = "we-case-studies-heading";

const STUDIES: CaseStudyItem[] = [
  {
    id: "stripe-lifecycle",
    title: "Stripe payment lifecycle",
    body: (
      <>
        React to <InlineCode>invoice.payment_failed</InlineCode>,{" "}
        <InlineCode>checkout.session.completed</InlineCode>, and subscription
        events with step-level retries. Downgrade a user, send an email, and
        notify Slack—all from one event, each step independent.
      </>
    ),
    logo: { src: "/assets/v1/logos/resend.svg", alt: "Resend", width: 96, height: 24 },
    cta: { label: "See the reliable webhook patterns", href: "/patterns/build-reliable-webhooks" },
  },
  {
    id: "clerk-auth",
    title: "Clerk auth events",
    body: (
      <>
        On <InlineCode>clerk/user.created</InlineCode>, fan-out to sync the
        user to your database, start a Stripe trial, and send a welcome email
        — all in parallel. If the Stripe call fails, the welcome email
        isn&apos;t blocked. One click setup via the Clerk dashboard.
      </>
    ),
    logo: { src: "/assets/v1/webhooks-events/integrations/Clerk.png", alt: "Clerk", width: 110, height: 32 },
    cta: { label: "Read the Clerk webhook guide", href: "/docs/guides/clerk-webhook-events" },
  },
  {
    id: "resend-email",
    title: "Resend email events",
    body: (
      <>
        When <InlineCode>email.clicked</InlineCode>, send a follow-up with pro
        tips. When <InlineCode>email.bounced</InlineCode>, flag the address in
        your database. Build behaviour-driven email campaigns that react to
        what users actually do, not just timers.
      </>
    ),
    logo: { src: "/assets/v1/logos/resend.svg", alt: "Resend", width: 96, height: 24 },
    cta: { label: "Read the Resend webhook guide", href: "/docs/guides/resend-webhook-events" },
  },
  {
    id: "cart-abandonment",
    title: "Cart abandonment",
    body: (
      <>
        On <InlineCode>cart/product.added</InlineCode>, pause the function and
        wait up to 24 hours for a <InlineCode>cart/purchased</InlineCode>{" "}
        event. If it never arrives, send the reminder. If the user checks out,
        the function exits cleanly — no reminder sent, no polling loop, no
        state table.
      </>
    ),
    logo: { src: "/assets/v1/logos/outtake.svg", alt: "Outtake", width: 136, height: 24 },
    cta: { label: "Read the event coordination pattern", href: "/patterns/event-coordination-for-lost-customers" },
  },
  {
    id: "internal-events",
    title: "Your own internal events",
    body: (
      <>
        Call <InlineCode>inngest.send()</InlineCode> from anywhere in your
        codebase — an API route, a mutation, a database trigger via Sequin.
        One event can trigger multiple functions across different services,
        with the same reliability guarantees.
      </>
    ),
    logo: { src: "/assets/v1/logos/replit.svg", alt: "Replit", width: 112, height: 28 },
    cta: { label: "Read the events & triggers docs", href: "/docs/features/events-triggers" },
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
          title="What teams have built with Inngest to handle webhooks & events"
          actions={
            <ButtonLink href="/customers?ref=webhooks-events" variant="primary">
              See all customers →
            </ButtonLink>
          }
        />
      }
    />
  );
}
