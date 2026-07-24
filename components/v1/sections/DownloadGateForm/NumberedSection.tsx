"use client";

import { motion } from "motion/react";
import { cn } from "@/utils/v1/cn";
import { reveals } from "@/utils/v1/reveals";
import { SECTION } from "@/components/v1/sections/DownloadGateForm/layout";

export default function NumberedSection({
  number,
  title,
  lead,
  body,
  children,
  className,
}: {
  number: string;
  title: string;
  lead: React.ReactNode;
  body: React.ReactNode;
  children: React.ReactNode;
  /** Override section padding (e.g. the last section adds the 120px
   *  bottom gap before the full-bleed CTA band). */
  className?: string;
}) {
  return (
    <section
      aria-labelledby={`benchmark-${number}-heading`}
      className={cn(`${SECTION} pb-0 pt-16 text-v1-frost`, className)}
    >
      {/* Heading/Sm title, Heading/Xs lead, Body/Sm body — all Carbon-0
          white, 16px gaps, full 800px column width. The v1 typography
          tokens carry the cap-trim. */}
      <motion.h2
        {...reveals.heading}
        id={`benchmark-${number}-heading`}
        className="text-v1-heading-sm text-v1-frost"
      >
        {number} — {title}
      </motion.h2>
      <motion.p
        {...reveals.heading}
        className="mt-4 text-v1-heading-xs text-v1-frost"
      >
        {lead}
      </motion.p>
      <motion.p
        {...reveals.body}
        className="mt-4 text-v1-body-sm-loose text-v1-frost"
      >
        {body}
      </motion.p>
      {children}
    </section>
  );
}
