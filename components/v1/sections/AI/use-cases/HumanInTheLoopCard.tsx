import CodeBlock, { type Line } from "@/components/v1/sections/shared/CodeBlock";
import HumanInTheLoopWidget, { NATURAL_H, NATURAL_W } from "./HumanInTheLoopWidget";
import ScaledWidget from "@/components/v1/sections/shared/ScaledWidget";

/**
 * Human-in-the-loop illustration — pairs a `publish-with-approval`
 * Inngest function (draft via `step.ai.infer`, pause on
 * `step.waitForEvent("approval", { timeout: "7d" })`, publish on
 * approval) with a stylised approval card waiting for a human's
 * decision.
 */

const HUMAN_IN_THE_LOOP_CODE: Line[] = [
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
    ['"publish-with-approval"', "str"],
    [" },", "punc"],
  ],
  [
    ["  { ", "punc"],
    ["event", "id"],
    [": ", "punc"],
    ['"content/drafted"', "str"],
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
    ["draft", "var"],
    [" = ", "punc"],
    ["await", "kw"],
    [" ", "punc"],
    ["step", "id"],
    [".", "punc"],
    ["ai", "id"],
    [".", "punc"],
    ["infer", "fn"],
    ["(", "punc"],
    ['"draft"', "str"],
    [", { ... })", "punc"],
  ],
  [["", "punc"]],
  [
    ["    ", "punc"],
    ["const", "kw"],
    [" ", "punc"],
    ["approval", "var"],
    [" = ", "punc"],
    ["await", "kw"],
    [" ", "punc"],
    ["step", "id"],
    [".", "punc"],
    ["waitForEvent", "fn"],
    ["(", "punc"],
    ['"approval"', "str"],
    [", {", "punc"],
  ],
  [
    ["      ", "punc"],
    ["timeout", "id"],
    [": ", "punc"],
    ['"7d"', "str"],
  ],
  [["    })", "punc"]],
  [["", "punc"]],
  [
    ["    ", "punc"],
    ["if", "kw"],
    [" (", "punc"],
    ["approval", "id"],
    [".", "punc"],
    ["data", "id"],
    [".", "punc"],
    ["approved", "id"],
    [") {", "punc"],
  ],
  [
    ["      ", "punc"],
    ["await", "kw"],
    [" ", "punc"],
    ["step", "id"],
    [".", "punc"],
    ["run", "fn"],
    ["(", "punc"],
    ['"publish"', "str"],
    [", () => ", "punc"],
    ["deploy", "fn"],
    ["(", "punc"],
    ["draft", "id"],
    ["))", "punc"],
  ],
  [["    }", "punc"]],
  [["  }", "punc"]],
  [[")", "punc"]],
  [
    ["// sleeps for days — wakes on event, zero cost", "cmt"],
  ],
];

export default function HumanInTheLoopCard({ label }: { label: string }) {
  return (
    <div className="flex w-full min-w-0 flex-col items-center justify-center gap-10 lg:flex-row lg:justify-around lg:gap-10">
      <CodeBlock label={label} lines={HUMAN_IN_THE_LOOP_CODE} />
      <ScaledWidget scale={0.66} natural={{ w: NATURAL_W, h: NATURAL_H }}>
        <HumanInTheLoopWidget />
      </ScaledWidget>
    </div>
  );
}
