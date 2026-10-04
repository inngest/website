"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { reveals } from "@/utils/v1/reveals";
import ButtonLink from "@/components/v1/ButtonLink";
import InstallCommandButton from "@/components/v1/sections/Home/InstallCommandButton";
import GradientFrame from "@/components/v1/sections/shared/GradientFrame";
import Section from "@/components/v1/sections/shared/Section";
import { HOME_SECTION_TITLE } from "@/components/v1/sections/shared/sectionTitle";
import { cn } from "@/utils/v1/cn";
import HlsVideo from "@/shared/HlsVideo";

const DX_DEMO_SRC =
  "https://cdn.inngest.com/videos/homepage-product-demo/hls/master.m3u8";
const DX_DEMO_POSTER = "/assets/v1/home/posters/demo.webp";

/**
 * Product demo — the first section after the hero, and the one
 * centre-aligned lockup on the page: title → body → CTA pair, stacked
 * on the centre axis above the demo video. The video sits in the same
 * gradient-ring frame the "Scale instantly" section uses so the two
 * product surfaces rhyme.
 *
 * `z-10` lifts the video above the next section's blue slab, which
 * reaches up into this section's bottom padding so the video appears
 * to rest on it.
 */
export default function Quote() {
  return (
    <Section
      aria-labelledby="home-dx-heading"
      className="relative z-10"
      containerClassName="flex flex-col items-center gap-16"
    >
      <div className="flex w-full flex-col items-center gap-8 text-center">
        {/* Centred lockup runs tighter than the left-aligned header
            rhythm: title → body 24, body → buttons 32, lockup → video 64. */}
        <div className="flex flex-col items-center gap-6">
          <motion.h2
            {...reveals.heading}
            id="home-dx-heading"
            className={cn(HOME_SECTION_TITLE, "max-w-[900px]")}
          >
            The DX in durable execution
          </motion.h2>
          <motion.p
            {...reveals.body}
            className="text-v1-body-lg-loose max-w-[560px]"
          >
            However it&rsquo;s written, wherever it runs, Inngest makes it
            unbreakable. Start locally, scale instantly.
          </motion.p>
        </div>
        <motion.div
          {...reveals.item(2)}
          className="flex flex-row flex-wrap items-center justify-center gap-4"
        >
          <InstallCommandButton label="Copy prompt to start locally" />
          <ButtonLink variant="accent" href="/pricing?ref=homepage-dx">
            Start free in cloud
          </ButtonLink>
        </motion.div>
      </div>

      <motion.div {...reveals.body} className="w-full">
        <GradientFrame
          variant="black"
          className="rounded-[10px]"
          innerClassName="relative aspect-video"
        >
          {/* Still of the demo's first frame under the video, so the
              frame isn't empty while the stream loads (or if autoplay
              is blocked). Lazy, and served as WebP by next/image. */}
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
