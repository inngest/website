"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
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
  /** Still of the clip's first shown frame (at `videoStart` if set),
   *  painted under the video so the card is never an empty box while
   *  the clip loads, or when autoplay is blocked / reduced motion is on. */
  videoPoster?: string;
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
    videoPoster: "/assets/v1/home/posters/observability.webp",
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
    videoPoster: "/assets/v1/home/posters/flow-control.webp",
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
    videoPoster: "/assets/v1/home/posters/sandbox.webp",
    docsHref: "/docs",
  },
  {
    id: "observability",
    label: "A/B Testing & Scoring",
    heading: "Know what works",
    icon: "/assets/v1/primitives/icon-4-human-loop.svg",
    body: "How do you know if your agent works? If you want to know which variant actually performed better, you used to have to stitch together data from multiple systems, implement human reviews, and build a layer of instrumentation on top. Inngest captures all of this data by default, so you can add scoring the same way you add retries.",
    videoSrc: "https://cdn.inngest.com/homepage/june-2026-score-website.mp4",
    videoPoster: "/assets/v1/home/posters/scoring.webp",
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
 * hero's trace). Every video stays visible; the row in focus is
 * full-contrast and the only one playing, the rest dim together. Below
 * lg the rows become stacked cards, video over copy.
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
      <ol className="relative mt-v1-stack hidden list-none pl-0 lg:block">
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
 * 48px header→content gap plus 96px into the first row / card).
 */
function BlueSlab() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -bottom-[6rem] -top-[13rem] left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-v1-accent-blue sm:-top-[16rem] lg:-bottom-[9rem] lg:-top-[26rem]"
    >
      {/* next/image: lazy by default (so React doesn't emit a preload for
          this below-the-fold texture) and served by the Vercel image
          optimizer as WebP (~100 KB) instead of the 1.5 MB source PNG. */}
      <Image
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
    <p className="flex items-center gap-2.5 text-v1-accent-salmon">
      <span
        aria-hidden="true"
        className="block h-5 w-6 shrink-0 bg-current"
        style={CAP_ICON_MASK(capability.icon)}
      />
      <span className="text-v1-eyebrow uppercase">{capability.label}</span>
    </p>
  );
}

// Parallax travel in px over a full viewport of scroll (see Step).
const PARALLAX_MEDIA = 72;
const PARALLAX_COPY = 20;

/**
 * One row in the desktop sequence: copy on the left, its own video on
 * the right, a rail dot between row and page edge. The row whose box
 * crosses the viewport's middle band is in focus: full-contrast and
 * the only one whose video plays. The others — copy and video together
 * — dim to 40% and hold on their first frame. A light scroll parallax
 * separates the video and copy planes (see the effect below). Rows own
 * their vertical spacing (240px between, as py) rather than using a
 * flex gap so the rail segment each row draws joins the next without a
 * break.
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
  const mediaRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const onInViewRef = useRef(onInView);
  onInViewRef.current = onInView;

  // Parallax: as the row travels through the viewport, its video drifts
  // against the scroll (up to ±PARALLAX_MEDIA px) while the copy drifts
  // a little with it (±PARALLAX_COPY px, opposite sign), so the two
  // planes separate and the row reads as having depth. Writes
  // transforms straight to the DOM from a rAF-throttled scroll
  // listener — no React state per frame. Skipped for reduced motion
  // and while the row has no layout (below lg, where the list is
  // display:none).
  useEffect(() => {
    const el = ref.current;
    const media = mediaRef.current;
    const copy = copyRef.current;
    if (!el || !media || !copy) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      if (rect.height === 0) return;
      const vh = window.innerHeight || 1;
      // -1 when the row's centre is a viewport below the middle, 0 when
      // centred, +1 when a viewport above.
      const p = Math.max(
        -1,
        Math.min(1, (vh / 2 - (rect.top + rect.height / 2)) / vh)
      );
      media.style.transform = `translate3d(0, ${(p * PARALLAX_MEDIA).toFixed(
        1
      )}px, 0)`;
      copy.style.transform = `translate3d(0, ${(-p * PARALLAX_COPY).toFixed(
        1
      )}px, 0)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

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
      className={cn(
        "relative pl-10",
        // The first row gets a small top pad so its copy clears the blue
        // slab (which overlaps the row by 96px) and reads on dark; its
        // video still rises into the blue.
        isFirst ? "pt-12" : "pt-[7.5rem]",
        !isLast && "pb-[7.5rem]"
      )}
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
      {/* Rail dot: solid salmon while in focus, quiet frost once passed,
          dim before. */}
      <span
        aria-hidden="true"
        className={cn(
          "border-v1-canvasBase absolute left-0 top-1/2 size-[11px] -translate-y-1/2 rounded-full border-2",
          "motion-safe:transition-colors motion-safe:duration-500",
          isActive
            ? "bg-v1-accent-salmon"
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
        <div
          ref={copyRef}
          className="flex max-w-[480px] flex-col gap-5 motion-safe:[will-change:transform]"
        >
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

        <div ref={mediaRef} className="motion-safe:[will-change:transform]">
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
                poster={capability.videoPoster}
                posterSizes="(min-width: 1024px) 50vw, 100vw"
                play={isActive}
                enabled={enabled}
              />
            )}
          </GradientFrame>
        </div>
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
            poster={capability.videoPoster}
            posterSizes="100vw"
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

/** How far outside the viewport a video starts loading its source. */
const ATTACH_MARGIN = "300px 0px";

function isHls(src: string) {
  return /\.m3u8(\?.*)?$/i.test(src);
}

function RowVideo({
  src,
  label,
  startAt,
  poster,
  posterSizes,
  play,
  enabled = true,
}: {
  src: string;
  label: string;
  startAt?: number;
  /** Still shown under the video until its first frame paints. */
  poster?: string;
  /** `sizes` for the poster's responsive srcset. */
  posterSizes?: string;
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

  // Attach the source lazily — only once the video is within
  // ATTACH_MARGIN of the viewport — and observe visibility. Bound once
  // per source. A display:none copy (the other breakpoint's layout)
  // never intersects, so it never attaches a source even if `enabled`
  // is briefly true during hydration (useIsDesktop reads false on the
  // first client render).
  useEffect(() => {
    const video = ref.current;
    if (!video || !enabled) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let hls: import("hls.js").default | undefined;
    let attached = false;
    let cancelled = false;

    const attach = async () => {
      if (attached) return;
      attached = true;
      // Native HLS (Safari, iOS, recent desktop Chrome) and plain MP4s
      // go straight onto the element.
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
          // Pick the rendition for the player's rendered size, not the
          // connection speed — these cards are never 1080p wide.
          capLevelToPlayerSize: true,
        });
        hls.loadSource(src);
        hls.attachMedia(video);
      } else {
        video.src = src;
      }
    };

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

    const loadObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void attach();
      },
      { rootMargin: ATTACH_MARGIN }
    );
    loadObserver.observe(video);

    const playObserver = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 }
    );
    playObserver.observe(video);

    return () => {
      cancelled = true;
      loadObserver.disconnect();
      playObserver.disconnect();
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("ended", onEnded);
      hls?.destroy();
      // Detach whatever source was set directly (MP4 / native HLS) so
      // the browser drops the connection and its buffer. hls.destroy()
      // only covers the hls.js path.
      if (attached) {
        video.pause();
        video.removeAttribute("src");
        video.load();
      }
      setReady(false);
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
      {/* A lazy next/image rather than the <video poster> attribute: it
          gets a responsive WebP from the Vercel optimizer, and copies
          inside the other breakpoint's display:none layout never load.
          The video sits above it (relative, later in DOM) and is
          transparent until it has a frame to paint. */}
      {poster && (
        <Image
          src={poster}
          alt=""
          aria-hidden="true"
          fill
          sizes={posterSizes}
          className="object-cover"
        />
      )}
      <video
        ref={ref}
        className="relative block h-full w-full object-cover"
        aria-label={`${label} in the Inngest dashboard`}
        loop={startAt == null}
        muted
        playsInline
        preload="metadata"
      />
    </div>
  );
}
