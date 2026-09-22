"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/v1/cn";

/**
 * The dev server recording from the local development docs, with a tour
 * narrating it: one caption at a time, keyed off the video's own
 * `currentTime` so the two can't drift the way a parallel CSS clock
 * would once the loop restarts.
 *
 * Playback pauses while the section is off-screen, and under
 * `prefers-reduced-motion` the poster frame stands in for the video.
 */

const VIDEO = "/assets/v1/dev-server/dev-server-tour.mp4";
const POSTER = "/assets/v1/dev-server/dev-server-tour-poster.jpg";

/** `at` is the second in the 11s recording where each caption takes over. */
const CAPTIONS = [
  { at: 0, label: "Every run, listed locally" },
  { at: 2.8, label: "Open one — every step, timed" },
  { at: 5.6, label: "Inputs and outputs, in full" },
  { at: 8.6, label: "No deploy, no infra" },
];

function captionAt(time: number) {
  let i = 0;
  for (let n = 0; n < CAPTIONS.length; n++) {
    if (time >= CAPTIONS[n].at) i = n;
  }
  return i;
}

export default function DevServerTour() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(0);

  // Only run the video while it's on screen — it's a decorative loop, and
  // there's no reason to keep decoding it further down the page.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.2 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0b0b0e] shadow-[0_40px_120px_-40px_rgb(0_0_0_/_0.9)] sm:rounded-2xl">
        <video
          ref={videoRef}
          className="block h-auto w-full"
          src={VIDEO}
          poster={POSTER}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="The Inngest dev server running locally: a list of runs, then one run opened to show each step with its inputs and outputs"
          onTimeUpdate={(event) =>
            setActive(captionAt(event.currentTarget.currentTime))
          }
        />

        {/* Captions share one grid cell: they crossfade in place instead
            of the strip shifting as the label lengths change. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 grid justify-items-center p-3 sm:p-5"
        >
          {CAPTIONS.map((caption, i) => (
            <span
              key={caption.label}
              className={cn(
                "col-start-1 row-start-1 whitespace-nowrap rounded-md bg-v1-accent-salmon px-2 py-1 font-v1Label text-[9px] uppercase leading-none tracking-[0.06em] text-v1-frost shadow-[0_8px_24px_-8px_rgb(0_0_0_/_0.8)] transition-opacity duration-300 sm:px-3 sm:py-2 sm:text-[11px]",
                i === active ? "opacity-100" : "opacity-0"
              )}
            >
              {caption.label}
            </span>
          ))}
        </div>
      </div>

      {/* Step pips — position in the tour, not a control. */}
      <div aria-hidden="true" className="mt-5 flex justify-center gap-2">
        {CAPTIONS.map((caption, i) => (
          <span
            key={caption.label}
            className={cn(
              "size-1.5 rounded-full transition-colors duration-300",
              i === active ? "bg-v1-accent-salmon" : "bg-white/20"
            )}
          />
        ))}
      </div>
    </div>
  );
}
