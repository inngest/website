import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import Events from "@/components/v1/pages/Events";
import eventsDotsData from "@/public/assets/v1/events-hero/dots.json";

// The events hero backdrop renders the "ParticleA01" swirl on a canvas
// (EventsHeroDotsCanvas). Inline the manifest in the SSR HTML so the
// pattern paints on the first frame instead of after a fetch.
const EVENTS_DOTS_JSON = JSON.stringify(eventsDotsData);

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
