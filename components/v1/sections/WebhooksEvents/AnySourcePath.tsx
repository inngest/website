"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { reveals } from "@/utils/v1/reveals";
import Logo from "@/components/v1/Logo";
import GradientFrame from "@/components/v1/sections/shared/GradientFrame";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import { cn } from "@/utils/v1/cn";

// "ANY SOURCE, ANY PATH" — left heading + body, right 2-up
// bordered card grid. Each card has an uppercase eyebrow + glyph
// image + body. Glyph PNGs live in /public/assets/v1/webhooks-events/.

function OrbitsGlyph() {
  // Sized to spec: 217 × 170 px.
  return (
    <Image
      src="/assets/v1/webhooks-events/3pp.png"
      alt=""
      width={434}
      height={340}
      className="h-[170px] w-[217px] object-contain"
    />
  );
}

function SendGlyph() {
  // The two offset frames are the artwork; the centred
  // "[INNGEST.SEND()]" overlay sits across the middle.
  return (
    // Sized to spec: 243 × 170 px.
    <div className="relative inline-flex h-[170px] w-[243px] items-center justify-center">
      <Image
        src="/assets/v1/webhooks-events/inngest-send.png"
        alt=""
        width={486}
        height={340}
        className="h-full w-full object-contain"
      />
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center font-v1Mono text-base uppercase leading-none">
        [INNGEST.SEND()]
      </span>
    </div>
  );
}

export default function AnySourcePath() {
  return (
    <Section
      aria-labelledby="we-any-source-heading"
      className="relative"
      containerClassName="grid grid-cols-1 gap-x-4 gap-y-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:items-stretch"
    >
      <div className="flex flex-col justify-between gap-v1-stack lg:pb-8">
        <SectionHeader
          id="we-any-source-heading"
          title={
            <>
              <span className="block">Any source,</span>
              <span className="block">any path</span>
            </>
          }
        />
        <motion.p
          {...reveals.body}
          className="max-w-[362px] text-v1-body-lg-loose"
        >
          Inngest handles every event no matter how they enter, making
          them reliable, observable, and retryable from Day&nbsp;1.
        </motion.p>
      </div>

      <ul className="grid list-none grid-cols-1 gap-y-6 pl-0 sm:grid-cols-2 sm:items-stretch sm:gap-y-0">
        <Card
          align="left"
          eyebrow="Third-party providers"
          sub="(webhooks)"
          glyph={<OrbitsGlyph />}
          body="Point any provider at an Inngest webhook URL. Trigger functions that retry automatically."
        />
        <Card
          align="right"
          eyebrow="Your own code"
          eyebrowIcon={<Logo width={28} logomarkOnly className="h-4" />}
          sub="[inngest.send()]"
          glyph={<SendGlyph />}
          body="Fire events from anywhere in your codebase. Trigger multiple functions in parallel."
          offsetSeam
        />
      </ul>
    </Section>
  );
}

function Card({
  eyebrow,
  eyebrowIcon,
  sub,
  glyph,
  body,
  align = "left",
  offsetSeam = false,
}: {
  eyebrow: string;
  /** Optional icon rendered before the eyebrow heading. */
  eyebrowIcon?: React.ReactNode;
  sub: string;
  glyph: React.ReactNode;
  body: string;
  align?: "left" | "right";
  offsetSeam?: boolean;
}) {
  const isRight = align === "right";
  const colAlign = isRight ? "items-end" : "items-start";
  const rowAlign = isRight ? "justify-end" : "justify-start";
  const textAlign = isRight ? "text-right" : "text-left";
  return (
    <motion.li
      {...reveals.body}
      className={cn(
        "flex h-full flex-col gap-8 border-2 border-v1-frost bg-v1-carbon-400 bg-[url('/assets/v1/webhooks-events/card-noise.webp')] bg-cover bg-center p-8",
        colAlign,
        offsetSeam && "sm:-ml-0.5",
      )}
    >
      <div className={cn("flex w-full flex-col gap-3", colAlign)}>
        <div className={cn("flex w-full items-center gap-3", rowAlign)}>
          {eyebrowIcon}
          <p className={cn("text-v1-heading-sm uppercase text-v1-frost", textAlign)}>
            {eyebrow}
          </p>
        </div>
        <p className={cn("text-v1-label-md uppercase text-v1-frost", textAlign)}>
          {sub}
        </p>
      </div>

      {/* Inner ICON frame — flex-1 fills the remaining card height so
          the glyph sits centred in a stretched container. */}
      <GradientFrame
        variant="black"
        className="min-h-[251px] w-full flex-1 rounded-md"
        innerClassName="flex h-full w-full items-center justify-center"
      >
        {glyph}
      </GradientFrame>

      <p className={cn("text-v1-body-sm", textAlign)}>{body}</p>
    </motion.li>
  );
}
