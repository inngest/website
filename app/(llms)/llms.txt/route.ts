import { loadMarkdownFilesMetadata } from "utils/markdown";
import { type MDXBlogPost } from "src/components/Blog";
import { loadPost } from "app/changelog/helpers";
import {
  topLevelNav,
  type NavGroup,
  type NavLink,
  type NavSection,
  type NavLinkGroup,
} from "shared/Docs/navigationStructure";

export const dynamic = "force-static";

export async function GET() {
  const mainDocs = topLevelNav.find((nav) => nav.title === "Home").sectionLinks;
  const examples = topLevelNav.find(
    (nav) => nav.title === "Examples"
  ).sectionLinks;

  const overview = `# Inngest

## Documentation

${recursiveLinks(mainDocs)}

## Examples

${recursiveLinks(examples)}

`;

  return new Response(overview, {
    headers: {
      "Content-Type": "text/plain;charset=UTF-8",
      "Cache-Control": "s-maxage=360, stale-while-revalidate",
    },
  });
}

function url(path: string): string {
  return `${process.env.NEXT_PUBLIC_HOST}${path}`;
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
        return `${indent}- [${link.title}](${url(link.href)})`;
      }
      return `${indent}- ${link.title}`;
    })
    .join("\n");
}
