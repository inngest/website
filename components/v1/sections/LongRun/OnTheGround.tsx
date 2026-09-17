"use client";

import Link from "next/link";
import { motion } from "motion/react";
import Section from "@/components/v1/sections/shared/Section";
import { V1_SECTION_TITLE } from "@/components/v1/sections/shared/sectionTitle";
import { reveals } from "@/utils/v1/reveals";
import {
  SF_CAMPAIGN,
  SF_CAMPAIGN_CARDS,
} from "@/components/v1/sections/LongRun/data";

/**
 * Section 06 — the San Francisco programming.
 *
 * Sits below the product story by design: the page's job is product-led,
 * and this connects it back to however someone ran into the campaign in
 * the city. It is not an event directory, so each card stays to a title,
 * a line, and a date.
 *
 * Unconfirmed events render a plain "details coming soon" line and no
 * button at all — an inactive CTA reads as broken, and a placeholder date
 * on a public page is worse. Cards gain a CTA the moment a real
 * destination exists in `SF_CAMPAIGN_CARDS`.
 */
export default function OnTheGround() {
  return (
    <Section
      aria-labelledby="long-run-sf-campaign-heading"
      className="border-y border-v1-subtle bg-v1-surfaceBase"
      containerClassName="flex flex-col gap-v1-stack"
    >
      <div className="flex flex-col gap-6">
        <motion.p
          {...reveals.body}
          className="text-v1-eyebrow uppercase text-v1-frost/55"
        >
          {SF_CAMPAIGN.eyebrow}
        </motion.p>
        <motion.h2
          {...reveals.heading}
          id="long-run-sf-campaign-heading"
          className={V1_SECTION_TITLE}
        >
          {SF_CAMPAIGN.title.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </motion.h2>
        <motion.p
          {...reveals.body}
          className="text-v1-body-lg-loose max-w-[640px]"
        >
          {SF_CAMPAIGN.body}
        </motion.p>
      </div>

      <ul className="grid list-none grid-cols-1 gap-8 pl-0 lg:grid-cols-3">
        {SF_CAMPAIGN_CARDS.map((card, i) => (
          <motion.li
            key={card.id}
            {...reveals.item(i)}
            className="flex list-none flex-col gap-5 rounded-lg border border-v1-subtle p-6"
          >
            {card.mediaNote && (
              <div
                role="img"
                aria-label={card.mediaNote}
                className="flex min-h-[160px] items-center justify-center rounded border border-dashed border-v1-muted px-4 text-center"
              >
                <span className="text-v1-label-sm uppercase text-v1-frost/45">
                  {card.mediaNote}
                </span>
              </div>
            )}

            <h3 className="text-v1-heading-xs text-v1-frost">{card.title}</h3>
            <p className="text-v1-body-sm-loose flex-1">{card.body}</p>

            {card.detail && (
              <p className="text-v1-label-sm uppercase text-v1-frost/55">
                {card.detail}
              </p>
            )}

            {/* An unconfirmed event says so plainly and shows no button.
                The brief is explicit that a disabled CTA is not an
                acceptable stand-in. */}
            {card.pending && (
              <p className="text-v1-label-sm uppercase text-v1-frost/45">
                {card.pending}
              </p>
            )}

            {card.cta && (
              <Link
                href={card.cta.href}
                className="text-v1-label-md uppercase text-v1-frost transition-opacity duration-200 hover:opacity-70"
              >
                {card.cta.label}{" "}
                <span
                  aria-hidden="true"
                  className="text-v1-accent-salmon-light"
                >
                  →
                </span>
              </Link>
            )}
          </motion.li>
        ))}
      </ul>
    </Section>
  );
}
