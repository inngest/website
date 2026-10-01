"use client";

import Link from "next/link";
import { motion } from "motion/react";
import CodeBlock, {
  type Line,
  type Token,
  type TokenKind,
} from "@/components/v1/sections/shared/CodeBlock";
import { tokenizeCode } from "@/components/v1/sections/shared/codeHighlight";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import { V1_HEADER_CONTENT_MT } from "@/components/v1/sections/shared/sectionShell";
import { reveals } from "@/utils/v1/reveals";

const MUTED = "#7c7c7c";
const TOKEN_COLORS: Partial<Record<TokenKind, string>> = {
  kw: "#fb5536",
  fn: "#5f7df0",
  id: "#0bdd48",
  str: "#77f19a",
  cmt: MUTED,
  punc: MUTED,
};

/** Turn a source string into CodeBlock lines, tagging calls as `fn`. */
function linesFrom(source: string): Line[] {
  const rows = source.replace(/^\n/, "").replace(/\n$/, "").split("\n");
  return rows.map((row) => {
    const raw = tokenizeCode(row);
    return raw.map(([text, kind], i): Token => {
      if (
        kind === "kw" ||
        kind === "str" ||
        kind === "num" ||
        kind === "cmt" ||
        kind === "id" ||
        kind === "fn" ||
        kind === "var"
      ) {
        return [text, kind];
      }
      if (/^[A-Za-z_$]/.test(text)) {
        const rest = raw.slice(i + 1).find(([token]) => token.trim() !== "");
        return [text, rest?.[0].startsWith("(") ? "fn" : "id"];
      }
      return [text, "punc"];
    });
  });
}

// Code samples are reflowed onto ≤ 44-character lines so each one fits
// a third-width card at 11px mono without wrapping.
const CASES: {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  label: string;
  code: string;
  /** The sandboxes docs page this case is drawn from. */
  docsHref: string;
}[] = [
  {
    id: "run-code",
    eyebrow: "Code interpreter",
    title: "Run AI-generated code",
    body: "If you ask a question, and your agent writes Python to answer it, that script needs a machine. Each question gets its own sandbox: upload the file, run the code, and the output comes back as the next step.",
    label: "inngest/analyse-data.ts",
    docsHref: "/docs/sandboxes/features/managed-lifecycle",
    code: `// One machine per run. Commands are steps.
const sandbox = await step.sandbox.create(
  "create-sandbox",
  {
    name: \`analyst-\${runId}\`,
    vcpu: 1,
    memoryMb: 1024,
  },
);

const result = await sandbox.commands.run(
  "run-code",
  ["python3", "-c", code],
);`,
  },
  {
    id: "score-code",
    eyebrow: "Evals",
    title: "Score generated code",
    body: "A new prompt only counts if the code it writes still passes. Run each case in a sandbox, then score in the background so the result is credited to the prompt that wrote it.",
    label: "inngest/score-code.ts",
    docsHref: "/docs/sandboxes/features/isolation-and-security",
    code: `// Run each case sandboxed. Score after.
const result = await sandbox.commands.run(
  \`case-\${i}\`,
  'printf %s "$INPUT" | python3 -c "$CODE"',
  {
    environment: {
      CODE: code,
      INPUT: test.stdin,
    },
    timeout: "5s",
  },
);

defer("score", {
  function: passRate,
  data: { code, cases },
  experiment: experimentRef,
});`,
  },
  {
    id: "custom-env",
    eyebrow: "Custom environments",
    title: "Heavy jobs, off your servers",
    body: "A DuckDB pass, a media batch, or a build will swamp the server handling requests. Install the tools once, snapshot the environment, and clone a worker per file. Each file retries on its own.",
    label: "inngest/process-dataset.ts",
    docsHref: "/docs/sandboxes/features/cloning",
    code: `// Install once, snapshot, clone per file.
await builder.commands.run(
  "install",
  "pip install --quiet duckdb",
  { timeout: "5m" },
);

const environment = await builder.snapshot(
  "snapshot-environment",
);

const worker = await environment.clone(
  \`clone-\${i}\`,
  { name: \`dataset-\${runId}-\${i}\` },
);`,
  },
];

/**
 * Use cases as a 1×3 row (stacked on mobile). Each column is a
 * fixed-height media panel in the hero's brand-blue fill, with the code
 * window top-aligned in it, then plain title + body on the page below.
 * At lg the three columns share a subgrid, so the panel row is exactly
 * as tall as the tallest code sample and the other two windows stretch
 * to match — equal heights with no dead space and no fixed number.
 * Stacked below lg, each panel sizes to its own code.
 */
export default function UseCases() {
  return (
    <Section aria-labelledby="sandboxes-usecases-heading" className="relative">
      <SectionHeader
        id="sandboxes-usecases-heading"
        eyebrow="Use cases"
        title={
          <>
            <span className="block">Durable machines</span>
            <span className="block">for every agent.</span>
          </>
        }
        body="A sandbox is a step. It retries, it shows up on the trace, and the same flow control you already use applies to the run."
        bodyClassName="max-w-[640px]"
      />

      <ul
        className={`${V1_HEADER_CONTENT_MT} grid list-none grid-cols-1 gap-x-10 gap-y-12 pl-0 lg:grid-cols-3`}
      >
        {CASES.map((item, i) => (
          <motion.li
            key={item.id}
            {...reveals.item(i)}
            // Subgrid at lg: each column spans the two parent rows (panel,
            // copy), so row 1 is exactly as tall as the tallest panel and
            // the other two panels stretch to match — no fixed height.
            className="list-none lg:row-span-2 lg:grid lg:grid-rows-subgrid"
          >
            <UseCaseCard item={item} />
          </motion.li>
        ))}
      </ul>
    </Section>
  );
}

function UseCaseCard({ item }: { item: typeof CASES[number] }) {
  return (
    <article className="flex h-full flex-col gap-10 lg:contents">
      {/* The hero's brand blue, mixed 70/30 with the page canvas so the
          panel reads as a deeper, quieter blue beside the grain instead of
          the fully saturated accent. The code window sits on top. */}
      <div className="relative flex w-full items-stretch justify-center overflow-hidden rounded-[10px] p-5 [background-color:color-mix(in_srgb,rgb(var(--color-v1-accent-blue))_70%,rgb(var(--color-v1-bg-canvas-base)))] sm:p-8 lg:p-10">
        {/* Code window — stretches to the panel's content box, which the
            subgrid row sets from the tallest sample, so all three windows
            are the same size; depth shadow so it reads as sitting on the
            panel. */}
        <div className="relative z-10 flex w-full min-w-0 max-w-[560px] shadow-[0_28px_64px_-24px_rgb(0_0_0/0.85),0_8px_20px_-10px_rgb(0_0_0/0.6)]">
          <CodeBlock
            label={item.label}
            lines={linesFrom(item.code)}
            gutter={false}
            footer={false}
            animate={false}
            caret={false}
            fontSize="11px"
            maxHeight="none"
            maxWidth="100%"
            tokenColors={TOKEN_COLORS}
          />
        </div>
      </div>

      {/* Copy: eyebrow → title 16, title → body 16 — the lockup rhythm
          the section headers use, scaled to a column. */}
      <div className="flex flex-col gap-4">
        <p className="text-v1-eyebrow uppercase text-v1-accent-salmon">
          {item.eyebrow}
        </p>
        <h3
          id={`sandboxes-${item.id}-heading`}
          className="text-v1-heading-card text-balance text-v1-frost"
        >
          {item.title}
        </h3>
        <p className="text-v1-body-lg-loose max-w-[460px]">{item.body}</p>
        {/* "Read the docs →" — the site's text-cue vocabulary, linking to
            the specific docs page this case is drawn from. */}
        <Link
          href={`${item.docsHref}?ref=sandboxes-use-cases`}
          className="group/cta text-v1-label-md mt-2 inline-flex w-fit items-center uppercase text-v1-frost hover:text-v1-accent-salmon focus:outline-none focus-visible:text-v1-accent-salmon motion-safe:transition-colors motion-safe:duration-300"
        >
          <span>Read the docs</span>
          <span
            aria-hidden="true"
            className="ml-2 inline-block group-hover/cta:translate-x-[6px] motion-safe:transition-transform motion-safe:duration-[400ms] motion-safe:ease-v1-in"
          >
            →
          </span>
        </Link>
      </div>
    </article>
  );
}
