"use client";

import Link from "next/link";
import { motion } from "motion/react";
import Section from "@/components/v1/sections/shared/Section";
import {
  SF_SECTION_PADDING,
  SF_SECTION_TITLE,
} from "@/components/v1/sections/SfLongRun/sfHeadings";
import { cn } from "@/utils/v1/cn";
import { reveals } from "@/utils/v1/reveals";
import {
  SF_USE_CASES,
  SF_USE_CASES_COPY,
} from "@/components/v1/sections/SfLongRun/data";

/**
 * Section 03 — what people build.
 *
 * Centred header, four cards across at lg, each led by a product
 * thumbnail and linking into the relevant docs.
 *
 * Cards fall back to a labelled placeholder if an entry in
 * `SF_USE_CASES` has no `image`, rather than substituting stand-in art.
 */
export default function SfUseCases() {
  return (
    <Section
      aria-labelledby="long-run-use-cases-heading"
      className={SF_SECTION_PADDING}
      containerClassName="flex flex-col gap-10"
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <motion.h2
          {...reveals.heading}
          id="long-run-use-cases-heading"
          className={SF_SECTION_TITLE}
        >
          {SF_USE_CASES_COPY.title}
        </motion.h2>
        <motion.p
          {...reveals.body}
          className="text-v1-body-sm-loose max-w-[720px]"
        >
          {SF_USE_CASES_COPY.body}
        </motion.p>
      </div>

      <ul className="grid list-none grid-cols-1 gap-4 pl-0 sm:grid-cols-2 lg:grid-cols-4">
        {SF_USE_CASES.map((c, i) => (
          <motion.li key={c.id} {...reveals.item(i)} className="list-none">
            <Link
              href={c.href}
              className="group flex h-full flex-col overflow-hidden rounded-lg border border-v1-subtle bg-v1-surfaceBase transition-colors duration-200 hover:border-v1-contrast"
            >
              {c.image ? (
                <img
                  src={c.image.src}
                  alt={c.image.alt}
                  loading="lazy"
                  decoding="async"
                  className="block aspect-[11/6] w-full object-cover"
                />
              ) : (
                <span
                  role="img"
                  aria-label={c.imageNote}
                  className="flex aspect-[11/6] w-full items-center justify-center border-b border-dashed border-v1-muted px-4 text-center"
                >
                  <span className="text-v1-label-sm uppercase text-v1-frost/40">
                    {c.imageNote}
                  </span>
                </span>
              )}

              <span className="flex flex-1 flex-col gap-2 p-5">
                <span className="text-v1-heading-xs text-v1-frost">
                  {c.title}{" "}
                  <span aria-hidden="true" className="text-v1-accent-salmon">
                    →
                  </span>
                </span>
                <span className="text-v1-body-sm-loose">{c.body}</span>
              </span>
            </Link>
          </motion.li>
        ))}
      </ul>
    </Section>
  );
}
