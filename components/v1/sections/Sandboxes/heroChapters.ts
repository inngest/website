/**
 * The three chapters of the Sandboxes hero: one per playground scenario.
 *
 * Each chapter pairs the function as a developer would write it (left
 * pane) with the playground's replay of a real run of that function
 * (right pane). `step` on a code line names the Inngest step the line
 * belongs to, so the host can light the line up when the playground
 * reports that step running, done, replayed or failed. CI step ids are
 * `job › command`, so a chapter line may name just the job and match
 * every step under it.
 *
 * The chapters are a real sequence: the playground calls them "Scenario
 * 1 of 3", and each builds on the one before (a sandbox, then what
 * happens when the process dies, then many sandboxes at once).
 */

export interface CodeLine {
  text: string;
  /** Step id (or `job` prefix for CI) this line belongs to. */
  step?: string;
}

export interface Chapter {
  id: "create" | "durability" | "ci";
  title: string;
  short: string;
  /** What the viewer is about to see, in one line. */
  line: string;
  file: string;
  code: CodeLine[];
}

export const CHAPTERS: readonly Chapter[] = [
  {
    id: "create",
    title: "Create a sandbox",
    short: "Create",
    line: "Create a microVM, boot it, run a command, destroy it. Four steps, one trace.",
    file: "inngest/create-sandbox.ts",
    code: [
      { text: "export const createSandbox =" },
      { text: "  inngest.createFunction(" },
      { text: '  { id: "create-sandbox" },' },
      { text: '  { event: "playground/create.run" },' },
      { text: "  async ({ step }) => {" },
      {
        text: "    const created = await step.sandbox.create(",
        step: "create-sandbox",
      },
      { text: '      "create-sandbox",', step: "create-sandbox" },
      { text: "      { vcpu: 2, memoryMb: 2048 },", step: "create-sandbox" },
      { text: "    );", step: "create-sandbox" },
      {
        text: "    const sandbox = await created.waitUntilRunning(",
        step: "wait-running",
      },
      { text: '      "wait-running",', step: "wait-running" },
      { text: "    );", step: "wait-running" },
      {
        text: "    const result = await sandbox.commands.run(",
        step: "run-command",
      },
      { text: '      "run-command",', step: "run-command" },
      { text: '      "node --version",', step: "run-command" },
      { text: "    );", step: "run-command" },
      {
        text: '    await sandbox.destroy("destroy-sandbox");',
        step: "destroy-sandbox",
      },
      { text: "    return result.stdout;" },
      { text: "  }," },
      { text: ");" },
    ],
  },
  {
    id: "durability",
    title: "Survive a crash",
    short: "Crash",
    line: "The process dies after step 3. The retry replays the saved steps in 0 ms and keeps the same sandbox.",
    file: "inngest/durability-demo.ts",
    code: [
      { text: "export const survivesCrash =" },
      { text: "  inngest.createFunction(" },
      { text: '  { id: "durability-demo" },' },
      { text: '  { event: "playground/durability.run" },' },
      { text: "  async ({ step, attempt }) => {" },
      {
        text: "    const created = await step.sandbox.create(",
        step: "create-sandbox",
      },
      { text: '      "create-sandbox",', step: "create-sandbox" },
      { text: "      { vcpu: 2, memoryMb: 2048 },", step: "create-sandbox" },
      { text: "    );", step: "create-sandbox" },
      {
        text: "    const sandbox = await created.waitUntilRunning(",
        step: "wait-running",
      },
      { text: '      "wait-running",', step: "wait-running" },
      { text: "    );", step: "wait-running" },
      { text: "    await sandbox.commands.run(", step: "write-marker" },
      { text: '      "write-marker",', step: "write-marker" },
      {
        text: '      `echo "attempt ${attempt + 1}" > /tmp/marker`,',
        step: "write-marker",
      },
      { text: "    );", step: "write-marker" },
      {
        text: '    await step.run("flaky-after-create", () => {',
        step: "flaky-after-create",
      },
      {
        text: "      // The process dies here on the first attempt.",
        step: "flaky-after-create",
      },
      {
        text: "      if (attempt === 0) process.exit(1);",
        step: "flaky-after-create",
      },
      { text: "    });", step: "flaky-after-create" },
      {
        text: '    await sandbox.commands.run("run-hello",',
        step: "run-hello",
      },
      { text: '      `echo "hello from $(hostname)"`);', step: "run-hello" },
      {
        text: "    const marker = await sandbox.commands.run(",
        step: "read-marker",
      },
      { text: '      "read-marker", "cat /tmp/marker");', step: "read-marker" },
      {
        text: '    await sandbox.destroy("destroy-sandbox");',
        step: "destroy-sandbox",
      },
      { text: "    return marker.stdout; // attempt 1: same sandbox" },
      { text: "  }," },
      { text: ");" },
    ],
  },
  {
    id: "ci",
    title: "Run a CI pipeline",
    short: "CI",
    line: "Five machines cloned from one snapshot run in parallel. Jobs that passed never rerun.",
    file: "inngest/ci-pipeline.ts",
    code: [
      { text: 'const setup = ci.job("setup", async () => {', step: "setup" },
      { text: "  await $`tar -x -C /work/app`;", step: "setup" },
      {
        text: "  return { node: (await $`node --version`).stdout };",
        step: "setup",
      },
      { text: "});", step: "setup" },
      { text: 'const lint = ci.job("lint", async () => {', step: "lint" },
      {
        text: "  await from(setup); // a clone of setup's machine",
        step: "lint",
      },
      { text: '  await $`node lint.mjs`.cwd("/work/app");', step: "lint" },
      { text: "});", step: "lint" },
      { text: 'const test = ci.job("test", async () => {', step: "test" },
      { text: "  await from(setup);", step: "test" },
      {
        text: '  await $`node --test`.cwd("/work/app").retries(1);',
        step: "test",
      },
      { text: "});", step: "test" },
      { text: "const compat = ci.matrix(", step: "compat" },
      {
        text: '  { id: "compat", axes: { runtime: ["node", "node-lts"] } },',
        step: "compat",
      },
      { text: "  async ({ runtime }) => {", step: "compat" },
      { text: "    await from(setup);", step: "compat" },
      {
        text: '    await $`${runtime} --test`.cwd("/work/app");',
        step: "compat",
      },
      { text: "  },", step: "compat" },
      { text: ");", step: "compat" },
      {
        text: 'const summarize = ci.job("summarize", (results) =>',
        step: "summarize",
      },
      {
        text: '  step.run("write-summary", () => results),',
        step: "summarize",
      },
      { text: ");", step: "summarize" },
      { text: "export const pipeline = ci.pipeline(" },
      { text: '  { id: "ci-pipeline" },' },
      { text: "  () => summarize(lint(), test(), compat())," },
      { text: ");" },
    ],
  },
];

export type ChapterId = Chapter["id"];
