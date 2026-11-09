"use client";

import ButtonLink from "@/components/v1/ButtonLink";
import PageShell from "@/components/v1/PageShell";
import StartBuilding from "@/components/v1/sections/Home/StartBuilding";
import AdventCalendar from "@/components/v1/sections/TwelveDays/AdventCalendar";
import BuildathonMarquee from "@/components/v1/sections/TwelveDays/BuildathonMarquee";
import BuildathonTeaser from "@/components/v1/sections/TwelveDays/BuildathonTeaser";
import { CLOSING } from "@/components/v1/sections/TwelveDays/data";
import Finale from "@/components/v1/sections/TwelveDays/Finale";
import Hero from "@/components/v1/sections/TwelveDays/Hero";
import Machine from "@/components/v1/sections/TwelveDays/Machine";
import PreviewClock from "@/components/v1/sections/TwelveDays/PreviewClock";
import HowItOpens from "@/components/v1/sections/TwelveDays/HowItOpens";
import { useCalendarClock } from "@/components/v1/sections/TwelveDays/useCalendarClock";

/**
 * inngest.com/12-days-of-workflows — the Inngest × CodeTV holiday
 * campaign, in the Build for the Lonng Run brand.
 *
 * Hero → the advent calendar → the build-a-thon → the live CodeTV
 * finale → the playable machine → how the doors open (the cron job) →
 * closing quick starts.
 *
 * One clock for the whole page, so the hero countdown, the doors and
 * the machine all flip at the same instant at midnight.
 *
 * There's no sign-in. The email sign-up in the calendar is how people
 * hear about each new door.
 *
 * `employeePreview` is the password-gated copy at
 * /12-days-of-workflows/team: time travel and the day switcher work
 * there even on production, so the team can walk every lesson early.
 */
export default function TwelveDaysOfWorkflows({
  employeePreview = false,
}: {
  employeePreview?: boolean;
}) {
  const now = useCalendarClock({ allowTimeTravel: employeePreview });

  return (
    <PageShell>
      <div className="overflow-x-clip">
        <Hero now={now} />
        <BuildathonMarquee />
        <AdventCalendar now={now} />
        <BuildathonTeaser />
        <Finale />
        <Machine now={now} />
        <HowItOpens />
        <StartBuilding
          refTag="12-days-of-workflows-start-building"
          title={CLOSING.title}
          body={CLOSING.body}
          titleClassName="normal-case"
          className="!py-16 sm:!py-20 lg:!py-24"
          actions={
            <ButtonLink variant="primary" href={CLOSING.cta.href}>
              {CLOSING.cta.label}
            </ButtonLink>
          }
        />
      </div>
      <PreviewClock always={employeePreview} />
    </PageShell>
  );
}
