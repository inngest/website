"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@/utils/v1/cn";
import { appendRef } from "@/utils/v1/ref";
import { reveals } from "@/utils/v1/reveals";
import { useIsDesktop } from "@/utils/v1/hooks/useIsDesktop";
import GradientFrame from "@/components/v1/sections/shared/GradientFrame";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import { HOME_SECTION_TITLE } from "@/components/v1/sections/shared/sectionTitle";

interface Capability {
  id: string;
  label: string;
  heading: string;
  body: string;
  /** Site line-art icon (white stroke) shown beside the label — same
   *  family as the use-case band's icons. */
  icon: string;
  videoSrc?: string;
  /** Seconds to skip at the start of the clip, including each loop. */
  videoStart?: number;
  docsHref: string;
}

const CAPABILITIES: Capability[] = [
  {
    id: "retries",
    label: "Observability",
    heading: "Know what happened",
    icon: "/assets/v1/feature-cards/observability.svg",
    body: "No more bespoke instrumentation. Inngest executes your functions, so you get observability by default. Trace every background job, agent, and event from trigger to completion, and use that data to evaluate outcomes on real production traffic.",
    videoSrc:
      "https://cdn.inngest.com/homepage/june-2026-redesign-dashboard-tour-v2.mp4",
    docsHref: "/docs/platform/monitor/traces",
  },
  {
    id: "flow-control",
    label: "Flow control",
    heading: "Know what to run",
    icon: "/assets/v1/primitives/icon-3-flow-control.svg",
    body: "Basic queues don't know what to do when multiple users compete for the same resource. Noisy neighbors, hand-rolled rate limits, wasted compute… Inngest’s flow control ensures every user gets their fair share, without extra work.",
    videoSrc:
      "https://cdn.inngest.com/homepage/june-2026-flow-control-website.mp4",
    docsHref: "/docs/guides/flow-control",
  },
  {
    id: "sandboxes",
    label: "Sandboxes",
    heading: "Know what's safe",
    icon: "/assets/v1/primitives/icon-6-local-env.svg",
    body: "Sandboxes need durability too. Try a change without putting production traffic behind it. Run a new prompt, model, or code path in an isolated sandbox, on the same triggers and the same data as the real thing, and compare the results before you ship it to anyone.",
    videoSrc:
      "https://cdn.inngest.com/videos/homepage-sandbox-demo/sandbox-black/master.m3u8",
    videoStart: 3,
    docsHref: "/docs",
  },
  {
    id: "observability",
    label: "A/B Testing & Scoring",
    heading: "Know what works",
    icon: "/assets/v1/primitives/icon-4-human-loop.svg",
    body: "How do you know if your agent works? If you want to know which variant actually performed better, you used to have to stitch together data from multiple systems, implement human reviews, and build a layer of instrumentation on top. Inngest captures all of this data by default, so you can add scoring the same way you add retries.",
    videoSrc: "https://cdn.inngest.com/homepage/june-2026-score-website.mp4",
    docsHref: "/docs/learn/agent-evals",
  },
];

/**
 * Capabilities chapter — the homepage's one full-bleed colour moment.
 *
 * A brand-blue slab runs edge to edge behind the section header. It
 * starts inside the previous (demo) section's bottom padding, so the
 * demo video appears to rest on it, and ends partway down the first
 * step, so the content appears to rise out of it. The slab is a solid
 * `accent-blue` fill plus the Figma pixel-dissolve PNG anchored at the
 * right edge; the fill is what makes it hold at any viewport width.
 *
 * Below the header, the four capabilities are told as a sequence —
 * know what happened → what to run → what's safe → what works — as
 * scroll-driven rows at lg+: copy left, that step's video right, a
 * step rail down the edge (the same "steps of a run" idea as the
 * hero's trace). Every video stays visible and playing; the row in
 * focus is full-contrast and the rest dim together. Below lg the rows
 * become stacked cards, video over copy.
 */
export default function Capabilities() {
  const isDesktop = useIsDesktop();
  const [active, setActive] = useState(0);

  return (
    <Section
      aria-labelledby="home-capabilities-heading"
      className="relative"
      containerClassName="relative"
    >
      <div className="relative">
        <BlueSlab />
        <SectionHeader
          id="home-capabilities-heading"
          title={
            <>
              Everything queues can&rsquo;t do; everything you don&rsquo;t want
              to do.
            </>
          }
          titleClassName={cn(HOME_SECTION_TITLE, "max-w-[1120px]")}
          className="relative"
        />
      </div>

      {/* Desktop: scroll-driven rows. Each row carries its own video; the
          row in focus is full-contrast, the others dim as one. */}
      <ol className="relative mt-v1-stack hidden list-none pl-0 lg:mt-v1-stack-lg lg:block">
        {CAPABILITIES.map((capability, i) => (
          <Step
            key={capability.id}
            capability={capability}
            index={i}
            isActive={i === active}
            isPast={i < active}
            onInView={() => setActive(i)}
            enabled={isDesktop}
          />
        ))}
      </ol>

      {/* Mobile / tablet: stacked cards. */}
      <ul className="relative mt-v1-stack flex list-none flex-col gap-6 pl-0 lg:hidden">
        {CAPABILITIES.map((capability, i) => (
          <motion.li
            key={capability.id}
            {...reveals.item(i)}
            className="list-none"
          >
            <StackedCard capability={capability} enabled={!isDesktop} />
          </motion.li>
        ))}
      </ul>
    </Section>
  );
}

/**
 * Full-bleed blue backdrop. Breaks out of the contained column with the
 * `left-1/2 w-screen -translate-x-1/2` trick, then extends above the
 * header (through this section's top padding and the demo section's
 * bottom padding, plus a 96px bite into the video) and below it (the
 * header→content gap plus 96px into the first step / card).
 */
function BlueSlab() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -bottom-[6rem] -top-[13rem] left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-v1-accent-blue sm:-top-[16rem] lg:-bottom-[12rem] lg:-top-[26rem]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/v1/home/figma-blue-band.png"
        alt=""
        width={1311}
        height={638}
        className="absolute inset-y-0 right-0 h-full w-auto max-w-none object-cover object-right"
      />
    </div>
  );
}

const CAP_ICON_MASK = (src: string) => ({
  maskImage: `url(${src})`,
  WebkitMaskImage: `url(${src})`,
  maskSize: "contain",
  WebkitMaskSize: "contain",
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
  maskPosition: "left center",
  WebkitMaskPosition: "left center",
});

/** Icon + label row. The site line-art SVG is used as a CSS mask over
 *  `currentColor`, so it takes the exact eyebrow colour. */
function Eyebrow({ capability }: { capability: Capability }) {
  return (
    <p className="flex items-center gap-2 text-v1-accent-salmon">
      <span
        aria-hidden="true"
        className="block h-4 w-5 shrink-0 bg-current"
        style={CAP_ICON_MASK(capability.icon)}
      />
      <span className="text-v1-label-sm uppercase">{capability.label}</span>
    </p>
  );
}

/**
 * One row in the desktop sequence: copy on the left, its own video on
 * the right, a rail dot between row and page edge. The row whose box
 * crosses the viewport's middle band is in focus; the others — copy
 * and video together — dim to 40%, so the eye lands on one story at a
 * time while every animation stays visible. Rows own their vertical
 * spacing (py) rather than using a flex gap so the rail segment each
 * row draws joins the next without a break.
 */
function Step({
  capability,
  index,
  isActive,
  isPast,
  onInView,
  enabled,
}: {
  capability: Capability;
  index: number;
  isActive: boolean;
  isPast: boolean;
  onInView: () => void;
  enabled: boolean;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const onInViewRef = useRef(onInView);
  onInViewRef.current = onInView;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onInViewRef.current();
      },
      // A thin band across the viewport's middle: whichever row
      // overlaps it is the one the reader is looking at.
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const isFirst = index === 0;
  const isLast = index === CAPABILITIES.length - 1;

  return (
    <li
      ref={ref}
      aria-current={isActive ? "step" : undefined}
      className={cn("relative pl-10", !isFirst && "pt-5", !isLast && "pb-5")}
    >
      {/* Rail segments: upper half (not on the first row) and lower half
          (not on the last), meeting under the dot at the row's centre. */}
      {!isFirst && (
        <span
          aria-hidden="true"
          className="absolute left-[5px] top-0 h-1/2 w-px bg-v1-frost/[0.12]"
        />
      )}
      {!isLast && (
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-[5px] h-1/2 w-px bg-v1-frost/[0.12]"
        />
      )}
      {/* Rail dot: salmon and lit while in focus, quiet frost once
          passed, dim before. */}
      <span
        aria-hidden="true"
        className={cn(
          "border-v1-canvasBase absolute left-0 top-1/2 size-[11px] -translate-y-1/2 rounded-full border-2",
          "motion-safe:transition-[background-color,box-shadow] motion-safe:duration-500",
          isActive
            ? "bg-v1-accent-salmon shadow-[0_0_0_4px_rgb(var(--color-v1-salmon-200)/0.25),0_0_18px_rgb(var(--color-v1-salmon-200)/0.6)]"
            : isPast
            ? "bg-v1-frost/60"
            : "bg-v1-frost/20"
        )}
      />

      <div
        className={cn(
          "grid grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-center gap-x-12",
          "motion-safe:transition-opacity motion-safe:duration-500 motion-safe:ease-v1-out",
          isActive ? "opacity-100" : "opacity-40"
        )}
      >
        <div className="flex max-w-[480px] flex-col gap-5">
          <div className="flex flex-col gap-3">
            <Eyebrow capability={capability} />
            <h3 className="font-v1Heading text-[clamp(2rem,3vw,2.75rem)] leading-[1.1] tracking-[-0.02em] text-v1-frost">
              {capability.heading}
            </h3>
          </div>
          <p className="text-v1-body-lg-loose !text-v1-frost">
            {capability.body}
          </p>
          <div className="pt-1">
            <DocsCue
              href={appendRef(capability.docsHref, `homepage-${capability.id}`)}
            />
          </div>
        </div>

        <GradientFrame
          variant="charcoal"
          className="rounded-[10px]"
          innerClassName="relative aspect-video [background-color:rgb(var(--color-v1-bg-canvas-base)/0.85)]"
        >
          {capability.videoSrc && (
            <RowVideo
              src={capability.videoSrc}
              label={capability.label}
              startAt={capability.videoStart}
              play
              enabled={enabled}
            />
          )}
        </GradientFrame>
      </div>
    </li>
  );
}

/** Below lg: a plain stacked card, video over copy. Plays when in view. */
function StackedCard({
  capability,
  enabled,
}: {
  capability: Capability;
  enabled: boolean;
}) {
  return (
    <GradientFrame
      variant="charcoal"
      className="h-full rounded-[10px]"
      innerClassName="flex h-full flex-col [background-color:rgb(var(--color-v1-bg-canvas-base)/0.85)]"
    >
      <div className="relative aspect-video w-full overflow-hidden border-b border-v1-frost/[0.08] bg-v1-surfaceElevated">
        {capability.videoSrc && (
          <RowVideo
            src={capability.videoSrc}
            label={capability.label}
            startAt={capability.videoStart}
            play
            enabled={enabled}
          />
        )}
      </div>
      <div className="flex flex-col gap-4 p-5 sm:p-6">
        <div className="flex flex-col gap-3">
          <Eyebrow capability={capability} />
          <h3 className="text-v1-heading-sm text-v1-frost">
            {capability.heading}
          </h3>
        </div>
        <p className="text-v1-body-sm !text-v1-frost">{capability.body}</p>
        <div className="pt-1">
          <DocsCue
            href={appendRef(capability.docsHref, `homepage-${capability.id}`)}
          />
        </div>
      </div>
    </GradientFrame>
  );
}

/**
 * "See docs →" — the same text-cue vocabulary the lower page uses for
 * card links (Learn more → / Get started → / See docs →).
 */
function DocsCue({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="group/cta text-v1-label-md inline-flex w-fit items-center uppercase text-v1-frost hover:text-v1-accent-salmon focus:outline-none focus-visible:text-v1-accent-salmon motion-safe:transition-colors motion-safe:duration-300"
    >
      <span>See docs</span>
      <span
        aria-hidden="true"
        className="ml-2 inline-block group-hover/cta:translate-x-[6px] motion-safe:transition-transform motion-safe:duration-[400ms] motion-safe:ease-v1-in"
      >
        →
      </span>
    </Link>
  );
}

function isHls(src: string) {
  return /\.m3u8(\?.*)?$/i.test(src);
}

function RowVideo({
  src,
  label,
  startAt,
  play,
  enabled = true,
}: {
  src: string;
  label: string;
  startAt?: number;
  /** External gate — the video only plays while this is true AND it is
   *  in view. The showcase flips it to the active step. */
  play: boolean;
  /** False for the copy rendered at a breakpoint that is display:none,
   *  so only one set of videos attaches a source and loads. */
  enabled?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  // Playback is driven from state, not refs, so every input change
  // (scrolled into view, hover hand-off, media becoming ready) re-runs
  // the single play/pause decision below. A play() issued before the
  // media is ready can silently no-op; `ready` flipping retries it.
  const [inView, setInView] = useState(false);
  const [ready, setReady] = useState(false);

  // Attach the source (hls.js for .m3u8 where native HLS is missing)
  // and observe visibility. Bound once per source.
  useEffect(() => {
    const video = ref.current;
    if (!video || !enabled) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let hls: import("hls.js").default | undefined;
    let cancelled = false;

    const attach = async () => {
      if (!isHls(src) || video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
        return;
      }
      const { default: Hls } = await import("hls.js");
      if (cancelled) return;
      if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          startPosition: startAt ?? -1,
        });
        hls.loadSource(src);
        hls.attachMedia(video);
      } else {
        video.src = src;
      }
    };
    void attach();

    const onReady = () => {
      // Park on the clip's first useful frame so a paused card never
      // shows black.
      if (startAt != null && video.currentTime < startAt - 0.4) {
        video.currentTime = startAt;
      }
      setReady(true);
    };
    const onEnded = () => {
      if (startAt == null) return;
      video.currentTime = startAt;
    };
    video.addEventListener("loadeddata", onReady);
    if (startAt != null) video.addEventListener("ended", onEnded);
    if (video.readyState >= 2) onReady();

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 }
    );
    observer.observe(video);
    return () => {
      cancelled = true;
      observer.disconnect();
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("ended", onEnded);
      hls?.destroy();
    };
  }, [src, startAt, enabled]);

  // The one play/pause decision.
  useEffect(() => {
    const video = ref.current;
    if (!video || !enabled) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (inView && play) {
      if (startAt != null && video.currentTime < startAt - 0.4) {
        video.currentTime = startAt;
      }
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [inView, play, ready, startAt, enabled]);

  return (
    <div className="absolute inset-0">
      <video
        ref={ref}
        className="block h-full w-full object-cover"
        aria-label={`${label} in the Inngest dashboard`}
        loop={startAt == null}
        muted
        playsInline
        preload="metadata"
      />
    </div>
  );
}
