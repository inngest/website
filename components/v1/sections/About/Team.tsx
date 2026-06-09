"use client";

import {
  CURSOR_TILT_SEED,
  onCursorTiltLeave,
  onCursorTiltMove,
} from "@/utils/v1/cursorFx";
import {
  GRADIENT_DIVIDER_FILL,
  GRADIENT_RING_FILL_HOVER,
  GRADIENT_RING_MASK,
} from "@/utils/v1/gradientRing";
import GradientFrame from "@/components/v1/sections/shared/GradientFrame";
import TeamDotSphere from "./TeamDotSphere";
import { TEAM, type TeamMember } from "./data";

export default function Team() {
  return (
    <section
      aria-labelledby="about-team-heading"
      // 1440-wide frame, 70 px gutters.
      className="relative mx-auto w-full max-w-[1440px] px-6 pb-20 pt-8 text-v1-frost sm:px-9 sm:pb-[120px] lg:px-[70px] lg:pb-[140px]"
    >
      {/* Section header — Heading/Md: ABC Whyte regular, 32 px size,
          40 px line-height, -0.01em tracking, capsize-trimmed. */}
      <h2
        id="about-team-heading"
        className="text-v1-heading-md-cap text-v1-frost"
      >
        Our Team
      </h2>

      {/* Cards grid — column count scales with viewport so cards never
          balloon on wide displays: 2-up on mobile, 3-up from lg (the
          1440 frame), 4-up from xl where 3 × 407 px cards read
          oversized. ~40 px gaps from sm. lg:mt-[76px] matches the
          frame: heading sits 32 px from section top, occupies the 22 px
          cap height (capsize-trimmed), then the grid starts at y=130
          within the team frame → 130 − 32 − 22 = 76 px. */}
      <ul className="mt-10 grid list-none grid-cols-2 gap-x-4 gap-y-6 pl-0 sm:mt-12 sm:gap-x-10 sm:gap-y-10 lg:mt-[76px] lg:grid-cols-3 xl:grid-cols-4">
        {TEAM.map((m) => (
          <li key={m.name} className="list-none">
            <TeamCard member={m} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function TeamCard({ member }: { member: TeamMember }) {
  const hasAvatar = Boolean(member.avatar);
  return (
    // Card frame — 407 × 503 (~0.81 aspect). The WHOLE card
    // (sphere, photo, frame, meta, hover overlays) tilts together as
    // a single rigid unit on cursor move. `CURSOR_TILT_SEED` writes
    // four vars + applies the perspective tilt transform; the tilt
    // handler updates them on pointer move and `onCursorTiltLeave`
    // resets to neutral on leave. Spotlight + ring glow inside the
    // same wrapper key off `group/card`.
    //   --mx / --my → spotlight + ring-glow position
    //   --rx / --ry → ±2° / ±1.5° card tilt
    <div
      data-team-card
      className="group/card relative aspect-[407/503] w-full motion-safe:transition-transform motion-safe:duration-[400ms] motion-safe:ease-v1-out"
      onPointerMove={onCursorTiltMove}
      onPointerLeave={onCursorTiltLeave}
      style={CURSOR_TILT_SEED}
    >
      <GradientFrame
        variant="black"
        className="absolute inset-0 rounded-md"
        innerClassName="flex h-full w-full flex-col"
      >
        {/* Photo area — top ~80.5 % of the card (405 / 503). Hosts the
            per-card dot-sphere graphic and the optional cutout photo.
            Cutout PNGs are transparent so the sphere shows through the
            empty regions; `grayscale` on the img desaturates the
            subject. */}
        <div
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: "407 / 405" }}
        >
          {/* Empty-state charcoal wash — Background-Gradient-Charcoal.
              Painted BENEATH the dot-sphere so the dots stay crisp on
              top; `mix-blend-mode:
              luminosity` keeps it a neutral grey over the frame's black
              without tinting. Only the avatar-less (logomark) cards. */}
          {!hasAvatar && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 mix-blend-luminosity"
              style={{
                background:
                  "linear-gradient(295deg, rgba(2, 2, 2, 0.00) 1.46%, #212121 50.43%)",
              }}
            />
          )}
          {/* Dot-sphere background — animated canvas lattice with a
              gravity-well crater. Idle = static; on card hover the
              crater breathes (footer-style lissajous) and displaced
              dots tint salmon. Clipped by this box's `overflow-hidden`
              so dots stay inside the card. */}
          <TeamDotSphere className="pointer-events-none absolute inset-0 h-full w-full select-none" />
          {hasAvatar ? (
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={member.avatar}
                alt={member.name}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full select-none object-cover grayscale"
              />
            </div>
          ) : (
            <TeamLogomark />
          )}
        </div>
        {/* 1 px gradient divider between photo area and meta strip —
            shares stops with the surrounding GradientFrame ring via
            the `GRADIENT_DIVIDER_FILL` constant in `utils/v1/
            gradientRing.ts`, just oriented left → right. */}
        <div
          aria-hidden="true"
          className="h-px w-full shrink-0"
          style={{ background: GRADIENT_DIVIDER_FILL }}
        />
        <CardMeta member={member} />
      </GradientFrame>

      {/* Cursor-tracking spotlight — radial gradient anchored to the
          shared --mx / --my vars. Clipped to the card's rounded
          corners via `rounded-md overflow-hidden`. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-md opacity-0 motion-safe:transition-opacity motion-safe:duration-300 motion-safe:ease-v1-out group-hover/card:opacity-100"
        style={{
          background:
            "radial-gradient(360px circle at var(--mx) var(--my), rgba(255,255,255,0.10), rgba(255,255,255,0) 60%)",
        }}
      />

      {/* Ring glow — mirrors the GradientFrame ring (same
          mask-composite hollow-ring trick) but with a brighter
          gradient. Fades in on hover so the card edge "lights up"
          alongside the spotlight. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-md p-[1px] opacity-0 motion-safe:transition-opacity motion-safe:duration-300 motion-safe:ease-v1-out group-hover/card:opacity-100"
        style={{
          background: GRADIENT_RING_FILL_HOVER,
          ...GRADIENT_RING_MASK,
        }}
      />
    </div>
  );
}

// Empty-state mark for members without a headshot — centres the
// Inngest logomark (∞ glyph) in the photo area at ~47 % of its width
// over the charcoal gradient wash painted beneath the dot-sphere (see
// the photo-area layer stack above).
// Logomark paths mirror the `<g>` in `components/v1/Logo.tsx`
// (viewBox 29 × 17); `currentColor` tints from the wrapper's frost
// text colour. Decorative, so the card stays a single hover target.
function TeamLogomark() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 w-[47%] -translate-x-1/2 -translate-y-1/2 select-none text-v1-frost"
    >
      <svg
        viewBox="0 0 29 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block h-auto w-full"
      >
        <path
          d="M0.300312 13.6542C-0.399794 11.4611 0.11671 9.62711 1.92851 7.88391C1.93053 7.88189 9.08392 1.11488 9.08392 1.11488C10.2158 0.025382 11.8763 -0.264143 13.3138 0.376443C15.5554 1.38524 15.6371 3.58744 15.5997 4.3047C15.5937 4.4308 15.5947 5.45069 14.6031 5.59495C13.9151 5.69482 13.2563 5.25902 13.2634 4.37027C13.2735 2.95997 12.8427 2.75216 12.3686 2.47777C12.1486 2.37991 11.3356 2.13276 10.6909 2.77133C10.6879 2.77435 3.53351 9.54136 3.53351 9.54136C2.36835 10.6642 2.08084 11.6215 2.50655 12.9541C2.70024 13.5604 2.3633 14.2081 1.75399 14.4007C1.02564 14.6297 0.456675 14.1435 0.300312 13.6532V13.6542Z"
          fill="currentColor"
        />
        <path
          d="M15.539 16.6567C12.8697 15.4664 13.2732 12.5842 13.2732 12.5842C13.3428 11.9406 13.7917 11.4322 14.4303 11.4322C15.0689 11.4322 15.544 11.8549 15.5884 12.5842C15.5884 12.5842 15.5309 14.163 16.4842 14.5544C16.7041 14.6523 17.4769 14.9206 18.1618 14.2608L25.2476 7.49182C26.4158 6.36802 26.7165 5.38343 26.2817 4.09621C26.0779 3.49295 26.4047 2.84026 27.01 2.63749C27.6163 2.43472 28.27 2.81907 28.4768 3.3618C29.2021 5.50852 28.6715 7.40204 26.8547 9.15028L19.7689 15.9183C19.0385 16.6224 17.4022 17.495 15.539 16.6557V16.6567Z"
          fill="currentColor"
        />
        <path
          d="M3.3943 16.6536C2.80012 16.4186 2.50959 15.7498 2.74565 15.1576C2.98171 14.5664 3.65457 14.2779 4.24876 14.512C5.18391 14.8812 6.2714 14.6623 7.01992 13.9531L20.1696 1.49143C21.1582 0.555266 23.1375 -0.546341 25.3891 0.306092C25.943 0.537107 26.2587 1.2241 26.0136 1.81223C25.7684 2.39935 25.0936 2.58295 24.5004 2.43364C23.3211 2.16026 22.3224 2.63238 21.7665 3.15998L8.61685 15.6216C7.67262 16.5175 5.71555 17.5525 3.3943 16.6536H3.3943Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}

function CardMeta({ member }: { member: TeamMember }) {
  // Name text at (x=32, y=31), title at (x=32, y=56), inside the 98-px
  // bottom strip — so 32 left/right pad, 31 top pad, 25 px gap from
  // baseline to title (≈8 px gap with name leading). Mobile tightens
  // padding + type because the 2-col mobile grid makes the design
  // sizing oversized for narrow cards; sm+ restores the full values.
  return (
    <div className="flex flex-col gap-1 p-4 sm:gap-2 sm:px-8 sm:py-6">
      <p className="font-v1Body text-[13px] font-semibold leading-[1.3] tracking-[-0.01em] text-v1-frost sm:text-[15px]">
        {member.name}
      </p>
      <p className="font-v1Body text-[11px] leading-[1.3] text-v1-frost/60 sm:text-[13px]">
        {member.title}
      </p>
    </div>
  );
}
