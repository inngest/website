/**
 * Clipboard payload for the "Copy prompt to start locally" button on
 * /12-days-of-workflows. Coding agents paste this to clone the course repo
 * (github.com/inngest/12-days-of-workflows), install it and run Day 01.
 * Source of truth: docs/setup-prompt.md in that repo; keep them in sync.
 * The homepage uses a different prompt (Home/localSetupPrompt.ts).
 */
export const TWELVE_DAYS_SETUP_PROMPT = `You are helping me set up "12 Days of Workflows", an open-source teaching repo with twelve small
Inngest examples (durable workflows in TypeScript). Get it cloned, installed and running on my
machine, then show me how to try it. Work step by step, run the commands yourself, and keep your
messages short. Stop and ask me before doing anything that needs admin rights (sudo) or that
installs system-wide software.

Repo: https://github.com/inngest/12-days-of-workflows (public, no login or API keys needed)

## 1. Pick a place to work

Check the current directory.
- If it is empty, or already contains this repo (a \`package.json\` named "12-days-of-workflows"),
  use it. Clone into it with \`git clone <repo> .\` if it is empty.
- If it is my home directory, Desktop, Downloads, or any folder with unrelated files, do NOT
  clone here. Ask me where I'd like the project (suggest \`~/Development\` or \`~/Projects\`),
  create that folder if needed, and clone into \`12-days-of-workflows\` inside it.
Then \`cd\` into the repo for every command that follows.

## 2. Check prerequisites

Run these and report what you find:

    git --version
    node --version     # needs v22 or newer
    pnpm --version     # needs pnpm 9 or newer (the repo pins pnpm 9.15.0)

Fix anything missing, using the least invasive route:
- Git missing: tell me how to install it for my OS and wait.
- Node missing or older than 22: if I have a version manager (nvm, fnm, volta, asdf, mise), use
  it to install Node 22 or newer (LTS is fine). Otherwise point me to https://nodejs.org and wait.
- pnpm missing: run \`corepack enable && corepack prepare pnpm@9.15.0 --activate\`. If corepack is
  unavailable or fails, use \`npm install -g pnpm@9.15.0\`.
- \`npx\` must work (it ships with Node). The Inngest Dev Server downloads itself through npx on
  first run, so I need internet access.

## 3. Install and verify

    pnpm install
    pnpm check 01

\`pnpm check 01\` typechecks and runs Day 01's scenario assertions. If it passes, the setup is good.
If anything fails, read the error, fix the cause (not the repo's code), and retry. Don't edit
files in \`packages/shared\` or any \`days/\` folder.

## 4. Run Day 01

Start these as two long-running processes, in separate terminal tabs or in the background, and
leave them running:

    pnpm day 01     # the Day 01 app on :3001 plus the Inngest Dev Server on :8288
    pnpm studio     # the Holiday Card Studio UI on :3100

The first \`pnpm day\` can take a minute while the Dev Server downloads. Wait until the output
shows the app and the Dev Server are up. If port 3001, 8288 or 3100 is taken, tell me which
process holds it and ask before killing anything.

Then open these in my browser, or give me the links if you can't open a browser:
- http://localhost:3100/day/01/problem (the app without the fix)
- http://localhost:3100/day/01/fix (the app with the fix)
- http://localhost:8288 (the Inngest Dev Server, where runs appear)

## 5. Explain the twelve days

Before the summary, give me a quick tour so I know what I'm looking at. Read the table in the
repo's \`README.md\` and the \`days/\` folder names rather than relying on memory. Explain:
- The story: Jason runs a holiday card business. A customer writes a message, an AI writes the
  card, an image service draws the artwork, and the card is emailed to the recipient. It works
  fine in November, then the holiday rush hits, and each day fixes one real-world problem with
  Inngest.
- The twelve days as a compact list, one line each: day number, the problem, and the Inngest
  idea that fixes it (for example Day 01 is retries and memoized steps, Day 04 is waiting for a
  human, Day 06 is per-user concurrency). Take the problems from the README table and the fixes
  from each day's \`README.md\` in \`days/NN-slug/\`.
- How each day is built: every day is standalone, has a "problem" version and a "fix" version
  I can compare side by side, and its scenarios finish in under a minute.
- That I'm starting with Day 01, and why: it covers the core idea (durable steps) that every
  later day builds on.

## 6. Tell me how to use it

Finish with a short summary (under 15 lines) covering:
- What's running and on which ports.
- What to do first: send a card from the \`/problem\` page, then from the \`/fix\` page, and watch
  both runs in the Dev Server at :8288. Terminal alternative:
  \`pnpm send 01 --list\`, then \`pnpm send 01 flaky-image-before\` (breaks) and
  \`pnpm send 01 flaky-image\` (fixed).
- How to switch days: stop \`pnpm day 01\`, then run \`pnpm day NN\` (02 to 12). Day NN runs on
  port 30NN. Each day's folder under \`days/\` has a README with its scenarios.
- Code-along mode: \`git checkout starter\` swaps each lesson for a \`// TODO:\` for me to fix, and
  \`pnpm check NN\` tests my fix.
- Day 12 compares two prompts and needs Inngest Cloud keys for the full demo. It also runs
  locally without them. Skip this unless I ask.

Notes for you, the agent:
- All AI, image, mail and database services are deterministic fakes in \`packages/shared\`. No API
  keys or network calls are needed (except the one-time Dev Server download).
- This repo uses Inngest TypeScript SDK v4 (\`inngest@^4\`). If I ask you to modify code, don't
  write v3 syntax: triggers go in the options object (\`{ id, triggers: [...] }\`), event payload
  lives in \`event.data\`, and \`step.invoke\` takes a function reference, never a string id. Read
  \`CLAUDE.md\` in the repo if it exists.
- Never put secrets in files or commit anything.
`;
