import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import Events from "@/components/v1/pages/Events";
import eventsDotsData from "@/public/assets/v1/events-hero/dots.json";

// The events hero backdrop renders the "ParticleA01" swirl on a canvas
// (EventsHeroDotsCanvas). Inline the manifest in the SSR HTML so the
// pattern paints on the first frame instead of after a fetch.
const EVENTS_DOTS_JSON = JSON.stringify(eventsDotsData);

// "Upcoming Events" is server-rendered, so its past/upcoming split gets
// frozen into the prerendered HTML at build time — an event that ended
// after the last deploy kept showing a live Register button. Regenerate
// at most hourly so the section tracks the clock rather than the deploy
// cadence. ("All Events" is a client component and self-corrects on
// hydration, which is why only this section drifted.)
export const revalidate = 3600;

export const metadata: Metadata = generateMetadata({
  title: "Events - Conferences, Meetups & Talks",
  description:
    "See where the Inngest team is speaking, demoing, and connecting with developers. Find upcoming conferences, meetups, and virtual events.",
});

export default function Page() {
  return (
    <>
      <script
        id="events-dots-data"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: EVENTS_DOTS_JSON }}
      />
      <Events />
    </>
  );
}
