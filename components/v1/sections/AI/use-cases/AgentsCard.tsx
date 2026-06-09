import AgentsFlowDiagram, { NATURAL_H, NATURAL_W } from "./AgentsFlowDiagram";
import ScaledWidget from "@/components/v1/sections/shared/ScaledWidget";
import CodeBlock, { type Line } from "@/components/v1/sections/shared/CodeBlock";

/**
 * AI Agents illustration — pairs a snippet of an Inngest agent loop
 * with the Plan → Tool Call → Evaluate → Complete flow diagram. The
 * snippet wraps over 6 visual lines (4 logical lines, with two
 * long ones spilling onto a second line), so we pass `visualLineCount`
 * to drive the gutter rather than letting `CodeBlock` infer it.
 */

const AGENTS_CODE: Line[] = [
  [
    ["while", "kw"],
    [" (!", "punc"],
    ["result", "id"],
    ["?.", "punc"],
    ["complete", "id"],
    [" && ", "punc"],
    ["attempts", "id"],
    ["++ < ", "punc"],
    ["10", "num"],
    [") {", "punc"],
  ],
  [
    ["  ", "punc"],
    ["const", "kw"],
    [" ", "punc"],
    ["plan", "var"],
    [" = ", "punc"],
    ["await", "kw"],
    [" ", "punc"],
    ["step", "id"],
    [".", "punc"],
    ["ai", "id"],
    [".", "punc"],
    ["infer", "fn"],
    ["(", "punc"],
    ["`plan-${", "str"],
    ["attempts", "id"],
    ["}`", "str"],
    [", { ... })", "punc"],
  ],
  [
    ["  ", "punc"],
    ["result", "id"],
    [" = ", "punc"],
    ["await", "kw"],
    [" ", "punc"],
    ["step", "id"],
    [".", "punc"],
    ["run", "fn"],
    ["(", "punc"],
    ["`tool-${", "str"],
    ["attempts", "id"],
    ["}`", "str"],
    [", () ", "punc"],
    ["=>", "punc"],
    [" ", "punc"],
    ["executeTool", "fn"],
    ["(", "punc"],
    ["plan", "id"],
    ["))", "punc"],
  ],
  [
    ["} ", "punc"],
    ["// each iteration checkpointed independently", "cmt"],
  ],
];

export default function AgentsCard({ label }: { label: string }) {
  return (
    <div className="flex w-full min-w-0 flex-col items-center justify-center gap-10 lg:flex-row lg:justify-around lg:gap-10">
      <CodeBlock label={label} lines={AGENTS_CODE} visualLineCount={6} />
      <ScaledWidget scale={0.94} natural={{ w: NATURAL_W, h: NATURAL_H }}>
        <AgentsFlowDiagram />
      </ScaledWidget>
    </div>
  );
}
