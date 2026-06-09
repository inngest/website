"use client";

import { useState, type ReactNode } from "react";
import { motion } from "motion/react";
import ButtonLink from "@/components/v1/ButtonLink";
import GradientFrame from "@/components/v1/sections/shared/GradientFrame";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import { reveals } from "@/utils/v1/reveals";

const BOX = {
  border: "1px solid #ffffff",
  borderRadius: 0,
} as const;

export default function AnyCode() {
  return (
    <Section
      aria-label="Any code, any runtime"
      className="relative"
      // No card wrapper — content sits directly on the section bg.
      // Two equal columns: copy + code panel.
      containerClassName="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-2 lg:items-center lg:gap-x-8"
    >
      <SectionHeader
        className="lg:pr-8"
        title="Any code, any runtime."
        body="Workflows, agents, endpoints. API calls, webhooks, cron. Edge, serverless, traditional. Same primitives, same guarantees, no matter what or where you run. Wrap functions in steps to make any code durable by default."
        bodyClassName="max-w-[640px]"
        actions={
          <ButtonLink
            href="/docs/runtimes?ref=durable-execution"
            variant="primary"
          >
            See Docs
          </ButtonLink>
        }
      />

      <motion.div {...reveals.body}>
        <MultiLanguagePanel />
      </motion.div>
    </Section>
  );
}

interface LangSection {
  label: string;
  body: ReactNode;
}

const LANGS: LangSection[] = [
  {
    label: "TYPESCRIPT",
    body: (
      <>
        <span className="text-[#C792EA]">await</span>{" "}
        <span className="text-v1-frost">step.run</span>
        <span className="text-v1-frost/65">(</span>
        <span className="text-[#C3E88D]">&ldquo;fetch-data&rdquo;</span>
        <span className="text-v1-frost/65">,</span>{" "}
        <span className="text-[#C792EA]">async</span>{" "}
        <span className="text-v1-frost/65">() =&gt; {"{"}</span>
        {"\n  "}
        <span className="text-[#C792EA]">return</span>{" "}
        <span className="text-[#C792EA]">await</span>{" "}
        <span className="text-v1-frost">db.query</span>
        <span className="text-v1-frost/65">(...)</span>
        {"\n"}
        <span className="text-v1-frost/65">{"})"}</span>
      </>
    ),
  },
  {
    label: "PYTHON",
    body: (
      <>
        <span className="text-[#82AAFF]">@inngest</span>
        <span className="text-v1-frost">.create_function</span>
        <span className="text-v1-frost/65">(...)</span>
        {"\n"}
        <span className="text-[#C792EA]">async</span>{" "}
        <span className="text-[#C792EA]">def</span>{" "}
        <span className="text-[#82AAFF]">handler</span>
        <span className="text-v1-frost/65">(ctx):</span>
        {"\n  "}
        <span className="text-v1-frost">data</span>{" "}
        <span className="text-v1-frost/65">=</span>{" "}
        <span className="text-[#C792EA]">await</span>{" "}
        <span className="text-v1-frost">ctx.step.run</span>
        <span className="text-v1-frost/65">(</span>
        <span className="text-[#C3E88D]">&ldquo;fetch&rdquo;</span>
        <span className="text-v1-frost/65">,</span>{" "}
        <span className="text-v1-frost">fetch</span>
        <span className="text-v1-frost/65">)</span>
      </>
    ),
  },
  {
    label: "GO",
    body: (
      <>
        <span className="text-v1-frost">step.Run</span>
        <span className="text-v1-frost/65">(ctx,</span>{" "}
        <span className="text-[#C3E88D]">&ldquo;fetch-data&rdquo;</span>
        <span className="text-v1-frost/65">,</span>{" "}
        <span className="text-[#C792EA]">func</span>
        <span className="text-v1-frost/65">(ctx) (</span>
        <span className="text-[#82AAFF]">any</span>
        <span className="text-v1-frost/65">,</span>{" "}
        <span className="text-[#F07178]">error</span>
        <span className="text-v1-frost/65">){"{"}</span>
        {"\n  "}
        <span className="text-[#C792EA]">return</span>{" "}
        <span className="text-v1-frost">db.Query</span>
        <span className="text-v1-frost/65">(...)</span>
        {"\n"}
        <span className="text-v1-frost/65">{"})"}</span>
      </>
    ),
  },
];

function MultiLanguagePanel() {
  // Single outer 1px white box. All three language bodies are open
  // by default; clicking a label row still sets it as "active" (the
  // salmon marker moves) but no collapse — every section stays
  // visible. Internal 1px white hairlines partition the sections
  // inside the outer box.
  const [active, setActive] = useState(0);
  return (
    // Black GradientFrame wrapper — the white code box sits inside with
    // ~24/32px padding; the gradient fill + stroke ring show through the
    // inset.
    <GradientFrame
      variant="black"
      className="rounded-[6px]"
      innerClassName="px-12 py-12"
    >
      <div className="bg-[#0a0a0a]" style={BOX}>
        <div
          className="px-5 py-3"
          style={{ borderBottom: "1px solid #ffffff" }}
        >
        <span className="font-mono text-[12px] text-v1-frost/75">
          Same primitives, any language
        </span>
      </div>
      {LANGS.map((lang, i) => {
        const isActive = i === active;
        const isLast = i === LANGS.length - 1;
        return (
          <div
            key={lang.label}
            style={
              isLast ? undefined : { borderBottom: "1px solid #ffffff" }
            }
          >
            <button
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={isActive}
              className="group/lang flex w-full items-center gap-2 px-5 pt-3 pb-2 text-left motion-safe:transition-colors hover:bg-v1-frost/[0.04]"
            >
              <span
                aria-hidden="true"
                className={`inline-block size-[8px] motion-safe:transition-colors ${
                  isActive
                    ? "bg-v1-accent-salmon"
                    : "bg-v1-frost/30 group-hover/lang:bg-v1-frost/60"
                }`}
              />
              <span className="text-v1-label-spaced font-semibold uppercase text-v1-frost">
                {lang.label}
              </span>
            </button>
            <pre className="overflow-x-auto whitespace-pre px-5 pt-1 pb-4 font-mono text-[12px] leading-[1.7] text-v1-frost/85 sm:text-[13px]">
              {lang.body}
            </pre>
          </div>
        );
      })}
      </div>
    </GradientFrame>
  );
}
