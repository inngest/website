import EventCardLarge from "@/components/v1/sections/Events/EventCardLarge";
import { UPCOMING } from "@/components/v1/sections/Events/data";

export default function UpcomingEvents() {
  return (
    <section
      aria-labelledby="upcoming-events-heading"
      className="relative mx-auto w-full max-w-[1280px] px-6 pb-[60px] pt-10 text-v1-frost sm:px-9 sm:pb-20 sm:pt-[50px] lg:px-8 lg:pb-[100px] lg:pt-[60px]"
    >
      <h2
        id="upcoming-events-heading"
        // Heading/Md — Whyte regular 32, line-height 40, tracking
        // -0.01em (= -0.32px @ 32px). Capsize-trimmed via text-box-*.
        // `leading-none` so the line box collapses to the font-size box
        // in browsers that don't yet support `text-box-trim` (matches
        // the trimmed look without relying solely on the new property).
        className="mb-8 text-v1-heading-md-cap text-white"
      >
        Upcoming Events
      </h2>
      <ul className="flex list-none flex-col gap-6 pl-0">
        {UPCOMING.map((ev) => (
          <li key={ev.id} className="list-none">
            <EventCardLarge ev={ev} />
          </li>
        ))}
      </ul>
    </section>
  );
}
