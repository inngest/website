"use client";

import { useEffect, useRef, type ComponentType, type SVGProps } from "react";
import { motion } from "motion/react";
import { cn } from "@/utils/v1/cn";
import { reveals } from "@/utils/v1/reveals";
import { BlackReveal } from "@/components/v1/sections/shared/BlackReveal";
import GradientFrame from "@/components/v1/sections/shared/GradientFrame";
import {
  AbTestingIcon,
  FlowControlIcon,
  ObservabilityIcon,
  SandboxesIcon,
} from "@/components/v1/sections/Home/CapabilityIcons";
import PixelEdge, {
  PIXEL_EDGE_INNER_WIDTH,
  PIXEL_EDGE_WIDTH,
} from "@/components/v1/sections/Home/PixelEdge";
import { V1_SECTION_GUTTER_X } from "@/components/v1/sections/shared/sectionShell";

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
  /** Sits before the eyebrow label, in its colour. */
  icon: ComponentType<SVGProps<SVGSVGElement>>;
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
    icon: ObservabilityIcon,
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
    icon: FlowControlIcon,
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
    icon: SandboxesIcon,
    heading: "Know what's safe",
    body: [
      "Sandboxes need durability too. Try a change without putting production traffic behind it. Run a new prompt, model, or code path in an isolated sandbox, on the same triggers and the same data as the real thing, and compare the results before you ship it to anyone.",
    ],
  },
  {
    id: "observability",
    label: "A/B Testing & Scoring",
    icon: AbTestingIcon,
    heading: "Know what works",
    body: [
      "How do you know if your agent works? If you want to know which variant actually performed better, you used to have to stitch together data from multiple systems, implement human reviews, and build a layer of instrumentation on top. Inngest captures all of this data by default, so you can add scoring the same way you add retries.",
    ],
    videoSrc: "https://cdn.inngest.com/homepage/june-2026-score-website.mp4",
  },
];

export default function CapabilityRows() {
  return (
    <section
      aria-labelledby="home-capabilities-heading"
      // overflow-x-clip (not hidden) so the pixel edge can't cause a
      // horizontal scroll while the band still rides up behind the dev
      // server frame above.
      className="relative overflow-x-clip pb-20 sm:pb-24 lg:pb-40"
    >
      <HeadlineBand />
      <div className={cn("mx-auto w-full max-w-[1440px]", V1_SECTION_GUTTER_X)}>
        <div className="mt-20 flex flex-col gap-20 lg:mt-24 lg:gap-32">
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
      </div>
    </section>
  );
}

/** How far the band rides up behind the bottom of the dev server frame. */
const BAND_OVERLAP = "clamp(56px, 11vw, 128px)";

/**
 * Blue band carrying the section headline. It bleeds off the left edge of
 * the viewport, stops square with the right edge of the dev server frame
 * (the same 1200px column inside the 1440px rail), dissolves into pixels
 * past that, and starts high enough that the frame overlaps its top edge.
 * The Quote section above sits on a higher z-index so the frame paints
 * over it.
 */
function HeadlineBand() {
  return (
    <div
      className="relative z-0"
      style={{ marginTop: `calc(-1 * ${BAND_OVERLAP})` }}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="mx-auto h-full max-w-[1440px] px-6 lg:px-8">
          <div className="relative mx-auto h-full max-w-[1200px]">
            <div className="absolute inset-y-0 left-[calc(50%-50vw)] right-0 bg-v1-accent-blue" />
            <PixelEdge
              className="absolute inset-y-0 overflow-hidden"
              style={{
                left: `calc(100% - ${PIXEL_EDGE_INNER_WIDTH}px)`,
                width: PIXEL_EDGE_WIDTH,
              }}
            />
          </div>
        </div>
      </div>

      <div
        className={cn(
          "relative mx-auto w-full max-w-[1440px]",
          V1_SECTION_GUTTER_X,
          // Keep the headline clear of the pixel edge on narrow screens,
          // where the band's right edge is only a gutter from the viewport.
          "pr-20 sm:pr-9 lg:pr-8"
        )}
        style={{
          paddingTop: `calc(${BAND_OVERLAP} + clamp(48px, 10vw, 120px))`,
          paddingBottom: "clamp(56px, 11vw, 128px)",
        }}
      >
        <motion.h2
          {...reveals.heading}
          id="home-capabilities-heading"
          className="font-whyte font-light normal-case leading-[1.15] tracking-[-0.02em] text-white [font-size:clamp(2rem,4.6vw,4rem)]"
        >
          Everything queues can&rsquo;t do, <br className="hidden sm:inline" />
          everything you don&rsquo;t <strong className="font-bold">
            want
          </strong>{" "}
          to do.
        </motion.h2>
      </div>
    </div>
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
          className="flex items-center gap-[0.6em] font-v1Label text-[clamp(0.75rem,1.05vw,0.875rem)] uppercase leading-[1.2] tracking-[0.08em] text-v1-accent-salmon"
        >
          <capability.icon className="size-[1.6em] shrink-0" />
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
