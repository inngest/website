"use client";

import ButtonLink from "@/components/v1/ButtonLink";
import PageShell from "@/components/v1/PageShell";
import StartBuilding from "@/components/v1/sections/Home/StartBuilding";
import AdventCalendar from "@/components/v1/sections/TwelveDays/AdventCalendar";
import { CLOSING } from "@/components/v1/sections/TwelveDays/data";
import Finale from "@/components/v1/sections/TwelveDays/Finale";
import Hero from "@/components/v1/sections/TwelveDays/Hero";
import Machine from "@/components/v1/sections/TwelveDays/Machine";
import HowItOpens from "@/components/v1/sections/TwelveDays/HowItOpens";
import Prizes from "@/components/v1/sections/TwelveDays/Prizes";
import SongSoFar from "@/components/v1/sections/TwelveDays/SongSoFar";
import {
  useCalendarClock,
  useLessonProgress,
} from "@/components/v1/sections/TwelveDays/useCalendarClock";

/**
 * inngest.com/12-days-of-workflows — the Inngest × CodeTV holiday
 * campaign, in the Build for the Lonng Run brand.
 *
 * Hero → the advent calendar → the playable machine → the song so far
 * → how the doors open (the cron job) → finish-the-run prizes → the
 * live CodeTV finale → closing quick starts.
 *
 * One clock for the whole page, so the hero countdown, the doors and
 * the song all flip at the same instant at midnight.
 */
export default function TwelveDaysOfWorkflows() {
  const now = useCalendarClock();
  const { done, toggle } = useLessonProgress();

  return (
    <PageShell>
      <div className="overflow-x-clip">
        <Hero now={now} />
        <AdventCalendar now={now} done={done} onToggleDone={toggle} />
        <Machine now={now} />
        <SongSoFar now={now} />
        <HowItOpens />
        <Prizes done={done} />
        <Finale />
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
    </PageShell>
  );
}
