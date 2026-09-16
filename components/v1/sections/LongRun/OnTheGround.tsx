"use client";

import Link from "next/link";
import { motion } from "motion/react";
import Section from "@/components/v1/sections/shared/Section";
import { V1_SECTION_TITLE } from "@/components/v1/sections/shared/sectionTitle";
import { reveals } from "@/utils/v1/reveals";
import {
  ON_THE_GROUND,
  SF_ACTIVATIONS,
} from "@/components/v1/sections/LongRun/data";

/**
 * SF's campaign moment — the programming around the city.
 *
 * Sits after the CTA rather than before it: SF's placements are scattered
 * across weeks instead of hanging on one weekend, so this reads as "here's
 * where to actually find us" once the product case is already made.
 *
 * Dates and RSVP destinations that haven't been confirmed render as
 * visible placeholders rather than invented values or dead links — the
 * page is public, so a wrong date costs more than an obviously unfinished
 * one.
 */
export default function OnTheGround() {
  return (
    <Section
      aria-labelledby="long-run-ground-heading"
      className="border-y border-v1-subtle bg-v1-surfaceBase"
      containerClassName="flex flex-col gap-v1-stack"
    >
      <div className="flex flex-col gap-6">
        <motion.p
          {...reveals.body}
          className="text-v1-eyebrow uppercase text-v1-frost/55"
        >
          {ON_THE_GROUND.eyebrow}
        </motion.p>
        <motion.h2
          {...reveals.heading}
          id="long-run-ground-heading"
          className={V1_SECTION_TITLE}
        >
          {ON_THE_GROUND.title.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </motion.h2>
        <motion.p {...reveals.body} className="text-v1-body-lg-loose">
          {ON_THE_GROUND.lead}
        </motion.p>
      </div>

      <ul className="grid list-none grid-cols-1 gap-8 pl-0 lg:grid-cols-3">
        {SF_ACTIVATIONS.map((a, i) => (
          <motion.li
            key={a.id}
            {...reveals.item(i)}
            className="flex list-none flex-col gap-5 rounded-lg border border-v1-subtle p-6"
          >
            {a.mediaNote && (
              <div
                role="img"
                aria-label={a.mediaNote}
                className="flex min-h-[160px] items-center justify-center rounded border border-dashed border-v1-muted px-4 text-center"
              >
                <span className="text-v1-label-sm uppercase text-v1-frost/45">
                  {a.mediaNote}
                </span>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <h3 className="text-v1-heading-xs uppercase text-v1-frost">
                {a.name}
              </h3>
              <p className="text-v1-label-sm uppercase text-v1-frost/55">
                {a.meta}
              </p>
            </div>

            <p className="flex-1 text-v1-body-sm-loose">{a.body}</p>

            {a.cta.href ? (
              <Link
                href={a.cta.href}
                className="text-v1-label-md uppercase text-v1-frost transition-opacity duration-200 hover:opacity-70"
              >
                {a.cta.label}{" "}
                <span aria-hidden="true" className="text-v1-accent-salmon-light">
                  →
                </span>
              </Link>
            ) : (
              // No destination yet. Rendered as inert, visibly unfinished
              // text so it reads as outstanding in review instead of
              // shipping as a link that goes nowhere.
              <p className="text-v1-label-md uppercase text-v1-frost/35">
                {a.cta.label} · link to come
              </p>
            )}
          </motion.li>
        ))}
      </ul>
    </Section>
  );
}
