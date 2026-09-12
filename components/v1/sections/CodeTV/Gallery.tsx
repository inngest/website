import Image from "next/image";
import { cn } from "@/utils/v1/cn";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import { V1_HEADER_CONTENT_MT } from "@/components/v1/sections/shared/sectionShell";
import { GALLERY } from "@/components/v1/sections/CodeTV/data";

export default function Gallery() {
  return (
    <Section
      id="from-the-set"
      aria-labelledby="codetv-gallery-heading"
      className="scroll-mt-28"
      containerClassName="flex flex-col"
    >
      <SectionHeader
        id="codetv-gallery-heading"
        eyebrow="From the set"
        title="The room where it kept running."
        body="Still more photos to add. For now, a first look at the Web Dev Challenge floor — desks, clapperboards, and the kind of energy you only get when the clock is loud and the functions don't quit."
        bodyClassName="max-w-[640px]"
      />

      <ul
        className={`${V1_HEADER_CONTENT_MT} grid grid-cols-1 items-start gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:gap-4`}
      >
        {GALLERY.map((photo) => (
          <li
            key={photo.src}
            className={cn(
              "relative overflow-hidden rounded-lg bg-v1-surfaceElevated",
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
