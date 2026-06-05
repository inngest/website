export const REPORT_TEXTURE = "/assets/report-assets/report_texture.png";
export const REPORT_SHAPE = "/assets/report-assets/report_shape.png";

/** Company logos shown on the report cover — shared with the microsite. */
export const REPORT_LOGOS = [
  { name: "Cohere", src: "/assets/report-assets/logos/Cohere.png", width: 505, height: 85, h: 24 },
  { name: "11x", src: "/assets/report-assets/logos/11x.png", width: 305, height: 108, h: 28 },
  { name: "LiveKit", src: "/assets/report-assets/logos/Livekit.png", width: 372, height: 85, h: 22 },
  { name: "mintlify", src: "/assets/report-assets/logos/Mintlify.png", width: 414, height: 96, h: 22 },
  { name: "BÆRSkin", src: "/assets/report-assets/logos/Bearskin.png", width: 475, height: 85, h: 32 },
  { name: "Stuut Technologies", src: "/assets/report-assets/logos/Stuut.png", width: 542, height: 77, h: 28 },
  { name: "Mercury", src: "/assets/report-assets/logos/Mercury.png", width: 346, height: 114, h: 36 },
  { name: "Wealthfront", src: "/assets/report-assets/logos/Wealthfront.png", width: 434, height: 84, h: 20 },
  { name: "Gnosis Freight", src: "/assets/report-assets/logos/Gnosis.png", width: 369, height: 103, h: 28 },
  { name: "Remitly", src: "/assets/report-assets/logos/Remintly.png", width: 416, height: 104, h: 28 },
] as const;

export type ReportTocItem = {
  id: string;
  label: string;
  section?: number;
};

export const REPORT_TOC_ITEMS: ReportTocItem[] = [
  { id: "executive-summary", label: "Executive summary" },
  { id: "confidence-in-scaling-ai", label: "Confidence in scaling AI", section: 1 },
  { id: "durable-execution", label: "Durable execution", section: 2 },
  { id: "reliability-tax", label: "The reliability tax", section: 3 },
  { id: "observability-edge", label: "The observability edge", section: 4 },
  { id: "ai-frameworks-and-evals", label: "AI frameworks and evals", section: 5 },
  { id: "whats-still-unsolved", label: "What's still unsolved", section: 6 },
  { id: "conclusion", label: "Conclusion" },
];

/** OG share-card chart images — used on the blog with share/download actions. */
export const REPORT_OG_PATH = "/assets/reports/2026-benchmark/og";
export const REPORT_BLEED =
  "not-prose relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2";

/** Full-bleed within the report content column (section breaks, exec summary). */
export const REPORT_FULL_BLEED = "report-full-bleed w-full";

/** @deprecated Use REPORT_FULL_BLEED */
export const REPORT_COLUMN_BLEED = REPORT_FULL_BLEED;

/** Explicit prose-width marker — default `.report-prose > *` already applies 75ch. */
export const REPORT_TEXT_WIDTH = "report-text-width w-full";
