import React, { useMemo } from "react";
import { useRouter } from "next/router";
import {
  NavGroup,
  NavLink,
  NavLinkGroup,
  NavSection,
  isNavGroup,
  isNavLink,
  isNavSection,
  topLevelNav,
} from "./navigationStructure";
import { getAllSections, hasNavGroupPath } from "./Navigation";
import Link from "next/link";

function getHierarchyLinks(
  currentPath: string,
  sections: (NavGroup | NavLink | NavSection | NavLinkGroup)[] = getAllSections(
    topLevelNav
  )
) {
  return sections.reduce((acc, section) => {
    if (isNavGroup(section)) {
      if (hasNavGroupPath(section, currentPath)) {
        const link = isNavLink(section.links[0])
          ? section.links[0].href
          : undefined;
        if (
          !link ||
          (link &&
            !(link === currentPath && section.links[0].title === "Overview"))
        ) {
          acc.push({ title: section.title, href: link });
        }
      }

      acc.push(...getHierarchyLinks(currentPath, section.links));
    } else if (isNavSection(section)) {
      acc.push(...getHierarchyLinks(currentPath, section.sectionLinks));
    }
    return acc;
  }, []);
}

export function Breadcrumb() {
  let router = useRouter();

  const hierarchyLinks = useMemo(
    () => getHierarchyLinks(router.pathname),
    [router.pathname]
  );

  return hierarchyLinks ? (
    <div className="my-1 text-sm">
      {hierarchyLinks.map(({ title, href }, index) => (
        <React.Fragment key={index}>
          {!!index && <span className="mx-1 text-gray-500">{"/"}</span>}
          {href ? (
            <Link href={href} className="text-breeze-600 dark:text-breeze-300">
              {title}
            </Link>
          ) : (
            <span className="text-[#2E2E2E] dark:text-carbon-100">{title}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  ) : null;
}
