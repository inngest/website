"use client";

import { motion } from "motion/react";
import ButtonLink from "@/components/v1/ButtonLink";
import { reveals } from "@/utils/v1/reveals";
import { PERKS, VALUES } from "./data";

export default function HowWeWork() {
  return (
    <section
      aria-labelledby="about-how-heading"
      // 3-equal-column grid with `gap-[58px]`. Left rail spans 1 col,
      // right rail spans 2. Mobile collapses to a single column with
      // the v1 page rhythm (80 / 100 / 160).
      className="relative mx-auto w-full max-w-[1440px] px-6 py-20 text-v1-frost sm:px-9 sm:py-[100px] lg:px-[70px] lg:py-40"
    >
      <div className="grid grid-cols-1 gap-x-[58px] gap-y-12 lg:grid-cols-3 lg:items-start">
        {/* Left rail — `h-[392px]` justify-between column: the header +
            body form a `gap-[20px]` group pinned to the top and the
            CTA sits at the bottom. The fixed height applies only at lg;
            below that the column stacks with the page rhythm. */}
        <div className="flex flex-col items-start gap-10 lg:col-span-1 lg:h-[392px] lg:justify-between lg:gap-0">
          <div className="flex flex-col items-start gap-[20px]">
            <motion.h2
              {...reveals.heading}
              id="about-how-heading"
              className="text-v1-display-sm uppercase leading-[1.25] [font-size:clamp(2.25rem,5.4vw,4rem)]"
            >
              How we work
            </motion.h2>
            <motion.p
              {...reveals.body}
              // Width capped at the rail (~374 px).
              className="max-w-[375px] text-v1-body-lg-loose text-v1-frost"
            >
              We&apos;re a small, remote-first team that are passionate
              about delivering great products. We all work closely with
              customers to deliver the right solution that solves many
              use cases, not on-off features.
            </motion.p>
          </div>
          <motion.div {...reveals.item(2)}>
            <ButtonLink href="/careers?ref=about" variant="accent">
              View Open Roles
            </ButtonLink>
          </motion.div>
        </div>

        {/* Right rail — Values + Perks blocks. Both groups render in
            full (no collapse/disclosure); the 72 px gap maps to
            `gap-[72px]`. */}
        <motion.div
          {...reveals.item(3)}
          className="flex flex-col gap-[72px] lg:col-span-2"
        >
          <ValueGroup title="Values">
            {VALUES.map((v) => (
              <p
                key={v.title}
                className="text-v1-body-lg text-v1-frost"
              >
                <span className="font-bold">{v.title}:</span> {v.body}
              </p>
            ))}
          </ValueGroup>
          <ValueGroup title="Perks">
            {PERKS.map((perk) => (
              <p
                key={perk}
                className="text-v1-body-lg text-v1-frost"
              >
                {perk}
              </p>
            ))}
          </ValueGroup>
        </motion.div>
      </div>
    </section>
  );
}

function ValueGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-[10px]">
        {/* Marker + title are persistently salmon. */}
        <span
          aria-hidden="true"
          className="block size-[8px] shrink-0 bg-v1-accent-salmon"
        />
        <h3 className="text-v1-heading-sm text-v1-accent-salmon">
          {title}
        </h3>
      </div>
      {/* `pl-[18px]` aligns the rows with the title text, past the
          8 px marker + 10 px gap. */}
      <div className="flex flex-col gap-[22px] pl-[18px]">{children}</div>
    </div>
  );
}
