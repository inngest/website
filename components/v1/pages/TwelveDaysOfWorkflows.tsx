"use client";

import PageShell from "@/components/v1/PageShell";
import AdventCalendar from "@/components/v1/sections/TwelveDays/AdventCalendar";
import BuildathonMarquee from "@/components/v1/sections/TwelveDays/BuildathonMarquee";
import BuildathonTeaser from "@/components/v1/sections/TwelveDays/BuildathonTeaser";
import Finale from "@/components/v1/sections/TwelveDays/Finale";
import Hero from "@/components/v1/sections/TwelveDays/Hero";
import PreviewClock from "@/components/v1/sections/TwelveDays/PreviewClock";
import RaffleDialog from "@/components/v1/sections/TwelveDays/RaffleDialog";
import RaffleSection from "@/components/v1/sections/TwelveDays/RaffleSection";
import { useCalendarClock } from "@/components/v1/sections/TwelveDays/useCalendarClock";

/**
 * inngest.com/12-days-of-workflows — the Inngest × CodeTV holiday
 * campaign, in the Build for the Lonng Run brand.
 *
 * Hero → countdown ticker → the advent calendar → the build-a-thon →
 * the live CodeTV finale → the daily raffle. (The playable machine,
 * Machine.tsx, is off the page after Lauren's review.)
 *
 * Four things to do, each with one home: join (the one form in the
 * calendar, which is also the raffle entry), open today's door, submit
 * to the build-a-thon (BuildathonTeaser), and get started with Inngest
 * (NewToInngest, under the form).
 *
 * One clock for the whole page, so the ticker and the doors flip at
 * the same instant at midnight.
 *
 * There's no sign-in. The sign-up form in the calendar is how people
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
        <Hero />
        <BuildathonMarquee now={now} />
        <AdventCalendar now={now} />
        <BuildathonTeaser />
        <Finale />
        {/* Lower priority than the lessons and the build-a-thon. The
            pop-up still opens from today's door. */}
        <RaffleSection now={now} />
      </div>
      <PreviewClock always={employeePreview} />
      <RaffleDialog />
    </PageShell>
  );
}
