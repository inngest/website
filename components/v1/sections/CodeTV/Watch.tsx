import Image from "next/image";
import Chip from "@/components/v1/sections/shared/Chip";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import { V1_HEADER_CONTENT_MT } from "@/components/v1/sections/shared/sectionShell";
import {
  CHALLENGE_STATUS_LEAD,
  CHALLENGE_STATUS_REST,
  EPISODE_FACTS,
  EPISODE_YOUTUBE_ID,
  HERO_IMAGE,
} from "@/components/v1/sections/CodeTV/data";

export default function Watch() {
  return (
    <Section
      id="episode"
      aria-labelledby="codetv-watch-heading"
      className="scroll-mt-28"
      containerClassName="flex flex-col"
    >
      <div className="flex flex-col items-start gap-6">
        <Chip variant="solid" size="sm" className="font-normal">
          YouTube · Coming soon
        </Chip>
        <SectionHeader
          id="codetv-watch-heading"
          title="Watch the episode."
          body="Four hours. Three teams. Two days. And one glimpse into the potential hellscape that might await us if the agents take over (you gotta watch to understand)."
          bodyClassName="max-w-[640px]"
        />
      </div>

      <div className={V1_HEADER_CONTENT_MT}>
        <EpisodePlayer />
      </div>

      <aside
        aria-label="Episode details"
        className="mt-4 w-full overflow-hidden rounded-lg border border-v1-subtle bg-v1-surfaceElevated"
      >
        <dl>
          <div className="grid grid-cols-3 divide-x divide-v1-subtle">
            {EPISODE_FACTS.filter((fact) => !fact.live).map((fact) => (
              <div key={fact.label} className="flex flex-col gap-2 px-5 py-4">
                <dt className="font-v1Label text-[11px] uppercase tracking-[0.08em] text-v1-frost/50">
                  {fact.label}
                </dt>
                <dd className="font-v1Label text-[12px] uppercase tracking-[0.06em] text-v1-frost">
                  {fact.value}
                </dd>
              </div>
            ))}
          </div>
          {EPISODE_FACTS.filter((fact) => fact.live).map((fact) => (
            <div
              key={fact.label}
              className="flex flex-col gap-2 border-t border-v1-subtle px-5 py-4"
            >
              <dt className="font-v1Label text-[11px] uppercase tracking-[0.08em] text-v1-frost/50">
                {fact.label}
              </dt>
              <dd className="flex flex-wrap items-center gap-x-2 gap-y-1 font-v1Label text-[12px] uppercase tracking-[0.06em] text-v1-accent-green">
                {CHALLENGE_STATUS_LEAD}
                <span
                  aria-hidden="true"
                  className="v1-codetv-pulse size-1.5 shrink-0 rounded-full bg-v1-accent-green"
                />
                {CHALLENGE_STATUS_REST}
              </dd>
            </div>
          ))}
        </dl>
      </aside>
    </Section>
  );
}

function EpisodePlayer() {
  if (EPISODE_YOUTUBE_ID) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-v1-subtle bg-v1-jetBlack">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${EPISODE_YOUTUBE_ID}?rel=0`}
          title="CodeTV Web Dev Challenge — Season 3, Episode 6"
          allow="encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div
      className="relative aspect-video w-full overflow-hidden rounded-lg border border-v1-subtle bg-v1-jetBlack"
      aria-label="Episode video coming soon"
    >
      <Image
        src={HERO_IMAGE}
        alt=""
        fill
        sizes="(min-width: 1440px) 1300px, 100vw"
        className="object-cover object-center opacity-40"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-v1-jetBlack/80 via-v1-jetBlack/35 to-v1-jetBlack/20"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
        <span
          aria-hidden="true"
          className="flex size-[72px] items-center justify-center rounded-full border border-v1-frost/25 bg-v1-frost/10 backdrop-blur-sm sm:size-[88px]"
        >
          <svg
            width="22"
            height="26"
            viewBox="0 0 22 26"
            aria-hidden="true"
            className="ml-1"
          >
            <path d="M0 0 L22 13 L0 26 Z" fill="rgb(var(--color-v1-frost))" />
          </svg>
        </span>
        <p className="font-v1Label text-[12px] uppercase tracking-[0.08em] text-v1-frost">
          Episode dropping soon
        </p>
      </div>
    </div>
  );
}
