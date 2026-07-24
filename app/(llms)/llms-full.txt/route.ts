import { processDirectory } from "../utils";
import path from "node:path";

export const dynamic = "force-static";

const DOCS = path.join(process.cwd(), "pages", "docs");
const HOST = process.env.NEXT_PUBLIC_HOST ?? "https://www.inngest.com";

/**
 * Sections included in full — order determines document structure.
 *
 * Excluded intentionally:
 *
 *   reference/typescript/v3  (~175KB) — superseded by v4; risks agents
 *     generating outdated v3 code. Fetch individually if needed.
 *
 *   examples/                (~67KB)  — linked from llms.txt for on-demand
 *     fetching; too bulky for a context window file.
 *
 *   getting-started/<framework>  (~86KB) — framework variants are ~90%
 *     identical; nodejs + python covers the pattern. Other URLs listed below.
 *
 *   features/                (~148KB) — overlaps with reference/typescript/v4
 *     and learn/; reference is more authoritative for code generation tasks.
 *
 *   platform/                (~103KB) — dashboard/UI observability docs;
 *     valuable for users but low signal for agents writing code.
 *
 *   guides (vendor-specific) (~35KB)  — integration guides for Resend,
 *     Retool, Mergent, and Clerk; too narrow for a general context file.
 */

// Framework quick-starts to omit — keep nodejs + python + index only
const GETTING_STARTED_EXCLUDE = new Set([
  "nextjs-quick-start.mdx",
  "express-quick-start.mdx",
  "nestjs-quick-start.mdx",
  "astro-quick-start.mdx",
  "tanstack-start-quick-start.mdx",
  "h3-quick-start.mdx",
]);

// Vendor-specific guides excluded from the guides/ section
const GUIDES_EXCLUDE = new Set([
  "resend-webhook-events.mdx",
  "trigger-your-code-from-retool.mdx",
  "mergent-migration.mdx",
  "clerk-webhook-events.mdx",
]);

const GETTING_STARTED_NOTE = `
---
Note: Framework-specific quick-start guides (Next.js, Express, NestJS, Astro, TanStack Start, H3) follow the same pattern as the Node.js guide above. Find them at:
- ${HOST}/docs/getting-started/nextjs-quick-start
- ${HOST}/docs/getting-started/express-quick-start
- ${HOST}/docs/getting-started/nestjs-quick-start
- ${HOST}/docs/getting-started/astro-quick-start
- ${HOST}/docs/getting-started/tanstack-start-quick-start
- ${HOST}/docs/getting-started/h3-quick-start
`.trim();

const FEATURES_NOTE = `
---
Note: Feature deep-dives (middleware, error handling, cancellation, realtime, AI orchestration) are available individually at ${HOST}/docs/features or via ${HOST}/docs-markdown/features/<page>.
`.trim();

const PLATFORM_NOTE = `
---
Note: Platform and observability docs (traces, metrics, alerts, replay) are available at ${HOST}/docs/platform or via ${HOST}/docs-markdown/platform/<page>.
`.trim();

// Sections processed in full (v3, examples, features, platform excluded)
const SECTIONS = [
  "getting-started", // filtered via GETTING_STARTED_EXCLUDE
  "learn",
  "guides",          // filtered via GUIDES_EXCLUDE
  "ai-patterns",
  "ai-dev-tools",
  "events",
  "deploy",
  "apps",
  "sdk",
  "setup",
  "functions",
  "usage-limits",
  // Reference: v4 + other SDKs only — v3 excluded
  path.join("reference", "typescript", "v4"),
  path.join("reference", "python"),
  path.join("reference", "go"),
  path.join("reference", "rest-api"),
  path.join("reference", "system-events"),
  path.join("reference", "workflow-kit"),
];

export async function GET() {
  const parts: string[] = [
    "# Inngest — Full Documentation\n",
    "> Complete documentation for Inngest, the durable workflow engine for AI applications.",
    `> TypeScript SDK v3 reference and framework-specific examples are excluded to reduce size.`,
    `> Fetch individual pages via ${HOST}/docs-markdown/<path> or browse the index at ${HOST}/llms.txt.\n`,
  ];

  for (const section of SECTIONS) {
    const sectionDir = path.join(DOCS, section);
    const excludeFiles =
      section === "getting-started" ? GETTING_STARTED_EXCLUDE :
      section === "guides" ? GUIDES_EXCLUDE :
      new Set<string>();

    try {
      const content = processDirectory(sectionDir, excludeFiles);
      if (content.length > 0) {
        parts.push(...content);
        // Append section notes after relevant sections
        if (section === "getting-started") {
          parts.push(GETTING_STARTED_NOTE);
        }
        if (section === "guides") {
          parts.push(FEATURES_NOTE);
          parts.push(PLATFORM_NOTE);
        }
      }
    } catch {
      // Directory may not exist in all environments — skip silently
    }
  }

  return new Response(parts.join("\n"), {
    headers: {
      "Content-Type": "text/plain;charset=UTF-8",
      "Cache-Control": "s-maxage=360, stale-while-revalidate",
    },
  });
}
