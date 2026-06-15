"use client";

// Page-top decoration for the Events page.
// The "ParticleA01" swirl, scaled + masked at 15% opacity so its arcs
// frame the page corners and fade out before the "Upcoming Events" band.
// Rendered via the live StippleCanvas (see EventsHeroDotsCanvas) so the
// dots stay crisp at any DPI and match the other v1 hero canvases.
// Passed to PageShell's `backdrop` slot so it sits between grain and
// content.
//
// This element owns the framing box: the swirl begins just below the
// fixed navigation and runs into the hero, faded out at the bottom with
// a mask-image gradient. The top offset clears the header so the
// pattern starts beneath the nav rather than bleeding up behind it —
// 56px for the mobile black band, 76px for the non-compact desktop bar
// (52px pill + 12px×2 py-3). Anchored "top" in the canvas, so the
// offset translates the pattern down. Dot opacity (15%) is applied
// here, not in the canvas, so the field reads as a faint texture
// rather than solid dots.
import EventsHeroDotsCanvas from "@/components/v1/sections/Events/EventsHeroDotsCanvas";

export default function Backdrop({
  // When true the field starts at the very top of the page so it runs
  // behind the fixed navigation, rather than beginning beneath it.
  behindNav = false,
}: {
  behindNav?: boolean;
} = {}) {
  return (
    <div
      aria-hidden="true"
      className={
        behindNav
          ? "pointer-events-none absolute left-0 top-0 h-[760px] w-full select-none opacity-50 [mask-image:linear-gradient(to_bottom,black_50%,transparent_80%)]"
          : "pointer-events-none absolute left-0 top-[56px] h-[760px] w-full select-none opacity-50 [mask-image:linear-gradient(to_bottom,black_50%,transparent_80%)] md:top-[76px]"
      }
    >
      <EventsHeroDotsCanvas className="block h-full w-full" />
    </div>
  );
}
