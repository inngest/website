"use client";

import Image from "next/image";
import { motion } from "motion/react";
import ButtonLink from "@/components/v1/ButtonLink";
import GradientFrame from "@/components/v1/sections/shared/GradientFrame";
import Section from "@/components/v1/sections/shared/Section";
import {
  LR_SECTION_PADDING,
  LR_SECTION_TITLE,
} from "@/components/v1/sections/LongRun/headings";
import { LR_DEMO } from "@/components/v1/sections/LongRun/data";
import { cn } from "@/utils/v1/cn";
import { reveals } from "@/utils/v1/reveals";
import HlsVideo from "@/shared/HlsVideo";

/** Same stream and poster as the homepage's "The DX in durable
 *  execution" section (components/v1/sections/Home/Quote.tsx). */
const DX_DEMO_SRC =
  "https://cdn.inngest.com/videos/homepage-product-demo/hls/master.m3u8";
const DX_DEMO_POSTER = "/assets/v1/home/posters/demo.webp";

/**
 * Section 02 — "Durable doesn't have to be hard." above the product demo.
 *
 * Centred heading + body over the homepage demo's video and gradient-ring
 * frame, with a "Start Free" CTA between the copy and the video.
 */
export default function ProductDemo() {
  return (
    <Section
      aria-labelledby="long-run-demo-heading"
      className={cn("relative", LR_SECTION_PADDING)}
      containerClassName="flex flex-col items-center gap-12 lg:gap-16"
    >
      <div className="flex flex-col items-center gap-6 text-center">
        <motion.h2
          {...reveals.heading}
          id="long-run-demo-heading"
          className={cn(LR_SECTION_TITLE, "max-w-[900px]")}
        >
          {LR_DEMO.title}
        </motion.h2>
        <motion.p
          {...reveals.body}
          className="text-v1-body-lg-loose max-w-[720px]"
        >
          {LR_DEMO.body}
        </motion.p>
        {/* Same button format as the homepage's "Start free in cloud". */}
        <motion.div {...reveals.item(2)} className="mt-2">
          <ButtonLink variant="accent" href={LR_DEMO.cta.href} prefetch={false}>
            {LR_DEMO.cta.label}
          </ButtonLink>
        </motion.div>
      </div>
      <motion.div {...reveals.body} className="w-full">
        <GradientFrame
          variant="black"
          className="rounded-[10px]"
          innerClassName="relative aspect-video"
        >
          {/* First-frame still under the video so the frame isn't empty
              while the stream loads (or if autoplay is blocked). */}
          <Image
            src={DX_DEMO_POSTER}
            alt=""
            aria-hidden="true"
            fill
            sizes="(min-width: 1280px) 1280px, 100vw"
            className="object-cover"
          />
          <HlsVideo
            src={DX_DEMO_SRC}
            loop
            controls
            autoPlay
            className="relative block h-full w-full object-cover"
          />
        </GradientFrame>
      </motion.div>
    </Section>
  );
}
