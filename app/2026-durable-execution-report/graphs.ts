export type ReportGraph = {
  title: string;
  description: string;
  image: string;
  shareText: string;
};

export const REPORT_PATH =
  "/assets/reports/2026-benchmark/2026-durable-execution-benchmark-report.pdf";

export const REPORT_LANDING_PATH = "/2026-durable-execution-report";

export const REPORT_GRAPHS = {
  "confidence-paradox": {
    title: "Only 19% of teams are confident their AI stack can scale",
    description:
      "From the 2026 Durable Execution Benchmark Report — and at orgs with 500+ engineers, that number drops to 0%.",
    image: "/assets/reports/2026-benchmark/og/confidence-paradox.png",
    shareText:
      "Only 19% of teams running AI in production are confident their stack can handle 2–3x scale.",
  },
  "observability-gap": {
    title: "Observability is the #1 unsolved problem for AI teams",
    description:
      "From the 2026 Durable Execution Benchmark Report — even teams with mixed third-party and homegrown observability spend hours diagnosing failures.",
    image: "/assets/reports/2026-benchmark/og/observability-gap.png",
    shareText:
      "Observability is the #1 unsolved problem engineers named in our 2026 AI in Production survey.",
  },
  "reliability-tax": {
    title: "20% of AI teams spend up to half their engineering time on reliability",
    description:
      "From the 2026 Durable Execution Benchmark Report — twice the rate of non-AI teams, and for most the burden is growing.",
    image: "/assets/reports/2026-benchmark/og/reliability-tax.png",
    shareText:
      "20% of AI teams spend up to half their engineering time on reliability work — twice the rate of non-AI teams.",
  },
  "infrastructure-layers": {
    title: "Three infrastructure layers separate confident AI teams from the rest",
    description:
      "From the 2026 Durable Execution Benchmark Report — orchestration that persists state, observability inside the workflow, and evals tied to where things break.",
    image: "/assets/reports/2026-benchmark/og/infrastructure-layers.png",
    shareText:
      "What separates the most confident AI teams isn't bigger budgets — it's tighter integration between three infrastructure layers.",
  },
} as const satisfies Record<string, ReportGraph>;

export type ReportGraphId = keyof typeof REPORT_GRAPHS;

export const getReportGraph = (id: string): ReportGraph | undefined =>
  (REPORT_GRAPHS as Record<string, ReportGraph>)[id];
