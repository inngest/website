import type { Metadata } from "next";
import { generateMetadata as buildMetadata } from "src/utils/social";
import Logo from "src/shared/Icons/Logo";

import ReportDownloadForm from "./ReportDownloadForm";
import { ObservabilityChart } from "./ObservabilityChart";
import { ReliabilityChart } from "./ReliabilityChart";

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
    title: "Only 19% of teams running AI in production are very confident their stack can handle 2–3x scale.",
    body: "At organizations with 500+ engineers and significantly more resources, that number drops to 0%. Our report explains why.",
  },
  {
    eyebrow: "02 — The observability gap",
    title: "Observability is the #1 unsolved problem engineers named in the survey.",
    body: "Even respondents using a mix of third-party and homegrown solutions are spending hours diagnosing failures. The report shows which observability approaches actually correlate with faster recovery.",
  },
  {
    eyebrow: "03 — The reliability tax",
    title: "20% of AI teams spend up to half their engineering time on reliability work.",
    body: "That's twice the rate of non-AI teams. And for most, the burden is growing. Our report identifies which orchestration approaches correlate with lower — and higher — reliability burden.",
  },
  {
    eyebrow: "04 — Summary",
    title: "Three infrastructure layers separate confident AI teams from the rest.",
    body: "What separates the most confident AI teams isn't bigger budgets or bigger teams — it's tighter integration between three infrastructure layers: orchestration that persists state and handles failures, observability that lives inside the workflow, and evals connected to where things actually break. When those layers share context, confidence follows.",
  },
];

const STATS = [
  { id: "01", value: "130", label: "Engineers surveyed" },
  { id: "02", value: "74%", label: "Had incidents in last 90 days" },
  { id: "03", value: "19%", label: "Had confidence at scale" },
];

export default function Page() {
  return (
    <div className="bg-[#212121] text-basis">
      <Hero />
      <div
        style={{
          backgroundImage:
            "linear-gradient(rgba(33,33,33,0.65), rgba(33,33,33,0.65)), url('/assets/report-assets/report_texture.png')",
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

function Hero() {
  return (
    <section className="bg-black pt-0">
      <div className="w-full">
        {/* Unified split card */}
        <div className="grid overflow-hidden rounded-r-3xl bg-black lg:grid-cols-[1.75fr_1fr]">

          {/* ── Green gradient panel ── */}
          <div
            className="relative my-3 mr-3 flex min-h-[640px] flex-col overflow-hidden rounded-r-2xl p-8 md:my-4 md:mr-4 md:min-h-[820px] md:p-12 lg:min-h-[900px]"
            style={{
              background:
                "linear-gradient(135deg, rgba(220,240,210,0.85) 6%, #2C9B63 33%, #79D617 49%, #2C9B63 64%, rgba(220,240,210,0.85) 100%)",
            }}
          >
            {/* Grain texture overlay */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage: "url('/assets/report-assets/report_texture.png')",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
                mixBlendMode: "soft-light",
                opacity: 0.25,
              }}
            />

            {/* Decorative shape accent */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage: "url('/assets/report-assets/report_shape.png')",
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
                backgroundPosition: "center",
                mixBlendMode: "multiply",
                opacity: 0.05,
              }}
            />

            {/* Logo at top */}
            <div className="relative z-10">
              <Logo width={130} fill="#0c1f10" />
            </div>

            {/* Centre copy */}
            <div className="relative z-10 mb-8 mt-10 flex flex-col gap-5">
              <span className="self-start rounded border border-[#0c1f10]/50 px-3 py-1 font-mono text-xs uppercase tracking-[0.18em] text-[#0c1f10]">
                AI in Production
              </span>
              <h1 className="font-whyteInktrap text-5xl font-bold leading-[1.05] text-[#0c1f10] sm:text-6xl xl:text-7xl">
                AI in Production: The 2026 Benchmark Report
              </h1>
              <p className="max-w-lg text-xl italic text-[#0c1f10]/80">
                How engineering teams are building, breaking, and scaling AI in
                production.
              </p>
              <p className="max-w-lg text-base text-[#0c1f10]/70">
                We surveyed 130 backend, full-stack, and AI engineers about
                what it takes to run reliable AI workflows in production. We
                wanted to know what's causing failures, and which infrastructure
                choices—across orchestration, observability, evals, and agent
                frameworks—actually reduce the burden of reliability.
                <br />
                <br />
                Explore the patterns that predict scaling confidence.
              </p>
            </div>

            {/* Stats tiles anchored to bottom */}
            <dl className="relative z-10 mt-auto grid grid-cols-3 gap-3 pt-8">
              {STATS.map((s) => (
                <div
                  key={s.id}
                  className="flex flex-col gap-1 rounded-xl bg-[#0c1f10]/10 p-4 ring-1 ring-[#0c1f10]/20"
                >
                  <span className="font-mono text-xs text-[#0c1f10]/60">
                    — {s.id}
                  </span>
                  <dd className="font-whyteInktrap text-4xl font-bold leading-none text-[#0c1f10]">
                    {s.value}
                  </dd>
                  <dt className="text-xs font-medium uppercase tracking-wider text-[#0c1f10]/70">
                    {s.label}
                  </dt>
                </div>
              ))}
            </dl>
          </div>

          {/* ── Form panel (dark, no wrapper card) ── */}
          <div
            id="get-the-report"
            className="flex flex-col justify-center scroll-mt-24 px-8 py-12 md:px-12 md:pr-16 xl:pr-24"
            style={{ backgroundColor: "#000000" }}
          >
            <ReportDownloadForm />
          </div>

        </div>
      </div>
    </section>
  );
}

function KeyFindings() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-16 pt-20 md:pb-24 md:pt-28">
      <div className="mx-auto max-w-3xl text-center">
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
        {KEY_FINDINGS.map((finding) => (
          <li
            key={finding.eyebrow}
            className="flex flex-col gap-4 rounded-2xl border border-white/5 p-6 md:p-8"
            style={{ background: "rgba(33, 33, 33, 0.98)" }}
          >
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[rgb(var(--color-matcha-400))]">
              {finding.eyebrow}
            </p>
            <h3 className="font-whyteInktrap text-xl font-semibold text-basis md:text-2xl">
              {finding.title}
            </h3>
            <p className="text-sm text-subtle md:text-base">{finding.body}</p>
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
          </li>
        ))}
      </ul>
    </section>
  );
}

function Methodology() {
  return (
    <section className="border-t border-subtle">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-[1fr_2fr] md:py-24">
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

function FinalCTA() {
  return (
    <section className="border-t border-subtle">
      <div className="mx-auto max-w-7xl px-6 py-16 text-center md:py-24">
        <h2 className="font-whyteInktrap text-3xl font-semibold text-basis md:text-4xl">
          Get the full report.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-subtle md:text-lg">
          Charts, breakouts by team size, and the patterns that predict scaling
          confidence — all in the PDF.
        </p>
        <div className="mt-8">
          <a
            href="#get-the-report"
            className="inline-flex items-center gap-2 rounded-md bg-cta px-6 py-3 text-sm font-medium text-carbon-1000 transition-all hover:bg-ctaHover"
          >
            Download the full report
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
