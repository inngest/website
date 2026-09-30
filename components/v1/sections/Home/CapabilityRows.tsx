"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  RiBox3Fill,
  RiEyeFill,
  RiFlaskFill,
  RiWindyLine,
  type RemixiconComponentType,
} from "@remixicon/react";
import { cn } from "@/utils/v1/cn";
import { appendRef } from "@/utils/v1/ref";

interface Capability {
  id: string;
  label: string;
  heading: string;
  body: string;
  icon: RemixiconComponentType;
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
    icon: RiEyeFill,
    body: "No more bespoke instrumentation. Inngest executes your functions, so you get observability by default. Trace every background job, agent, and event from trigger to completion, and use that data to evaluate outcomes on real production traffic.",
    videoSrc:
      "https://cdn.inngest.com/homepage/june-2026-redesign-dashboard-tour-v2.mp4",
    docsHref: "/docs/platform/monitor/traces",
  },
  {
    id: "flow-control",
    label: "Flow control",
    heading: "Know what to run",
    icon: RiWindyLine,
    body: "Basic queues don't know what to do when with got multiple users competing for the same resource. Noisy neighbors, hand-rolled rate limits, wasted compute… Inngest’s Flow Control features ensure every user gets their fair share, without extra work.",
    videoSrc:
      "https://cdn.inngest.com/homepage/june-2026-flow-control-website.mp4",
    docsHref: "/docs/guides/flow-control",
  },
  {
    id: "sandboxes",
    label: "Sandboxes",
    heading: "Know what's safe",
    icon: RiBox3Fill,
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
    icon: RiFlaskFill,
    body: "How do you know if your agent works? If you want to know which variant actually performed better, you used to have to stitch together data from multiple systems, implement human reviews, and build a layer of instrumentation on top. Inngest captures all of this data by default, so you can add scoring the same way you add retries.",
    videoSrc: "https://cdn.inngest.com/homepage/june-2026-score-website.mp4",
    docsHref: "/docs/learn/agent-evals",
  },
];

export function CapabilitiesHeading() {
  return (
    <section
      aria-labelledby="home-capabilities-heading"
      className="relative z-10 flex w-full flex-col items-start lg:h-[360px] lg:pb-[160px] lg:pt-16"
    >
      <h2
        id="home-capabilities-heading"
        className="v1-trim w-full max-w-[1120px] text-left font-whyte text-[clamp(2rem,6vw,72px)] font-light leading-[1.2] tracking-[-3px] text-white"
      >
        Everything queues can&rsquo;t do; everything you don&rsquo;t want to do.
      </h2>
    </section>
  );
}

export default function CapabilityRows() {
  return (
    <>
      {CAPABILITIES.map((capability, i) => (
        <Row
          key={capability.id}
          capability={capability}
          mediaFirst={i % 2 === 1}
        />
      ))}
    </>
  );
}

function Row({
  capability,
  mediaFirst,
}: {
  capability: Capability;
  mediaFirst: boolean;
}) {
  const Icon = capability.icon;
  return (
    <div className="flex w-full flex-col items-center gap-16 lg:min-h-[339.6px] lg:flex-row">
      <div
        className={cn(
          "flex w-full flex-col items-start gap-[46px] lg:max-w-[50%] lg:flex-1",
          mediaFirst && "lg:order-2"
        )}
      >
        <div className="flex w-full flex-col items-start gap-6">
          <p className="v1-trim flex items-center gap-2 font-v1Heading text-[20px] uppercase leading-[1.2] tracking-[-0.5px] text-v1-accent-salmon">
            <Icon className="size-6 shrink-0 text-current" size={24} />
            {capability.label}
          </p>
          <h3 className="v1-trim w-full font-v1Heading text-[clamp(1.75rem,4vw,48px)] uppercase leading-[0.95] tracking-[-1px] text-white">
            {capability.heading}
          </h3>
        </div>
        <div className="flex w-full flex-col items-start gap-4">
          <p className="w-full font-v1Body text-[16px] leading-[1.5] text-[#CDCDCD]">
            {capability.body}
          </p>
          <Link
            href={appendRef(capability.docsHref, `homepage-${capability.id}`)}
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-lg border-2 border-[#FEFEFE] bg-transparent px-4 py-3 font-v1Mono text-[12px] font-semibold uppercase leading-[1.3] tracking-[1.44px] text-white hover:border-v1-accent-salmon hover:bg-v1-accent-salmon"
          >
            See docs
          </Link>
        </div>
      </div>

      <div
        className={cn(
          "w-full overflow-hidden bg-[#212121] lg:h-[339.6px] lg:flex-1",
          mediaFirst && "lg:order-1"
        )}
      >
        {capability.videoSrc ? (
          <RowVideo
            src={capability.videoSrc}
            label={capability.label}
            startAt={capability.videoStart}
          />
        ) : (
          <div
            className="flex w-full items-center justify-center bg-[#212121]"
            style={{ aspectRatio: "608 / 339.6" }}
          >
            <span className="font-v1Body text-[14px] text-[#9B9B9B]">
              {capability.label} video
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function isHls(src: string) {
  return /\.m3u8(\?.*)?$/i.test(src);
}

function RowVideo({
  src,
  label,
  startAt,
}: {
  src: string;
  label: string;
  startAt?: number;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let hls: import("hls.js").default | undefined;
    let cancelled = false;

    const cueStart = () => {
      if (startAt == null || !Number.isFinite(video.duration)) return;
      if (video.currentTime < startAt - 0.4) video.currentTime = startAt;
    };

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

    let wantsPlay = false;
    const tryPlay = () => {
      if (!wantsPlay) return;
      cueStart();
      void video.play().catch(() => {});
    };

    const onEnded = () => {
      if (startAt == null) return;
      video.currentTime = startAt;
    };

    video.addEventListener("loadedmetadata", tryPlay);
    video.addEventListener("seeked", tryPlay);
    if (startAt != null) video.addEventListener("ended", onEnded);

    const observer = new IntersectionObserver(
      ([entry]) => {
        wantsPlay = entry.isIntersecting;
        if (wantsPlay) tryPlay();
        else video.pause();
      },
      { threshold: 0.25 }
    );
    observer.observe(video);
    return () => {
      cancelled = true;
      observer.disconnect();
      video.removeEventListener("loadedmetadata", tryPlay);
      video.removeEventListener("seeked", tryPlay);
      video.removeEventListener("ended", onEnded);
      hls?.destroy();
    };
  }, [src, startAt]);

  return (
    <div
      className="relative w-full overflow-hidden bg-[#212121]"
      style={{ aspectRatio: "608 / 339.6" }}
    >
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
