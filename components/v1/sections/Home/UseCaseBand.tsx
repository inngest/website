"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { appendRef } from "@/utils/v1/ref";
import { reveals } from "@/utils/v1/reveals";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import RegisterCue from "@/components/v1/sections/Events/RegisterCue";
import {
  onCursorTiltMove,
  onCursorTiltLeave,
  CURSOR_TILT_SEED,
} from "@/utils/v1/cursorFx";

/**
 * Homepage "From background jobs to agents, in one codebase" — a
 * use-case band directly beneath the "Durability belongs in code"
 * section. Six clickable cards (title + body + "Learn more →" cue),
 * each linking to the matching docs/platform/uses page. Exists to give
 * crawlers + answer engines concrete use-case anchor text and internal
 * links (SEO/AEO), so the copy and hrefs are the payload here.
 */

interface UseCase {
  id: string;
  title: string;
  body: string;
  href: string;
}

const USE_CASES: UseCase[] = [
  {
    id: "background-jobs",
    title: "Background jobs",
    body: "One line in your code makes any background job reliable. Automatic retries, recovery, and observability.",
    href: "/docs/guides/background-jobs",
  },
  {
    id: "messaging-queues",
    title: "Messaging queues",
    body: "Durable message queues without the infrastructure—no Redis or broker, with built-in flow control.",
    href: "/platform/flow-control",
  },
  {
    id: "workflow-orchestration",
    title: "Workflow orchestration",
    body: "Multi-step workflow orchestration in code: functions that checkpoint, wait, and fan out across steps.",
    href: "/platform/durable-execution",
  },
  {
    id: "scheduled-cron",
    title: "Scheduled & cron jobs",
    body: "Run scheduled and cron jobs as functions that sleep, fan out, parallelize, retry, and recover.",
    href: "/uses/scheduled-jobs",
  },
  {
    id: "webhooks-events",
    title: "Webhooks & Events",
    body: "Handle webhooks and event-driven functions reliably. Inngest retries failures and shows what happened.",
    href: "/uses/webhooks",
  },
  {
    id: "serverless-background-jobs",
    title: "Serverless background jobs",
    body: "Replace your serverless background job stack with one SDK you drop into your existing codebase.",
    href: "/uses/serverless-node-background-jobs",
  },
];

export default function UseCaseBand() {
  return (
    <Section aria-labelledby="home-use-cases-heading" className="relative">
      <SectionHeader
        id="home-use-cases-heading"
        title={
          <>
            From background jobs to agents,
            <br className="hidden sm:inline" /> in one codebase.
          </>
        }
        body="Add durable functions to your existing code, from background jobs and queues to AI agents. No infrastructure to provision or maintain."
        bodyClassName="max-w-[640px]"
      />
      <ul className="mt-v1-stack grid grid-cols-1 gap-[10px] pl-0 sm:grid-cols-2 lg:grid-cols-3">
        {USE_CASES.map((u, i) => (
          <motion.li key={u.id} {...reveals.item(i)} className="list-none">
            <UseCaseCard useCase={u} />
          </motion.li>
        ))}
      </ul>
    </Section>
  );
}

function UseCaseCard({ useCase }: { useCase: UseCase }) {
  // Whole-card link — anywhere on the card navigates to useCase.href;
  // the "Learn more →" cue is presentational and reacts to the card's
  // `group/card` hover. All targets are on-domain, so default prefetch
  // stays on. Accessibility: aria-label restated, focus-visible ring.
  return (
    <Link
      href={appendRef(useCase.href, "home-use-cases")}
      aria-label={`${useCase.title} — learn more`}
      onPointerMove={onCursorTiltMove}
      onPointerLeave={onCursorTiltLeave}
      style={CURSOR_TILT_SEED}
      className="group/card relative isolate flex h-full flex-col items-start justify-between gap-8 rounded-md border border-transparent p-5 hover:border-v1-frost/[0.18] hover:shadow-[0_28px_60px_-32px_rgba(0,0,0,0.55)] hover:[--lift:-4px] focus:outline-none focus-visible:ring-2 focus-visible:ring-v1-frost/30 motion-safe:transition-[transform,border-color,box-shadow] motion-safe:duration-[500ms] motion-safe:ease-v1-in"
    >
      {/* Cursor sheen — frost wash that tracks the pointer. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-0 rounded-md opacity-0 group-hover/card:opacity-100 motion-safe:transition-opacity motion-safe:duration-[420ms]"
        style={{
          background:
            "radial-gradient(360px circle at var(--mx) var(--my), rgba(232, 234, 237, 0.08), transparent 60%)",
        }}
      />

      <div className="relative flex flex-col gap-3">
        <h3 className="font-v1Heading text-[24px] font-normal leading-[1.2] tracking-[-0.01em] text-v1-frost sm:text-[28px]">
          {useCase.title}
        </h3>
        <p className="text-v1-body-sm text-v1-frost/80">{useCase.body}</p>
      </div>

      <div className="relative">
        <RegisterCue label="Learn more" />
      </div>
    </Link>
  );
}
