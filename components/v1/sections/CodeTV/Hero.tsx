import Image from "next/image";
import Chip from "@/components/v1/sections/shared/Chip";
import ButtonLink from "@/components/v1/ButtonLink";
import RunConsole from "@/components/v1/sections/CodeTV/RunConsole";
import {
  EPISODE_YOUTUBE_ID,
  HERO_IMAGE,
  SUBMIT_APP_HREF,
} from "@/components/v1/sections/CodeTV/data";

export default function Hero() {
  return (
    <section
      aria-labelledby="codetv-hero-heading"
      className="relative w-full overflow-hidden text-v1-frost"
    >
      <div className="relative mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-12 px-6 pb-16 pt-[104px] sm:px-9 lg:grid-cols-12 lg:gap-10 lg:px-[70px] lg:pb-20 lg:pt-[152px]">
        <div className="flex flex-col gap-8 lg:col-span-7 lg:gap-10">
          <Chip
            variant="solid"
            size="sm"
            className="self-start whitespace-normal font-normal sm:whitespace-nowrap"
          >
            CodeTV Web Dev Challenge × Inngest
          </Chip>

          <h1
            id="codetv-hero-heading"
            className="text-v1-display-sm uppercase [font-size:clamp(2.25rem,7vw,4.75rem)] [line-height:1.05]"
          >
            Build an app
            <span className="block">that does work while</span>
            <span className="block text-v1-accent-salmon">
              you&apos;re away
            </span>
          </h1>

          <p className="text-v1-body-lg-loose max-w-[38rem] text-v1-frost/80">
            Welcome to Inngest&apos;s Web Dev Challenge Hackathon. Build an
            event-driven app or agent that runs no matter what. The Inngest SDK
            is all you need to make work reliable at scale.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <ButtonLink
              href={SUBMIT_APP_HREF}
              variant="accent"
              size="md"
              target="_blank"
              rel="noreferrer"
              prefetch={false}
            >
              Submit your app
            </ButtonLink>
            <ButtonLink
              href={
                EPISODE_YOUTUBE_ID
                  ? `https://www.youtube.com/watch?v=${EPISODE_YOUTUBE_ID}`
                  : "#episode"
              }
              variant="secondary"
              size="md"
              {...(EPISODE_YOUTUBE_ID
                ? { target: "_blank", rel: "noreferrer", prefetch: false }
                : {})}
            >
              Watch our episode
            </ButtonLink>
          </div>
        </div>

        <div className="relative flex flex-col gap-4 lg:col-span-5 lg:pt-6">
          <div className="relative aspect-[3/2] overflow-hidden rounded-lg">
            <Image
              src={HERO_IMAGE}
              alt="The CodeTV Web Dev Challenge cast"
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
          <RunConsole />
        </div>
      </div>
    </section>
  );
}
