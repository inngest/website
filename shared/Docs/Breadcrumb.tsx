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
import ChevronRight from "../Icons/ChevronRight";

import clsx from "clsx";

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
    <div className="text-sm flex flex-row mb-6">
      {hierarchyLinks.map(({ title, href }, index) => (
        <React.Fragment key={index}>
          {!!index && (
            <span className="mx-1 text-gray-500">
              <ChevronRight
                className={
                  "dark:stroke-carbon-700 dark:fill-carbon-700 stroke-carbon-200 fill-carbon-200"
                }
              />
            </span>
          )}
          {href ? (
            <Link
              href={href}
              className={
                "text-carbon-600 dark:text-[#9B9B9B] dark:hover:text-carbon-50 no-underline font-normal"
              }
            >
              {title}
            </Link>
          ) : (
            <span className={"text-[#2E2E2E] dark:text-carbon-50 font-medium"}>
              {title}
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  ) : null;
}
