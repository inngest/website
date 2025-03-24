import fs from "node:fs";
import path from "node:path";
import {
  topLevelNav,
  type NavGroup,
  type NavLink,
  type NavSection,
  type NavLinkGroup,
} from "shared/Docs/navigationStructure";

export const dynamic = "force-static";

export async function GET() {
  const links = recursiveLinks(
    topLevelNav.map((nav) => nav.sectionLinks).flat()
  );
  const content = links
    .map((link) => `${link.title} - ${link.href}`)
    .join("\n");
  return new Response(content, {
    headers: {
      "Content-Type": "text/plain;charset=UTF-8",
      "Cache-Control": "s-maxage=360, stale-while-revalidate",
    },
  });
}

function recursiveLinks(
  links: (NavGroup | NavLink | NavSection | NavLinkGroup)[]
): { title: string; href: string }[] {
  return links
    .map((link) => {
      if ("links" in link) {
        return recursiveLinks(link.links);
      }
      if ("href" in link) {
        return {
          title: link.title,
          href: link.href,
        };
      }
      return {
        title: link.title,
        href: "",
      };
    })
    .flat()
    .filter((link) => link.href !== "");
}
