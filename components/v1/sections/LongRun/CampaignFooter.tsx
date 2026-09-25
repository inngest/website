"use client";

import Link from "next/link";
import { motion } from "motion/react";
import Section from "@/components/v1/sections/shared/Section";
import { reveals } from "@/utils/v1/reveals";
import { ELSEWHERE, type Market } from "@/components/v1/sections/LongRun/data";

/**
 * Section 09 — campaign footer.
 *
 * A quiet sign-off above the site footer: the campaign line, and the way
 * across to the other markets' pages. Deliberately plain — the page has
 * already asked for the click in section 08.
 */
export default function CampaignFooter({ market }: { market: Market }) {
  const elsewhere = ELSEWHERE[market];

  return (
    <Section
      aria-labelledby="long-run-campaign-footer-heading"
      className="border-t border-v1-subtle"
      containerClassName="flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between"
    >
      <motion.h2
        {...reveals.heading}
        id="long-run-campaign-footer-heading"
        className="text-v1-heading-card uppercase text-v1-frost"
      >
        Build for the long run
      </motion.h2>

      <motion.div {...reveals.body} className="flex flex-col gap-4">
        <p className="text-v1-label-sm uppercase text-v1-frost/45">
          Running elsewhere?
        </p>
        <ul className="flex list-none flex-col gap-3 pl-0 sm:flex-row sm:gap-8">
          {elsewhere.map((link) => (
            <li key={link.href} className="list-none">
              <Link
                href={link.href}
                className="text-v1-label-md uppercase text-v1-frost transition-opacity duration-200 hover:opacity-70"
              >
                {link.label}{" "}
                <span
                  aria-hidden="true"
                  className="text-v1-accent-salmon-light"
                >
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </motion.div>
    </Section>
  );
}
