import CodeBlock, { type Line } from "@/components/v1/sections/shared/CodeBlock";
import MultiStepLLMDiagram, { NATURAL_H, NATURAL_W } from "./MultiStepLLMDiagram";
import ScaledWidget from "@/components/v1/sections/shared/ScaledWidget";

/**
 * Multi-step LLM illustration — pairs a multi-step Inngest function
 * (three `step.ai.infer` calls + a final `step.run("save")`) with the
 * timeline-style diagram that shows each step running as an
 * independent, checkpointed unit. The snippet exceeds the shared
 * code-surface cap (see `CODE_SURFACE_MAX_H` in CodeBlock), so the
 * surface scrolls vertically within the capped frame.
 */

const MULTI_STEP_LLM_CODE: Line[] = [
  [
    ["export", "kw"],
    [" ", "punc"],
    ["default", "kw"],
    [" ", "punc"],
    ["inngest", "id"],
    [".", "punc"],
    ["createFunction", "fn"],
    ["(", "punc"],
  ],
  [
    ["  { ", "punc"],
    ["id", "id"],
    [": ", "punc"],
    ['"process-document"', "str"],
    [" },", "punc"],
  ],
  [
    ["  { ", "punc"],
    ["event", "id"],
    [": ", "punc"],
    ['"doc/upload"', "str"],
    [" },", "punc"],
  ],
  [
    ["  ", "punc"],
    ["async", "kw"],
    [" ({ ", "punc"],
    ["event", "id"],
    [", ", "punc"],
    ["step", "id"],
    [" }) => {", "punc"],
  ],
  [["", "punc"]],
  [
    ["    ", "punc"],
    ["const", "kw"],
    [" ", "punc"],
    ["extracted", "var"],
    [" = ", "punc"],
    ["await", "kw"],
    [" ", "punc"],
    ["step", "id"],
    [".", "punc"],
    ["ai", "id"],
    [".", "punc"],
    ["infer", "fn"],
    ["(", "punc"],
    ['"extract"', "str"],
    [", {", "punc"],
  ],
  [
    ["      ", "punc"],
    ["model", "id"],
    [": ", "punc"],
    ['"claude-sonnet-4-20250514"', "str"],
    [",", "punc"],
  ],
  [
    ["      ", "punc"],
    ["messages", "id"],
    [": [{ ", "punc"],
    ["role", "id"],
    [": ", "punc"],
    ['"user"', "str"],
    [", ", "punc"],
    ["content", "id"],
    [": ", "punc"],
    ["event", "id"],
    [".", "punc"],
    ["data", "id"],
    [".", "punc"],
    ["raw", "id"],
    [" }]", "punc"],
  ],
  [["    })", "punc"]],
  [["", "punc"]],
  [
    ["    ", "punc"],
    ["const", "kw"],
    [" ", "punc"],
    ["summary", "var"],
    [" = ", "punc"],
    ["await", "kw"],
    [" ", "punc"],
    ["step", "id"],
    [".", "punc"],
    ["ai", "id"],
    [".", "punc"],
    ["infer", "fn"],
    ["(", "punc"],
    ['"summarize"', "str"],
    [", {", "punc"],
  ],
  [
    ["      ", "punc"],
    ["messages", "id"],
    [": [{ ", "punc"],
    ["role", "id"],
    [": ", "punc"],
    ['"user"', "str"],
    [", ", "punc"],
    ["content", "id"],
    [": ", "punc"],
    ["extracted", "id"],
    [" }]", "punc"],
  ],
  [["    })", "punc"]],
  [["", "punc"]],
  [
    ["    ", "punc"],
    ["const", "kw"],
    [" ", "punc"],
    ["label", "var"],
    [" = ", "punc"],
    ["await", "kw"],
    [" ", "punc"],
    ["step", "id"],
    [".", "punc"],
    ["ai", "id"],
    [".", "punc"],
    ["infer", "fn"],
    ["(", "punc"],
    ['"classify"', "str"],
    [", {", "punc"],
  ],
  [
    ["      ", "punc"],
    ["messages", "id"],
    [": [{ ", "punc"],
    ["role", "id"],
    [": ", "punc"],
    ['"user"', "str"],
    [", ", "punc"],
    ["content", "id"],
    [": ", "punc"],
    ["summary", "id"],
    [" }]", "punc"],
  ],
  [["    })", "punc"]],
  [["", "punc"]],
  [
    ["    ", "punc"],
    ["await", "kw"],
    [" ", "punc"],
    ["step", "id"],
    [".", "punc"],
    ["run", "fn"],
    ["(", "punc"],
    ['"save"', "str"],
    [", () ", "punc"],
    ["=>", "punc"],
    [" ", "punc"],
    ["db", "id"],
    [".", "punc"],
    ["insert", "fn"],
    ["({ ", "punc"],
    ["summary", "id"],
    [", ", "punc"],
    ["label", "id"],
    [" }))", "punc"],
  ],
  [["  }", "punc"]],
  [[")", "punc"]],
  [
    ["// each step checkpointed — step 3 never re-runs 1 & 2", "cmt"],
  ],
];

export default function MultiStepLLMCard({ label }: { label: string }) {
  return (
    <div className="flex w-full min-w-0 flex-col items-center justify-center gap-10 lg:flex-row lg:justify-around lg:gap-10">
      <CodeBlock label={label} lines={MULTI_STEP_LLM_CODE} />
      <ScaledWidget scale={0.83} natural={{ w: NATURAL_W, h: NATURAL_H }}>
        <MultiStepLLMDiagram />
      </ScaledWidget>
    </div>
  );
}
