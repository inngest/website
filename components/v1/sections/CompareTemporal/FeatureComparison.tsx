"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import Logo from "@/components/v1/Logo";
import { cn } from "@/utils/v1/cn";
import { reveals } from "@/utils/v1/reveals";
import { V1_CYCLE_MS } from "@/utils/v1/springs";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import DocsCtaPair from "@/components/v1/sections/CompareTemporal/DocsCtaPair";
import { V1_HEADER_CONTENT_MT } from "@/components/v1/sections/shared/sectionShell";

/**
 * "Side by side feature comparison". A persona
 * tab bar sits above a 3-column table (Feature / Temporal / Inngest)
 * whose rows are grouped under accordion categories. Each persona has
 * its own category set + copy; Inngest cells can carry inline `code`
 * segments rendered in
 * salmon mono, and partial-support Temporal cells are prefixed "~".
 *
 * The persona tabs auto-advance on a timer (Background-jobs "See it in
 * action" pattern): the active tab shows a salmon square + a 2px
 * progress bar that fills over the cycle. Auto-advance pauses when the
 * section is off-screen and stops permanently on any manual click. On
 * mobile the tabs stack vertically.
 *
 * NOTE: Backend Engineer's non-Core categories are authored copy — only
 * its Core Execution view is specified in the design.
 */

// Row dividers are a 40%-grey hairline.
const ROW_BORDER = "rgba(124,124,124,0.4)";

// ---- rich cell ----------------------------------------------------
type Seg = { t: string; code?: boolean };
type Cell = Seg[];
const t = (s: string): Seg => ({ t: s });
const c = (s: string): Seg => ({ t: s, code: true });

interface Row {
  feature: string;
  temporal: Cell;
  inngest: Cell;
}
interface Category {
  key: string;
  label: string;
  rows: Row[];
}
interface Persona {
  key: string;
  label: string;
  categories: Category[];
}

// The Inngest "Minutes – npx inngest-cli@latest dev …" row recurs as the
// lead row of several personas' first category.
const TIME_TO_FIRST: Row = {
  feature: "Time to first execution",
  temporal: [t("Hours to days – provision workers, server, and database first")],
  inngest: [
    t("Minutes – "),
    c("npx inngest-cli@latest dev"),
    t(" and wrap an existing function"),
  ],
};

// ---- data (per-persona views) -------------------------------------
const PERSONAS: Persona[] = [
  {
    key: "backend",
    label: "Backend Engineer",
    categories: [
      {
        key: "core",
        label: "Core Execution",
        rows: [
          TIME_TO_FIRST,
          {
            feature: "Multi-step execution",
            temporal: [t("Workflows + Activities – their terms for functions & steps")],
            inngest: [c("step.run()"), t(" – plain async, automatic persistence (Temporal calls these Activities)")],
          },
          {
            feature: "Fan-out / Parallel Steps",
            temporal: [t("Parallel activity execution")],
            inngest: [c("promise.all"), t(" over "), c("step.run()")],
          },
          {
            feature: "Scheduled / Cron",
            temporal: [t("Cron schedules")],
            inngest: [t("Native cron trigger (Temporal: Schedules)")],
          },
          {
            feature: "SDK ergonomics",
            temporal: [t("Determinism rules add cognitive hoverhead; Go SKD most mature")],
            inngest: [t("Plain async/await — no determinism constraints")],
          },
          {
            feature: "Language support",
            temporal: [t("Go, Java, TypeScript, Python – Go SKD significantly ahead; Java unique to Temporal")],
            inngest: [t("TypeScript, Python, Go — any HTTP runtime")],
          },
        ],
      },
      {
        key: "ai",
        label: "AI Agents",
        rows: [
          {
            feature: "Step memoization",
            temporal: [t("Activity results are cached, but retries re-run the whole activity")],
            inngest: [t("Completed steps never re-run on retry")],
          },
          {
            feature: "Human-in-the-loop",
            temporal: [t("Signals — Temporal’s term for what Inngest calls waitForEvent")],
            inngest: [c("step.waitForEvent()"), t(" — native primitive (Temporal calls these Signals)")],
          },
          {
            feature: "Durable HTTP endpoints",
            temporal: [t("Not supported")],
            inngest: [t("Durability for real-time / streaming agent calls")],
          },
        ],
      },
      {
        key: "observability",
        label: "Observability",
        rows: [
          {
            feature: "Step-level traces",
            temporal: [t("Event History (Temporal’s term) — workflow-level, less granular per step")],
            inngest: [t("Every step timed and inspectable in the dashboard")],
          },
          {
            feature: "Queue delay vs. execution time",
            temporal: [t("Not broken out natively — custom instrumentation needed")],
            inngest: [t("Surfaced separately per run")],
          },
          {
            feature: "Bulk replay",
            temporal: [t("Workflow reset (Temporal’s term) — per-workflow via CLI, no bulk UI")],
            inngest: [t("Re-run failed functions in bulk from the dashboard")],
          },
        ],
      },
      {
        key: "flow",
        label: "Flow Control",
        rows: [
          {
            feature: "Per-key concurrency",
            temporal: [t("Task queues — Temporal’s term; sized at worker level, not per-key")],
            inngest: [t("One line of function config")],
          },
          {
            feature: "Rate limiting",
            temporal: [t("No built-in rate limiting — requires custom implementation")],
            inngest: [t("Built-in, per function or per user")],
          },
          {
            feature: "Debouncing",
            temporal: [t("No native debouncing — achievable with custom signal/timer logic")],
            inngest: [t("Native")],
          },
        ],
      },
    ],
  },
  {
    key: "ai",
    label: "AI Engineer",
    categories: [
      {
        key: "primitives",
        label: "Agent Primitives",
        rows: [
          TIME_TO_FIRST,
          {
            feature: "Step memoization",
            temporal: [t("~ Activity results cached, but not at per-step granularity within a retry")],
            inngest: [t("Completed steps never re-run on retry")],
          },
          {
            feature: "Human-in-the-loop",
            temporal: [t("~ Signals (Temporal’s term) — require channel, Selector, and handler setup")],
            inngest: [c("step.waitForEvent()"), t(" — native, no boilerplate (Temporal: Signals)")],
          },
          {
            feature: "Inter-step latency",
            temporal: [t("~ Synchronous history write per step — a deliberate durability tradeoff that adds latency")],
            inngest: [t("Near-zero with Checkpointing — ~50% faster end-to-end")],
          },
          {
            feature: "Durable HTTP endpoints",
            temporal: [t("Not natively supported")],
            inngest: [t("Durability for streaming / real-time agent responses")],
          },
        ],
      },
      {
        key: "flow",
        label: "Flow Control",
        rows: [
          {
            feature: "Per-user concurrency",
            temporal: [t("Worker-level only — per-key isolation must be built manually")],
            inngest: [c("concurrency: key: 'event.data.userId'")],
          },
          {
            feature: "Rate limiting",
            temporal: [t("No built-in rate limiting — requires custom implementation")],
            inngest: [t("Built-in, one line of config")],
          },
          {
            feature: "Debouncing",
            temporal: [t("No native debouncing — achievable with signals and timers")],
            inngest: [t("Native")],
          },
        ],
      },
      {
        key: "observability",
        label: "Observability",
        rows: [
          {
            feature: "Step-level traces",
            temporal: [t("Event History (Temporal’s term) — less granular than Inngest traces")],
            inngest: [t("Every step timed, status visible, inputs inspectable")],
          },
          {
            feature: "Queue delay vs. execution time",
            temporal: [t("Not broken out natively — harder to distinguish slow queue from slow code")],
            inngest: [t("Separated from execution time in every trace")],
          },
          {
            feature: "Bulk replay",
            temporal: [t("Workflow reset (Temporal’s term) — per-workflow via CLI, no bulk UI")],
            inngest: [t("One-click from the dashboard")],
          },
        ],
      },
      {
        key: "dx",
        label: "Developer experience",
        rows: [
          {
            feature: "AgentKit",
            temporal: [t("No native agent framework — integrates well with LangChain and others")],
            inngest: [t("First-party framework for multi-agent networks")],
          },
          {
            feature: "Language support",
            temporal: [t("Go SDK is excellent; TypeScript and Python are functional and improving quickly")],
            inngest: [t("TypeScript, Python, Go — any HTTP runtime")],
          },
          {
            feature: "Local dev",
            temporal: [t("Docker-based local server — solid once configured, no MCP support")],
            inngest: [t("One command, MCP integration for AI coding tools")],
          },
        ],
      },
    ],
  },
  {
    key: "platform",
    label: "Platform Engineer",
    categories: [
      {
        key: "infra",
        label: "Infrastructure ownership",
        rows: [
          TIME_TO_FIRST,
          {
            feature: "Worker processes",
            temporal: [t("You deploy, scale, and monitor workers")],
            inngest: [t("None — Inngest has no worker concept; calls your existing HTTP server")],
          },
          {
            feature: "Orchestration server",
            temporal: [t("Self-hosted or Temporal Cloud — self-hosted suits teams already running their own infra")],
            inngest: [t("Fully managed")],
          },
          {
            feature: "Database",
            temporal: [t("Cassandra or PostgreSQL — you manage")],
            inngest: [t("None required")],
          },
          {
            feature: "Scaling model",
            temporal: [t("Worker pools give fine-grained control — good fit if you want that level of tuning")],
            inngest: [t("Scales with your existing HTTP server — no separate worker fleet")],
          },
        ],
      },
      {
        key: "flow",
        label: "Flow Control",
        rows: [
          {
            feature: "Per-user concurrency",
            temporal: [t("Task queues — Temporal’s term; powerful but manual, no per-key isolation")],
            inngest: [t("One line of function config")],
          },
          {
            feature: "Rate limiting",
            temporal: [t("No built-in rate limiting — must be implemented")],
            inngest: [t("Built-in, per function or per user")],
          },
          {
            feature: "Multi-tenancy isolation",
            temporal: [t("Namespaces + Task queues (Temporal’s terms) — more work, but gives full control")],
            inngest: [t("Per-key limits in config — no custom code needed")],
          },
        ],
      },
      {
        key: "observability",
        label: "Observability",
        rows: [
          {
            feature: "Step-level traces",
            temporal: [t("Event History (Temporal’s term) — coarser granularity")],
            inngest: [t("Per-step timing, status, and input/output")],
          },
          {
            feature: "Queue delay visibility",
            temporal: [t("Not broken out natively — custom instrumentation needed")],
            inngest: [t("Surfaced separately from execution time")],
          },
          {
            feature: "Metrics export",
            temporal: [t("Possible via tctl and custom setup — more configuration required")],
            inngest: [t("Native Datadog and Prometheus integrations")],
          },
        ],
      },
      {
        key: "compliance",
        label: "Compliance & security",
        rows: [
          {
            feature: "SOC 2 / HIPAA",
            temporal: [t("Temporal Cloud compliant; self-hosted scope is yours")],
            inngest: [t("SOC 2 compliant, HIPAA BAA available")],
          },
          {
            feature: "E2E encryption",
            temporal: [t("Codec server pattern — you implement it")],
            inngest: [t("Encryption middleware available")],
          },
        ],
      },
    ],
  },
  {
    key: "product",
    label: "Product Engineer",
    categories: [
      {
        key: "start",
        label: "Getting started",
        rows: [
          TIME_TO_FIRST,
          {
            feature: "Time to first function",
            temporal: [t("Workers, server, and database required before writing any logic")],
            inngest: [t("Minutes — wraps your existing code")],
          },
          {
            feature: "Serverless / Next.js support",
            temporal: [t("Persistent worker processes required — doesn’t fit serverless natively")],
            inngest: [t("Native — no persistent processes needed")],
          },
          {
            feature: "Local dev",
            temporal: [t("Docker-based local server — solid once set up")],
            inngest: [t("One command, full traces in browser")],
          },
          {
            feature: "Pricing to start",
            temporal: [t("Self-hosted is free; Temporal Cloud requires a contract")],
            inngest: [t("Free tier, no credit card required")],
          },
        ],
      },
      {
        key: "agents",
        label: "Building agents",
        rows: [
          {
            feature: "Step memoization",
            temporal: [t("Activities are cached on success — same principle, less granular")],
            inngest: [t("Retries never re-invoke completed steps")],
          },
          {
            feature: "Human-in-the-loop",
            temporal: [t("Signals (Temporal’s term) — work well, just more code to wire up")],
            inngest: [c("step.waitForEvent()"), t(" — one line (Signals in Temporal)")],
          },
          {
            feature: "Background jobs & cron",
            temporal: [t("First-class")],
            inngest: [t("First-class")],
          },
          {
            feature: "Observability",
            temporal: [t("Workflow history — less granular, no bulk replay")],
            inngest: [t("Per-key limits in config — no custom code needed")],
          },
        ],
      },
    ],
  },
  {
    key: "leadership",
    label: "Engineer Leadership",
    categories: [
      {
        key: "cost",
        label: "Operational cost",
        rows: [
          TIME_TO_FIRST,
          {
            feature: "Infrastructure to own",
            temporal: [t("Workers, server, and database before writing any logic")],
            inngest: [t("Zero — no workers, servers, or databases")],
          },
          {
            feature: "Maintenance burden",
            temporal: [t("You own ops — more control, more responsibility")],
            inngest: [t("Inngest manages the platform")],
          },
          {
            feature: "Team ramp-up",
            temporal: [t("Steeper learning curve; pays off for teams going deep on Go")],
            inngest: [t("Familiar async/await — no new paradigm")],
          },
          {
            feature: "Pricing",
            temporal: [t("Temporal Cloud pricing is custom at scale — standard for enterprise infra")],
            inngest: [t("Usage-based, public pricing, free tier")],
          },
          {
            feature: "Scale ceiling",
            temporal: [t("Proven at extreme scale — one of Temporal’s genuine strengths")],
            inngest: [t("100k+ executions/sec, enterprise SLAs available")],
          },
          {
            feature: "No vendor lock-in",
            temporal: [t("Open-source core; Temporal Cloud is proprietary")],
            inngest: [t("Open-source SDK, self-hostable")],
          },
        ],
      },
      {
        key: "readiness",
        label: "AI agent readiness",
        rows: [
          {
            feature: "Purpose-built primitives",
            temporal: [t("Fully capable — designed for deterministic logic, which shows at the edges for AI")],
            inngest: [t("HITL, step memoization, flow control — first-class")],
          },
          {
            feature: "Multi-tenant flow control",
            temporal: [t("No built-in primitives — must be implemented from scratch")],
            inngest: [t("Per-user concurrency and rate limits in config")],
          },
          {
            feature: "Agent observability",
            temporal: [t("Workflow-level history — less granular for debugging agent runs")],
            inngest: [t("Step-level traces, queue delay, flow control visibility")],
          },
        ],
      },
      {
        key: "trust",
        label: "Trust & scale",
        rows: [
          {
            feature: "Compliance",
            temporal: [t("Temporal Cloud compliant; self-hosted scope is yours")],
            inngest: [t("SOC 2, HIPAA BAA available")],
          },
          {
            feature: "Multi-region reliability",
            temporal: [t("Active-active multi-region on Temporal Cloud — a genuine strength")],
            inngest: [t("Managed uptime; no self-service multi-region")],
          },
          {
            feature: "Ecosystem maturity",
            temporal: [t("Larger community, more enterprise deployments, longer track record")],
            inngest: [t("Growing fast — strong community, younger than Temporal’s")],
          },
        ],
      },
    ],
  },
];

function Chevron({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn(
        "size-6 shrink-0 text-v1-frost motion-safe:transition-transform motion-safe:duration-200",
        isOpen ? "rotate-180" : "",
      )}
      aria-hidden="true"
    >
      <path
        d="M6 10 L12 16 L18 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RichCell({ cell, tone }: { cell: Cell; tone: "dim" | "frost" }) {
  return (
    <p
      className={cn(
        "text-[15px] leading-[1.5] lg:text-[16px]",
        tone === "dim" ? "text-v1-frost/55" : "text-v1-frost",
      )}
    >
      {cell.map((seg, i) =>
        seg.code ? (
          <code
            key={i}
            className="font-v1Label text-[13px] text-v1-accent-salmon lg:text-[14px]"
          >
            {seg.t}
          </code>
        ) : (
          <span key={i}>{seg.t}</span>
        ),
      )}
    </p>
  );
}

export default function FeatureComparison() {
  const [personaKey, setPersonaKey] = useState<string>(PERSONAS[0].key);
  const persona = PERSONAS.find((p) => p.key === personaKey) ?? PERSONAS[0];
  // Single-open accordion, keyed within the active persona; defaults to
  // the persona's first category and resets when the persona changes.
  const [openKey, setOpenKey] = useState<string>(PERSONAS[0].categories[0].key);
  const toggle = (key: string) =>
    setOpenKey((prev) => (prev === key ? "" : key));

  // ---- auto-advancing persona timer (See-it-in-action pattern) ----
  const [inView, setInView] = useState(false);
  const [cycleNonce, setCycleNonce] = useState(0);
  const [userTookControl, setUserTookControl] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  const selectPersona = (key: string, manual: boolean) => {
    setPersonaKey(key);
    const next = PERSONAS.find((p) => p.key === key) ?? PERSONAS[0];
    setOpenKey(next.categories[0].key);
    setCycleNonce((n) => n + 1);
    if (manual) setUserTookControl(true);
  };

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "-15% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || userTookControl) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const interval = window.setInterval(() => {
      setPersonaKey((prev) => {
        const idx = PERSONAS.findIndex((p) => p.key === prev);
        const next = PERSONAS[(idx + 1) % PERSONAS.length];
        setOpenKey(next.categories[0].key);
        return next.key;
      });
      setCycleNonce((n) => n + 1);
    }, V1_CYCLE_MS);
    return () => window.clearInterval(interval);
  }, [inView, userTookControl]);

  const showProgress = inView && !userTookControl;

  return (
    <Section
      ref={sectionRef}
      aria-labelledby="ct-table-heading"
      className="relative"
    >
      <SectionHeader
        id="ct-table-heading"
        titleClassName="lg:max-w-[868px]"
        title="Side by side feature comparison."
        titleAside={<DocsCtaPair />}
      />

      {/* Persona tabs — the Background-jobs "See it in action" card
          tabs verbatim: frost hover background, a 2px top-edge salmon
          progress bar driving the auto-cycle, and a salmon square next
          to the label. Stacked full-width on mobile; at sm+ each tab
          hugs its content in a horizontally-scrollable row. */}
      <motion.div
        {...reveals.item(0)}
        role="tablist"
        aria-label="Choose your role"
        className={`${V1_HEADER_CONTENT_MT} flex flex-col gap-3 sm:-mx-8 sm:flex-row sm:overflow-x-auto sm:px-8 md:gap-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
      >
        {PERSONAS.map((p) => {
          const active = p.key === personaKey;
          return (
            <button
              key={p.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => selectPersona(p.key, true)}
              className={cn(
                "group relative flex items-center gap-[10px] whitespace-nowrap rounded-md px-4 py-5 text-left font-v1Mono text-[16px] uppercase leading-[1.5] tracking-[-0.01em] motion-safe:transition-colors motion-safe:duration-300 motion-safe:ease-v1-out sm:flex-none",
                "hover:bg-v1-frost/[0.035] focus-visible:bg-v1-frost/[0.04] focus-visible:outline-none",
              )}
            >
              {/* Top-edge progress bar — fills left → right over the
                  cycle while the tab is active + auto-cycling. */}
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute inset-x-2 top-0 block h-[2px] overflow-hidden bg-v1-frost/[0.08]",
                  active && showProgress ? "opacity-100" : "opacity-0",
                )}
              >
                {active && showProgress && (
                  <span
                    key={cycleNonce}
                    className="absolute inset-0 origin-left bg-v1-accent-salmon motion-reduce:hidden"
                    style={{
                      animation: `v1-carousel-progress ${V1_CYCLE_MS}ms linear forwards`,
                    }}
                  />
                )}
              </span>
              {/* Salmon square (active) / steel square (resting). */}
              <span
                aria-hidden="true"
                className={cn(
                  "block size-2 shrink-0 motion-safe:transition-colors motion-safe:duration-300",
                  active
                    ? "bg-v1-accent-salmon"
                    : "bg-v1-steel group-hover:bg-v1-frost",
                )}
              />
              <span
                className={cn(
                  "motion-safe:transition-colors motion-safe:duration-300",
                  active ? "text-v1-frost" : "text-v1-frost/60 group-hover:text-v1-frost",
                )}
              >
                {p.label}
              </span>
            </button>
          );
        })}
      </motion.div>

      {/* Table — three equal columns; the feature column is indented
          34px to align with the tab row. */}
      <div className="-mx-6 mt-3 overflow-x-auto sm:-mx-8 lg:mx-0 lg:overflow-visible">
        <motion.div
          {...reveals.item(1)}
          className="min-w-[760px] px-6 sm:px-8 lg:min-w-0 lg:px-0"
        >
          {/* Header row */}
          <div className="grid grid-cols-3 items-center border-b border-v1-frost/40">
            <HeaderCell className="pl-[34px] pr-6 py-[26px]">Feature</HeaderCell>
            <HeaderCell className="px-6 py-[26px]" tone="dim">Temporal</HeaderCell>
            <HeaderCell className="px-6 py-[26px]" icon={<Logo logomarkOnly width={26} />}>
              Inngest
            </HeaderCell>
          </div>

          {/* Categories */}
          {persona.categories.map((cat) => {
            const isOpen = openKey === cat.key;
            return (
              <div key={cat.key} className="flex flex-col">
                <button
                  type="button"
                  onClick={() => toggle(cat.key)}
                  aria-expanded={isOpen}
                  aria-controls={`ct-cat-${cat.key}`}
                  className="flex h-[64px] w-full items-center gap-[10px] border-b border-v1-frost/40 pr-6 text-left"
                >
                  <Chevron isOpen={isOpen} />
                  <span className="font-v1Label text-[16px] uppercase leading-none text-v1-frost">
                    {cat.label}
                  </span>
                </button>
                <div
                  id={`ct-cat-${cat.key}`}
                  className={cn(
                    "grid motion-safe:transition-[grid-template-rows] motion-safe:duration-300",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-hidden">
                    {cat.rows.map((row, ri) => {
                      // Inner rows use a faint hairline; the last row gets
                      // the brighter category divider (matching the header /
                      // category buttons) so an open category doesn't blend
                      // into the next one.
                      const isLastRow = ri === cat.rows.length - 1;
                      return (
                        <div
                          key={row.feature}
                          className={cn(
                            "grid min-h-[90px] grid-cols-3 items-center border-b",
                            isLastRow && "border-v1-frost/40",
                          )}
                          style={isLastRow ? undefined : { borderColor: ROW_BORDER }}
                        >
                          <p className="pl-[34px] pr-6 text-[15px] leading-[1.5] text-v1-frost lg:text-[16px]">
                            {row.feature}
                          </p>
                          <div className="px-6">
                            <RichCell cell={row.temporal} tone="dim" />
                          </div>
                          <div className="px-6">
                            <RichCell cell={row.inngest} tone="frost" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </Section>
  );
}

function HeaderCell({
  children,
  tone = "frost",
  icon,
  className,
}: {
  children: React.ReactNode;
  tone?: "frost" | "dim";
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 font-v1Label text-[16px] uppercase leading-none lg:text-[18px]",
        tone === "dim" ? "text-v1-frost/50" : "text-v1-frost",
        className,
      )}
    >
      {icon}
      <span>{children}</span>
    </div>
  );
}
