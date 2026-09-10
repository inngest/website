"use client";

import Link from "next/link";
import { motion } from "motion/react";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import { reveals } from "@/utils/v1/reveals";
import {
  COURSE_COPY,
  type Market,
} from "@/components/v1/sections/LongRun/data";

/**
 * The campaign centrepiece — a real city-crossing race route mapped, leg by
 * leg, onto what Inngest does over a long run (deck p.19). New York gets
 * the marathon; San Francisco gets Bay to Breakers, so the SF page isn't
 * quoting mile markers from the wrong coast. Both come from COURSE_COPY.
 *
 * Laid out as a race course rather than a feature grid: a rule runs through
 * six mile-marker dots, and each leg hangs off its marker. The rule is
 * horizontal across three columns at lg and vertical down the left edge
 * below it, so the "course" reading holds at every width without any SVG
 * alignment to keep in sync.
 */
export default function Course({ market }: { market: Market }) {
  const copy = COURSE_COPY[market];

  return (
    <Section
      aria-labelledby="long-run-course-heading"
      className="bg-v1-canvasSubtle"
      containerClassName="flex flex-col gap-v1-stack"
    >
      <SectionHeader
        id="long-run-course-heading"
        eyebrow={copy.eyebrow}
        title={copy.title}
        body={copy.body}
        bodyClassName="max-w-[600px]"
      />

      {/* Two-row × three-column course at lg. Each cell carries its own
          marker + rule so the line reads continuously across a row and the
          cards can be any height. Below lg it collapses to a single
          vertical course. */}
      <ol className="grid list-none grid-cols-1 gap-x-8 gap-y-0 pl-0 lg:grid-cols-3 lg:gap-y-16">
        {copy.stages.map((stage, i) => (
          <motion.li
            key={stage.id}
            {...reveals.item(i)}
            className="group relative flex list-none gap-6 pb-10 last:pb-0 lg:flex-col lg:gap-0 lg:pb-0"
          >
            {/* Course rail. Mobile: a vertical rule down the left gutter,
                with the marker sitting on it. Desktop: the rule runs
                horizontally through the top of the cell. */}
            <div className="relative flex w-4 shrink-0 justify-center lg:h-4 lg:w-full lg:justify-start">
              {/* The rule itself. Mobile draws it down from the marker and
                  hides it on the last leg (the finish line has nothing
                  after it); desktop draws it full-width behind the marker.
                  The mobile height overshoots by the list's 40px `pb-10`
                  so the line reaches the next marker instead of breaking
                  in the gap between legs. */}
              <span
                aria-hidden="true"
                className="bg-v1-border-muted absolute left-1/2 top-4 h-[calc(100%+2.5rem)] w-px -translate-x-1/2 group-last:hidden lg:left-0 lg:top-1/2 lg:h-px lg:w-full lg:-translate-x-0 lg:-translate-y-1/2 lg:group-last:block"
              />
              <motion.span
                aria-hidden="true"
                {...reveals.accent}
                className="relative z-10 mt-1 block h-[9px] w-[9px] rounded-full bg-v1-accent-salmon lg:mt-0 lg:h-[11px] lg:w-[11px] lg:self-center"
              />
            </div>

            <div className="flex flex-col gap-4 lg:pr-8 lg:pt-8">
              <p className="text-v1-label-sm uppercase text-v1-frost/55">
                {stage.marker} · {stage.place}
              </p>
              <h3 className="text-v1-heading-xs uppercase text-v1-frost">
                <Link
                  href={stage.href}
                  className="transition-opacity duration-200 hover:opacity-70"
                >
                  {stage.capability}{" "}
                  <span aria-hidden="true" className="text-v1-accent-salmon-light">
                    →
                  </span>
                </Link>
              </h3>
              <p className="text-v1-body-sm-loose">{stage.body}</p>
            </div>
          </motion.li>
        ))}
      </ol>
    </Section>
  );
}
