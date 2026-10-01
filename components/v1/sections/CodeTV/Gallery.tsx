import Image from "next/image";
import { cn } from "@/utils/v1/cn";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import {
  V1_HEADER_CONTENT_MT,
  V1_SECTION_PADDING_Y_COMPACT,
} from "@/components/v1/sections/shared/sectionShell";
import { GALLERY } from "@/components/v1/sections/CodeTV/data";
import GiveScott from "@/components/v1/sections/CodeTV/GiveScott";

export default function Gallery() {
  const beforeScott = GALLERY.slice(0, 2);
  const afterScott = GALLERY.slice(2);

  return (
    <Section
      id="from-the-set"
      aria-labelledby="codetv-gallery-heading"
      className={`scroll-mt-28 ${V1_SECTION_PADDING_Y_COMPACT}`}
      containerClassName="flex flex-col"
    >
      <SectionHeader
        id="codetv-gallery-heading"
        eyebrow="From the set"
        title="Snapshots from Portland"
        body="A few of our favorite moments on set with the CodeTV team. Huge thank you to the contestants, and production team that made magic!"
        bodyClassName="max-w-[640px]"
      />

      <ul
        className={`${V1_HEADER_CONTENT_MT} grid grid-cols-1 items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:gap-4`}
      >
        {beforeScott.map((photo) => (
          <li
            key={photo.src}
            className={cn(
              "relative h-full overflow-hidden rounded-lg bg-v1-surfaceElevated",
              photo.className
            )}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </li>
        ))}
        <GiveScott />
        {afterScott.map((photo) => (
          <li
            key={photo.src}
            className={cn(
              "relative h-full overflow-hidden rounded-lg bg-v1-surfaceElevated",
              photo.className
            )}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </li>
        ))}
      </ul>
    </Section>
  );
}
