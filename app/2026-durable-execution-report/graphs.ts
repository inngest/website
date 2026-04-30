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
  "confidence-in-scaling-ai-workflows-by-team-size": {
    title: "Confidence in scaling AI workflows by team size",
    description:
      "Only 19% of teams running AI in production are very confident their stack can handle 2–3x scale. At 500+ engineer teams, that number drops to 0%.",
    image:
      "/assets/reports/2026-benchmark/og/01-confidence-in-scaling-ai-workflows-by-team-size.png",
    shareText:
      "Only 19% of teams running AI in production are very confident their stack can scale 2–3x. At 500+ engineer teams, that number is 0%.",
  },
  "most-statistically-significant-signals-for-confidence-in-scaling-ai": {
    title: "Most statistically significant signals for confidence in scaling AI",
    description:
      "Durable execution + production evals + low burden is the strongest predictor of AI scaling confidence. Missing evals is the top anti-pattern.",
    image:
      "/assets/reports/2026-benchmark/og/02-most-statistically-significant-signals-for-confidence-in-scaling-ai.png",
    shareText:
      "Confident AI teams share 3 things: durable execution, production evals, and low reliability burden. Missing evals is the top anti-pattern.",
  },
  "orchestration-platform-by-team-size": {
    title: "Orchestration platform by team size",
    description:
      "56% of teams use more than one orchestration tool. Inngest is most often run solo and serves the widest variety of use cases among reportable cohorts.",
    image:
      "/assets/reports/2026-benchmark/og/03-orchestration-platform-by-team-size.png",
    shareText:
      "56% of teams pair multiple orchestration tools. Inngest is the most common solo choice and serves the widest variety of workflows.",
  },
  "time-spent-on-reliability-work-teams-building-ai-vs-traditional-software": {
    title:
      "Time spent on reliability work — teams building AI vs traditional software",
    description:
      "20% of AI teams spend up to half their engineering time on reliability work — twice the rate of teams not building AI in production (10%).",
    image:
      "/assets/reports/2026-benchmark/og/04-time-spent-on-reliability-work-teams-building-ai-vs-traditional-software.png",
    shareText:
      "20% of AI teams spend up to half their engineering time on reliability — twice the rate of non-AI teams. The reliability tax is real.",
  },
  "whats-driving-reliability-burden-up": {
    title: "What's driving reliability burden up?",
    description:
      "Higher traffic and technical debt tie as top drivers of rising reliability burden (61% each). AI teams cite scale; non-AI teams cite tech debt.",
    image:
      "/assets/reports/2026-benchmark/og/05-whats-driving-reliability-burden-up.png",
    shareText:
      "Top drivers of rising reliability burden: traffic & scale and tech debt (61% each). AI teams blame scale; non-AI teams blame tech debt.",
  },
  "time-to-understand-pipeline-failures-by-observability-method": {
    title: "Time to understand pipeline failures, by observability method",
    description:
      "Orchestration-native observability diagnoses failures fastest: 40% in minutes vs. 29% on APM-only stacks — an 11x gap on worst-case outcomes.",
    image:
      "/assets/reports/2026-benchmark/og/06-time-to-understand-pipeline-failures-by-observability-method.png",
    shareText:
      "Orchestration-native observability diagnoses failures in minutes 40% of the time, vs. 29% on APM tools — an 11x gap on worst-case outcomes.",
  },
  "what-breaks-teams-building-ai-vs-traditional-software": {
    title: "What breaks — teams building AI vs traditional software",
    description:
      "AI teams cite LLM and external API failures (56%) as the top cause of customer-visible incidents. Non-AI teams blame infrastructure crashes (57%) most often.",
    image:
      "/assets/reports/2026-benchmark/og/07-what-breaks-teams-building-ai-vs-traditional-software.png",
    shareText:
      "What breaks in production: AI teams hit LLM and external API failures (56%); non-AI teams trip on infrastructure crashes (57%).",
  },
  "perceived-gaps-in-eval-solutions": {
    title: "Perceived gaps in eval solutions",
    description:
      "Top eval-tool gaps engineers cite: hard-to-write evals (31%) and LLM-as-judge cost (25%). Most other complaints are integration failures, not eval ergonomics.",
    image:
      "/assets/reports/2026-benchmark/og/08-perceived-gaps-in-eval-solutions.png",
    shareText:
      "Top complaints about AI eval tools: hard-to-write evals (31%), LLM-as-judge cost (25%). Most other gaps are integration problems.",
  },
  "agent-framework-adoption-by-team-size": {
    title: "Agent framework adoption by team size",
    description:
      "69% of AI teams skip third-party agent frameworks, calling LLM APIs directly or rolling their own. LangChain adoption skews to large teams (45% at 500+).",
    image:
      "/assets/reports/2026-benchmark/og/09-agent-framework-adoption-by-team-size.png",
    shareText:
      "69% of AI teams skip agent frameworks — calling LLM APIs directly or building their own. LangChain skews to 500+ engineer teams (45%).",
  },
  "eval-approach-by-team-size": {
    title: "Eval approach by team size",
    description:
      "35% of teams building AI in production aren't running evals at all. Among the 65% who are, most have built their own pipeline rather than buying one.",
    image:
      "/assets/reports/2026-benchmark/og/10-eval-approach-by-team-size.png",
    shareText:
      "35% of teams building AI in production aren't doing evals at all. Most who do, built their own pipeline. Growth-phase teams are least eval-ready.",
  },
  "perceived-gaps-in-agent-frameworks": {
    title: "Perceived gaps in agent frameworks",
    description:
      "Top complaints about agent frameworks: abstractions make failures harder to trace (26%) and poor support for long-running, stateful workflows (19%).",
    image:
      "/assets/reports/2026-benchmark/og/11-perceived-gaps-in-agent-frameworks.png",
    shareText:
      "Engineers' top gripes with agent frameworks: abstractions hide failures (26%) and poor support for long-running, stateful workflows (19%).",
  },
  "whats-unsolved-by-team-size": {
    title: "What's unsolved by team size",
    description:
      "Observability is the #1 unsolved problem engineers cite across team sizes — 19% of responses, equal across AI (18%) and non-AI (21%) teams.",
    image:
      "/assets/reports/2026-benchmark/og/12-whats-unsolved-by-team-size.png",
    shareText:
      "Engineers' #1 unsolved problem: observability. 19% of all responses — the highest of any theme, equal across AI and non-AI teams.",
  },
} as const satisfies Record<string, ReportGraph>;

export type ReportGraphId = keyof typeof REPORT_GRAPHS;

export const getReportGraph = (id: string): ReportGraph | undefined =>
  (REPORT_GRAPHS as Record<string, ReportGraph>)[id];
