import Image from "next/image";
import clsx from "clsx";

import Container from "./Container";
import { Button } from "src/shared/Button";
import Link from "src/components/Link";

export default function HeroScreenshot() {
  return (
    <div
      // negative margin to match layout.tsx's horizontal margin - px-6 md:px-10 lg:px-20
      // TODO - fix for wide screens
      // w-[calc(100%+48px)] md:w-[calc(100%+80px)] lg:w-[calc(100%+160px)] -mx-6 md:-mx-10 lg:-mx-20
      className={`

        -mt-[84px] pt-[84px]
        bg-[url(/assets/textures/blob-background-1-light.png)] dark:bg-[url(/assets/textures/blob-background-1.png)]
        bg-cover bg-no-repeat bg-top
        text-basis text-center
      `}
    >
      <Container>
        <header className="pt-16 pb-16 px-4 sm:px-8">
          <h1 className="px-4 sm:px-0 font-bold text-2xl sm:text-4xl md:text-6xl leading-tight md:leading-tight drop-shadow-lg">
            Queuing and orchestration <br className="hidden lg:inline" />
            for modern software teams
          </h1>
          <p className="max-w-5xl mt-8 mx-auto text-base sm:text-lg md:text-xl leading-normal text-balance drop-shadow-lg">
            Inngest's durable functions replace queues, state management, and
            scheduling to enable any developer to write reliable step functions
            faster without touching infrastructure.
            {/*
            Alternatives:

              Inngest is the modern durable execution platform that lets developers ship reliable and
              scalable functions in minutes, without touching queues, function state, or infrastructure.

              Inngest's durable execution platform enables developers to ship reliable and
              scalable functions in minutes, without managing queues, function state, or infrastructure.

            */}
          </p>

          <div className="mt-8 flex flex-row flex-wrap justify-center items-center gap-4">
            {/* Desktop */}
            <Button
              variant="primary"
              size="md"
              className="hidden sm:inline-flex shadow-lg px-8 py-3"
              href={`${process.env.NEXT_PUBLIC_SIGNUP_URL}?ref=homepage-hero`}
            >
              Start building for free
            </Button>
            <Button
              variant="outline"
              size="md"
              className="hidden sm:inline-flex shadow-lg px-8 py-3"
              href="/contact?ref=homepage-hero"
            >
              Chat with solutions engineering
            </Button>

            {/* Mobile */}
            <Button
              variant="primary"
              size="sm"
              className="sm:hidden shadow-lg px-8 py-3"
              href={`${process.env.NEXT_PUBLIC_SIGNUP_URL}?ref=homepage-hero`}
            >
              Start for free
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="sm:hidden shadow-lg px-8 py-3"
              href="/contact?ref=homepage-hero"
            >
              Get a demo
            </Button>
          </div>
        </header>
        <div className="flex flex-col gap-6 items-center sm:pb-8">
          <p className="mx-8 text-sm text-balance text-subtle">
            Trusted by modern software companies at scale worldwide:
          </p>
          <div className="grid grid-cols-2 sm:flex flex-wrap lg:flex-nowrap gap-x-4 sm:gap-x-8 gap-y-6 sm:gap-y-8 mx-8">
            {[
              {
                src: "/assets/customers/soundcloud-logo-white-horizontal.svg",
                name: "SoundCloud",
                scale: 1.5,
              },
              {
                src: "/assets/customers/tripadvisor.svg",
                name: "TripAdvisor",
                scale: 1.4,
              },
              {
                src: "/assets/customers/gitbook-logo-white.svg",
                name: "Gitbook",
                scale: 1.3,
              },
              {
                src: "/assets/customers/resend.svg",
                name: "Resend",
                scale: 0.9,
              },
              {
                src: "/assets/customers/leap-logo-white.svg",
                name: "Leap",
                scale: 0.8,
              },
              {
                src: "/assets/customers/zamp-logo.svg",
                name: "Zamp",
                scale: 0.7,
              },
            ].map(({ src, name, scale = 1 }, idx) => (
              <Image
                key={idx}
                src={src}
                alt={name}
                title={name}
                width={120 * 0.8 * scale}
                height={30 * 0.8 * scale}
                className={clsx(
                  "m-auto width-auto transition-all grayscale opacity-80 invert dark:invert-0",
                  `max-h-[${36 * scale}px]`,
                  idx === 4 && "hidden sm:block",
                  idx > 4 && "hidden xl:block"
                )}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center mt-8 mx-4">
          <Image
            alt="Screenshot of Inngest's dashboard"
            className="rounded-t-md"
            src="/assets/homepage/hero/2024-08-function-dashboard.png"
            width={3060 * 0.5}
            height={1680 * 0.5}
          />
        </div>
      </Container>
    </div>
  );
}
