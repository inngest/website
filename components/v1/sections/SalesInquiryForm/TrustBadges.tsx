"use client";

import { motion } from "motion/react";
import { reveals } from "@/utils/v1/reveals";

const TRUST_BADGES: { label: string; icon: string }[] = [
  { label: "SOC 2 Compliant", icon: "/assets/v1/mission-critical/soc2.png" },
  { label: "HIPAA BAA Available", icon: "/assets/v1/mission-critical/hipaa.png" },
  { label: "E2E Encryption", icon: "/assets/v1/mission-critical/e2e.png" },
  { label: "100k+ executions/sec", icon: "/assets/v1/mission-critical/executions.png" },
  { label: "SSO & SAML", icon: "/assets/v1/mission-critical/sso.png" },
  { label: "Low Latency", icon: "/assets/v1/mission-critical/latency.png" },
];

/**
 * "Built for mission-critical infrastructure" — six trust/compliance
 * badges (icon over an uppercase mono label): 64px display heading on
 * two lines, then a 6-up grid. Page-specific
 * (the CompareTemporal `MissionCritical` uses a different label-above-
 * icon layout), so it lives with the page rather than the shared set.
 */
export default function TrustBadges() {
  return (
    <section
      aria-labelledby="sales-trust-heading"
      className="mx-auto w-full max-w-[1440px] px-6 py-20 text-v1-frost sm:px-9 sm:py-[110px] lg:px-8 lg:py-40"
    >
      <motion.h2
        {...reveals.heading}
        id="sales-trust-heading"
        className="text-v1-display-sm uppercase leading-[1.25] [font-size:clamp(2.25rem,5vw,4rem)]"
      >
        Built for mission-critical{" "}
        <span className="lg:block">infrastructure</span>
      </motion.h2>

      {/* No column gap — each cell's px-16 supplies the spacing (a flush
          6-col grid), so the tight mono labels get the full ~197px cell
          width and don't wrap on lg. */}
      <ul className="mt-12 grid grid-cols-2 gap-y-12 sm:grid-cols-3 lg:mt-16 lg:grid-cols-6 lg:gap-y-0">
        {TRUST_BADGES.map((badge, i) => (
          <motion.li
            key={badge.label}
            {...reveals.item(i)}
            // `group` drives the hover: the icon scales up 10% and
            // brightens from grey (60% — reads grey over the dark bg) to
            // full white, echoing Durable Execution's ProblemsGrid where
            // the dim icons sharpen when active.
            className="group flex flex-col items-center justify-start gap-[44px] px-4 py-8 text-center"
          >
            <span className="flex h-[97px] items-center justify-center motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-safe:group-hover:scale-110">
              <img
                src={badge.icon}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                className="block max-h-full w-auto opacity-60 motion-safe:transition-opacity motion-safe:duration-300 motion-safe:ease-out group-hover:opacity-100"
              />
            </span>
            <span className="font-v1Label text-[16px] uppercase leading-[16px] text-v1-frost">
              {badge.label}
            </span>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
