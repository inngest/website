"use client";

import { motion } from "motion/react";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import { V1_HEADER_CONTENT_MT } from "@/components/v1/sections/shared/sectionShell";
import { reveals } from "@/utils/v1/reveals";
import { CITIES, type Market } from "@/components/v1/sections/LongRun/data";

/**
 * Where to find us on the ground — NYC and SF, in the order that matters to
 * whoever is reading. The market the visitor scanned from leads; the other
 * city follows, so a New Yorker isn't reading about matcha in SoMa first.
 */
export default function Cities({ market }: { market: Market }) {
  // `all` (step.run/build — DOOH and paid, no city context) keeps the
  // campaign's own order: NYC makes it visible, SF makes it credible.
  const order: Array<"nyc" | "sf"> =
    market === "sf" ? ["sf", "nyc"] : ["nyc", "sf"];

  return (
    <Section
      aria-labelledby="long-run-cities-heading"
      containerClassName="flex flex-col"
    >
      <SectionHeader
        id="long-run-cities-heading"
        eyebrow="Two cities, two different jobs"
        title={<>Come find us on the course.</>}
        body="We're spending the autumn where the people building long-running things actually are — on the marathon route in New York, and in the room after hours in San Francisco."
        bodyClassName="max-w-[655px]"
      />

      <div
        className={`${V1_HEADER_CONTENT_MT} grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-8`}
      >
        {order.map((key, i) => {
          const city = CITIES[key];
          return (
            <motion.div
              key={key}
              {...reveals.item(i)}
              className="flex flex-col gap-6 border-t border-v1-subtle pt-8"
            >
              <div className="flex flex-col gap-2">
                <h3 className="text-v1-heading-card text-v1-frost">
                  {city.city}
                </h3>
                <p className="text-v1-label-md uppercase text-v1-accent-salmon-light">
                  {city.role}
                </p>
              </div>
              <p className="text-v1-label-sm uppercase text-v1-frost/55">
                {city.window}
              </p>
              <ul className="flex list-none flex-col gap-3 pl-0">
                {city.items.map((item) => (
                  <li
                    key={item}
                    className="text-v1-body-sm-loose list-none border-b border-v1-subtle pb-3 last:border-b-0 last:pb-0"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
