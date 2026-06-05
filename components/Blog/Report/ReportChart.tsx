import Image from "next/image";
import {
  RiDownload2Line,
  RiFilePdf2Line,
  RiLinkedinBoxFill,
  RiTwitterXFill,
} from "@remixicon/react";
import {
  getReportGraph,
  REPORT_GRAPH_HEIGHT,
  REPORT_GRAPH_WIDTH,
  REPORT_LANDING_PATH,
  REPORT_PATH,
  type ReportGraphId,
} from "app/content/ai-in-production-report-2026/graphs";
import { getFullURL } from "src/utils/social";

type Props = {
  graphId: ReportGraphId;
  /** Tighter vertical rhythm when charts stack as a set */
  tight?: boolean;
};

/** Display width cap — matches `.report-prose` (75ch). Native PNG is 3600px. */
const CHART_DISPLAY_WIDTH = 1200;
const CHART_DISPLAY_HEIGHT = Math.round(
  (CHART_DISPLAY_WIDTH * REPORT_GRAPH_HEIGHT) / REPORT_GRAPH_WIDTH
);
const CHART_SIZES = "(min-width: 768px) 75ch, 100vw";

export function ReportChart({ graphId, tight = false }: Props) {
  const graph = getReportGraph(graphId);
  if (!graph) return null;

  const shareUrl = getFullURL(`${REPORT_LANDING_PATH}/share/${graphId}`);
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(graph.shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
  const downloadUrl = `/api/report-graph-download/${graphId}`;

  return (
    <figure
      className={`report-chart not-prose ${tight ? "my-6" : "my-10"}`}
      style={{ maxWidth: "75ch", width: "100%" }}
    >
      <Image
        src={graph.image}
        alt={graph.title}
        width={CHART_DISPLAY_WIDTH}
        height={CHART_DISPLAY_HEIGHT}
        sizes={CHART_SIZES}
        quality={75}
        loading="lazy"
        className="h-auto w-full rounded-lg"
        style={{ width: "100%", height: "auto" }}
      />
      <figcaption className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/10 pt-3">
        <span className="sr-only">Share or download this chart</span>
        <a
          href={tweetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-subtle transition-colors hover:text-basis"
        >
          <RiTwitterXFill className="h-4 w-4" aria-hidden="true" />
          Post to X
        </a>
        <a
          href={linkedInUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-subtle transition-colors hover:text-basis"
        >
          <RiLinkedinBoxFill className="h-4 w-4" aria-hidden="true" />
          Post to LinkedIn
        </a>
        <a
          href={downloadUrl}
          className="inline-flex items-center gap-1.5 text-sm text-subtle transition-colors hover:text-basis"
        >
          <RiDownload2Line className="h-4 w-4" aria-hidden="true" />
          Download image
        </a>
        <a
          href={REPORT_PATH}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[rgb(var(--color-matcha-400))] transition-colors hover:text-[rgb(var(--color-matcha-300))]"
        >
          <RiFilePdf2Line className="h-4 w-4" aria-hidden="true" />
          See PDF for full breakdown
        </a>
      </figcaption>
    </figure>
  );
}
