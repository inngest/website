import SpotlightFrame from "@/components/v1/sections/Events/SpotlightFrame";
import { SPEAKERS } from "@/components/v1/sections/Events/data";

// "Guest Speakers" — 3-up grid of GradientFrame cards, each with a
// landscape b&w photo, name, role and bio. Passive cards
// (not links) so they get the spotlight + lift + shadow hover, but no
// 3D tilt (tilt would imply clickability).
export default function GuestSpeakers() {
  return (
    <section
      aria-labelledby="event-speakers-heading"
      className="relative mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-8 text-v1-frost sm:px-9 lg:gap-10 lg:px-[70px]"
    >
      {/* Heading/Md — 32/40 Whyte, capsize-trimmed (matches UpcomingEvents). */}
      <h2
        id="event-speakers-heading"
        className="text-v1-heading-md-cap text-white"
      >
        Guest Speakers
      </h2>
      <ul className="grid list-none grid-cols-1 gap-6 pl-0 sm:grid-cols-2 lg:grid-cols-3">
        {SPEAKERS.map((s, i) => (
          <li key={`${s.name}-${i}`} className="list-none">
            <SpotlightFrame
              className="h-full rounded-[10px]"
              innerClassName="flex h-full flex-col"
            >
              {/* Image: 417/300 landscape, mix-blend-luminosity for the
                  desaturated b&w look. Dark-grey backdrop sits under the
                  image — the blend reference + load-state fallback. */}
              <div className="aspect-[417/300] w-full overflow-hidden bg-v1-surfaceElevated">
                <img
                  src={s.avatar}
                  alt={s.name}
                  loading="lazy"
                  className="h-full w-full object-cover mix-blend-luminosity"
                />
              </div>
              {/* gap-24, px-24 py-32. */}
              <div className="flex flex-col gap-6 px-6 py-8">
                <p className="text-v1-heading-sm">{s.name}</p>
                <p className="text-v1-body-sm">{s.role}</p>
                <p className="text-v1-body-sm">{s.bio}</p>
              </div>
            </SpotlightFrame>
          </li>
        ))}
      </ul>
    </section>
  );
}
