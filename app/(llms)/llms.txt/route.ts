import {
  topLevelNav,
  type NavGroup,
  type NavLink,
  type NavSection,
  type NavLinkGroup,
} from "shared/Docs/navigationStructure";

export const dynamic = "force-static";

export async function GET() {
  const learnDocs = topLevelNav.find((nav) => nav.title === "Learn")?.sectionLinks || [];
  const referenceDocs = topLevelNav.find(
    (nav) => nav.title === "Reference"
  )?.sectionLinks || [];
  const examplesDocs = topLevelNav.find(
    (nav) => nav.title === "Examples"
  )?.sectionLinks || [];

  const overview = `# Inngest

> Inngest is the durable workflow engine for AI applications. It provides step-level retries, event coordination, throttling, concurrency controls, and human-in-the-loop patterns. Write reliable background jobs and multi-step AI pipelines as regular code, with built-in observability and zero infrastructure to manage.

- [Documentation](${process.env.NEXT_PUBLIC_HOST}/docs-markdown/)
- [Full documentation as single file](${process.env.NEXT_PUBLIC_HOST}/llms-full.txt)
- [LLM integration context](${process.env.NEXT_PUBLIC_HOST}/llm-context.md)
- [Blog index](${process.env.NEXT_PUBLIC_HOST}/blog.txt)

## Learn

${recursiveLinks(learnDocs)}

## Reference

${recursiveLinks(referenceDocs)}

## Examples

${recursiveLinks(examplesDocs)}

`;

  return new Response(overview, {
    headers: {
      "Content-Type": "text/plain;charset=UTF-8",
      "Cache-Control": "s-maxage=360, stale-while-revalidate",
    },
  });
}

function markdownUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_HOST}/docs-markdown${path.replace(/^\/docs/, '')}`;
}

function recursiveLinks(
  links: (NavGroup | NavLink | NavSection | NavLinkGroup)[],
  depth: number = 0
) {
  return links
    // Skip items gated behind ?unreleased=<label> so they don't leak here.
    .filter((link) => !(link as { unreleased?: string }).unreleased)
    .map((link) => {
      const indent = "  ".repeat(depth); // Create indentation based on depth
      if ("links" in link) {
        return `${indent}- ${link.title}\n${recursiveLinks(
          link.links,
          depth + 1
        )}`;
      }
      if ("href" in link) {
        return `${indent}- [${link.title}](${markdownUrl(link.href)})`;
      }
      return `${indent}- ${link.title}`;
    })
    .join("\n");
}
