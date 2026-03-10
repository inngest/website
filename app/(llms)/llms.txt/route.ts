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
