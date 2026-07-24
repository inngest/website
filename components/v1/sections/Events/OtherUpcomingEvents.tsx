import EventCardLarge from "@/components/v1/sections/Events/EventCardLarge";
import { OTHER_EVENTS } from "@/components/v1/sections/Events/data";

// "Other upcoming events" — stacks the shared EventCardLarge (same card
// as the Event Schedule page) with 40px gaps.
export default function OtherUpcomingEvents() {
  return (
    <section
      aria-labelledby="event-other-heading"
      className="relative mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-8 text-v1-frost sm:px-9 lg:gap-10 lg:px-[70px]"
    >
      {/* Heading/Md — 32/40 Whyte, capsize-trimmed. */}
      <h2
        id="event-other-heading"
        className="text-v1-heading-md-cap text-white"
      >
        Other upcoming events
      </h2>
      <ul className="flex list-none flex-col gap-8 pl-0 lg:gap-10">
        {OTHER_EVENTS.map((ev) => (
          <li key={ev.id} className="list-none">
            <EventCardLarge ev={ev} />
          </li>
        ))}
      </ul>
    </section>
  );
}
