"use client";

import { useState } from "react";
import { motion } from "motion/react";
import ButtonLink from "@/components/v1/ButtonLink";
import Section from "@/components/v1/sections/shared/Section";
import { cn } from "@/utils/v1/cn";
import { reveals } from "@/utils/v1/reveals";
import {
  FEATURES,
  FEATURE_SECTIONS,
  PLANS,
  PLAN_NAMES,
  type Feature,
  type FeatureCell,
  type Plan,
} from "./plans";

// "PLAN FEATURES" comparison.
// Left column carries the section eyebrow ("PLAN FEATURES") + the
// per-plan CTA stack; the rest of the row is taken up by feature
// rows grouped under accordion-style category headers.

const SECTIONS = [
  { key: "all", label: "Plan Comparison" },
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
    <Section aria-labelledby="pricing-compare-heading" className="relative">
      {/* Below lg the inner table is wider than the viewport and
          scrolls horizontally; at lg+ the min-width matches the
          natural content so there's no overflow. */}
      <div className="-mx-6 overflow-x-auto sm:-mx-9 lg:mx-0 lg:overflow-visible">
        <div className="min-w-[660px] px-6 sm:px-9 lg:min-w-0 lg:px-0">
          {/* Header row: PLAN FEATURES on left, 3 plan CTAs across the
              right. Each cell sits in its own column with a single
              cdcdcd hairline at the bottom. Below lg the entire table
              scrolls horizontally inside the outer overflow wrapper. */}
          <div className="grid min-h-[80px] grid-cols-[180px_repeat(3,minmax(160px,1fr))] items-center border-b border-v1-contrast py-3 lg:h-[122px] lg:min-h-0 lg:grid-cols-[1.5fr_repeat(3,minmax(0,1fr))] lg:py-0">
            <div className="flex h-full items-center pr-4 lg:pr-6">
              <motion.h2
                {...reveals.heading}
                id="pricing-compare-heading"
                className="text-v1-heading-xs sm:text-v1-heading-sm lg:text-v1-heading-card uppercase text-v1-frost"
              >
                Plan features
              </motion.h2>
            </div>
            {PLANS.map((plan, i) => (
              <PlanHeaderCol key={plan.name} plan={plan} highlight={i === 1} />
            ))}
          </div>

          {/* Sections */}
          <div className="flex flex-col">
            {SECTIONS.map((sec) => {
              const rows =
                sec.key === "all"
                  ? FEATURES
                  : FEATURES.filter((f) => f.section === sec.key);
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
                    <div className="overflow-hidden">
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
      <h3 className="text-v1-label-sm uppercase text-v1-frost lg:text-v1-label-md">
        {plan.name}
      </h3>
      <ButtonLink
        href={plan.cta.href}
        variant={highlight ? "primary" : "secondary"}
        className="w-full max-w-[180px] !min-w-0 !px-3 lg:!min-w-[154px] lg:!px-5"
      >
        {plan.name === PLAN_NAMES.enterprise
          ? "Contact Us"
          : plan.name === PLAN_NAMES.pro
            ? "Start Building"
            : "Get Started"}
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
    <div className="grid grid-cols-[180px_repeat(3,minmax(160px,1fr))] lg:grid-cols-[1.5fr_repeat(3,minmax(0,1fr))] items-center border-b border-v1-strong/[0.4] py-3 lg:py-4">
      <div className="flex h-full flex-col justify-center gap-1 pl-4 pr-3 lg:gap-1.5 lg:pl-[34px] lg:pr-6">
        <div className="flex items-center gap-2">
          <p className="text-v1-body-xs text-v1-frost lg:text-v1-body-sm">
            {feature.name}
          </p>
          {feature.infoUrl && feature.infoUrl !== "#" && (
            <a
              href={feature.infoUrl}
              aria-label={`More info about ${feature.name}`}
              className="text-v1-frost/70 motion-safe:transition-colors hover:text-v1-frost"
            >
              <InfoIcon />
            </a>
          )}
        </div>
        {feature.description && (
          <p className="hidden text-v1-body-xs text-v1-frost sm:block">
            {feature.description}
          </p>
        )}
      </div>
      {PLANS.map((plan) => (
        <div
          key={plan.name}
          className="flex flex-col items-start gap-1 pl-4 pr-3 lg:pl-[82px] lg:pr-6"
        >
          <Cell value={feature.plans[plan.name]} />
        </div>
      ))}
    </div>
  );
}

function InfoIcon() {
  // file-list-line icon — 20×19.5 white-ish glyph next
  // to each feature name.
  return (
    <svg
      viewBox="0 0 20 20"
      className="size-5 shrink-0"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="2"
        width="14"
        height="16"
        rx="1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <line x1="6" y1="6.5" x2="14" y2="6.5" stroke="currentColor" strokeWidth="1.2" />
      <line x1="6" y1="10" x2="14" y2="10" stroke="currentColor" strokeWidth="1.2" />
      <line x1="6" y1="13.5" x2="11" y2="13.5" stroke="currentColor" strokeWidth="1.2" />
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
        <span className="text-v1-body-xs text-v1-carbon-200 lg:text-v1-body-sm">
          {value.description}
        </span>
      )}
    </div>
  );
}
