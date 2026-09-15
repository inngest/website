"use client";

import { motion } from "motion/react";
import Section from "@/components/v1/sections/shared/Section";
import { V1_SECTION_TITLE } from "@/components/v1/sections/shared/sectionTitle";
import { reveals } from "@/utils/v1/reveals";
import { CONNECTION } from "@/components/v1/sections/LongRun/data";

/**
 * Section 02 — the connection.
 *
 * Draws the line from the marathon to the work, then piles up everything a
 * long run is actually made of. The pile-up is the argument, so the list
 * is set as a wrapping run of chips rather than a tidy column: it should
 * read as "this keeps going" before any single item is read.
 */
export default function Connection() {
  return (
    <Section
      aria-labelledby="long-run-connection-heading"
      containerClassName="flex flex-col gap-v1-stack"
    >
      <div className="flex flex-col gap-6">
        <motion.p
          {...reveals.body}
          className="text-v1-eyebrow uppercase text-v1-frost"
        >
          {CONNECTION.eyebrow}
        </motion.p>
        <motion.h2
          {...reveals.heading}
          id="long-run-connection-heading"
          className={V1_SECTION_TITLE}
        >
          {CONNECTION.title.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 gap-v1-stack lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-6">
          {CONNECTION.lead.map((line) => (
            <motion.p
              key={line}
              {...reveals.body}
              className="text-v1-heading-xs-loose text-v1-frost"
            >
              {line}
            </motion.p>
          ))}
        </div>

        <div className="flex flex-col gap-10">
          {/* The pile-up. Each item is its own bordered chip so the row
              wraps into a block that visibly keeps going. */}
          <ul className="flex list-none flex-wrap gap-2 pl-0">
            {CONNECTION.work.map((item, i) => (
              <motion.li
                key={item}
                {...reveals.item(i)}
                className="list-none rounded-full border border-v1-subtle px-4 py-2 text-v1-label-sm uppercase text-v1-frost/75"
              >
                {item}
              </motion.li>
            ))}
          </ul>

          <div className="flex flex-col gap-4">
            {CONNECTION.close.map((line, i) => (
              <motion.p
                key={line}
                {...reveals.item(i)}
                className="text-v1-body-lg-loose"
              >
                {line}
              </motion.p>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
