import type { Metadata } from "next";
import { generateMetadata as buildMetadata } from "src/utils/social";

import ReportDownloadForm from "./ReportDownloadForm";

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
    <div className="bg-canvasBase text-basis">
      <Hero />
      <KeyFindings />
      <Methodology />
      <FinalCTA />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:py-24 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c2a14] via-[#1f7a36] to-[#7ddc4a] p-8 text-carbon-1000 md:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay"
            style={{
              backgroundImage:
                "radial-gradient(ellipse at 70% 20%, rgba(255,255,255,0.6), transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(0,0,0,0.4), transparent 60%)",
            }}
          />
          <div className="relative flex flex-col gap-8">
            <div>
              <span className="inline-flex items-center rounded-md border border-carbon-1000/40 bg-carbon-1000/5 px-3 py-1 text-xs font-mono uppercase tracking-[0.18em] text-carbon-1000">
                AI in Production
              </span>
            </div>
            <h1 className="font-whyteInktrap text-4xl font-semibold leading-[1.05] sm:text-5xl md:text-6xl">
              2026 Durable Execution
              <br />
              Benchmark Report
            </h1>
            <p className="max-w-xl text-lg text-carbon-1000/80 md:text-xl">
              We surveyed 130 engineers about how they build, run, and keep
              reliable the AI workflows powering their products.
            </p>
            <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {STATS.map((s) => (
                <div
                  key={s.id}
                  className="rounded-xl bg-carbon-1000/10 p-5 ring-1 ring-carbon-1000/20"
                >
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-carbon-1000/70">
                    — {s.id}
                  </p>
                  <dd className="mt-2 font-whyteInktrap text-4xl font-semibold leading-none">
                    {s.value}
                  </dd>
                  <dt className="mt-2 text-xs uppercase tracking-wide text-carbon-1000/80">
                    {s.label}
                  </dt>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div id="get-the-report" className="scroll-mt-24 self-center">
          <ReportDownloadForm />
        </div>
      </div>
    </section>
  );
}

function KeyFindings() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-16 md:pb-24">
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
      <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        {KEY_FINDINGS.map((finding) => (
          <li
            key={finding.eyebrow}
            className="flex flex-col gap-4 rounded-2xl border border-subtle bg-surfaceSubtle/40 p-6 md:p-8"
          >
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[rgb(var(--color-matcha-400))]">
              {finding.eyebrow}
            </p>
            <h3 className="font-whyteInktrap text-xl font-semibold text-basis md:text-2xl">
              {finding.title}
            </h3>
            <p className="text-sm text-subtle md:text-base">{finding.body}</p>
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
