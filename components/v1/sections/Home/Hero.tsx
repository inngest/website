"use client";

import ButtonLink from "@/components/v1/ButtonLink";
import HeroTrace from "@/components/v1/sections/Home/HeroTrace";
import InstallCommandButton from "@/components/v1/sections/Home/InstallCommandButton";

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-headline"
      className="relative isolate flex w-full flex-col justify-center overflow-hidden bg-v1-surfaceBase"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[url(/assets/v1/hero/.compressed/inngest-hero-mobile.avif)] bg-cover bg-center bg-no-repeat lg:bg-[url(/assets/v1/hero/.compressed/inngest-hero.avif?v=3)]"
      />

      {/* Copy left, trace right. The split is 56/44 rather than even: the
          headline's longest line ("UNBREAKABLE.") sets the left column's
          minimum, and the trace still clears the width where its error
          payload and retry chip drop out. */}
      <div className="relative z-30 mx-auto grid w-full max-w-[1440px] items-center gap-12 px-6 pb-14 pt-28 sm:px-10 lg:grid-cols-[minmax(0,1.28fr)_minmax(0,1fr)] lg:gap-10 lg:px-8 lg:pb-[4.5rem] lg:pt-[7rem]">
        <div>
          <p className="font-v1Label text-[clamp(0.75rem,1.05vw,0.875rem)] uppercase leading-[1.2] tracking-[0.08em] text-v1-frost">
            Open Source Durable Execution
          </p>

          {/* Lines are set by hand rather than left to wrapping — at this
              size the break points are part of the composition. */}
          <h1
            id="hero-headline"
            className="mt-5 font-v1Display text-[clamp(2.5rem,6.2vw,6rem)] uppercase leading-[1] tracking-[-0.02em] text-v1-frost"
          >
            <span className="block">
              Make <span className="font-extrabold">every</span>
            </span>
            <span className="block">workflow</span>
            <span className="v1-hollow block">unbreakable.</span>
          </h1>

          <h2 className="mt-7 max-w-[34rem] text-pretty font-v1Body text-[clamp(1.0625rem,1.35vw,1.25rem)] font-normal leading-[1.45] text-v1-subtle">
            Inngest is the fastest way to orchestrate all your async code. Wrap
            functions in primitives to handle any event, at any scale. Pause,
            fan-out, defer, retry, and a/b test&mdash;one SDK, zero infra.
          </h2>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <InstallCommandButton />
            <ButtonLink
              href={`${
                process.env.NEXT_PUBLIC_SIGNUP_URL ?? "/sign-up"
              }?ref=homepage-hero`}
              variant="accent"
            >
              Build free
            </ButtonLink>
          </div>
        </div>

        <HeroTrace />
      </div>
    </section>
  );
}
