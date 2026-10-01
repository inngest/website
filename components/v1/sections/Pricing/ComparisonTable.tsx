"use client";

import { useState } from "react";
import { motion } from "motion/react";
import ButtonLink from "@/components/v1/ButtonLink";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import { cn } from "@/utils/v1/cn";
import { reveals } from "@/utils/v1/reveals";
import {
  FEATURES,
  FEATURE_SECTIONS,
  PLANS,
  type Feature,
  type FeatureCell,
  type Plan,
} from "./plans";

// Comparison table. Heading + per-plan CTAs, then feature rows
// grouped under accordion-style category headers. Top padding is
// halved so the gap from the calculator matches other section
// rhythms (the calculator already provides a full bottom pad).

const SECTIONS = [
  { key: "all", label: "Platform" },
  ...FEATURE_SECTIONS.map((s) => ({ key: s.key, label: s.name })),
];

export default function ComparisonTable() {
  // Set of expanded section keys — sections expand/collapse independently
  // rather than accordion-style (one at a time).
  const [open, setOpen] = useState<Set<string>>(() => new Set(["all"]));
  const toggle = (key: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  return (
    <Section
      aria-labelledby="pricing-compare-heading"
      className="relative !pt-20 sm:!pt-24 lg:!pt-16"
      containerClassName="flex flex-col gap-v1-stack"
    >
      <SectionHeader
        id="pricing-compare-heading"
        title="Compare All Plan Features"
        body="A detailed look at every Cloud pricing tier. Know exactly what you get at every phase of growth."
      />
      {/* Below lg the inner table is wider than the viewport and
          scrolls horizontally; at lg+ the min-width matches the
          natural content so there's no overflow. */}
      <div className="-mx-6 overflow-x-auto sm:-mx-9 lg:mx-0 lg:overflow-visible">
        <div className="min-w-[820px] px-6 sm:px-9 lg:min-w-0 lg:px-0">
          {/* Header row: empty first column (feature labels sit
              below), plan CTAs across the right. */}
          <div className="grid min-h-[80px] grid-cols-[180px_repeat(4,minmax(140px,1fr))] items-center border-b border-v1-contrast py-3 lg:min-h-0 lg:grid-cols-[minmax(0,1.3fr)_repeat(4,minmax(0,1fr))] lg:py-6">
            <div className="pr-4 lg:pr-6" />
            {PLANS.map((plan, i) => (
              <PlanHeaderCol key={plan.name} plan={plan} highlight={i === 1} />
            ))}
          </div>

          {/* Sections */}
          <div className="flex flex-col">
            {SECTIONS.map((sec) => {
              const rows = FEATURES.filter((f) =>
                sec.key === "all"
                  ? f.section === "comparison"
                  : f.section === sec.key,
              );
              const isOpen = open.has(sec.key);
              return (
                <div key={sec.key} className="flex flex-col">
                  {/* Section accordion header — brighter cdcdcd border
                      matches the section dividers. */}
                  <button
                    type="button"
                    onClick={() => toggle(sec.key)}
                    aria-expanded={isOpen}
                    aria-controls={`pricing-section-${sec.key}`}
                    className="flex h-[52px] w-full items-center gap-[10px] border-b border-v1-contrast pr-6 text-left"
                  >
                    <Chevron isOpen={isOpen} />
                    <span
                      id={`pricing-section-label-${sec.key}`}
                      className="text-v1-eyebrow uppercase text-v1-frost"
                    >
                      {sec.label}
                    </span>
                  </button>
                  <div
                    id={`pricing-section-${sec.key}`}
                    role="region"
                    aria-labelledby={`pricing-section-label-${sec.key}`}
                    className={cn(
                      "grid motion-safe:transition-[grid-template-rows] motion-safe:duration-300",
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    )}
                  >
                    <div className={isOpen ? "overflow-visible" : "overflow-hidden"}>
                      <div className="flex flex-col">
                        {rows.map((row) => (
                          <FeatureRow key={row.name} feature={row} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Section>
  );
}

function PlanHeaderCol({ plan, highlight }: { plan: Plan; highlight: boolean }) {
  return (
    <motion.div
      {...reveals.body}
      className="flex flex-col items-center justify-center gap-3 px-2 text-center lg:gap-[18px] lg:px-6"
    >
      <h3 className="text-v1-heading-xs uppercase text-v1-frost">
        {plan.name}
      </h3>
      <ButtonLink
        href={plan.cta.href}
        variant={highlight ? "primary" : "secondary"}
        className="w-full max-w-[160px] !min-w-0 !px-2 lg:max-w-[180px] lg:!min-w-0 lg:!px-4"
      >
        {plan.cta.text}
      </ButtonLink>
    </motion.div>
  );
}

function Chevron({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn(
        "size-6 text-v1-frost motion-safe:transition-transform motion-safe:duration-200",
        isOpen ? "rotate-180" : ""
      )}
      aria-hidden="true"
    >
      <path
        d="M6 10 L12 16 L18 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FeatureRow({ feature }: { feature: Feature }) {
  // Per-row border uses the dimmer rgba(124,124,124,0.4) tone so the
  // row separators sit visually behind the brighter section-header
  // hairlines. The first column is sticky-left so it
  // stays visible during horizontal scroll below lg. The feature's
  // secondary description is hidden below sm to keep that sticky
  // column narrow on phones.
  return (
    <div className="grid grid-cols-[180px_repeat(4,minmax(140px,1fr))] lg:grid-cols-[1.3fr_repeat(4,minmax(0,1fr))] items-center border-b border-v1-strong/[0.4] py-3 lg:py-4">
      <div className="flex h-full items-center gap-2 pl-4 pr-3 lg:pl-[34px] lg:pr-6">
        <p className="text-v1-body-xs text-v1-frost lg:text-v1-body-sm">
          {feature.name}
        </p>
        {feature.description && (
          <InfoTip label={feature.name} text={feature.description} />
        )}
      </div>
      {PLANS.map((plan) => (
        <div
          key={plan.name}
          className="flex flex-col items-start gap-1 pl-3 pr-2 lg:pl-6 lg:pr-4"
        >
          <Cell value={feature.plans[plan.name]} />
        </div>
      ))}
    </div>
  );
}

function InfoTip({ label, text }: { label: string; text: string }) {
  return (
    <span className="group/info relative inline-flex shrink-0">
      <button
        type="button"
        aria-label={`About ${label}`}
        className="text-v1-frost/55 outline-none motion-safe:transition-colors hover:text-v1-frost focus-visible:text-v1-frost"
      >
        <InfoIcon />
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute left-0 top-[calc(100%+8px)] z-30 w-max max-w-[240px] rounded-md border border-v1-contrast bg-v1-carbon-400 px-2.5 py-2 text-left text-v1-body-xs text-v1-frost opacity-0 shadow-[0_8px_24px_rgba(0,0,0,0.45)] motion-safe:transition-opacity motion-safe:duration-150 group-hover/info:opacity-100 group-focus-within/info:opacity-100"
      >
        {text}
      </span>
    </span>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true">
      <circle
        cx="8"
        cy="8"
        r="6.25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="8" cy="5.25" r="0.85" fill="currentColor" />
      <path
        d="M8 7.25 v4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Cell({ value }: { value: FeatureCell | undefined }) {
  if (value === undefined) {
    return <span className="text-v1-body-xs text-v1-frost/40">—</span>;
  }
  if (value === true) {
    return (
      <svg
        viewBox="0 0 24 24"
        className="size-6 text-[#3DE070]"
        aria-label="Included"
        role="img"
      >
        <path
          d="M6 12 L10.5 16 L18 8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (value === false) {
    return (
      <svg
        viewBox="0 0 24 24"
        className="size-6 text-v1-frost/50"
        aria-label="Not included"
        role="img"
      >
        <path
          d="M8 8 L16 16 M16 8 L8 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (typeof value === "string") {
    return (
      <span className="text-v1-body-xs text-v1-frost lg:text-v1-body-sm">
        {value}
      </span>
    );
  }
  return (
    <div className="flex flex-col gap-1">
      <span className="text-v1-body-xs text-v1-frost lg:text-v1-body-sm">
        {value.value}
      </span>
      {value.description && (
        <span className="text-v1-body-xs italic text-v1-carbon-200">
          {value.description}
        </span>
      )}
    </div>
  );
}
