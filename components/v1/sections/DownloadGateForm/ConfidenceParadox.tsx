"use client";

import { motion } from "motion/react";
import { reveals } from "@/utils/v1/reveals";
import NumberedSection from "@/components/v1/sections/DownloadGateForm/NumberedSection";

export default function ConfidenceParadox() {
  const stats = [
    { value: "130", label: "Engineers surveyed" },
    { value: "74%", label: "Had incidents in last 90 days" },
    { value: "19%", label: "Had confidence at scale" },
  ];
  return (
    <NumberedSection
      number="01"
      title="The confidence paradox"
      lead="Only 19% of teams running AI in production are very confident their stack can handle 2–3× scale."
      body="At organizations with 500+ engineers and significantly more resources, that number drops to 0%. Our report explains why."
    >
      <ul className="mt-8 grid list-none grid-cols-1 gap-3 pl-0 sm:grid-cols-3">
        {stats.map((s, i) => (
          <motion.li
            key={s.label}
            {...reveals.item(i)}
            className="flex list-none flex-col gap-1 rounded-xl p-5 text-v1-jetBlack"
            style={{ backgroundColor: "#9ADAB3" }}
          >
            <span className="font-v1Label text-[11px] font-semibold uppercase tracking-[0.08em] opacity-50">
              — 0{i + 1}
            </span>
            <span className="font-v1Display text-[40px] leading-[1] tracking-[-0.01em]">
              {s.value}
            </span>
            <span className="font-v1Label text-[11px] font-semibold uppercase tracking-[0.08em] opacity-50">
              {s.label}
            </span>
          </motion.li>
        ))}
      </ul>
    </NumberedSection>
  );
}
