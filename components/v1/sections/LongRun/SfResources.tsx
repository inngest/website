"use client";

import Link from "next/link";
import { motion } from "motion/react";
import Section from "@/components/v1/sections/shared/Section";
import { SF_SECTION_TITLE } from "@/components/v1/sections/LongRun/sfHeadings";
import { reveals } from "@/utils/v1/reveals";
import {
  SF_RESOURCES,
  SF_RESOURCES_COPY,
} from "@/components/v1/sections/LongRun/data";

/**
 * Section 07 — resources.
 *
 * Only real, already-published content. The section removes itself when
 * `SF_RESOURCES` is empty, so pulling an uncleared card never leaves an
 * empty shell on the page.
 */
export default function SfResources() {
  if (SF_RESOURCES.length === 0) return null;

  return (
    <Section
      aria-labelledby="long-run-resources-heading"
      className="border-t border-v1-subtle"
      containerClassName="flex flex-col"
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <motion.h2
          {...reveals.heading}
          id="long-run-resources-heading"
          className={SF_SECTION_TITLE}
        >
          {SF_RESOURCES_COPY.title[0]}
        </motion.h2>
        <motion.p
          {...reveals.body}
          className="text-v1-body-sm-loose max-w-[640px]"
        >
          {SF_RESOURCES_COPY.body}
        </motion.p>
      </div>

      <ul
        className={`mt-10 grid list-none grid-cols-1 gap-6 pl-0 md:grid-cols-3`}
      >
        {SF_RESOURCES.map((r, i) => (
          <motion.li key={r.id} {...reveals.item(i)} className="list-none">
            <Link
              href={r.href}
              className="group flex h-full flex-col gap-4 rounded-lg border border-v1-subtle p-6 transition-colors duration-200 hover:border-v1-contrast"
            >
              <span className="text-v1-label-sm uppercase text-v1-frost/55">
                {r.kind}
              </span>
              <span className="text-v1-heading-xs flex-1 text-v1-frost">
                {r.title}
              </span>
              <span
                aria-hidden="true"
                className="text-v1-label-md uppercase text-v1-accent-salmon"
              >
                Read →
              </span>
            </Link>
          </motion.li>
        ))}
      </ul>
    </Section>
  );
}
