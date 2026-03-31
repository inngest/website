# Step Metadata Docs — PR #1498 Review Changes

Summary of all changes addressing review comments from @rhino1998.

## 1. Dropped step/step_attempt distinction (line 7)

Removed "step attempts" as a separate concept from the intro. Metadata attaches to step attempt spans, but we just call them "steps" in docs. Added a note that metadata is attempt-specific (each retry gets its own).

> **Code check**: `step_attempt` is still a distinct enum value in the backend (`MetadataScopeStepAttempt` in `pkg/enums/metadata_scope.go`) and in the SDK (`MetadataScope = "run" | "step" | "step_attempt" | "extended_trace"` in `InngestMetadata.ts:11`). The executor actively uses `MetadataScopeStepAttempt` when creating metadata spans (executor.go lines 1788, 3379, 4121). Dropping the distinction in *docs* is fine as a simplification, but the underlying code has not collapsed these — be careful that docs don't imply the scopes were merged in the implementation.

## 2. Metadata is attempt-specific for retries (line 80)

Added to the Scoping section: "Metadata is always attached at the step attempt level. When a step retries, each attempt gets its own metadata — previous attempts' metadata is preserved."

Removed the `step_attempt` row and `.attempt()` builder method from the scoping table.

> **Code check**: Confirmed — the executor uses `MetadataScopeStepAttempt` when creating metadata spans for SDK-driven metadata and server-extracted metadata (AI output, HTTP timing), which attaches to the execution/attempt span. Each retry creates a new execution span, so previous attempts' metadata is preserved. However, note the `.attempt()` method removal claim is inaccurate — see Section 8.

## 3. Clarified repeated execution outside `step.run()` (line 70)

Rewrote the warning to explain the real concern: metadata updates in the function body but outside `step.run()` will be **repeated on every subsequent step execution** as the function re-executes from the top. Previously just said "may be lost if the function retries."

> **Code check**: The SDK warning at `InngestMetadata.ts:301` still uses the old language: `"metadata.update() called outside of a step; this metadata may be lost on retries."` — The docs update is a more accurate description of the behavior, but the SDK warning message has not been updated to match.

## 4. `step.metadata` can't be called inside a step (line 86)

Restructured the Basic Usage section into two subsections:

- **`step.metadata(memoId)`** — clearly stated it is a step itself and **cannot** be called inside another step.
- **`inngest.metadata` inside a step** — new subsection with example showing `inngest.metadata.update()` called inside `step.run()`.

> **Code check**: Confirmed — `step.metadata("id").update(values)` wraps the update in `tools.run(memoizationId, ...)` (InngestStepTools.ts:399), making it a step itself that cannot be nested inside another `step.run()`. Meanwhile `inngest.metadata.update()` uses the `performOp` path which can batch metadata via opcodes when called inside a `step.run()` callback (InngestMetadata.ts:317-328).

## 5. Cross-run example changed to scoring/evaluation (line 176)

Replaced the "child function notifying parent run of completion" example with an `evaluateRun` function that attaches quality/relevance scores to a completed run. The previous example implied runs could read metadata while running, which isn't the case.

## 6. Fixed "How it works" section (line 253)

Changed the batched path description from `step.metadata(id).update(values)` to `inngest.metadata.update(values)` inside a `step.run()` callback. `step.metadata` doesn't work inside a step.

> **Code check**: Confirmed — The batched path in `performOp` (InngestMetadata.ts:311-328) only fires when inside a step execution context and calls `execInstance.addMetadata()` to batch the update into the step's opcode response. `step.metadata` wraps in its own `step.run()`, so it sends metadata as a separate step, not batched with another step's response.

## 7. Clarified `step.metadata` is a convenience wrapper (line 31)

Added explanation at the top of Basic Usage: "`step.metadata(memoId)` — A convenience wrapper that creates its own memoized step. It is equivalent to calling `inngest.metadata` inside a `step.run()`."

> **Code check**: Confirmed — `createStepMetadataWrapper` in `InngestStepTools.ts:372-412` shows that `.update()` calls `tools.run(memoizationId, async () => { await builder.update(values, kind); })`, which is literally wrapping `inngest.metadata.update()` inside a `step.run()`.

## 8. API reference for collapsed step/step_attempt (line 299)

- `.attempt()` is omitted from both `step.metadata` and `inngest.metadata` API reference tables (not a public-facing method).
- `.step(id?)` signature omits the `index?` param. Added note: "Defaults to the current or latest attempt."
