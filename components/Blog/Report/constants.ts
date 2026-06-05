/** Company logos shown on the report cover — shared with the microsite. */
export const REPORT_LOGOS = [
  { name: "Cohere", src: "/assets/report-assets/logos/Cohere.png", h: 24 },
  { name: "11x", src: "/assets/report-assets/logos/11x.png", h: 28 },
  { name: "LiveKit", src: "/assets/report-assets/logos/Livekit.png", h: 22 },
  { name: "mintlify", src: "/assets/report-assets/logos/Mintlify.png", h: 22 },
  { name: "BÆRSkin", src: "/assets/report-assets/logos/Bearskin.png", h: 32 },
  { name: "Stuut Technologies", src: "/assets/report-assets/logos/Stuut.png", h: 28 },
  { name: "Mercury", src: "/assets/report-assets/logos/Mercury.png", h: 36 },
  { name: "Wealthfront", src: "/assets/report-assets/logos/Wealthfront.png", h: 20 },
  { name: "Gnosis Freight", src: "/assets/report-assets/logos/Gnosis.png", h: 28 },
  { name: "Remitly", src: "/assets/report-assets/logos/Remintly.png", h: 28 },
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

/** Full width within the report content column — never crosses into the TOC rail. */
export const REPORT_COLUMN_BLEED = "not-prose w-full max-w-none";
