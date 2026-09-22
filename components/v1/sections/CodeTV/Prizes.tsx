import Image from "next/image";
import ButtonLink from "@/components/v1/ButtonLink";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import {
  V1_HEADER_CONTENT_MT,
  V1_SECTION_PADDING_Y_COMPACT,
} from "@/components/v1/sections/shared/sectionShell";
import { appendRef } from "@/utils/v1/ref";
import { PAGE_REF, PRIZES } from "@/components/v1/sections/CodeTV/data";
import StickerPack from "@/components/v1/sections/CodeTV/StickerPack";

export default function Prizes() {
  return (
    <Section
      id="prizes"
      aria-labelledby="codetv-prizes-heading"
      className={`scroll-mt-28 ${V1_SECTION_PADDING_Y_COMPACT}`}
      containerClassName="flex flex-col"
    >
      <SectionHeader
        id="codetv-prizes-heading"
        title="Your Hackathon Prizes"
        body={
          <>
            Inngest is accepting submissions until{" "}
            <strong className="font-bold">October 6, 2026</strong>. Build on
            Inngest for free, send us what you got, and compete for a free year
            of Inngest Pro to take your app to the next level.
          </>
        }
        bodyClassName="max-w-[640px]"
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <ButtonLink
              href="https://app.inngest.com/sign-up?ref=hackathon"
              variant="accent"
              prefetch={false}
            >
              Build Free
            </ButtonLink>
            <ButtonLink
              href={appendRef("/docs", `${PAGE_REF}-prizes`)}
              variant="secondary"
            >
              Read the Docs
            </ButtonLink>
          </div>
        }
      />

      <ul
        className={`${V1_HEADER_CONTENT_MT} grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-8`}
      >
        {PRIZES.map((prize) => (
          <li key={prize.place} className="flex flex-col gap-6">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-v1-surfaceElevated">
              {"visual" in prize && prize.visual === "stickers" ? (
                <StickerPack />
              ) : prize.image ? (
                <Image
                  src={prize.image}
                  alt={prize.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 30vw, 100vw"
                  className="object-cover"
                />
              ) : null}
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="text-v1-heading-sm text-v1-frost">
                {prize.place}
              </h3>
              <p className="text-v1-body-lg-loose text-v1-frost/75">
                {prize.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
