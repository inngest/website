"use client";

import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

import HlsVideo from "@/shared/HlsVideo";

const VIDEO_EXT = /\.(mp4|m3u8|webm|mov)(\?.*)?$/i;

function isVideo(src: string): boolean {
  return VIDEO_EXT.test(src) || /cdn\.inngest\.com\/videos\//.test(src);
}

/**
 * Inline media for pattern pages, authored with Markdown image syntax
 * `![alt](url "poster=/path")`. Images render as a lazy `<img>`; `.mp4`/`.m3u8`
 * (and other video) URLs render as a muted, looping, autoplaying video —
 * `.m3u8` streams go through the hls.js-backed HlsVideo. Uses plain
 * `<img>`/`<video>` (not next/image) so CDN URLs work without a remotePatterns
 * entry, matching how the blog renders remote CDN media.
 */
export default function PatternMedia({
  src,
  alt,
  poster,
}: {
  src: string;
  alt?: string;
  poster?: string;
}) {
  if (isVideo(src)) {
    if (/\.m3u8(\?.*)?$/i.test(src)) {
      return (
        <HlsVideo
          src={src}
          poster={poster}
          loop
          controls
          autoPlay
          className="md-media"
        />
      );
    }
    return (
      <video
        className="md-media"
        src={src}
        poster={poster}
        playsInline
        loop
        controls
        preload="metadata"
        autoPlay
        muted
      />
    );
  }

  // Click to enlarge (react-medium-image-zoom, same as docs images).
  return (
    <Zoom wrapElement="span" zoomMargin={25}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="md-media" src={src} alt={alt ?? ""} loading="lazy" />
    </Zoom>
  );
}
