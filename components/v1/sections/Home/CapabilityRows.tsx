"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { cn } from "@/utils/v1/cn";
import { reveals } from "@/utils/v1/reveals";
import { BlackReveal } from "@/components/v1/sections/shared/BlackReveal";
import GradientFrame from "@/components/v1/sections/shared/GradientFrame";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";

/**
 * The durability capabilities as alternating copy/video rows —
 * the flat version of what used to be a tablist over a single panel.
 * Copy sits left on the odd rows and right on the even ones, so the eye
 * zig-zags down the section instead of scanning identical rows.
 *
 * Videos are the same dashboard tours the tabbed panel played, and each
 * only starts once its row is on screen: several autoplaying streams on
 * one page is a lot of decode work to spend on content nobody has
 * scrolled to yet.
 */

interface Capability {
  id: string;
  /** Short name, used as the row's eyebrow. */
  label: string;
  heading: string;
  /** Each entry renders as its own paragraph. */
  body: string[];
  /** Omit to render the placeholder frame until a recording exists. */
  videoSrc?: string;
}

const CAPABILITIES: Capability[] = [
  {
    id: "retries",
    label: "Observability",
    heading: "Know what happened",
    body: [
      "No more grepping logs, or building separate instrumentation. Inngest executes your functions, so you get observability by default. Trace every background job, agent, and event from trigger to completion, and use that data to evaluate outcomes on real production traffic.",
    ],
    videoSrc:
      "https://cdn.inngest.com/homepage/june-2026-redesign-dashboard-tour-v2.mp4",
  },
  {
    id: "flow-control",
    label: "Flow control",
    heading: "Know what to run",
    body: [
      "Basic queues have no idea what to do when you’ve got multiple users competing for the same resource. Noisy neighbors, hand-rolled rate limits, priority queue sprawl, wasted compute… Inngest’s flow control features ensure every user gets their fair share, without extra work.",
    ],
    videoSrc:
      "https://cdn.inngest.com/homepage/june-2026-flow-control-website.mp4",
  },
  {
    id: "sandboxes",
    label: "Sandboxes",
    heading: "Know what's safe",
    body: [
      "Sandboxes need durability too. Try a change without putting production traffic behind it. Run a new prompt, model, or code path in an isolated sandbox, on the same triggers and the same data as the real thing, and compare the results before you ship it to anyone.",
    ],
  },
  {
    id: "observability",
    label: "A/B Testing & Scoring",
    heading: "Know what works",
    body: [
      "How do you know if your agent works? If you want to know which variant actually performed better, you used to have to stitch together data from multiple systems, implement human reviews, and build a layer of instrumentation on top. Inngest captures all of this data by default, so you can add scoring the same way you add retries.",
    ],
    videoSrc: "https://cdn.inngest.com/homepage/june-2026-score-website.mp4",
  },
];

export default function CapabilityRows() {
  return (
    <Section
      aria-labelledby="home-capabilities-heading"
      // Tighter top than the standard section rhythm: the dev server
      // frame above already ends in whitespace, so the full 160px reads
      // as a hole between the two.
      className="relative pt-12 sm:pt-14 lg:pt-20"
    >
      <SectionHeader
        id="home-capabilities-heading"
        title={
          <>
            Everything queues can&rsquo;t do,
            <br className="hidden sm:inline" /> everything you don&rsquo;t want
            to do.
          </>
        }
      />
      <div className="mt-v1-stack flex flex-col gap-20 lg:mt-24 lg:gap-32">
        {CAPABILITIES.map((capability, i) => (
          <Row
            key={capability.id}
            capability={capability}
            // Alternate which side the video lands on, starting with
            // copy-left.
            mediaFirst={i % 2 === 1}
          />
        ))}
      </div>
    </Section>
  );
}

function Row({
  capability,
  mediaFirst,
}: {
  capability: Capability;
  mediaFirst: boolean;
}) {
  return (
    <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-x-16">
      <div className={cn("flex flex-col gap-5", mediaFirst && "lg:order-2")}>
        <motion.p
          {...reveals.body}
          className="font-v1Label text-[clamp(0.75rem,1.05vw,0.875rem)] uppercase leading-[1.2] tracking-[0.08em] text-v1-accent-salmon"
        >
          {capability.label}
        </motion.p>
        <motion.h3
          {...reveals.heading}
          className="font-v1Display uppercase leading-[1.1] tracking-[-0.01em] text-v1-frost [font-size:clamp(1.75rem,3.2vw,2.75rem)]"
        >
          {capability.heading}
        </motion.h3>
        <motion.p
          {...reveals.body}
          className="text-v1-body-lg-loose !text-[clamp(1rem,1.35vw,1.125rem)] !leading-[1.5] text-v1-frost"
        >
          {capability.body.map((paragraph, i) => (
            <span key={i} className={i === 0 ? "block" : "mt-[1.5em] block"}>
              {paragraph}
            </span>
          ))}
        </motion.p>
      </div>

      <GradientFrame
        className={cn("relative rounded-md", mediaFirst && "lg:order-1")}
        variant="charcoal"
      >
        <BlackReveal block>
          {capability.videoSrc ? (
            <RowVideo src={capability.videoSrc} label={capability.label} />
          ) : (
            <MediaPlaceholder label={capability.label} />
          )}
        </BlackReveal>
      </GradientFrame>
    </div>
  );
}

/** Same box the videos occupy, so dropping a recording in later doesn't
 *  change the row's geometry. */
function MediaPlaceholder({ label }: { label: string }) {
  return (
    <div
      className="relative flex w-full items-center justify-center bg-v1-jetBlack"
      style={{ aspectRatio: "1980 / 1080" }}
    >
      <span className="font-v1Label text-[11px] uppercase tracking-[0.08em] text-v1-muted">
        {label} video
      </span>
    </div>
  );
}

function RowVideo({ src, label }: { src: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.25 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden bg-v1-jetBlack"
      style={{ aspectRatio: "1980 / 1080" }}
    >
      <video
        ref={ref}
        className="block h-full w-full"
        src={src}
        aria-label={`${label} in the Inngest dashboard`}
        loop
        muted
        playsInline
        preload="metadata"
      />
    </div>
  );
}
