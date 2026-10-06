"use client";

import ButtonLink from "@/components/v1/ButtonLink";
import HeroCodeTrace from "@/components/v1/sections/Home/HeroCodeTrace";
import InstallCommandButton from "@/components/v1/sections/Home/InstallCommandButton";
import LogoStrip from "@/components/v1/sections/Home/LogoStrip";
import { V1_SECTION_GUTTER_X } from "@/components/v1/sections/shared/sectionShell";
import { cn } from "@/utils/v1/cn";

/**
 * Homepage hero — owns the first screen. The header is fixed and the
 * page has no top offset, so the hero carries it: 96px top padding on
 * mobile (56px header + 40) and 88px at lg (the header's full height,
 * banner included). On desktop the section fills the viewport (capped
 * at 1048px so very tall screens don't strand the copy), the
 * headline/code lockup is centred in the height below the header, and
 * the customer logo row is anchored at the fold so the first screen
 * ends on proof rather than on empty canvas.
 *
 * The all-caps headline is the one uppercase display element on the
 * page — every section title below is sentence case and one step
 * smaller, so the hierarchy reads top-down without competition.
 */
export default function Hero() {
  return (
    <section
      aria-labelledby="hero-headline"
      className="flex flex-col lg:min-h-[min(100svh,1048px)]"
    >
      <div
        className={cn(
          "mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-center pb-16 pt-24 lg:pb-20 lg:pt-[88px]",
          V1_SECTION_GUTTER_X
        )}
      >
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          <div className="flex w-full max-w-[608px] shrink-0 flex-col items-start gap-8 lg:max-w-[576px]">
            <p className="text-v1-eyebrow uppercase text-v1-accent-salmon">
              Open source durable execution
            </p>

            <h1
              id="hero-headline"
              // -ml compensates the display caps' left side bearing so the "M" ink
              // lines up with the eyebrow and body text, not 3px to the right.
              className="v1-trim -ml-[0.04em] w-full font-v1Heading text-[clamp(2.75rem,6.5vw,4.5rem)] uppercase leading-[0.95] tracking-[-0.02em] text-v1-frost"
            >
              make every
              <br />
              backend
              <br />
              <span className="v1-hollow-1px">unbreakable.</span>
            </h1>

            <p className="text-v1-body-md w-full max-w-[560px]">
              Inngest is the fastest way to orchestrate all your async code.
              Wrap functions in steps to handle any event, at any scale. Pause,
              fan-out, defer, retry, and A/B test&mdash;one SDK, zero infra.
            </p>

            <div className="flex flex-row flex-wrap items-center gap-4">
              <InstallCommandButton placement="homepage_hero" />
              <ButtonLink
                variant="accent"
                href={`${
                  process.env.NEXT_PUBLIC_SIGNUP_URL ?? "/sign-up"
                }?ref=homepage-hero`}
              >
                Start free
              </ButtonLink>
            </div>
          </div>

          <HeroCodeTrace />
        </div>
      </div>

      <LogoStrip contained label="Trusted in production by" />
    </section>
  );
}
