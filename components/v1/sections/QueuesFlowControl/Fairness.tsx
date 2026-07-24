"use client";

import BeforeAfterSlider from "@/components/v1/sections/shared/BeforeAfterSlider";
import ButtonLink from "@/components/v1/ButtonLink";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";

// "Solve noisy neighbors." 3-column grid: a copy column on the left
// (eyebrow + display heading + body + CTA) and a 2-column-wide
// before/after slider on the right that wipes between the unfair (Acme
// hogs 88%) and the fair (everyone 24%) capacity allocation.

const WITHOUT_SRC = "/assets/v1/queues-flow-control/fairness/without.webp";
const WITH_SRC = "/assets/v1/queues-flow-control/fairness/with.webp";
// Intrinsic dimensions of the exported slides — kept on the
// <img> tags so the browser reserves space before decode.
const SLIDE_W = 1828;
const SLIDE_H = 914;

export default function Fairness() {
  return (
    <Section
      aria-labelledby="qfc-fairness-headline"
      // 16px column gap, 1fr / 2fr columns at desktop.
      className="relative"
      containerClassName="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_2fr] lg:items-stretch lg:gap-4"
    >
      <Copy />
      <BeforeAfterSlider
        ariaLabel="Drag to compare worker capacity allocation without and with Inngest"
        aspectClassName="aspect-[912/455]"
        className="border-2 border-v1-frost"
        beforeLabel="Without Inngest"
        afterLabel="With Inngest"
        before={
          <img
            src={WITHOUT_SRC}
            alt="Without Inngest: Acme Corp consumes 88% of worker capacity while the other tenants split the remainder."
            width={SLIDE_W}
            height={SLIDE_H}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 block h-full w-full object-cover"
            draggable={false}
          />
        }
        after={
          <img
            src={WITH_SRC}
            alt="With Inngest: every tenant receives a fair, scoped share of worker capacity."
            width={SLIDE_W}
            height={SLIDE_H}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 block h-full w-full object-cover"
            draggable={false}
          />
        }
      />
    </Section>
  );
}

function Copy() {
  // Copy column; the eyebrow → title → body → CTA rhythm is baked into
  // SectionHeader. lg:pb-8 = 32px bottom pad.
  return (
    <SectionHeader
      id="qfc-fairness-headline"
      className="lg:pb-8"
      eyebrow="Multi-tenant fairness"
      title="Solve noisy neighbors."
      body="With Inngest, concurrency limits are scoped per key, per account, per org, per user. Every tenant gets a fairshare of capacity. Through every burst and blip. You write one expression. Inngest enforces it across every run, forever."
      bodyClassName="sm:max-w-[420px] lg:max-w-[362px]"
      actions={
        <ButtonLink
          href="/docs/guides/concurrency?ref=queues-flow-control"
          variant="primary"
          className="max-sm:w-full"
        >
          See Concurrency Docs
        </ButtonLink>
      }
    />
  );
}
