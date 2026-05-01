import type { Metadata } from "next";
import { generateMetadata as buildMetadata } from "src/utils/social";
import ContentDownloadForm from "src/components/ContentDownloadForm";
import { ObservabilityChart } from "./ObservabilityChart";
import { ReliabilityChart } from "./ReliabilityChart";
import { InfrastructureChart } from "./InfrastructureChart";
import { StatTiles } from "./StatTiles";
import { HeroGreenPanel } from "./HeroGreenPanel";
import { ParallaxCard } from "./ParallaxCard";
import { ScrollToFormButton } from "./ScrollToFormButton";

const PAGE_TITLE = "AI in Production: The 2026 Durable Execution Benchmark Report";
const PAGE_DESCRIPTION =
  "We surveyed 130 backend, full-stack, and AI engineers about what it takes to run reliable AI workflows in production. Explore the patterns that predict scaling confidence.";

export const metadata: Metadata = buildMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  image: "/assets/reports/2026-benchmark/og/landing.png",
});

const KEY_FINDINGS = [
  {
    eyebrow: "01 — The confidence paradox",
    color: "#2C9B63",
    title: "Only 19% of teams running AI in production are very confident their stack can handle 2–3x scale.",
    body: "At organizations with 500+ engineers and significantly more resources, that number drops to 0%. Our report explains why.",
  },
  {
    eyebrow: "02 — The observability gap",
    color: "#FB5536",
    title: "Observability is the #1 unsolved problem engineers named in the survey.",
    body: "Even respondents using a mix of third-party and homegrown solutions are spending hours diagnosing failures. The report shows which observability approaches actually correlate with faster recovery.",
  },
  {
    eyebrow: "03 — The reliability tax",
    color: "#CEE9FF",
    title: "20% of AI teams spend up to half their engineering time on reliability work.",
    body: "That's twice the rate of non-AI teams. And for most, the burden is growing. Our report identifies which orchestration approaches correlate with lower — and higher — reliability burden.",
  },
  {
    eyebrow: "04 — Summary",
    color: "#a8ef3c",
    title: "Three infrastructure layers separate confident AI teams from the rest.",
    body: "What separates the most confident AI teams isn't bigger budgets or bigger teams — it's tighter integration between three infrastructure layers: orchestration that persists state and handles failures, observability that lives inside the workflow, and evals connected to where things actually break. When those layers share context, confidence follows.",
  },
];

export default function Page() {
  return (
    <div className="bg-[#212121] text-basis">
      {/* Hero is pinned; content scrolls up over it */}
      <div className="sticky top-0 z-0">
        <Hero />
      </div>
      <div
        className="relative z-10"
        style={{
          backgroundColor: "#212121",
          backgroundImage:
            "linear-gradient(rgba(33,33,33,0.88), rgba(33,33,33,0.88)), url('/assets/report-assets/report_texture.png')",
          backgroundRepeat: "no-repeat, no-repeat",
          backgroundSize: "100% 100%, 100% 100%",
        }}
      >
        <KeyFindings />
        <Methodology />
        <FinalCTA />
      </div>
    </div>
  );
}

function FinalCTA() {
  return (
    <section
      className="border-b border-white/10"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
    >
      <div className="mx-auto max-w-4xl px-6 py-16 text-center md:py-24">
        <h2 className="font-whyteInktrap text-3xl font-semibold text-basis md:text-4xl">
          Get the full report.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-subtle md:text-lg">
          Charts, breakouts by team size, and the patterns that predict scaling
          confidence — all in the PDF.
        </p>
        <div className="mt-8">
          <ScrollToFormButton />
        </div>
      </div>
    </section>
  );
}

function Hero() {
  return (
    <section className="bg-black pt-0">
      <div className="w-full">
        {/* Unified split card */}
        <div className="grid overflow-hidden rounded-r-3xl bg-black lg:grid-cols-[1.75fr_1fr]">

          {/* ── Green gradient panel ── */}
          <HeroGreenPanel />

          {/* ── Form panel (dark, no wrapper card) ── */}
          <div
            id="get-the-report"
            className="flex flex-col justify-center scroll-mt-24 px-8 py-12 md:px-12 md:pr-16 xl:pr-24"
            style={{ backgroundColor: "#000000" }}
          >
            <ContentDownloadForm asset="ai-in-production-report-2026" />
          </div>

        </div>
      </div>
    </section>
  );
}

function KeyFindings() {
  return (
    <section className="mx-auto max-w-4xl px-6 pb-8 pt-20 md:pb-12 md:pt-28">
      <div className="max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[rgb(var(--color-matcha-400))]">
          Key findings
        </p>
        <h2 className="mt-3 font-whyteInktrap text-3xl font-semibold text-basis md:text-4xl">
          What 130 engineers told us about running AI in production.
        </h2>
        <p className="mt-4 text-base text-subtle md:text-lg">
          We wanted to know what's causing failures, and which infrastructure
          choices — across orchestration, observability, evals, and agent
          frameworks — actually reduce the burden of reliability.
        </p>
      </div>
      <ul className="mt-12 flex flex-col gap-6">
        {KEY_FINDINGS.map((finding, i) => (
          <ParallaxCard key={finding.eyebrow} index={i}>
            <p className="font-mono text-xs uppercase tracking-[0.18em]" style={{ color: finding.color }}>
              {finding.eyebrow}
            </p>
            <h3 className="font-whyteInktrap text-xl font-semibold text-basis md:text-2xl">
              {finding.title}
            </h3>
            <p className="text-sm text-subtle md:text-base">{finding.body}</p>
            {finding.eyebrow.startsWith("01") && (
              <div className="mt-2">
                <StatTiles />
              </div>
            )}
            {finding.eyebrow.startsWith("02") && (
              <div className="mt-2">
                <ObservabilityChart />
              </div>
            )}
            {finding.eyebrow.startsWith("03") && (
              <div className="mt-2">
                <ReliabilityChart />
              </div>
            )}
            {finding.eyebrow.startsWith("04") && (
              <div className="mt-2">
                <InfrastructureChart />
              </div>
            )}
          </ParallaxCard>
        ))}
      </ul>
    </section>
  );
}

function Methodology() {
  return (
    <section>
      <div className="mx-auto grid max-w-4xl gap-10 px-6 py-14 md:grid-cols-[1fr_2fr] md:py-20">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[rgb(var(--color-matcha-400))]">
            Methodology
          </p>
          <h2 className="mt-3 font-whyteInktrap text-3xl font-semibold text-basis md:text-4xl">
            How we ran this survey.
          </h2>
        </div>
        <div className="text-base text-subtle md:text-lg">
          <p>
            130 backend, full-stack, and AI engineers and engineering leaders
            across companies of every size — from solopreneurs to organizations
            with 1,000+ engineers. All respondents were required to be running
            asynchronous workflows in production.
          </p>
          <p className="mt-4">
            The survey covered orchestration, observability, evals, agent
            frameworks, and scaling confidence. The full methodology is included
            in the report.
          </p>
        </div>
      </div>
    </section>
  );
}
