"use client";

import { useState } from "react";

import Button from "@/components/v1/Button";
import EventRegisterModal from "@/components/v1/sections/Events/EventRegisterModal";
import { SAMPLE_EVENT } from "@/components/v1/sections/Events/data";

// Event detail hero — full-bleed 50/50 split: event detail on the left,
// cover image bleeding to the viewport's right edge.
export default function EventDetailHero() {
  const [registerOpen, setRegisterOpen] = useState(false);
  return (
    <section
      aria-labelledby="event-hero-heading"
      className="relative w-full overflow-hidden text-v1-frost"
    >
      {/* Right cover image — full-bleed to the viewport's right edge on
          desktop. `w-1/2 right-0` starts at the viewport centre, which
          equals the centred container's midpoint (i.e. exactly where the
          left text column ends), so the split stays seamless while the
          image fills out to the edge. Mirrors SplitHero's absolute panel.
          `top-[80px]` (not inset-y-0) starts the image below the fixed
          nav rather than bleeding up behind it. */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 right-0 top-[80px] hidden w-1/2 overflow-hidden bg-v1-surfaceElevated lg:block"
      >
        <EventCover />
      </div>

      <div className="relative mx-auto grid w-full max-w-[1440px] grid-cols-1 lg:grid-cols-2">
        {/* Left — event detail. Gaps: 51px between blocks, 16px within
            each block. Top padding clears the 80px fixed header and then
            adds 72px, so the title sits 72px below the nav. */}
        <div className="flex flex-col px-6 pb-16 pt-[104px] sm:px-9 lg:pb-[72px] lg:pl-[70px] lg:pr-8 lg:pt-[152px]">
          <div className="flex w-full flex-col gap-10 lg:gap-[51px] lg:pr-8">
            {/* Title + date / time. Cap-height text-box trim (capsize)
                on every text element so the flex gaps below land at
                their true 16px / 51px values rather than carrying extra
                line-height leading. */}
            <div className="flex flex-col gap-4">
              {/* Token bakes in family/weight/tracking + em-based capsize
                  margins. Overriding line-height to the unitless 70/58
                  ratio keeps the capsize exact while font-size scales
                  down for mobile (margins are em, so they track size). */}
              <h1
                id="event-hero-heading"
                className="text-v1-heading-lg text-[40px] leading-[1.207] sm:text-[48px] lg:text-[58px]"
              >
                {SAMPLE_EVENT.title}
              </h1>
              <div className="flex flex-wrap gap-x-4 gap-y-1 font-v1Body text-[14px] leading-[20px]">
                <span className="v1-trim">
                  {SAMPLE_EVENT.date}
                </span>
                <span className="v1-trim">
                  {SAMPLE_EVENT.time}
                </span>
              </div>
            </div>

            {/* Location */}
            <div className="flex flex-col gap-4">
              <p className="text-v1-label-md uppercase">Location</p>
              <p className="text-v1-body-sm">{SAMPLE_EVENT.location}</p>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-4">
              <p className="text-v1-label-md uppercase">Description</p>
              <p className="text-v1-body-sm">{SAMPLE_EVENT.description}</p>
            </div>

            <Button
              type="button"
              onClick={() => setRegisterOpen(true)}
              variant="accent"
              className="self-start"
            >
              Register for event →
            </Button>
          </div>
        </div>

        {/* Mobile cover image (stacked under the detail). Desktop uses
            the full-bleed absolute panel above. */}
        <div className="relative min-h-[300px] overflow-hidden bg-v1-surfaceElevated lg:hidden">
          <EventCover />
        </div>
      </div>

      <EventRegisterModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        eventTitle={SAMPLE_EVENT.title}
      />
    </section>
  );
}

/** Event cover image — the real image when present, otherwise the
 *  shared events placeholder (same checkerboard-at-low-opacity treatment
 *  as EventCardLarge). Rendered into a `relative` parent that owns the
 *  sizing and the muted surface background. */
function EventCover() {
  return SAMPLE_EVENT.image ? (
    <img
      src={SAMPLE_EVENT.image}
      alt=""
      className="absolute inset-0 h-full w-full object-cover"
    />
  ) : (
    <div
      aria-hidden="true"
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage: "url(/assets/v1/events/event-placeholder.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}
