"use client";

import Link from "next/link";
import { motion } from "motion/react";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import { V1_HEADER_CONTENT_MT } from "@/components/v1/sections/shared/sectionShell";
import { reveals } from "@/utils/v1/reveals";
import { cn } from "@/utils/v1/cn";
import { REFERENCES } from "@/components/v1/sections/LongRun/data";

/**
 * Further reading — the section that has to survive the walk home.
 *
 * An in-person conversation ends without a URL, so this is where the page
 * pays back the part of the pitch a run club or a drink sleeve couldn't
 * carry. Grouped by depth (concept → mechanics → proof → start here) via
 * each entry's `kind`, so someone can enter at whatever altitude they're
 * at instead of reading a flat link list top to bottom.
 *
 * Whole card is the hit target, not just the title: these are read on a
 * phone, one-handed, often outdoors.
 */
export default function References() {
  return (
    <Section
      aria-labelledby="long-run-references-heading"
      containerClassName="flex flex-col"
    >
      <SectionHeader
        id="long-run-references-heading"
        eyebrow="Go deeper"
        title={<>Read the rest of it.</>}
        body="We can only get so far standing on a sidewalk. This is the same argument with the detail put back in."
        bodyClassName="max-w-[600px]"
      />

      <ul
        className={cn(
          V1_HEADER_CONTENT_MT,
          // `bg-v1-canvasMuted` rather than a border token: `v1-subtle`
          // is only registered as a border/text colour, so `bg-v1-subtle`
          // silently renders transparent and the rules disappear.
          // canvasMuted resolves to the same 53 53 53 as
          // `--color-v1-border-subtle`, so these hairlines match every
          // other rule on the page exactly.
          "grid list-none grid-cols-1 gap-px overflow-hidden rounded-lg bg-v1-canvasMuted pl-0 sm:grid-cols-2 lg:grid-cols-3"
        )}
      >
        {REFERENCES.map((r, i) => (
          <motion.li key={r.id} {...reveals.item(i)} className="list-none">
            {/* The 1px grid rules are the parent's background showing
                through a `gap-px` grid, so each cell paints its own
                surface — and repaints it on hover for the whole card. */}
            <Link
              href={r.href}
              className="group flex h-full flex-col gap-3 bg-v1-canvasBase p-8 transition-colors duration-200 hover:bg-v1-canvasSubtle"
            >
              <p className="text-v1-label-sm uppercase text-v1-accent-salmon-light">
                {r.kind}
              </p>
              <h3 className="text-v1-heading-xs text-v1-frost">
                {r.title}{" "}
                <span
                  aria-hidden="true"
                  className="inline-block text-v1-accent-salmon-light transition-transform duration-200 group-hover:translate-x-1"
                >
                  →
                </span>
              </h3>
              <p className="text-v1-body-sm-loose text-v1-frost/75">{r.body}</p>
            </Link>
          </motion.li>
        ))}
      </ul>
    </Section>
  );
}
