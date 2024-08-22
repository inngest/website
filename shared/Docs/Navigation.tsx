import {
  ComponentProps,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";
import { AnimatePresence, m, motion, useIsPresent } from "framer-motion";

import { Button } from "./Button";
import { useIsInsideMobileNavigation } from "./MobileNavigation";
import { useSectionStore } from "./SectionProvider";
import { Tag } from "./Tag";
import { remToPx } from "../../utils/remToPx";
import {
  topLevelNav,
  menuTabs,
  type NavGroup,
  type NavLink,
  isNavGroup,
  isNavLinkGroup,
  NavSection,
  NavLinkGroup,
  isNavLink,
} from "./navigationStructure";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { MobileSearch } from "./Search";

const BASE_DIR = "/docs";

function useInitialValue(value, condition = true) {
  let initialValue = useRef(value).current;
  return condition ? initialValue : value;
}

function isMatch(
  matcher: RegExp | ((pathname: string) => boolean),
  pathname
): boolean {
  return matcher instanceof RegExp
    ? matcher.test(pathname)
    : typeof matcher === "function"
    ? matcher(pathname)
    : false;
}

function TopLevelNavItem({ href, matcher, title, icon: Icon }) {
  const router = useRouter();
  const pathname = router.pathname;
  const isActive = isMatch(matcher, pathname) || href === pathname;
  return (
    <NavLink href={href} isTopLevel={true}>
      <span
        className={clsx(
          "flex flex-row py-1 gap-4 items-center",
          isActive && "font-bold text-breeze-600 dark:text-breeze-300"
        )}
      >
        {Icon && (
          <Icon className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200" />
        )}
        {title}
      </span>
    </NavLink>
  );
}

export function TabItem({ href, children, matcher }) {
  const router = useRouter();
  const pathname = router.pathname;
  const isActive = isMatch(matcher, pathname) || href === pathname;
  return (
    <li>
      <Link
        href={href}
        className={clsx(
          "font-medium text-sm leading-5 transition whitespace-nowrap px-3 py-4 relative top-0.5",
          isActive &&
            "text-black dark:text-carbon-100 border-b-2 dark:border-b-carbon-300 border-b-black  hover:text-black",
          !isActive &&
            "text-carbon-600  dark:text-carbon-400 hover:text-carbon-900 dark:hover:text-white"
        )}
      >
        <span className="relative -top-0.5">{children}</span>
      </Link>
    </li>
  );
}

function NavLink({
  href,
  tag,
  active,
  isAnchorLink = false,
  isTopLevel = false,
  truncate = true,

  className = "",
  children,
  target,
}: {
  href: string;
  tag?: any;
  active?: boolean;
  isAnchorLink?: boolean;
  isTopLevel?: boolean;
  truncate?: boolean;
  className?: string;
  target?: string;
  children: React.ReactNode;
}) {
  return (
    <LinkOrHref
      href={href}
      aria-current={active ? "page" : undefined}
      target={target}
      className={clsx(
        "flex rounded justify-between items-center gap-2 py-2 pl-2 text-sm transition group", // group for nested hovers
        active
          ? "font-medium rounded bg-breeze-0 text-breeze-600 dark:bg-breeze-1000 dark:text-breeze-300"
          : "font-medium hover:text-[#2E2E2E] text-carbon-700 hover:bg-carbon-50 dark:text-carbon-400 dark:hover:text-carbon-100 dark:hover:bg-[#2E2E2E]",
        className
      )}
    >
      {!isAnchorLink && <span className="absolute inset-y-0 left-0 w-px" />}

      <span>{children}</span>
      {tag && <Tag color="breeze">{tag}</Tag>}
    </LinkOrHref>
  );
}

// LinkOrHref returns a standard link with target="_blank" if we want to open a docs
// link in a new tab.
const LinkOrHref = (props: any) => {
  if (props.target === "_blank") {
    return <a {...props} />;
  }
  return <Link {...props} />;
};

function VisibleSectionHighlight({ listItems }) {
  const sections = useSectionStore((s) => s.sections);
  const visibleSections = useSectionStore((s) => s.visibleSections);

  let firstVisibleSectionIndex = Math.max(
    0,
    sections.findIndex((section) => section.id === visibleSections[0])
  );

  let aboveItems = listItems?.slice(0, firstVisibleSectionIndex);
  let visibleItems = listItems?.slice(
    firstVisibleSectionIndex,
    firstVisibleSectionIndex + visibleSections.length
  );

  let top = 0;
  let height = 0;
  for (const item of aboveItems) top += item.offsetHeight;
  for (const item of visibleItems) height += item.offsetHeight;

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2 } }}
      exit={{ opacity: 0 }}
      className="absolute -left-2 right-0 top-0 bg-slate-500/10 will-change-transform dark:bg-white/10"
      style={{ borderRadius: 8, height, top }}
    />
  );
}
export function PageSidebar() {
  let isInsideMobileNavigation = useIsInsideMobileNavigation();
  let router = useRouter();
  let sections = useSectionStore((s) => s.sections);

  let [pageSectionsEl, setPageSectionsEl] = useState(null);
  let [pageSectionListItems, setPageSectionListItems] = useState(null);
  let [windowWidth, setWindowWidth] = useState(null);

  useEffect(() => {
    const updateWindowWidth = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", updateWindowWidth);
    return () => {
      window.removeEventListener("resize", updateWindowWidth);
    };
  }, []);

  useEffect(() => {
    if (pageSectionsEl) {
      setPageSectionListItems([
        ...(pageSectionsEl?.querySelectorAll("li") ?? []),
      ]);
    }
  }, [router.pathname, windowWidth, pageSectionsEl]);

  return (
    <div>
      <h4 className="text-base font-medium pb-2">On this page</h4>
      <div className="relative">
        <AnimatePresence initial={!isInsideMobileNavigation}>
          {pageSectionListItems && (
            <VisibleSectionHighlight listItems={pageSectionListItems} />
          )}
        </AnimatePresence>
        <motion.ul
          key={router.pathname}
          ref={setPageSectionsEl}
          role="list"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { delay: 0.1 },
          }}
          exit={{
            opacity: 0,
            transition: { duration: 0.15 },
          }}
        >
          {sections.map((section) => (
            <li
              key={section.id}
              className="relative"
              style={{
                marginLeft: `${(section.level - 1) * 12}px`,
              }}
            >
              <NavLink
                href={section.level === 1 ? `#top` : `#${section.id}`}
                tag={section.tag}
                isAnchorLink
                truncate={false}
              >
                {section.title}
              </NavLink>
            </li>
          ))}
        </motion.ul>
      </div>
    </div>
  );
}

const NavigationGroupStructureContext = createContext(0);

function NavigationGroupStructure({
  nestingLevel,
  children,
  ...props
}: { nestingLevel?: number; children: React.ReactNode } & ComponentProps<
  typeof Accordion.Item
>) {
  return (
    <NavigationGroupStructureContext.Provider value={nestingLevel}>
      {nestingLevel > 0 ? (
        <Accordion.Item {...props}>{children}</Accordion.Item>
      ) : (
        <div>{children}</div>
      )}
    </NavigationGroupStructureContext.Provider>
  );
}

NavigationGroupStructure.Trigger = function NavigationGroupStructureItem({
  children,
  ...props
}: { children: React.ReactNode } & ComponentProps<typeof Accordion.Trigger>) {
  const nestingLevel = useContext(NavigationGroupStructureContext);

  return nestingLevel > 0 ? (
    <Accordion.Trigger {...props}>{children}</Accordion.Trigger>
  ) : (
    <div>{children}</div>
  );
};

NavigationGroupStructure.Content = function NavigationGroupStructureItem({
  children,
  ...props
}: { children: React.ReactNode } & ComponentProps<typeof Accordion.Content>) {
  const nestingLevel = useContext(NavigationGroupStructureContext);

  return nestingLevel > 0 ? (
    <Accordion.Content {...props}>{children}</Accordion.Content>
  ) : (
    <div>{children}</div>
  );
};

// A nested navigation group of links that expand and follow
function NavigationGroup({
  group,
  isActiveGroup = false,
  nestingLevel = 0,
  className = "",
}: {
  group: NavGroup;
  isActiveGroup?: boolean;
  nestingLevel?: number;
  className?: string;
}) {
  const defaultOpenGroupTitles = useContext(DefaultOpenSectionsContext);
  // If this is the mobile navigation then we always render the initial
  // state, so that the state does not change during the close animation.
  // The state will still update when we re-open (re-render) the navigation.
  let isInsideMobileNavigation = useIsInsideMobileNavigation();
  let [router] = useInitialValue([useRouter()], isInsideMobileNavigation);

  // hack: animation flickers on initial render so let's enable it after mount
  let [animateAccordion, setAnimateAccordion] = useState(false);
  useEffect(() => {
    setAnimateAccordion(true);
  }, []);

  return (
    <NavigationGroupStructure value={group.title} nestingLevel={nestingLevel}>
      <li className={clsx("relative", className)}>
        <NavigationGroupStructure.Trigger className="w-full animate-accordion-trigger">
          <h2
            className={clsx("flex justify-between m-0", {
              "py-2": nestingLevel > 0,
              "mt-4 mb-1": nestingLevel === 0,
            })}
          >
            <span
              className={clsx("pl-2", {
                "text-sm font-medium text-[#2E2E2E] dark:text-carbon-100":
                  nestingLevel > 0,
                "text-xs font-semibold text-carbon-300 dark:text-carbon-600":
                  nestingLevel == 0,
              })}
            >
              {group.title}
            </span>
            {nestingLevel > 0 && <ChevronDownIcon className="h-4 w-4" />}
          </h2>
        </NavigationGroupStructure.Trigger>

        <NavigationGroupStructure.Content
          className={animateAccordion ? "animate-accordion" : ""}
        >
          <div className={clsx("relative overflow-hidden")}>
            <motion.ul
              role="list"
              className={clsx("border-l border-transparent", {
                "ml-4": nestingLevel > 0,
              })}
            >
              {group.links.map((link) => {
                if (isNavGroup(link)) {
                  return (
                    <Accordion.Root
                      type="multiple"
                      defaultValue={
                        hasNavGroupPath(link, router.pathname)
                          ? [...defaultOpenGroupTitles, link.title]
                          : defaultOpenGroupTitles
                      }
                    >
                      <NavigationGroup
                        group={link}
                        nestingLevel={nestingLevel + 1}
                      />
                    </Accordion.Root>
                  );
                } else if (isNavLink(link)) {
                  return (
                    <motion.li
                      key={link.href}
                      layout="position"
                      className={"relative"}
                    >
                      <NavLink
                        href={link.href}
                        active={link.href === router.pathname}
                        className={link.className}
                        tag={link.tag}
                      >
                        <span>{link.title}</span>
                      </NavLink>
                    </motion.li>
                  );
                } else {
                  return (
                    <motion.li
                      key={link.title}
                      layout="position"
                      className={"relative"}
                    >
                      <span
                        className={clsx(
                          "flex justify-between items-center text-sm transition group py-2 pl-2",
                          "text-xs font-semibold text-carbon-300 dark:text-carbon-600",
                          className
                        )}
                      >
                        {link.title}
                      </span>
                    </motion.li>
                  );
                }
              })}
            </motion.ul>
          </div>
        </NavigationGroupStructure.Content>
      </li>
    </NavigationGroupStructure>
  );
}

function findPathIndex(links: { href?: string }[], pathname: string) {
  return links.findIndex((link) => link.href && link.href === pathname);
}

function hasPath(links: { href?: string }[], pathname: string) {
  return findPathIndex(links, pathname) !== -1;
}

export function hasNavGroupPath(group: NavGroup, pathname: string) {
  return group.links.find((link) => {
    return isNavGroup(link)
      ? hasNavGroupPath(link, pathname)
      : isNavLink(link)
      ? link.href && link.href === pathname
      : false;
  });
}

// Flatten the nested nav and get all nav sections w/ sectionLinks
export function getAllSections(nav) {
  return nav.reduce((acc, item) => {
    if (item.sectionLinks) {
      acc.push(item);
    }
    if (item.links) {
      acc.push(...getAllSections(item.links));
    }
    return acc;
  }, []);
}

function getAllOpenedByDefaultSections(
  sections: (NavGroup | NavLink | NavSection | NavLinkGroup)[],
  currentPath: string
) {
  return sections.reduce((acc, section) => {
    if (isNavGroup(section)) {
      if (section.defaultOpen) {
        acc.push(section.title);
      } else if (hasNavGroupPath(section, currentPath)) {
        acc.push(section.title);
      }
      if (section.links) {
        acc.push(...getAllOpenedByDefaultSections(section.links, currentPath));
      }
    }
    return acc;
  }, []);
}

function findRecursiveSectionLinkMatch(sections, pathname) {
  return sections.find(({ matcher, sectionLinks }) => {
    if (matcher && isMatch(matcher, pathname)) {
      return true;
    }

    return sectionLinks?.find((item) => {
      return isNavGroup(item)
        ? hasNavGroupPath(item, pathname)
        : item.href === pathname;
    });
  });
}
// todo fix active on top level

export const DefaultOpenSectionsContext = createContext([]);

export function Navigation(props) {
  const router = useRouter();
  // Remove query params and hash from pathname
  const pathname = router.asPath.replace(/(\?|#).+$/, "");

  const nestedSection = findRecursiveSectionLinkMatch(
    getAllSections(topLevelNav),
    pathname
  );

  const isNested = !!nestedSection;
  const nestedNavigation = nestedSection;

  const activeGroup = useMemo(
    () =>
      nestedNavigation?.sectionLinks.find(
        (group) => isNavGroup(group) && hasNavGroupPath(group, router.pathname)
      ),
    [router.pathname, nestedNavigation]
  );

  const defaultOpenGroupTitles = useMemo(
    () =>
      getAllOpenedByDefaultSections(
        [
          ...(activeGroup ? [activeGroup] : []),
          ...(nestedNavigation?.sectionLinks
            ? nestedNavigation?.sectionLinks
            : []),
        ],
        router.pathname
      ),
    [activeGroup, nestedNavigation, router.pathname]
  );

  return (
    <DefaultOpenSectionsContext.Provider value={defaultOpenGroupTitles}>
      <nav {...props}>
        <MobileSearch />

        <ul role="list" className="flex lg:hidden flex-col">
          {menuTabs.map((tab, idx) => (
            <li key={idx}>
              <TopLevelNavItem
                href={tab.href}
                matcher={tab.matcher}
                icon={tab.icon}
                title={tab.title}
              />
            </li>
          ))}
        </ul>

        <ul
          role="list"
          className={!isNested ? "flex flex-col gap-2" : undefined}
        >
          {nestedNavigation ? (
            <>
              <Accordion.Root
                key={
                  // re-mount on page navigation
                  router.pathname
                }
                type="multiple"
                defaultValue={defaultOpenGroupTitles}
              >
                {nestedNavigation.sectionLinks.map((item, groupIndex) =>
                  isNavGroup(item) ? (
                    <NavigationGroup
                      key={item.title}
                      group={item}
                      isActiveGroup={item.title === activeGroup?.title}
                    />
                  ) : (
                    <NavLink
                      isTopLevel={true}
                      href={item.href}
                      active={pathname === item.href}
                    >
                      {" "}
                      {item.title}{" "}
                    </NavLink>
                  )
                )}
              </Accordion.Root>
            </>
          ) : null}

          <li className="sticky bottom-0 z-10 mt-6 sm:hidden gap-2 flex dark:bg-carbon-900">
            <Button
              href={process.env.NEXT_PUBLIC_SIGNIN_URL}
              variant="secondaryV2"
              className="w-full"
            >
              Sign In
            </Button>
            <Button
              href={`${process.env.NEXT_PUBLIC_SIGNUP_URL}?ref=docs-mobile-nav`}
              variant="primaryV2"
              arrow="right"
              className="w-full"
            >
              Sign Up
            </Button>
          </li>
        </ul>
      </nav>
    </DefaultOpenSectionsContext.Provider>
  );
}
