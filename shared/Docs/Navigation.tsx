import { useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";
import { AnimatePresence, motion, useIsPresent } from "framer-motion";

import { Button } from "./Button";
import { useIsInsideMobileNavigation } from "./MobileNavigation";
import { useSectionStore } from "./SectionProvider";
import { Tag } from "./Tag";
import { remToPx } from "../../utils/remToPx";
import { topLevelNav, menuTabs, type NavGroup } from "./navigationStructure";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const BASE_DIR = "/docs";

function useInitialValue(value, condition = true) {
  let initialValue = useRef(value).current;
  return condition ? initialValue : value;
}

function TopLevelNavItem({ href, children }) {
  return (
    <li className="lg:hidden">
      <Link
        href={href}
        className="block py-1 text-sm text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
      >
        {children}
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
        "flex justify-between items-center gap-2 py-1 pr-3 text-sm font-medium transition group", // group for nested hovers
        isTopLevel ? "pl-0" : isAnchorLink ? "pl-3" : "pl-4",
        active
          ? "text-slate-900 dark:text-white"
          : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white",
        className
      )}
    >
      <span className={truncate ? "truncate" : ""}>{children}</span>
      {tag && (
        <Tag variant="small" color="slate" background="page">
          {tag}
        </Tag>
      )}
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

function VisibleSectionHighlight({ group, pathname }) {
  let [sections, visibleSections] = useInitialValue(
    [
      useSectionStore((s) => s.sections),
      useSectionStore((s) => s.visibleSections),
    ],
    useIsInsideMobileNavigation()
  );

  let isPresent = useIsPresent();
  let firstVisibleSectionIndex = Math.max(
    0,
    [{ id: "_top" }, ...sections].findIndex(
      (section) => section.id === visibleSections[0]
    )
  );
  let itemHeight = remToPx(1.76);
  let height = isPresent
    ? Math.max(1, visibleSections.length) * itemHeight
    : itemHeight;
  let top =
    findPathIndex(group.links, pathname) * itemHeight +
    firstVisibleSectionIndex * itemHeight;

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2 } }}
      exit={{ opacity: 0 }}
      className="absolute inset-x-0 top-0 bg-slate-800/2.5 will-change-transform dark:bg-white/2.5"
      style={{ borderRadius: 8, height, top }}
    />
  );
}

function ActivePageMarker({ group, pathname }) {
  let itemHeight = 28;
  let offset = remToPx(0.27);
  let activePageIndex = findPathIndex(group.links, pathname);
  let top = offset + activePageIndex * itemHeight;

  return (
    <motion.div
      layout
      className="absolute h-[20px] w-px bg-indigo-500"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2 } }}
      exit={{ opacity: 0 }}
      style={{ top }}
    />
  );
}

export function PageSidebar() {
  let isInsideMobileNavigation = useIsInsideMobileNavigation();
  let [router, sections] = useInitialValue(
    [useRouter(), useSectionStore((s) => s.sections)],
    isInsideMobileNavigation
  );

  return (
    <div>
      <h4 className="text-base font-medium pb-2">On this page</h4>
      {/* TODO: Add highlighted page section back */}
      {/* <AnimatePresence initial={!isInsideMobileNavigation}>
        <VisibleSectionHighlight group={group} pathname={router.pathname} />
      </AnimatePresence> */}
      <motion.ul
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
          <li key={section.id}>
            <NavLink
              href={`#${section.id}`}
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
  return (
    <Accordion.Item value={group.title}>
      <li
        className={clsx("relative", className, {
          "mt-2": isNestedGroup,
          "mt-6": !isNestedGroup,
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

        <Accordion.Content className="animate-accordion">
          <div
            className={clsx(
              "relative overflow-hidden",
              isNestedGroup ? "mt-2" : "pl-2 mt-3"
            )}
          >
            {!isNestedGroup && (
              <motion.div
                layout
                className="absolute inset-y-0 left-2 w-px bg-slate-900/10 dark:bg-white/5"
              />
            )}

            <AnimatePresence initial={false}>
              {(isActiveGroup || isNestedGroup) && (
                <ActivePageMarker group={group} pathname={router.pathname} />
              )}
            </AnimatePresence>

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
    if (matcher?.test(pathname)) {
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
      (activeGroup
        ? [activeGroup]
        : nestedNavigation?.sectionLinks.filter((group) => group.defaultOpen)
      )?.map((group) => group.title),
    [activeGroup, nestedNavigation]
  );

  return (
    <nav {...props}>
      {isNested && (
        <NavLink href={BASE_DIR} className="pl-0 text-xs uppercase font-mono">
          ← Back to docs home
        </NavLink>
      )}
      <ul role="list" className={!isNested ? "flex flex-col gap-2" : undefined}>
        {nestedNavigation ? (
          <>
            <li className="mt-6 mb-4 flex gap-2 items-center text-base font-semibold text-slate-900 dark:text-white">
              <span className="p-0.5">
                <nestedNavigation.icon className="w-5 h-5 text-slate-400" />
              </span>
              {nestedNavigation.title}
            </li>
            <Accordion.Root
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
        ) : (
          topLevelNav.map((item, idx) =>
            item.href ? (
              <li key={idx}>
                <NavLink href={item.href} key={idx} isTopLevel={true}>
                  <span className="flex flex-row gap-3 items-center">
                    {item.icon && (
                      <item.icon className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200" />
                    )}
                    {item.title}
                  </span>
                </NavLink>
              </li>
            ) : (
              <li className="mt-6" key={idx}>
                <h2 className="text-xs font-semibold text-slate-900 dark:text-white uppercase">
                  {item.title}
                </h2>
                <ul role="list" className="mt-3 flex flex-col gap-2">
                  {item.links.map((link, idx) => (
                    <li key={idx}>
                      <NavLink
                        href={link.href}
                        isTopLevel={true}
                        tag={link.tag}
                        target={link.target}
                      >
                        <span className="flex flex-row gap-3 items-center">
                          {link.icon && (
                            <link.icon className="w-5 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200" />
                          )}
                          {link.title}
                        </span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>
            )
          )
        )}

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
