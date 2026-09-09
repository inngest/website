import Image from "next/image";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import { V1_HEADER_CONTENT_MT } from "@/components/v1/sections/shared/sectionShell";
import { TEAMS } from "@/components/v1/sections/CodeTV/data";

export default function Teams() {
  return (
    <Section
      id="teams"
      aria-labelledby="codetv-teams-heading"
      className="scroll-mt-28 !pt-12 sm:!pt-16 lg:!pt-20"
      containerClassName="flex flex-col"
    >
      <SectionHeader
        id="codetv-teams-heading"
        eyebrow="The teams"
        title="Three teams. Four hours. No babysitting the job."
        body="Names and what they built are coming. For now: two builders per team, one function that had to keep going without them."
        bodyClassName="max-w-[640px]"
      />

      <ul
        className={`${V1_HEADER_CONTENT_MT} grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-8`}
      >
        {TEAMS.map((team) => (
          <li key={team.id} className="flex flex-col gap-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-v1-surfaceElevated">
              <Image
                src={team.image}
                alt={team.imageAlt}
                fill
                sizes="(min-width: 1024px) 30vw, 100vw"
                className="object-cover object-[center_30%]"
              />
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-v1-label-md uppercase text-v1-accent-salmon">
                {team.number}
              </p>
              <h3 className="text-v1-heading-sm text-v1-frost">{team.name}</h3>
              <ul className="flex flex-col gap-1">
                {team.members.map((member, i) => (
                  <li
                    key={`${team.id}-${i}`}
                    className="font-v1Label text-[12px] uppercase tracking-[0.06em] text-v1-frost/70"
                  >
                    {member}
                  </li>
                ))}
              </ul>
              <p className="text-v1-body-lg-loose text-v1-frost/75">
                {team.built}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
