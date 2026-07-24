"use client";

import { motion } from "motion/react";
import { reveals } from "@/utils/v1/reveals";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import { V1_HEADER_CONTENT_MT } from "@/components/v1/sections/shared/sectionShell";

/**
 * "Built for mission-critical infrastructure" — six trust/compliance
 * badges, each a label over a line-art icon (icons from the
 * inngest-icons-5-26 set, white-on-transparent PNGs).
 */

interface Badge {
  label: string;
  icon: string;
}

const BADGES: Badge[] = [
  { label: "SOC 2 Compliant", icon: "/assets/v1/mission-critical/soc2.png" },
  { label: "HIPAA BAA Available", icon: "/assets/v1/mission-critical/hipaa.png" },
  { label: "E2E Encryption", icon: "/assets/v1/mission-critical/e2e.png" },
  { label: "100k+ Executions/Sec", icon: "/assets/v1/mission-critical/executions.png" },
  { label: "SSO & SAML", icon: "/assets/v1/mission-critical/sso.png" },
  { label: "Low Latency", icon: "/assets/v1/mission-critical/latency.png" },
];

export default function MissionCritical() {
  return (
    <Section
      aria-labelledby="ct-trust-heading"
      className="relative"
      containerClassName="flex flex-col"
    >
      <SectionHeader
        id="ct-trust-heading"
        titleClassName="lg:max-w-[780px]"
        title="Built for mission-critical infrastructure."
      />

      <ul className={`${V1_HEADER_CONTENT_MT} grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-[28px]`}>
        {BADGES.map((badge, i) => (
          <motion.li
            key={badge.label}
            {...reveals.item(i)}
            className="flex flex-col items-center gap-[36px] text-center"
          >
            <span className="text-[16px] leading-[1.3] text-v1-frost">
              {badge.label}
            </span>
            <span className="flex h-[88px] items-center">
              <img
                src={badge.icon}
                alt=""
                aria-hidden="true"
                className="block h-full w-auto"
              />
            </span>
          </motion.li>
        ))}
      </ul>
    </Section>
  );
}
