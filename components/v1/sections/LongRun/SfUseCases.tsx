"use client";

import Link from "next/link";
import { motion } from "motion/react";
import Section from "@/components/v1/sections/shared/Section";
import { V1_SECTION_TITLE } from "@/components/v1/sections/shared/sectionTitle";
import NavIcon from "@/components/v1/NavIcons";
import { reveals } from "@/utils/v1/reveals";
import { SF_USE_CASES } from "@/components/v1/sections/LongRun/data";

/**
 * Section 03 — what people build.
 *
 * Deliberately low-profile: this is a signpost between the product
 * argument and the technical proof, so it runs tighter than a standard
 * section (reduced vertical padding, compact header, four-up at lg) and
 * each card links straight into the relevant docs.
 */
export default function SfUseCases() {
  return (
    <Section
      aria-labelledby="long-run-use-cases-heading"
      // Runs tighter than the standard section box (80/96/160) — this
      // section is a signpost, not a destination.
      className="bg-v1-canvasSubtle !py-16 lg:!py-24"
      containerClassName="flex flex-col gap-10"
    >
      <div className="flex flex-col gap-4">
        <motion.h2
          {...reveals.heading}
          id="long-run-use-cases-heading"
          // A step down from the standard section title so the section
          // reads as secondary to the ones either side of it.
          className={`${V1_SECTION_TITLE} !text-v1-heading-card`}
        >
          Built for work that doesn&apos;t finish in one request.
        </motion.h2>
        <motion.p
          {...reveals.body}
          className="text-v1-body-sm-loose max-w-[640px]"
        >
          From background jobs to AI agents, keep execution moving even when
          work takes longer than expected.
        </motion.p>
      </div>

      <ul className="grid list-none grid-cols-1 gap-4 pl-0 sm:grid-cols-2 lg:grid-cols-4">
        {SF_USE_CASES.map((c, i) => (
          <motion.li key={c.id} {...reveals.item(i)} className="list-none">
            <Link
              href={c.href}
              className="group flex h-full flex-col gap-3 rounded-lg border border-v1-subtle p-5 transition-colors duration-200 hover:border-v1-contrast"
            >
              <NavIcon
                name={c.icon}
                className="h-5 w-5 text-v1-accent-salmon-light"
              />
              <h3 className="text-v1-heading-xs text-v1-frost">
                {c.title}{" "}
                <span
                  aria-hidden="true"
                  className="text-v1-accent-salmon-light"
                >
                  →
                </span>
              </h3>
              <p className="text-v1-body-sm-loose">{c.body}</p>
            </Link>
          </motion.li>
        ))}
      </ul>
    </Section>
  );
}
