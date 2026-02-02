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
  sidebarMenuTabs,
  type NavGroup,
  type NavLink,
  isNavGroup,
  isNavLinkGroup,
  NavSection,
  NavLinkGroup,
  isNavLink,
} from "./navigationStructure";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/24/outline";
import { MobileSearch } from "./Search";
import * as Select from "@radix-ui/react-select";
import {
  useLanguageStore,
  SDK_LANGUAGES,
  SDK_TITLE_TO_LANGUAGE,
  SDK_HOME_PAGES,
  getLanguageFromPath,
  type SDKLanguage,
} from "./LanguageStore";
import TypeScriptIcon from "src/shared/Icons/TypeScript";
import PythonIcon from "src/shared/Icons/Python";
import GoIcon from "src/shared/Icons/Go";

type ActiveSectionContextType = {
  activeSection: string;
  setActiveSection: (section: string) => void;
};

const ActiveSectionContext = createContext<ActiveSectionContextType>({
  activeSection: "Learn",
  setActiveSection: () => {},
});

export function ActiveSectionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = router.pathname;

  // Determine initial section based on current URL
  const getInitialSection = useCallback(() => {
    // Check if current path matches Reference section
    const referenceTab = sidebarMenuTabs.find(tab => tab.title === "Reference");
    if (referenceTab?.matcher && !!referenceTab.matcher(pathname)) {
      return "Reference";
    }
    // Check if current path matches Examples section
    const examplesTab = topLevelNav.find(tab => tab.title === "Examples");
    if (examplesTab?.matcher && !!examplesTab.matcher(pathname)) {
      return "Examples";
    }
    return "Learn";
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
          "flex flex-row py-1 items-center",
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
          "font-medium text-sm leading-5 transition whitespace-nowrap px-3 py-4 relative top-0.5 cursor-pointer block",
          isActive &&
            "text-black dark:text-carbon-100 border-b-2 dark:border-b-carbon-300 border-b-black hover:text-black",
          !isActive &&
            "text-carbon-600 dark:text-carbon-400 hover:text-carbon-900 dark:hover:text-white"
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
        "flex rounded justify-between items-center gap-2 py-1 pl-2 text-sm transition group", // group for nested hovers
        active
          ? "font-medium rounded bg-secondary-3xSubtle text-info hover:bg-secondary-2xSubtle"
          : "font-medium hover:bg-canvasSubtle text-subtle hover:text-basis",
        className
      )}
    >
      {!isAnchorLink && <span className="absolute inset-y-0 left-0 w-px" />}
      <span>{children}</span>
      {tag && (
        <Tag color="breeze" className={"mr-2"}>
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
      className="absolute left-0 top-0 w-[2px] bg-breeze-600 dark:bg-breeze-300 will-change-transform"
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
    <div>
      <h4 className="text-base font-medium pb-2">On this page</h4>
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
            className={clsx("flex justify-between m-0 rounded transition-colors", {
              "py-1 hover:bg-canvasSubtle": nestingLevel > 0,
              "mt-4 mb-1.5 mx-1 px-1 py-0.5 hover:bg-canvasSubtle": nestingLevel === 0,
            })}
          >
            <span
              className={clsx({
                "pl-2 text-sm font-medium text-subtle hover:text-basis":
                  nestingLevel > 0,
                "text-xs font-medium uppercase tracking-wider text-muted":
                  nestingLevel == 0,
              })}
            >
              {group.title}
              {tag && (
                <Tag color="breeze" className={"ml-2"}>
                  {tag}
                </Tag>
              )}
            </span>
            {nestingLevel > 0 && <ChevronDownIcon className="mr-1 h-4 w-4" />}
          </h2>
        </NavigationGroupStructure.Trigger>

        <NavigationGroupStructure.Content
          className={animateAccordion ? "animate-accordion" : ""}
        >
          <div className={clsx("relative overflow-hidden")}>
            {/* @ts-ignore */}
            <motion.ul
              role="list"
              className={clsx({
                "ml-2.5 pl-2 border-l border-carbon-100 dark:border-[#3D3D3D]":
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
                        hasNavGroupPath(link, router.pathname)
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
                    // @ts-ignore
                    <motion.li
                      key={link.title}
                      layout="position"
                      className={"relative"}
                    >
                      <span
                        className={clsx(
                          "flex justify-between items-center transition group py-1 pl-2",
                          "text-xs font-medium uppercase tracking-wider text-muted",
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

const defaultSection = getAllSections(topLevelNav).find(
  (section) => section.title === "Learn"
);

// SDK titles that should be filtered based on language selection
const SDK_SECTION_TITLES = ["TypeScript SDK", "Python SDK", "Go SDK"];

// Non-SDK reference sections that should always be shown (separated from SDK sections)
const SHARED_REFERENCE_TITLES = ["REST API", "System events", "Self-hosting"];

// Helper to check if a section should be hidden based on selected language
function shouldHideSection(title: string, selectedLanguage: SDKLanguage): boolean {
  const selectedSdkTitle = SDK_LANGUAGES.find(l => l.id === selectedLanguage)?.title + " SDK";
  // Hide other SDK sections (not the selected one)
  if (SDK_SECTION_TITLES.includes(title) && title !== selectedSdkTitle) {
    return true;
  }
  return false;
}

const SDK_ICONS: Record<SDKLanguage, React.ComponentType<{ className?: string }>> = {
  typescript: TypeScriptIcon,
  python: PythonIcon,
  go: GoIcon,
};

function LanguageSwitcher() {
  const router = useRouter();
  const pathname = router.asPath.replace(/(\?|#).+$/, "");
  const { language, setLanguage } = useLanguageStore();
  const { activeSection } = useActiveSection();

  const handleLanguageChange = (newLang: SDKLanguage) => {
    const currentPathLang = getLanguageFromPath(pathname);
    const isOnSDKPage = !!currentPathLang;
    
    setLanguage(newLang);
    
    // Navigate based on active tab vs current page mismatch
    if (activeSection === "Learn" && isOnSDKPage) {
      // User clicked Learn tab but is still on a Reference (SDK) page
      // Navigate to Learn home
      router.push("/docs");
    } else if (activeSection === "Reference" && !isOnSDKPage) {
      // User clicked Reference tab but is still on a Learn page
      // Navigate to the selected SDK's Reference home
      router.push(SDK_HOME_PAGES[newLang]);
    } else if (activeSection === "Reference" && isOnSDKPage && currentPathLang !== newLang) {
      // User is on Reference and on an SDK page, but switching to different SDK
      // Navigate to the new SDK's Reference home
      router.push(SDK_HOME_PAGES[newLang]);
    }
    // Otherwise: just update the language preference, no navigation needed
  };

  const currentLang = SDK_LANGUAGES.find((l) => l.id === language);
  const CurrentIcon = SDK_ICONS[language];

  return (
    <div className="mt-3">
      <Select.Root value={language} onValueChange={(val) => handleLanguageChange(val as SDKLanguage)}>
        <Select.Trigger
          className={clsx(
            "flex items-center justify-between w-full px-3 py-2",
            "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700",
            "rounded-lg shadow-sm",
            "text-sm font-medium text-slate-900 dark:text-slate-100",
            "hover:border-slate-300 dark:hover:border-slate-600",
            "focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500",
            "transition-colors"
          )}
        >
          <span className="flex items-center gap-2">
            <CurrentIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            <Select.Value>{currentLang?.title}</Select.Value>
          </span>
          <Select.Icon>
            <ChevronDownIcon className="w-4 h-4 text-slate-400" />
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
                      "flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer",
                      "text-sm text-slate-700 dark:text-slate-200",
                      "hover:bg-slate-100 dark:hover:bg-slate-700",
                      "focus:outline-none focus:bg-slate-100 dark:focus:bg-slate-700",
                      "data-[state=checked]:font-medium"
                    )}
                  >
                    <Icon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                    <Select.ItemText>{lang.title}</Select.ItemText>
                    <Select.ItemIndicator className="ml-auto">
                      <CheckIcon className="w-4 h-4 text-indigo-500" />
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

export function Navigation(props) {
  const router = useRouter();
  // Remove query params and hash from pathname
  const pathname = router.asPath.replace(/(\?|#).+$/, "");
  const { activeSection, setActiveSection } = useActiveSection();
  const { language } = useLanguageStore();

  // Find the section based on the active tab (Learn/Reference)
  const nestedSection =
    getAllSections(topLevelNav).find(
      (section) => section.title === activeSection
    ) ?? defaultSection;

  const isNested = !!nestedSection;
  
  // Keep all sections in DOM for SEO, but mark which ones should be hidden
  // This way crawlers can still see all the links
  const nestedNavigation = useMemo(() => {
    if (!nestedSection) return null;
    return nestedSection;
  }, [nestedSection]);

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

        {activeSection !== "Examples" && (
          <div className="mb-4 lg:mb-8">
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
              {sidebarMenuTabs.map((tab) => {
                const isActive = activeSection === tab.title;
                return (
                  <button
                    key={tab.title}
                    onClick={() => {
                      setActiveSection(tab.title);
                      // Navigate to SDK home page when switching to Reference tab
                      if (tab.title === "Reference" && !isActive) {
                        router.push(SDK_HOME_PAGES[language]);
                      }
                    }}
                    className={clsx(
                      "flex-1 flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                      isActive
                        ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
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
            
            {/* Language Switcher - shown on both Learn and Reference */}
            <LanguageSwitcher />
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
                  // re-mount on page navigation
                  router.pathname
                }
                type="multiple"
                defaultValue={defaultOpenGroupTitles}
              >
                {nestedNavigation.sectionLinks.map((item, groupIndex) => {
                  // For Reference section, hide non-selected SDK sections with CSS (keeps links in DOM for SEO)
                  const isHidden = activeSection === "Reference" && shouldHideSection(item.title, language);
                  // Add visual separator before shared sections (REST API, etc.)
                  const isSharedSection = SHARED_REFERENCE_TITLES.includes(item.title);
                  const isFirstSharedSection = isSharedSection && 
                    groupIndex > 0 && 
                    !SHARED_REFERENCE_TITLES.includes(nestedNavigation.sectionLinks[groupIndex - 1]?.title);
                  
                  return (
                    <div 
                      key={item.title || `grp-${groupIndex}`}
                      className={clsx(isHidden && "hidden")}
                    >
                      {/* Separator before shared sections in Reference */}
                      {activeSection === "Reference" && isFirstSharedSection && (
                        <div className="mt-6 mb-4 border-t border-slate-200 dark:border-slate-700" />
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

          <li className="sticky bottom-0 z-10 mt-6 sm:hidden gap-2 flex bg-canvasBase dark:bg-carbon-900 shadow-xl shadow-white dark:shadow-black">
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
