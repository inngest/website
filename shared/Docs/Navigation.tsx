import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";
import { AnimatePresence, m, motion, useIsPresent } from "framer-motion";

import { Button } from "./Button";
import { useIsInsideMobileNavigation } from "./MobileNavigation";
import { useSectionStore } from "./SectionProvider";
import { Tag } from "./Tag";
import { remToPx } from "../../utils/remToPx";
import { topLevelNav, menuTabs, type NavGroup } from "./navigationStructure";
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
          isActive && "font-bold text-indigo-600"
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
            "text-indigo-700 dark:text-white border-b dark:border-b-white border-b-indigo-700  hover:text-indigo-900",
          !isActive &&
            "text-slate-600  dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
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
        "flex justify-between items-center gap-2 py-1 pr-3 text-sm transition group", // group for nested hovers
        isTopLevel || isAnchorLink ? "pl-0" : "pl-4",
        active
          ? "font-semibold text-black dark:text-white"
          : "font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white",
        className
      )}
    >
      {!isAnchorLink && (
        <span className="absolute inset-y-0 left-0 w-px bg-slate-900/10 dark:bg-white/15" />
      )}

      <span className={truncate ? "truncate" : ""}>{children}</span>
      {tag && <Tag color="indigo">{tag}</Tag>}
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
// A nested navigation group of links that expand and follow
function NavigationGroup({
  group,
  isActiveGroup = false,
  isNestedGroup = false,
  className = "",
}: {
  group: NavGroup;
  isActiveGroup?: boolean;
  isNestedGroup?: boolean;
  className?: string;
}) {
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
    <Accordion.Item value={group.title}>
      <li
        className={clsx("relative", className, {
          "mt-2": isNestedGroup,
          "mt-4": !isNestedGroup,
        })}
      >
        <Accordion.Trigger className="w-full animate-accordion-trigger">
          <h2
            className={clsx("flex justify-between", { "ml-4": isNestedGroup })}
          >
            <span
              className={clsx("text-slate-900 dark:text-white", {
                "text-sm font-medium": isNestedGroup,
                "text-xs font-semibold uppercase font-mono": !isNestedGroup,
              })}
            >
              {/* TODO: Make group title a link to group landing page */}
              {group.title}
            </span>
            <ChevronDownIcon className="h-4 w-4" />
          </h2>
        </Accordion.Trigger>

        <Accordion.Content
          className={animateAccordion ? "animate-accordion" : ""}
        >
          <div
            className={clsx(
              "relative overflow-hidden",
              isNestedGroup ? "mt-2" : "pl-2 mt-3"
            )}
          >
            <motion.ul role="list" className="border-l border-transparent">
              {group.links.map((link) =>
                "links" in link ? (
                  <Accordion.Root
                    type="multiple"
                    defaultValue={
                      hasPath(link.links, router.pathname) ? [link.title] : []
                    }
                  >
                    <NavigationGroup group={link} isNestedGroup />
                  </Accordion.Root>
                ) : (
                  <motion.li
                    key={link.href}
                    layout="position"
                    className={clsx("relative", { "ml-3": isNestedGroup })}
                  >
                    <NavLink
                      href={link.href}
                      active={link.href === router.pathname}
                      className={link.className}
                      tag={link.tag}
                    >
                      {link.title}
                    </NavLink>
                  </motion.li>
                )
              )}
            </motion.ul>
          </div>
        </Accordion.Content>
      </li>
    </Accordion.Item>
  );
}

function findPathIndex(links: { href?: string }[], pathname: string) {
  return links.findIndex((link) => link.href && link.href === pathname);
}

function hasPath(links: { href?: string }[], pathname: string) {
  return findPathIndex(links, pathname) !== -1;
}

// Flatten the nested nav and get all nav sections w/ sectionLinks
function getAllSections(nav) {
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

function findRecursiveSectionLinkMatch(nav, pathname) {
  const sections = getAllSections(nav);
  return sections.find(({ matcher, sectionLinks }) => {
    if (matcher && isMatch(matcher, pathname)) {
      return true;
    }

    if (
      sectionLinks?.find((item) => {
        return (
          hasPath(item.links, pathname) ||
          item.links?.some(
            (subgroup) => subgroup.links && hasPath(subgroup.links, pathname)
          )
        );
      })
    ) {
      return true;
    }

    return false;
  });
}
// todo fix active on top level

export function Navigation(props) {
  const router = useRouter();
  // Remove query params and hash from pathname
  const pathname = router.asPath.replace(/(\?|#).+$/, "");

  const nestedSection = findRecursiveSectionLinkMatch(topLevelNav, pathname);
  const isNested = !!nestedSection;
  const nestedNavigation = nestedSection;

  const activeGroup = useMemo(
    () =>
      nestedNavigation?.sectionLinks.find((group) =>
        hasPath(group.links, router.pathname)
      ),
    [router.pathname, nestedNavigation]
  );

  const defaultOpenGroupTitles = useMemo(
    () =>
      [
        activeGroup,
        ...(nestedNavigation?.sectionLinks.filter(
          (group) => group.defaultOpen
        ) ?? []),
      ]
        .filter(Boolean)
        .map((group) => group.title),
    [activeGroup, nestedNavigation]
  );

  return (
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

      <ul role="list" className={!isNested ? "flex flex-col gap-2" : undefined}>
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
              {nestedNavigation.sectionLinks.map((group, groupIndex) => (
                <NavigationGroup
                  key={group.title}
                  group={group}
                  isActiveGroup={group.title === activeGroup?.title}
                />
              ))}
            </Accordion.Root>
          </>
        ) : null}

        <li className="sticky bottom-0 z-10 mt-6 sm:hidden gap-2 flex dark:bg-slate-900">
          <Button
            href={process.env.NEXT_PUBLIC_SIGNIN_URL}
            variant="secondary"
            className="w-full"
          >
            Sign In
          </Button>
          <Button
            href={`${process.env.NEXT_PUBLIC_SIGNUP_URL}?ref=docs-mobile-nav`}
            variant="primary"
            arrow="right"
            className="w-full"
          >
            Sign Up
          </Button>
        </li>
      </ul>
    </nav>
  );
}
