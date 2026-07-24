"use client";

import Image from "next/image";
import { motion } from "motion/react";
import HoverCardShell from "@/components/v1/sections/shared/HoverCardShell";
import LogoStrip from "@/components/v1/sections/Home/LogoStrip";
import { TESTIMONIALS } from "@/components/v1/sections/Customers/data";
import { reveals } from "@/utils/v1/reveals";

export default function Testimonials() {
  return (
    <section
      aria-label="Customer testimonials"
      className="relative flex w-full flex-col items-center justify-center gap-[18px] py-20 text-v1-frost sm:py-[100px] lg:py-40"
    >
      <div className="mx-auto flex w-full max-w-[1440px] items-center px-6 lg:px-8">
        <motion.h2
          {...reveals.heading}
          className="w-full flex-1 text-center font-v1Display uppercase leading-[1.25] tracking-[-0.01em] text-v1-frost [font-size:clamp(2rem,5vw,4rem)]"
        >
          <span className="block">Trusted by the fastest growing</span>
          <span className="block">Startups &amp; Scaleups</span>
        </motion.h2>
      </div>
      <LogoStrip contained />
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-x-4 gap-y-10 px-6 md:grid-cols-3 md:py-6 lg:px-8">
        {TESTIMONIALS.map((t, i) => (
          <motion.div key={t.id} {...reveals.item(i)} className="h-full">
            {/* Reuses the QuickStart card chrome — frost border
                fade-in + salmon spotlight + 4 px lift + soft drop
                shadow. `tilt={false}` drops the 3D perspective so the
                surface reads as editorial, not as an action target. */}
            <HoverCardShell
              tilt={false}
              className="gap-6 px-6 py-6 md:gap-8 md:pb-8 md:pt-8"
            >
              <figure className="flex h-full flex-col gap-6 md:gap-8">
                <blockquote className="font-v1Heading text-[20px] leading-[1.5] tracking-[-0.01em] text-v1-frost md:flex-1">
                  “{t.quote}”
                </blockquote>
                <figcaption className="flex items-start gap-[21px]">
                  <Image
                    src={t.portrait}
                    alt={t.portraitAlt}
                    width={74}
                    height={74}
                    className="size-[74px] shrink-0 rounded-full object-cover"
                  />
                  <div className="flex flex-col justify-center self-stretch text-v1-body-lg-loose">
                    <span className="text-v1-frost motion-safe:transition-colors group-hover:text-v1-accent-salmon">
                      {t.authorName}
                    </span>
                    <span className="text-v1-carbon-200">{t.authorTitle}</span>
                  </div>
                </figcaption>
              </figure>
            </HoverCardShell>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
