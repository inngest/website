"use client";

import Link from "next/link";
import HeroCodeScroll from "@/components/v1/sections/Home/HeroCodeScroll";
import InstallCommandButton from "@/components/v1/sections/Home/InstallCommandButton";

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-headline"
      className="flex w-full max-w-[1280px] flex-col items-center gap-16 pt-10 lg:min-h-[488px] lg:flex-row lg:items-stretch lg:gap-[84px] lg:pt-16"
    >
      <div className="flex w-full max-w-[608px] shrink-0 flex-col items-start justify-between gap-8 lg:h-full">
        <p className="v1-trim w-full font-v1Heading text-[20px] uppercase leading-[1.2] tracking-[-1px] text-v1-accent-salmon">
          Open Source Durable Execution
        </p>

        <h1
          id="hero-headline"
          className="v1-trim w-full font-v1Heading text-[clamp(2.5rem,8vw,72px)] uppercase leading-[0.95] tracking-[-1px] text-white"
        >
          make every
          <br />
          backend
          <br />
          <span className="v1-hollow-1px">unbreakable.</span>
        </h1>

        <p className="w-full font-v1Body text-[20px] leading-[1.5] text-[#CDCDCD]">
          Inngest is the fastest way to orchestrate all your async code. Wrap
          functions in steps to handle any event, at any scale. Pause, fan-out,
          defer, retry, and a/b test&mdash;one SDK, zero infra.
        </p>

        <div className="flex flex-row items-center gap-[14px]">
          <InstallCommandButton />
          <Link
            href={`${
              process.env.NEXT_PUBLIC_SIGNUP_URL ?? "/sign-up"
            }?ref=homepage-hero`}
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-lg bg-v1-accent-salmon px-4 font-v1Mono text-[12px] font-semibold uppercase leading-[1.3] tracking-[1.44px] text-white"
          >
            BUILD FREE
          </Link>
        </div>
      </div>

      <HeroCodeScroll />
    </section>
  );
}
