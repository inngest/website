"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { reveals } from "@/utils/v1/reveals";
import { BlackReveal } from "@/components/v1/sections/shared/BlackReveal";
import GradientFrame from "@/components/v1/sections/shared/GradientFrame";
import Section from "@/components/v1/sections/shared/Section";
import { V1_SECTION_TITLE } from "@/components/v1/sections/shared/sectionTitle";
import { CARDS, FeatureCardsGrid } from "./FeatureCards";
import {
  type DurabilityTabId,
  DEFAULT_DURABILITY_TAB,
  DURABILITY_PANEL_ID,
  durabilityTabButtonId,
} from "./durabilityTabs";

interface Capability {
  title: string;
  body: string;
  /** Natural intrinsic dimensions; rendered inside a 32×32 slot. */
  icon: string;
  iconWidth: number;
  iconHeight: number;
  href?: string;
}

interface TabContent {
  /** Per-tab headline, rendered as the section H2. */
  heading: string;
  /** Supporting paragraphs (each rendered as its own block). */
  body: string[];
  /** Dashboard video shown to the right of the intro copy. */
  videoSrc: string;
  /** The six capability tiles below the header. */
  capabilities: Capability[];
}

// ── Retries & Reliability ──────────────────────────────────────────────
// Real content (the original "Durability belongs in code" copy).
const RETRIES_CONTENT: TabContent = {
  heading: "Durability belongs in code",
  body: [
    "Because durability lives in code—not tied to any specific infrastructure pattern—the same primitives that power your background jobs also power agents and apps. And because Inngest handles execution, you get full observability by default.",
    "No new infrastructure. No new instrumentation. No new architecture when there’s a new ‘right way’ to build in 6 weeks’ time.",
  ],
  videoSrc:
    "https://cdn.inngest.com/homepage/june-2026-redesign-dashboard-tour-v2.mp4",
  capabilities: [
    {
      title: "AI Agents",
      body: "Pause mid-execution, wait for input, then resume exactly where you left off.",
      icon: "/assets/v1/scale-instantly/ai-agents.svg",
      iconWidth: 27.77,
      iconHeight: 32,
      href: "/ai",
    },
    {
      title: "API Endpoints",
      body: "Long-running endpoints that survive timeouts, failures, and deploys.",
      icon: "/assets/v1/scale-instantly/api-endpoints.svg",
      iconWidth: 30.02,
      iconHeight: 25.71,
      href: "/docs/learn/durable-endpoints",
    },
    {
      title: "Workflows",
      body: "Each step retries independently. No failed run restarts from scratch.",
      icon: "/assets/v1/scale-instantly/workflows.svg",
      iconWidth: 32,
      iconHeight: 32,
      href: "/ai",
    },
    {
      title: "Schedules",
      body: "Missed runs recover automatically. Every execution is logged and replayable.",
      icon: "/assets/v1/scale-instantly/schedules.svg",
      iconWidth: 32,
      iconHeight: 12.85,
      href: "/uses/scheduled-jobs",
    },
    {
      title: "Serverless",
      body: "Functions persist state across invocations without a database.",
      icon: "/assets/v1/scale-instantly/serverless.svg",
      iconWidth: 32,
      iconHeight: 20.52,
      href: "/docs/reference/typescript/v4/extended-traces#serverless",
    },
    {
      title: "Events",
      body: "Fan out thousands of jobs per event. Every one tracked, retriable, and replayable.",
      icon: "/assets/v1/scale-instantly/events.svg",
      iconWidth: 21.65,
      iconHeight: 32,
      href: "/uses/webhooks",
    },
  ],
};

// Icons + video are still placeholders for the two non-retries tabs.
// TODO(jb): supply per-tab icons (these reuse the Retries icons by index),
// a per-tab dashboard video (these reuse the Retries video), and tile
// hrefs (none set yet). `icon(i)` borrows the Retries tile icon at index i.
const icon = (i: number) => {
  const c = RETRIES_CONTENT.capabilities[i];
  return { icon: c.icon, iconWidth: c.iconWidth, iconHeight: c.iconHeight };
};

// ── Flow Control ────────────────────────────────────────────────────────
const FLOW_CONTROL_CONTENT: TabContent = {
  heading: "The control layer queues are missing",
  body: [
    "Basic queues have no idea what to do when you’ve got multiple users competing for the same resource. Noisy neighbors, hand-rolled rate limits, priority queue sprawl, wasted compute… Inngest’s flow control features ensure every user gets their fair share, without extra work.",
  ],
  videoSrc: RETRIES_CONTENT.videoSrc,
  capabilities: [
    {
      title: "Concurrency Control",
      body: "Every tenant gets their fair share, no matter how much work one of them throws at your app.",
      ...icon(0),
    },
    {
      title: "Throttling & Rate Limiting",
      body: "Absorb traffic spikes without dropping work—excess runs queue and drain at your rate.",
      ...icon(1),
    },
    {
      title: "Debouncing",
      body: "Don’t burn compute on redundant work. Collapse bursts of identical events into one execution.",
      ...icon(2),
    },
    {
      title: "Dynamic Prioritization",
      body: "Decide which work should take priority without starving the rest.",
      ...icon(3),
    },
    {
      title: "Batch Processing",
      body: "Reduce invocation costs on high-volume workloads by ensuring whatever comes first triggers the run.",
      ...icon(4),
    },
    {
      title: "Declarative Cancellation",
      body: "Cancel in-flight runs automatically if a matching event occurs.",
      ...icon(5),
    },
  ],
};

// ── Agent Observability ─────────────────────────────────────────────────
const OBSERVABILITY_CONTENT: TabContent = {
  heading: "Judge on outcomes, not output",
  body: [
    "How do you know if your agent works? If you want to know which variant actually performed better, you used to have to stitch together data from multiple systems, implement human reviews, and build a layer of instrumentation on top. Inngest captures all of this data by default, so you can add scoring the same way you add retries.",
  ],
  videoSrc: RETRIES_CONTENT.videoSrc,
  capabilities: [
    {
      title: "Scoring",
      body: "One shot was never enough. We let you use real production outcomes to eval variants.",
      ...icon(0),
    },
    {
      title: "Live Experiments",
      body: "Test what works against live production traffic, or in a sandbox.",
      ...icon(1),
    },
    {
      title: "100% not 1%",
      body: "Track outcomes across every run, without needing to sample.",
      ...icon(2),
    },
    {
      title: "Datasets",
      body: "Generate datasets of good and bad runs for evals and offline replay.",
      ...icon(3),
    },
    {
      title: "Sessions",
      body: "Group multiple agent loops or turns as a single conversation, thread, or however you choose.",
      ...icon(4),
    },
    // TODO(jb): the source listed “Scoring” twice — replace this sixth tile
    // with the intended capability.
    {
      title: "[Needs copy]",
      body: "[Placeholder] Sixth Agent Observability capability goes here.",
      ...icon(5),
    },
  ],
};

const TAB_CONTENT: Record<DurabilityTabId, TabContent> = {
  retries: RETRIES_CONTENT,
  "flow-control": FLOW_CONTROL_CONTENT,
  observability: OBSERVABILITY_CONTENT,
};

export default function ScaleInstantly({
  activeTab = DEFAULT_DURABILITY_TAB,
  onSelect,
}: {
  activeTab?: DurabilityTabId;
  /** When provided, the three feature cards render inside this section as
   *  a tablist driving the panel below. */
  onSelect?: (id: DurabilityTabId) => void;
}) {
  const content = TAB_CONTENT[activeTab];
  return (
    <Section aria-label="Durability belongs in code" className="relative">
      <GradientFrame
        variant="charcoal"
        className="rounded-md"
        innerClassName="relative flex flex-col pb-[72px]"
      >
        {/* Tabs — the three feature cards form a full-width bar flush to
            the panel's top edge (no surrounding padding) so they read as
            the panel's own tab strip. */}
        <FeatureCardsGrid
          cards={CARDS}
          selectedId={activeTab}
          onSelect={onSelect}
        />

        {/* Heading + content sit below the tab bar with the panel's
            normal inset padding. role=tabpanel wires this content to the
            tablist above; `key` replays the reveal animations on tab
            change so the new copy fades in rather than swapping in place. */}
        <div className="px-4 pt-11 lg:px-11 lg:pt-16">
          <motion.h2 {...reveals.heading} className={V1_SECTION_TITLE}>
            {content.heading}
          </motion.h2>

          <div
            key={activeTab}
            id={DURABILITY_PANEL_ID}
            role="tabpanel"
            aria-labelledby={durabilityTabButtonId(activeTab)}
            className="mt-8 flex flex-col gap-[29px] lg:mt-12 lg:gap-20"
          >
            <Header content={content} />
            <CapabilityGrid capabilities={content.capabilities} />
          </div>
        </div>
      </GradientFrame>
    </Section>
  );
}

function Header({ content }: { content: TabContent }) {
  return (
    <div
      className="
        grid grid-cols-1 gap-4
        lg:grid-cols-[448fr_774fr] lg:items-start lg:gap-x-4 lg:gap-y-10
      "
    >
        <div className="flex flex-col gap-6 lg:pr-8 lg:pt-11">
          <motion.p
            {...reveals.body}
            className="text-v1-body-lg-loose !text-[clamp(1rem,3vw,1.125rem)] !leading-[1.45] text-v1-frost"
          >
            {content.body.map((paragraph, i) => (
              <span key={i} className={i === 0 ? "block" : "mt-[1.5em] block"}>
                {paragraph}
              </span>
            ))}
          </motion.p>
        </div>
        <GradientFrame className="relative rounded-md" variant="charcoal">
          <BlackReveal block>
            <DashboardVideo src={content.videoSrc} />
          </BlackReveal>
        </GradientFrame>
      </div>
  );
}

function DashboardVideo({ src }: { src: string }) {
  return (
    <div
      className="relative w-full overflow-hidden bg-v1-jetBlack"
      style={{ aspectRatio: "1980 / 1080" }}
    >
      <video controls autoPlay loop muted src={src} />
    </div>
  );
}

function CapabilityGrid({ capabilities }: { capabilities: Capability[] }) {
  return (
    <ul
      className="
        grid grid-cols-1 gap-[22px]
        lg:grid-cols-3 lg:gap-[58px]
      "
    >
      {capabilities.map((c, i) => (
        <CapabilityTile key={c.title} capability={c} index={i} />
      ))}
    </ul>
  );
}

function CapabilityTile({
  capability,
  index,
}: {
  capability: Capability;
  index: number;
}) {
  const inner = (
    <>
      <div className="flex items-center gap-[10px]">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center">
          <img
            src={capability.icon}
            alt=""
            aria-hidden="true"
            width={capability.iconWidth}
            height={capability.iconHeight}
            className="block"
          />
        </span>
        <h3 className="text-v1-heading-xs text-v1-frost lg:text-v1-heading-card">
          {capability.title}
        </h3>
      </div>
      <p className="text-v1-heading-xs-loose text-pretty text-[#B3B3B3]">
        {capability.body}
      </p>
    </>
  );

  return (
    <motion.li {...reveals.item(index)} className="flex flex-col gap-2">
      {capability.href ? (
        <Link
          href={capability.href}
          prefetch={false}
          className="-m-3 flex flex-col gap-2 rounded-md p-3 hover:bg-gradient-to-br hover:from-white/[0.06] hover:to-white/[0.02] motion-safe:transition-colors motion-safe:duration-200"
        >
          {inner}
        </Link>
      ) : (
        <div className="flex cursor-default flex-col gap-2">{inner}</div>
      )}
    </motion.li>
  );
}
