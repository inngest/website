"use client";

import { motion } from "motion/react";
import CodeBlock, {
  type Line,
  type Token,
  type TokenKind,
} from "@/components/v1/sections/shared/CodeBlock";
import { tokenizeCode } from "@/components/v1/sections/shared/codeHighlight";
import GradientFrame from "@/components/v1/sections/shared/GradientFrame";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import { V1_HEADER_CONTENT_MT } from "@/components/v1/sections/shared/sectionShell";
import { reveals } from "@/utils/v1/reveals";
import { cn } from "@/utils/v1/cn";

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

const CASES: {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  label: string;
  code: string;
  flip: boolean;
}[] = [
  {
    id: "run-code",
    eyebrow: "Code interpreter",
    title: "Run AI-generated code",
    body: "If you ask a question, and your agent writes Python to answer it, that script needs a machine. Each question gets its own sandbox: upload the file, run the code, and the output comes back as the next step.",
    label: "inngest/analyse-data.ts",
    flip: false,
    code: `// One machine per run. The command is a step.
const sandbox = await step.sandbox.create("create-sandbox", {
  name: \`analyst-\${runId}\`,
  vcpu: 1,
  memoryMb: 1024,
});

const result = await sandbox.commands.run("run-code", [
  "python3",
  "-c",
  code,
]);`,
  },
  {
    id: "score-code",
    eyebrow: "Evals",
    title: "Test and score generated code",
    body: "A new prompt only counts if the code it writes still passes. Run each case in a sandbox, then score in the background so the result is credited to the prompt that wrote it.",
    label: "inngest/score-code.ts",
    flip: true,
    code: `// Each case runs in the sandbox. Scoring happens after.
const result = await sandbox.commands.run(
  \`case-\${i}\`,
  'printf %s "$INPUT" | python3 -c "$CODE"',
  {
    environment: { CODE: code, INPUT: test.stdin },
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
    flip: false,
    code: `// Install once, snapshot, then clone a worker per file.
await builder.commands.run("install", "pip install --quiet duckdb", {
  timeout: "5m",
});

const environment = await builder.snapshot("snapshot-environment");

const worker = await environment.clone(\`clone-\${i}\`, {
  name: \`dataset-\${runId}-\${i}\`,
});`,
  },
];

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
      <div className={cn(V1_HEADER_CONTENT_MT, "flex flex-col gap-6 lg:gap-8")}>
        {CASES.map((item) => (
          <GradientFrame
            key={item.id}
            variant="charcoal"
            className="rounded-md"
            innerClassName={cn(
              "grid grid-cols-1 items-center gap-x-4 gap-y-10 px-6 py-12 sm:gap-y-12 sm:px-8 sm:py-14 lg:gap-x-8 lg:px-8 lg:py-16",
              item.flip
                ? "lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]"
                : "lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
            )}
          >
            <SectionHeader
              id={`sandboxes-${item.id}-heading`}
              className={cn(
                "lg:pr-4",
                item.flip && "lg:order-2 lg:pl-4 lg:pr-0"
              )}
              eyebrow={item.eyebrow}
              title={item.title}
              titleClassName="[font-size:clamp(1.75rem,3vw,2.75rem)]"
              body={item.body}
              bodyClassName="max-w-[460px]"
            />
            <motion.div
              {...reveals.body}
              className={cn("min-w-0", item.flip && "lg:order-1")}
            >
              <CodeBlock
                label={item.label}
                lines={linesFrom(item.code)}
                gutter={false}
                animate={false}
                caret={false}
                fontSize="14px"
                maxHeight="none"
                maxWidth="100%"
                tokenColors={TOKEN_COLORS}
              />
            </motion.div>
          </GradientFrame>
        ))}
      </div>
    </Section>
  );
}
