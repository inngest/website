import Link from "next/link";
import Chip from "@/components/v1/sections/shared/Chip";
import SpotlightFrame from "@/components/v1/sections/Events/SpotlightFrame";
import RegisterCue from "@/components/v1/sections/Events/RegisterCue";
import type { EventItem } from "@/components/v1/sections/Events/data";

// The grid card used in the All Events section. Hover matches the home
// "Get Started" cards: cursor spotlight + 4px lift + soft shadow + a
// subtle 3D tilt (these grid cards are small enough for tilt to read
// well).
export default function EventCard({ ev }: { ev: EventItem }) {
  return (
    <Link href={ev.href} className="block h-full rounded-lg">
      <SpotlightFrame
        tilt
        className="h-full"
        innerClassName="flex h-full flex-col"
      >
      <div
        aria-hidden="true"
        // Image area is 204px tall. The placeholder lives here at 10%
        // opacity.
        className="relative h-[204px] w-full shrink-0 overflow-hidden"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url(/assets/v1/events/event-placeholder.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        {ev.recording && (
          <Chip
            variant="solid"
            size="sm"
            className="absolute left-4 top-4 font-normal"
          >
            Recording
          </Chip>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-6 p-5">
        <div className="flex flex-col gap-2">
          {/* Heading/Sm token — 26/31.2 Whyte, -0.01em, margin-based capsize. */}
          <h3 className="text-v1-heading-sm text-white">{ev.title}</h3>
          {/* body-xs token — 14/20 CircularXX, untrimmed (body), smoke @ 80%. */}
          <p className="text-v1-body-xs text-[#cfcfcf]/80">{ev.date}</p>
        </div>
        <div className="flex flex-col gap-2">
          {/* Body/Small token — 16/24 CircularXX capsize, white @ 80%,
              single-line ellipsis. */}
          <p className="text-v1-body-sm truncate text-white/80">{ev.excerpt}</p>
          <div className="py-1">
            <RegisterCue />
          </div>
        </div>
      </div>
      </SpotlightFrame>
    </Link>
  );
}
