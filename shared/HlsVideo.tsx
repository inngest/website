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

/**
 * Plays an HLS (.m3u8) stream with adaptive bitrate.
 *
 * Safari/iOS play HLS natively via the `<video>` element. Everywhere else we
 * lazy-load hls.js (only when an HLS source is actually rendered) and let it
 * drive the media element. Falls back to setting `src` directly if neither
 * path is available.
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

    // Native HLS (Safari, iOS) — no JS shim needed.
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      return;
    }

    let hls: import("hls.js").default | undefined;
    let cancelled = false;

    import("hls.js").then(({ default: Hls }) => {
      if (cancelled) return;
      if (Hls.isSupported()) {
        hls = new Hls({ enableWorker: true });
        hls.loadSource(src);
        hls.attachMedia(video);
      } else {
        // Last-resort fallback for browsers without MSE.
        video.src = src;
      }
    });

    return () => {
      cancelled = true;
      hls?.destroy();
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      className={className}
      poster={poster}
      playsInline
      loop={loop}
      controls={controls}
      preload="metadata"
      autoPlay={autoPlay}
      muted
    />
  );
}
