"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@/utils/v1/cn";
import { appendRef } from "@/utils/v1/ref";
import { reveals } from "@/utils/v1/reveals";
import { useMediaQuery } from "@/utils/v1/hooks/useMediaQuery";
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
 * row of cards, so the cards appear to rise out of it. The slab is a
 * solid `accent-blue` fill plus the Figma pixel-dissolve PNG anchored
 * at the right edge; the fill is what makes it hold at any viewport
 * width (the PNG alone is 1311px wide).
 *
 * Below the header, the four capabilities are four full-width framed
 * cards, stacked. Each card is horizontal from md up — video on the
 * left at 16:9, copy centred beside it — so the copy column is wide
 * enough to set the body a size up and keep it to a few lines; on
 * mobile the media stacks above the copy. Same `GradientFrame` the
 * platform section uses, so the two product chapters share one
 * surface language.
 */
/**
 * Desktop with a real pointer: one video at a time. The first card
 * (Observability) plays by default; hovering or focusing another card
 * hands playback to it, and leaving hands it back. Touch / narrow
 * viewports have no hover, so every in-view video plays.
 */
const HOVER_PLAYBACK_MQ = "(min-width: 1024px) and (hover: hover)";

export default function Capabilities() {
  const hoverPlayback = useMediaQuery(HOVER_PLAYBACK_MQ);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const activeId = hoveredId ?? CAPABILITIES[0].id;
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

      <ul className="relative mt-v1-stack flex flex-col gap-6 pl-0 lg:mt-v1-stack-lg">
        {CAPABILITIES.map((capability, i) => (
          <motion.li
            key={capability.id}
            {...reveals.item(i)}
            className="list-none"
          >
            <CapabilityCard
              capability={capability}
              play={!hoverPlayback || activeId === capability.id}
              onActivate={() => setHoveredId(capability.id)}
              onDeactivate={() =>
                setHoveredId((cur) => (cur === capability.id ? null : cur))
              }
            />
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
 * header→grid gap plus 96px into the first card row).
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

function CapabilityCard({
  capability,
  play,
  onActivate,
  onDeactivate,
}: {
  capability: Capability;
  play: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
}) {
  return (
    // Hover/focus state: 4px lift + a neutral depth shadow with a 1px
    // frost ring (the design system's card-hover token adds a salmon
    // glow, which read as a red halo here, so this is the same depth
    // stack without the tint). Applied as an arbitrary box-shadow
    // property; Tailwind's shadow utility can't take a multi-layer
    // value. Pointer handlers are mouse-only so a touch tap doesn't
    // leave a card stuck active.
    <div
      className="group/cap h-full rounded-[10px] ease-v1-out focus-within:-translate-y-1 focus-within:[box-shadow:0_28px_72px_-20px_rgb(0_0_0/0.7),0_12px_32px_-14px_rgb(0_0_0/0.5),0_0_0_1px_rgb(255_255_255/0.18)] hover:-translate-y-1 hover:[box-shadow:0_28px_72px_-20px_rgb(0_0_0/0.7),0_12px_32px_-14px_rgb(0_0_0/0.5),0_0_0_1px_rgb(255_255_255/0.18)] motion-safe:transition-[transform,box-shadow] motion-safe:duration-300"
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") onActivate();
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") onDeactivate();
      }}
      onFocus={onActivate}
      onBlur={onDeactivate}
    >
      {/* An 85%-opaque canvas-colour base sits under the charcoal
          gradient, which fades to transparent at one corner. Fully
          transparent, the blue slab behind the top row fought the copy;
          fully opaque, the cards lost their depth — 0.85 lets the slab
          tint the surface faintly while the text stays legible. Written
          as an arbitrary property so tailwind-merge doesn't treat it as
          a conflict with the frame's gradient background class. */}
      <GradientFrame
        variant="charcoal"
        className="h-full rounded-[10px]"
        innerClassName="flex h-full flex-col [background-color:rgb(var(--color-v1-bg-canvas-base)/0.85)] md:flex-row"
      >
        {/* Media column: a 16:9 box at every width. Side-by-side (md+)
            it sets the card height and the copy centres beside it. */}
        <div className="relative aspect-video w-full shrink-0 overflow-hidden border-b border-v1-frost/[0.08] bg-v1-surfaceElevated md:w-1/2 md:border-b-0 md:border-r">
          {capability.videoSrc ? (
            <RowVideo
              src={capability.videoSrc}
              label={capability.label}
              startAt={capability.videoStart}
              play={play}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-v1-body-sm">{capability.label} video</span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col justify-center gap-5 p-6 md:p-8 lg:p-12">
          <div className="flex flex-col gap-3">
            {/* Icon + label row. The icon is the site line-art SVG used
                as a CSS mask over `currentColor`, so it takes the exact
                eyebrow colour (an <img> can't be tinted). Label-sm (12px
                mono) keeps the row quieter than the title. */}
            <p className="flex items-center gap-2 text-v1-accent-salmon">
              <span
                aria-hidden="true"
                className="block h-4 w-5 shrink-0 bg-current"
                style={{
                  maskImage: `url(${capability.icon})`,
                  WebkitMaskImage: `url(${capability.icon})`,
                  maskSize: "contain",
                  WebkitMaskSize: "contain",
                  maskRepeat: "no-repeat",
                  WebkitMaskRepeat: "no-repeat",
                  maskPosition: "left center",
                  WebkitMaskPosition: "left center",
                }}
              />
              <span className="text-v1-label-sm uppercase">
                {capability.label}
              </span>
            </p>
            <h3 className="text-v1-heading-card text-v1-frost">
              {capability.heading}
            </h3>
          </div>
          {/* `!text-v1-frost`: the page-level body rule dims body tokens to
              #B3B3B3 at (0,2,0) specificity; these cards read better in
              full white against the dark frame. */}
          <p className="text-v1-body-lg-loose max-w-[560px] !text-v1-frost">
            {capability.body}
          </p>
          <div className="pt-1">
            <DocsCue
              href={appendRef(capability.docsHref, `homepage-${capability.id}`)}
            />
          </div>
        </div>
      </GradientFrame>
    </div>
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
}: {
  src: string;
  label: string;
  startAt?: number;
  /** External gate — the video only plays while this is true AND it is
   *  in view. The grid flips it per card on hover (desktop). */
  play: boolean;
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
    if (!video) return;
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
  }, [src, startAt]);

  // The one play/pause decision.
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (inView && play) {
      if (startAt != null && video.currentTime < startAt - 0.4) {
        video.currentTime = startAt;
      }
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [inView, play, ready, startAt]);

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
