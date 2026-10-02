"use client";

import { useEffect, useRef } from "react";

type HlsVideoProps = {
  src: string;
  poster?: string;
  loop?: boolean;
  controls?: boolean;
  autoPlay?: boolean;
  className?: string;
};

/** How far outside the viewport the video starts loading its source. */
const ATTACH_MARGIN = "300px 0px";
/** How much of the video must be on screen before it autoplays. */
const PLAY_THRESHOLD = 0.25;

/**
 * Plays an HLS (.m3u8) stream with adaptive bitrate.
 *
 * Safari/iOS and recent desktop Chrome play HLS natively via the
 * `<video>` element. Everywhere else we lazy-load hls.js and let it drive
 * the media element. Falls back to setting `src` directly if neither path
 * is available.
 *
 * Loading is deferred: no source is attached until the video is within
 * ATTACH_MARGIN of the viewport, so off-screen videos cost nothing on page
 * load (native HLS players buffer segments regardless of `preload`).
 * `autoPlay` means "play while on screen": the video starts when it
 * scrolls into view and pauses when it leaves, unless the viewer paused
 * it themselves. Reduced-motion users get no autoplay; controls still work.
 */
export default function HlsVideo({
  src,
  poster,
  loop = true,
  controls = true,
  autoPlay = true,
  className,
}: HlsVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const shouldAutoPlay = autoPlay && !reducedMotion;

    let hls: import("hls.js").default | undefined;
    let attached = false;
    let cancelled = false;
    // Viewer paused it with the controls — don't resume on scroll.
    let userPaused = false;
    // True while we're pausing it ourselves (scrolled out of view), so
    // the resulting `pause` event isn't mistaken for the viewer's.
    let autoPausing = false;
    let inView = false;

    const attach = async () => {
      if (attached) return;
      attached = true;

      // Native HLS (Safari, iOS, recent Chrome) — no JS shim needed.
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
        return;
      }

      const { default: Hls } = await import("hls.js");
      if (cancelled) return;
      if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          // Choose the rendition for the player's rendered size rather
          // than the connection speed.
          capLevelToPlayerSize: true,
        });
        hls.loadSource(src);
        hls.attachMedia(video);
      } else {
        // Last-resort fallback for browsers without MSE.
        video.src = src;
      }
    };

    const onPause = () => {
      if (autoPausing) {
        autoPausing = false;
        return;
      }
      if (!video.ended) userPaused = true;
    };
    const onPlay = () => {
      userPaused = false;
    };
    // hls.js attaches asynchronously, so a play() issued on entering the
    // viewport can land before there is any media. Retry once it's ready.
    const onCanPlay = () => {
      if (shouldAutoPlay && inView && !userPaused && video.paused) {
        void video.play().catch(() => {});
      }
    };
    video.addEventListener("pause", onPause);
    video.addEventListener("play", onPlay);
    video.addEventListener("canplay", onCanPlay);

    const loadObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void attach();
      },
      { rootMargin: ATTACH_MARGIN }
    );
    loadObserver.observe(video);

    const playObserver = shouldAutoPlay
      ? new IntersectionObserver(
          ([entry]) => {
            inView = entry.isIntersecting;
            if (entry.isIntersecting) {
              if (!userPaused) {
                void attach();
                void video.play().catch(() => {});
              }
            } else if (!video.paused) {
              autoPausing = true;
              video.pause();
            }
          },
          { threshold: PLAY_THRESHOLD }
        )
      : undefined;
    playObserver?.observe(video);

    return () => {
      cancelled = true;
      loadObserver.disconnect();
      playObserver?.disconnect();
      video.removeEventListener("pause", onPause);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("canplay", onCanPlay);
      hls?.destroy();
      // Detach a directly-set source (native HLS / fallback) so the
      // browser drops the connection and its buffer.
      if (attached) {
        video.pause();
        video.removeAttribute("src");
        video.load();
      }
    };
  }, [src, autoPlay]);

  return (
    <video
      ref={videoRef}
      className={className}
      poster={poster}
      playsInline
      loop={loop}
      controls={controls}
      preload="metadata"
      muted
    />
  );
}
