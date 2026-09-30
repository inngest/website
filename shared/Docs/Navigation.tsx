import {
  ComponentProps,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";
import { AnimatePresence, m, motion, useIsPresent } from "framer-motion";
import { RiExternalLinkLine } from "@remixicon/react";

// import { Button } from "./Button";
import { Button } from "../Button";
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
import { useUnreleasedLabels, filterUnreleasedNav } from "./Unreleased";
import * as Accordion from "@radix-ui/react-accordion";
import {
  BookOpenIcon,
  ChevronDownIcon,
  CheckIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/outline";
import { MobileSearch } from "./Search";
import * as Select from "@radix-ui/react-select";
import {
  useLanguageStore,
  SDK_LANGUAGES,
  SDK_HOME_PAGES,
  getLanguageFromPath,
  getSdkVersionFromPath,
  TS_STABLE,
  TS_VERSIONS,
  type SDKLanguage,
  type TSVersion,
} from "./LanguageStore";
import TypeScriptIcon from "src/shared/Icons/TypeScript";
import PythonIcon from "src/shared/Icons/Python";
import GoIcon from "src/shared/Icons/Go";

type ActiveSectionContextType = {
  activeSection: string;
  setActiveSection: (section: string) => void;
};

const ActiveSectionContext = createContext<ActiveSectionContextType>({
  activeSection: "docs",
  setActiveSection: () => {},
});

export function ActiveSectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = router.pathname;

  const getInitialSection = useCallback(() => {
    const section = topLevelNav.find(
      (item) => item.id !== "docs" && item.matcher(pathname)
    );
    return section?.id ?? "docs";
  }, [pathname]);

  const [activeSection, setActiveSection] = useState(getInitialSection);

  // Update active section when URL changes (e.g., direct navigation)
  useEffect(() => {
    setActiveSection(getInitialSection());
  }, [pathname, getInitialSection]);

  return (
    <ActiveSectionContext.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </ActiveSectionContext.Provider>
  );
}

export function useActiveSection() {
  return useContext(ActiveSectionContext);
}

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
          "flex flex-row items-center py-1",
          isActive && "font-bold text-breeze-600 dark:text-breeze-300"
        )}
      >
        {title}
      </span>
    </NavLink>
  );
}

export function TabItem({ href, children, matcher, title }) {
  const router = useRouter();
  const pathname = router.pathname;
  const isActive = isMatch(matcher, pathname) || href === pathname;

  return (
    <li>
      <Link
        href={href}
        className={clsx(
          "relative top-0.5 block cursor-pointer whitespace-nowrap px-3 py-4 text-sm font-medium leading-5 transition",
          isActive &&
            "border-b-2 border-b-black text-black hover:text-black dark:border-b-carbon-300 dark:text-carbon-100",
          !isActive &&
            "text-carbon-600 hover:text-carbon-900 dark:text-carbon-400 dark:hover:text-white"
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
  const isExternal = target === "_blank" || href.match(/^https?:\/\//);
  const linkTarget = target ?? href.match(/^https?:\/\//) ? "_blank" : null;
  return (
    <LinkOrHref
      href={href}
      aria-current={active ? "page" : undefined}
      target={linkTarget}
      className={clsx(
        "group flex items-center justify-between gap-2 rounded py-1 pl-2 transition",
        isAnchorLink ? "text-[13px]" : "text-sm",
        active
          ? "rounded bg-secondary-3xSubtle font-medium text-info hover:bg-secondary-2xSubtle"
          : "font-medium text-subtle hover:bg-canvasSubtle hover:text-basis",
        className
      )}
    >
      {!isAnchorLink && <span className="absolute inset-y-0 left-0 w-px" />}
      <span>{children}</span>
      {tag && (
        <Tag color="matcha" className={"mr-2"}>
          {tag}
        </Tag>
      )}
      {isExternal && <RiExternalLinkLine className="mx-1 h-4 w-4 text-muted" />}
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
      // @ts-ignore
      className="absolute left-0 top-0 w-[2px] bg-breeze-600 will-change-transform dark:bg-breeze-300"
      style={{ height, top }}
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
    <div className="opacity-75">
      <h4 className="pb-2 text-sm font-medium">On this page</h4>
      <div className="relative">
        <AnimatePresence initial={!isInsideMobileNavigation}>
          {pageSectionListItems && (
            <VisibleSectionHighlight listItems={pageSectionListItems} />
          )}
        </AnimatePresence>
        {/* @ts-ignore */}
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

function NavigationGroupStructure({
  children,
  ...props
}: { children: React.ReactNode } & ComponentProps<typeof Accordion.Item>) {
  return (
    <Accordion.Item asChild {...props}>
      {children}
    </Accordion.Item>
  );
}

NavigationGroupStructure.Trigger = function NavigationGroupStructureItem({
  children,
  ...props
}: { children: React.ReactNode } & ComponentProps<typeof Accordion.Trigger>) {
  return <Accordion.Trigger {...props}>{children}</Accordion.Trigger>;
};

NavigationGroupStructure.Content = function NavigationGroupStructureItem({
  children,
  ...props
}: { children: React.ReactNode } & ComponentProps<typeof Accordion.Content>) {
  return <Accordion.Content {...props}>{children}</Accordion.Content>;
};

// A nested navigation group of links that expand and follow
function NavigationGroup({
  group,
  isActiveGroup = false,
  nestingLevel = 0,
  className = "",
  tag = "",
}: {
  group: NavGroup;
  isActiveGroup?: boolean;
  nestingLevel?: number;
  className?: string;
  tag?: string;
}) {
  const defaultOpenGroupTitles = useContext(DefaultOpenSectionsContext);
  // If this is the mobile navigation then we always render the initial
  // state, so that the state does not change during the close animation.
  // The state will still update when we re-open (re-render) the navigation.
  let isInsideMobileNavigation = useIsInsideMobileNavigation();
  let [router] = useInitialValue([useRouter()], isInsideMobileNavigation);

  const currentPath = router.pathname;

  // hack: animation flickers on initial render so let's enable it after mount
  let [animateAccordion, setAnimateAccordion] = useState(false);
  useEffect(() => {
    setAnimateAccordion(true);
  }, []);

  return (
    <NavigationGroupStructure value={group.title}>
      <li className={clsx("relative", className, nestingLevel === 0 && "mt-2")}>
        {group.href ? (
          <div
            className={clsx(
              "flex items-center rounded-md transition-colors hover:bg-canvasSubtle",
              nestingLevel === 0 && "py-2"
            )}
          >
            <LinkOrHref
              href={group.href}
              target={/^https?:\/\//.test(group.href) ? "_blank" : undefined}
              rel="noopener noreferrer"
              aria-current={group.href === currentPath ? "page" : undefined}
              className={clsx(
                "flex min-w-0 flex-1 items-center gap-1 pl-2",
                nestingLevel === 0
                  ? "dark:text-carbon-00 text-xs font-bold uppercase tracking-wide text-carbon-300"
                  : "py-1 text-sm font-medium text-subtle hover:text-basis"
              )}
            >
              <span className="truncate">{group.title}</span>
              {/^https?:\/\//.test(group.href) && (
                <RiExternalLinkLine className="h-3 w-3 shrink-0" />
              )}
            </LinkOrHref>
            {tag && (
              <Tag color="matcha" className="mr-2">
                {tag}
              </Tag>
            )}
            {nestingLevel > 0 && (
              <NavigationGroupStructure.Trigger
                aria-label={`Toggle ${group.title}`}
                className="animate-accordion-trigger px-2 py-1"
              >
                <ChevronDownIcon className="h-4 w-4 text-carbon-600 dark:text-carbon-500" />
              </NavigationGroupStructure.Trigger>
            )}
          </div>
        ) : (
          <NavigationGroupStructure.Trigger
            className={clsx(
              "animate-accordion-trigger w-full rounded-md text-left transition-colors hover:bg-canvasSubtle",
              nestingLevel === 0 ? "py-2" : "py-1"
            )}
          >
            <div className="flex w-full items-center justify-between">
              <span
                className={clsx("pl-2", {
                  "text-sm font-medium text-subtle hover:text-basis":
                    nestingLevel > 0,
                  "dark:text-carbon-00 text-xs font-bold uppercase tracking-wide text-carbon-300":
                    nestingLevel == 0,
                })}
              >
                {group.title}
              </span>
              <span className="flex items-center gap-1">
                {tag && (
                  <Tag color="matcha" className={"mr-2"}>
                    {tag}
                  </Tag>
                )}
                <ChevronDownIcon className="mr-2 h-4 w-4 text-carbon-600 dark:text-carbon-500" />
              </span>
            </div>
          </NavigationGroupStructure.Trigger>
        )}

        <NavigationGroupStructure.Content
          className={animateAccordion ? "animate-accordion" : ""}
        >
          <div
            className={clsx(
              "relative overflow-hidden",
              nestingLevel === 0 && "pb-4"
            )}
          >
            {/* @ts-ignore */}
            <motion.ul
              role="list"
              className={clsx({
                "ml-2.5 border-l border-carbon-100 pl-2 dark:border-[#3D3D3D]":
                  nestingLevel > 0,
              })}
            >
              {group.links.map((link, idx) => {
                if (isNavGroup(link)) {
                  return (
                    <Accordion.Root
                      key={idx}
                      type="multiple"
                      defaultValue={
                        hasNavGroupPath(link, currentPath)
                          ? [...defaultOpenGroupTitles, link.title]
                          : defaultOpenGroupTitles
                      }
                    >
                      <NavigationGroup
                        group={link}
                        tag={(link as any).tag || ""}
                        nestingLevel={nestingLevel + 1}
                      />
                    </Accordion.Root>
                  );
                } else if (isNavLink(link)) {
                  return (
                    // @ts-ignore
                    <motion.li
                      key={link.href}
                      layout="position"
                      className={"relative"}
                    >
                      <NavLink
                        href={link.href}
                        active={link.href === currentPath}
                        className={link.className}
                        tag={link.tag}
                      >
                        <span>{link.title}</span>
                      </NavLink>
                    </motion.li>
                  );
                } else {
                  return (
                    // @ts-ignore
                    <motion.li
                      key={link.title}
                      layout="position"
                      className={"relative"}
                    >
                      <span
                        className={clsx(
                          "group flex items-center justify-between py-1 pl-2 text-sm transition",
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
  if (group.href === pathname) return true;
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

const defaultSection = getAllSections(topLevelNav).find(
  (section) => section.id === "docs"
);

// SDK titles that should be filtered based on language and version selection
const SDK_SECTION_TITLES = [
  "TypeScript SDK v3",
  "TypeScript SDK v4",
  "Python SDK",
  "Go SDK",
];

// Non-SDK reference sections that should always be shown (separated from SDK sections)
const SHARED_REFERENCE_TITLES = ["REST API", "System events", "Self-hosting"];

// Helper to check if a section should be hidden based on selected language and TS version
function shouldHideSection(
  title: string,
  selectedLanguage: SDKLanguage,
  tsVersion: TSVersion
): boolean {
  let selectedSdkTitle = SDK_LANGUAGES.find(
    (l) => l.id === selectedLanguage
  )?.title;
  if (!selectedSdkTitle) {
    // Unreachable (unless there's a bug)
    console.error(
      `Selected language ${selectedLanguage} not found in SDK_LANGUAGES`
    );
    return false;
  }
  selectedSdkTitle += " SDK";

  // For TypeScript, match the selected version's section title
  if (selectedLanguage === "typescript") {
    selectedSdkTitle = `TypeScript SDK ${tsVersion}`;
  }
  if (SDK_SECTION_TITLES.includes(title) && title !== selectedSdkTitle) {
    return true;
  }
  return false;
}

const SDK_ICONS: Record<
  SDKLanguage,
  React.ComponentType<{ className?: string }>
> = {
  typescript: TypeScriptIcon,
  python: PythonIcon,
  go: GoIcon,
};

function sdkHomePath(language: SDKLanguage, tsVersion: TSVersion): string {
  return language === "typescript"
    ? `/docs/reference/typescript/${tsVersion}/intro`
    : SDK_HOME_PAGES[language];
}

function LanguageSwitcher({
  displayLanguage,
  setLanguage,
  activeSection,
  tsVersion,
}: {
  displayLanguage: SDKLanguage;
  setLanguage: (lang: SDKLanguage) => void;
  activeSection: string;
  tsVersion: TSVersion;
}) {
  const router = useRouter();
  const pathname = router.asPath.replace(/(\?|#).+$/, "");

  const handleLanguageChange = (newLang: SDKLanguage) => {
    const currentPathLang = getLanguageFromPath(pathname);
    const isOnSDKPage = !!currentPathLang;

    setLanguage(newLang);

    if (
      activeSection === "sdk" &&
      (!isOnSDKPage || currentPathLang !== newLang)
    ) {
      router.push(sdkHomePath(newLang, tsVersion));
    }
  };

  const currentLang = SDK_LANGUAGES.find((l) => l.id === displayLanguage);
  const CurrentIcon = SDK_ICONS[displayLanguage];

  return (
    <div className="mt-3">
      <Select.Root
        value={displayLanguage}
        onValueChange={(val) => handleLanguageChange(val as SDKLanguage)}
      >
        <Select.Trigger
          className={clsx(
            "flex w-full items-center justify-between px-3 py-2",
            "border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800",
            "rounded-lg shadow-sm",
            "text-sm font-medium text-slate-900 dark:text-slate-100",
            "hover:border-slate-300 dark:hover:border-slate-600",
            "focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20",
            "transition-colors"
          )}
        >
          <span className="flex items-center gap-2">
            <CurrentIcon className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            <Select.Value>{currentLang?.title}</Select.Value>
          </span>
          <Select.Icon>
            <ChevronDownIcon className="h-4 w-4 text-slate-400" />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            className={clsx(
              "overflow-hidden bg-white dark:bg-slate-800",
              "border border-slate-200 dark:border-slate-700",
              "rounded-lg shadow-lg",
              "z-50 w-[var(--radix-select-trigger-width)]"
            )}
            position="popper"
            sideOffset={4}
          >
            <Select.Viewport className="p-1">
              {SDK_LANGUAGES.map((lang) => {
                const Icon = SDK_ICONS[lang.id];
                return (
                  <Select.Item
                    key={lang.id}
                    value={lang.id}
                    className={clsx(
                      "flex cursor-pointer items-center gap-2 rounded-md px-3 py-2",
                      "text-sm text-slate-700 dark:text-slate-200",
                      "hover:bg-slate-100 dark:hover:bg-slate-700",
                      "focus:bg-slate-100 focus:outline-none dark:focus:bg-slate-700",
                      "data-[state=checked]:font-medium"
                    )}
                  >
                    <Icon className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                    <Select.ItemText>{lang.title}</Select.ItemText>
                    <Select.ItemIndicator className="ml-auto">
                      <CheckIcon className="h-4 w-4 text-indigo-500" />
                    </Select.ItemIndicator>
                  </Select.Item>
                );
              })}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}

function VersionSwitcher({
  language,
  displayVersion,
  setTsVersion,
}: {
  language: SDKLanguage;
  displayVersion: TSVersion;
  setTsVersion: (version: TSVersion) => void;
}) {
  const router = useRouter();
  const pathname = router.asPath.replace(/(\?|#).+$/, "");

  const handleVersionChange = (newVersion: TSVersion) => {
    setTsVersion(newVersion);

    // If on a versioned TS page for a different version, navigate to version intro.
    // Target the concrete generated /intro page so the client router fetches
    // `_next/data` JSON instead of hitting a redirect or rewrite source.
    const pathVersion = getSdkVersionFromPath(pathname);
    if (pathVersion && pathVersion !== newVersion) {
      if (newVersion === TS_STABLE) {
        router.push(`/docs/reference/typescript/${TS_STABLE}/intro`);
      } else {
        router.push(`/docs/reference/typescript/${newVersion}/intro`);
      }
    }
  };

  if (language !== "typescript") {
    return null;
  }

  const currentVersion = TS_VERSIONS.find((v) => v.id === displayVersion);

  return (
    <div className="mt-2">
      <Select.Root
        value={displayVersion}
        onValueChange={(val) => handleVersionChange(val as TSVersion)}
      >
        <Select.Trigger
          className={clsx(
            "flex w-full items-center justify-between px-3 py-2",
            "border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800",
            "rounded-lg shadow-sm",
            "text-sm font-medium text-slate-900 dark:text-slate-100",
            "hover:border-slate-300 dark:hover:border-slate-600",
            "focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20",
            "transition-colors"
          )}
        >
          <span className="flex items-center gap-2">
            <Select.Value>{currentVersion?.title}</Select.Value>
          </span>
          <Select.Icon>
            <ChevronDownIcon className="h-4 w-4 text-slate-400" />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            className={clsx(
              "overflow-hidden bg-white dark:bg-slate-800",
              "border border-slate-200 dark:border-slate-700",
              "rounded-lg shadow-lg",
              "z-50 w-[var(--radix-select-trigger-width)]"
            )}
            position="popper"
            sideOffset={4}
          >
            <Select.Viewport className="p-1">
              {TS_VERSIONS.map((version) => (
                <Select.Item
                  key={version.id}
                  value={version.id}
                  className={clsx(
                    "flex cursor-pointer items-center gap-2 rounded-md px-3 py-2",
                    "text-sm text-slate-700 dark:text-slate-200",
                    "hover:bg-slate-100 dark:hover:bg-slate-700",
                    "focus:bg-slate-100 focus:outline-none dark:focus:bg-slate-700",
                    "data-[state=checked]:font-medium"
                  )}
                >
                  <Select.ItemText>{version.title}</Select.ItemText>
                  <Select.ItemIndicator className="ml-auto">
                    <CheckIcon className="h-4 w-4 text-indigo-500" />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}

export function Navigation(props) {
  const router = useRouter();

  const pathname = router.pathname;

  const { activeSection } = useActiveSection();
  const { effectiveLanguage, effectiveTsVersion, setLanguage, setTsVersion } =
    useHydratedLanguageState(pathname);

  const unreleasedLabels = useUnreleasedLabels();
  const visibleMenuTabs = filterUnreleasedNav(menuTabs, unreleasedLabels);
  // Stable string for the accordion remount key below.
  const unreleasedKey = Array.from(unreleasedLabels).sort().join(",");

  const nestedSection =
    getAllSections(topLevelNav).find(
      (section) => section.id === activeSection
    ) ?? defaultSection;

  const isNested = !!nestedSection;

  // Keep all sections in DOM for SEO, but mark which ones should be hidden
  // This way crawlers can still see all the links
  const nestedNavigation = useMemo(() => {
    if (!nestedSection) return null;
    return {
      ...nestedSection,
      sectionLinks: filterUnreleasedNav(
        nestedSection.sectionLinks ?? [],
        unreleasedLabels
      ),
    };
  }, [nestedSection, unreleasedLabels]);

  const activeGroup = useMemo(
    () =>
      nestedNavigation?.sectionLinks.find(
        (group) => isNavGroup(group) && hasNavGroupPath(group, pathname)
      ),
    [pathname, nestedNavigation]
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
        pathname
      ),
    [activeGroup, nestedNavigation, pathname]
  );

  return (
    <DefaultOpenSectionsContext.Provider value={defaultOpenGroupTitles}>
      <nav {...props}>
        <MobileSearch />

        <ul role="list" className="flex flex-col lg:hidden">
          {visibleMenuTabs.map((tab, idx) => (
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

        {activeSection !== "examples" && (
          <div className="mb-4 lg:mb-8">
            <div
              aria-label="Documentation view"
              className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800/50"
            >
              {[
                { id: "docs", title: "Learn", icon: BookOpenIcon },
                { id: "sdk", title: "Reference", icon: CodeBracketIcon },
              ].map((tab) => {
                const isActive = activeSection === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => {
                      if (isActive) return;
                      router.push(
                        tab.id === "docs"
                          ? "/docs"
                          : sdkHomePath(effectiveLanguage, effectiveTsVersion)
                      );
                    }}
                    className={clsx(
                      "flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all",
                      isActive
                        ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100"
                        : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    )}
                  >
                    <tab.icon
                      className={clsx(
                        "h-4 w-4",
                        isActive
                          ? "text-breeze-600 dark:text-breeze-400"
                          : "text-slate-400"
                      )}
                    />
                    {tab.title}
                  </button>
                );
              })}
            </div>
            <LanguageSwitcher
              displayLanguage={effectiveLanguage}
              setLanguage={setLanguage}
              activeSection={activeSection}
              tsVersion={effectiveTsVersion}
            />
            {activeSection === "sdk" && (
              <VersionSwitcher
                language={effectiveLanguage}
                displayVersion={effectiveTsVersion}
                setTsVersion={setTsVersion}
              />
            )}
          </div>
        )}

        <ul
          role="list"
          className={!isNested ? "flex flex-col gap-2" : undefined}
        >
          {nestedNavigation ? (
            <>
              <Accordion.Root
                key={
                  // re-mount on page navigation, and after an unreleased reveal so
                  // a gated page's own group auto-opens once its nav link appears
                  `${pathname}:${unreleasedKey}`
                }
                type="multiple"
                defaultValue={defaultOpenGroupTitles}
              >
                {nestedNavigation.sectionLinks.map((item, groupIndex) => {
                  const isHidden =
                    activeSection === "sdk" &&
                    shouldHideSection(
                      item.title,
                      effectiveLanguage,
                      effectiveTsVersion
                    );
                  // Add visual separator before shared sections (REST API, etc.)
                  const isSharedSection = SHARED_REFERENCE_TITLES.includes(
                    item.title
                  );
                  const isFirstSharedSection =
                    isSharedSection &&
                    groupIndex > 0 &&
                    !SHARED_REFERENCE_TITLES.includes(
                      nestedNavigation.sectionLinks[groupIndex - 1]?.title
                    );

                  return (
                    <div
                      key={item.title || `grp-${groupIndex}`}
                      className={clsx(isHidden && "hidden")}
                    >
                      {activeSection === "sdk" && isFirstSharedSection && (
                        <div className="mb-4 mt-6 border-t border-slate-200 dark:border-slate-700" />
                      )}
                      {isNavGroup(item) ? (
                        <NavigationGroup
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
                      )}
                    </div>
                  );
                })}
              </Accordion.Root>
            </>
          ) : null}

          <li className="sticky bottom-0 z-10 mt-6 flex gap-2 bg-canvasBase shadow-xl shadow-white dark:bg-carbon-900 dark:shadow-black sm:hidden">
            <Button
              href="/contact?ref=docs-mobile-nav"
              variant="primaryOutline"
              className="w-full"
              size="sm"
            >
              Contact sales
            </Button>
            <Button
              href={`${process.env.NEXT_PUBLIC_SIGNUP_URL}?ref=docs-mobile-nav`}
              variant="primaryV2"
              className="w-full"
              size="sm"
            >
              Sign Up
            </Button>
          </li>
        </ul>
      </nav>
    </DefaultOpenSectionsContext.Provider>
  );
}

/**
 * Hydration-safe wrapper around the persisted language store.
 *
 * The URL is the source of truth for which SDK/version the page is showing.
 * The persisted store only fills in when the URL has no language/version info
 * (e.g. /docs/learn/* pages) so the switchers remember the user's preference
 * across navigations.
 *
 * Pre-hydration we never read the store. Post-hydration the store is consulted
 * only as a fallback. This means: when the URL has SDK info, the value never
 * changes between SSR and CSR — no flicker, no sidebar re-shuffle.
 */
export function useHydratedLanguageState(pathname: string) {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  const { language, setLanguage, tsVersion, setTsVersion } = useLanguageStore();
  const pathLanguage = getLanguageFromPath(pathname);
  const pathTsVersion = getSdkVersionFromPath(pathname);
  const storeLanguage = SDK_LANGUAGES.some((l) => l.id === language)
    ? language
    : "typescript";
  const storeTsVersion = TS_VERSIONS.some((v) => v.id === tsVersion)
    ? tsVersion
    : TS_STABLE;

  // Sync store to URL on mount and on navigation so the URL always wins
  useEffect(() => {
    if (pathLanguage) {
      setLanguage(pathLanguage);
    }
    if (pathTsVersion) {
      setTsVersion(pathTsVersion);
    }
  }, [pathLanguage, pathTsVersion, setLanguage, setTsVersion]);

  // URL wins. Store only fills in when the URL is silent (e.g. /docs/learn/*).
  // Pre-hydration we ignore the store entirely so SSR and the first client
  // render produce identical markup.
  const effectiveLanguage: SDKLanguage =
    pathLanguage ?? (hydrated ? storeLanguage : "typescript");
  const effectiveTsVersion: TSVersion =
    pathTsVersion ?? (hydrated ? storeTsVersion : TS_STABLE);

  return {
    effectiveLanguage,
    effectiveTsVersion,
    hydrated,
    setLanguage,
    setTsVersion,
  };
}
