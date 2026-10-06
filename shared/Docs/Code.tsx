"use client";

import React, {
  Children,
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/router";
import { TabGroup, TabPanel, TabPanels, TabList, Tab } from "@headlessui/react";
import clsx from "clsx";
import create from "zustand";

import { Tag } from "./Tag";
import { useSearchParams } from "next/navigation";
import { useLocalStorage } from "react-use";
import {
  useLanguageStore,
  SDK_LANGUAGES,
  type SDKLanguage,
} from "./LanguageStore";

const languageNames = {
  js: "JavaScript",
  ts: "TypeScript",
  javascript: "JavaScript",
  typescript: "TypeScript",
  php: "PHP",
  python: "Python",
  py: "Python",
  ruby: "Ruby",
  go: "Go",
};

function getPanelTitle({
  title,
  language,
}: {
  title?: string;
  language?: string;
}): string {
  return title ?? languageNames[language] ?? "Code";
}

function ClipboardIcon(props) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" {...props}>
      <path
        strokeWidth="0"
        d="M5.5 13.5v-5a2 2 0 0 1 2-2l.447-.894A2 2 0 0 1 9.737 4.5h.527a2 2 0 0 1 1.789 1.106l.447.894a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2Z"
      />
      <path
        fill="none"
        strokeLinejoin="round"
        d="M12.5 6.5a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2m5 0-.447-.894a2 2 0 0 0-1.79-1.106h-.527a2 2 0 0 0-1.789 1.106L7.5 6.5m5 0-1 1h-3l-1-1"
      />
    </svg>
  );
}

export function CopyButton({ code }) {
  let [copyCount, setCopyCount] = useState(0);
  let copied = copyCount > 0;

  useEffect(() => {
    if (copyCount > 0) {
      let timeout = setTimeout(() => setCopyCount(0), 1000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [copyCount]);

  return (
    <button
      type="button"
      className={clsx(
        // Header is ~41px, button height
        "absolute right-1.5 top-1.5 overflow-hidden rounded-md border border-muted px-2 py-1 text-xs font-medium",
        "bg-surfaceBase hover:border-contrast hover:bg-canvasSubtle"
      )}
      onClick={() => {
        const trimmedCode = (code || "").trimEnd();
        window.navigator.clipboard.writeText(trimmedCode).then(() => {
          setCopyCount((count) => count + 1);
        });
      }}
    >
      <span
        aria-hidden={copied}
        className={clsx(
          "pointer-events-none flex items-center gap-0.5 text-basis transition duration-300",
          copied && "-translate-y-1.5 opacity-0"
        )}
      >
        Copy
      </span>
      <span
        aria-hidden={!copied}
        className={clsx(
          "pointer-events-none absolute inset-0 flex items-center justify-center text-success transition duration-300",
          !copied && "translate-y-1.5 opacity-0"
        )}
      >
        Copied
      </span>
    </button>
  );
}

function CodePanelHeader({ tag, label }) {
  if (!tag && !label) {
    return null;
  }

  return (
    <div
      className={`flex h-10 items-center gap-2 rounded-t-md
        border-b border-b-subtle bg-surfaceBase
        px-4
      `}
    >
      {tag && (
        <div className="flex">
          <Tag variant="small">{tag}</Tag>
        </div>
      )}
      {tag && label && (
        <span className="h-0.5 w-0.5 rounded-full bg-surfaceMuted" />
      )}
      {label && <span className="font-mono text-sm text-basis">{label}</span>}
    </div>
  );
}

type CodePanelProps = {
  tag?: string;
  label?: string;
  code?: string;
  children?: React.ReactNode;
};

function CodePanel({ tag, label, code, children }: CodePanelProps) {
  // Tolerate multiple children (some MDX content blocks pass more
  // than one) — take the first element rather than throwing via
  // Children.only. Falls back to an empty props object if there's
  // nothing renderable.
  const childArray = Children.toArray(children);
  const child: any =
    (childArray.find((c) => typeof c === "object" && c !== null) as any) ?? {
      props: {},
    };

  if (child.type === SdkUnsupported) {
    return <div className="group bg-codeEditor">{child}</div>;
  }

  return (
    <div className="group bg-codeEditor">
      <CodePanelHeader
        tag={child.props.tag ?? tag}
        label={child.props.label ?? label}
      />
      {/* Added wrapper to contain button within code area and prevent tab overlap */}
      <div className="relative">
        <CopyButton code={child.props.code ?? code} />
        <pre className="overflow-x-auto px-6 py-5 text-xs leading-relaxed text-basis">
          {children}
        </pre>
      </div>
    </div>
  );
}

type CodeGroupHeaderProps = {
  title?: string;
  filename?: string;
  hasTabs?: boolean;
  children: React.ReactNode;
  selectedIndex?: number;
};

export function CodeGroupHeader({
  title,
  filename,
  children,
  hasTabs,
  selectedIndex,
}: CodeGroupHeaderProps) {
  const heading = title || filename;

  if (!heading && !hasTabs) {
    return null;
  }

  return (
    <div
      className={`
      flex min-h-[calc(theme(spacing.10)+1px)] flex-wrap items-center gap-x-4
      rounded-t-md border-b border-b-subtle bg-surfaceBase px-4 text-basis
      `}
    >
      {heading && (
        <div
          className={clsx(
            "mr-auto text-xs font-semibold text-basis",
            !!filename && "font-mono"
          )}
        >
          {filename ? <code>{heading}</code> : heading}
        </div>
      )}
      {hasTabs && (
        <Tab.List className="-mb-px flex gap-4 text-xs font-medium">
          {Children.map<ReactNode, any>(children, (child, childIndex) => (
            <Tab
              className={clsx(
                "border-b py-3 transition focus:outline-none",
                childIndex === selectedIndex
                  ? "border-breeze-500 text-breeze-400"
                  : "border-transparent text-basis hover:text-breeze-300"
              )}
            >
              {getPanelTitle(child.props)}
            </Tab>
          ))}
        </Tab.List>
      )}
    </div>
  );
}

function CodeGroupPanels({ hasTabs, children, ...props }) {
  if (hasTabs) {
    return (
      <TabPanels>
        {Children.map(children, (child) => (
          <TabPanel>
            <CodePanel {...props}>{child}</CodePanel>
          </TabPanel>
        ))}
      </TabPanels>
    );
  }

  return <CodePanel {...props}>{children}</CodePanel>;
}

function usePreventLayoutShift() {
  let positionRef = useRef<HTMLElement>(null);
  let rafRef = useRef<number>(null);

  useEffect(() => {
    return () => {
      window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return {
    positionRef,
    preventLayoutShift(callback) {
      let initialTop = positionRef.current?.getBoundingClientRect().top;

      callback();

      rafRef.current = window.requestAnimationFrame(() => {
        let newTop = positionRef.current?.getBoundingClientRect().top;
        window.scrollBy(0, newTop - initialTop);
      });
    },
  };
}

type PreferredLanguageStore = {
  preferredLanguages: string[];
  addPreferredLanguage: (string) => void;
};
const usePreferredLanguageStore = create<PreferredLanguageStore>((set) => ({
  preferredLanguages: [],
  addPreferredLanguage: (language) =>
    set((state) => ({
      preferredLanguages: [
        ...state.preferredLanguages.filter(
          (preferredLanguage) => preferredLanguage !== language
        ),
        language,
      ],
    })),
}));

function useTabGroupProps(availableLanguages) {
  let { preferredLanguages, addPreferredLanguage } =
    usePreferredLanguageStore();
  let [selectedIndex, setSelectedIndex] = useState(0);
  let activeLanguage = [...availableLanguages].sort(
    (a, z) => preferredLanguages.indexOf(z) - preferredLanguages.indexOf(a)
  )[0];
  let languageIndex = availableLanguages.indexOf(activeLanguage);
  let newSelectedIndex = languageIndex === -1 ? selectedIndex : languageIndex;
  if (newSelectedIndex !== selectedIndex) {
    setSelectedIndex(newSelectedIndex);
  }

  let { positionRef, preventLayoutShift } = usePreventLayoutShift();

  return {
    as: "div",
    ref: positionRef,
    selectedIndex,
    onChange: (newSelectedIndex) => {
      preventLayoutShift(() =>
        addPreferredLanguage(availableLanguages[newSelectedIndex])
      );
    },
  };
}

function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  return hasMounted;
}

const SDK_UNSUPPORTED_LABELS: Record<SDKLanguage, string> = {
  typescript: "TypeScript",
  python: "Python",
  go: "Go",
};

/**
 * A code tab for an SDK that doesn't support the feature yet. Use inside a
 * `<CodeGroup>` so readers who picked that SDK in the nav see an explicit
 * note instead of silently falling back to another language:
 *
 *   <SdkUnsupported title="Go" feature="Deferred work" />
 */
export function SdkUnsupported({
  title,
  sdk,
  feature,
  children,
}: {
  /** Tab title. Must be the SDK name ("Go", "Python") so nav matching works. */
  title: string;
  sdk?: SDKLanguage;
  /** Feature name, used in the default copy. */
  feature?: string;
  /** Optional replacement copy, e.g. a suggested workaround. */
  children?: React.ReactNode;
}) {
  const sdkId: SDKLanguage =
    sdk ?? GUIDE_KEY_TO_SDK[title?.toLowerCase()] ?? "typescript";
  const label = SDK_UNSUPPORTED_LABELS[sdkId];
  return (
    <div className="px-6 py-5 text-sm leading-6 text-subtle">
      <p className="m-0 font-medium text-basis">
        {feature ? `${feature} isn't` : "This isn't"} available in the {label}{" "}
        SDK yet.
      </p>
      {children ? (
        <div className="mt-2 [&_a]:text-breeze-600 dark:[&_a]:text-breeze-300 [&_p]:m-0">
          {children}
        </div>
      ) : (
        <p className="m-0 mt-2">
          Select another language to see the example, or{" "}
          <a
            className="text-breeze-600 hover:text-breeze-500 dark:text-breeze-300"
            href={`https://github.com/inngest/${
              sdkId === "go" ? "inngestgo" : sdkId === "python" ? "inngest-py" : "inngest-js"
            }/issues`}
            target="_blank"
            rel="noreferrer"
          >
            tell us you need it
          </a>
          .
        </p>
      )}
    </div>
  );
}

function isUnsupportedChild(child: unknown): boolean {
  return (
    React.isValidElement(child) &&
    (child.type === SdkUnsupported ||
      (child.props as { mdxType?: string })?.mdxType === "SdkUnsupported")
  );
}

const CodeGroupContext = createContext(false);

type CodeGroupProps = {
  title?: string;
  filename?: string;
  forceTabs?: boolean;
  children: React.ReactNode;
};

export function CodeGroup({
  children,
  title,
  filename,
  forceTabs,
  ...props
}: CodeGroupProps) {
  const languages = Children.map<string, any>(children, (child) =>
    getPanelTitle(child.props)
  );
  const [currentLanguage] = useLocalStorage("currentLanguage", null);
  const { language: storeLanguage, setLanguage } = useLanguageStore();
  // The language store is persisted in localStorage and rehydrates
  // synchronously on the client, so the first client render can disagree with
  // the server-rendered TypeScript tab. React doesn't patch attribute
  // mismatches during hydration, which left the TypeScript tab selected on
  // page load. Render the server default until mounted, then switch to the
  // language chosen in the nav.
  const hasMounted = useHasMounted();
  const globalLanguage: SDKLanguage = hasMounted ? storeLanguage : "typescript";
  const { preferredLanguages, addPreferredLanguage } =
    usePreferredLanguageStore();
  const { positionRef, preventLayoutShift } = usePreventLayoutShift();

  const hasTabs = forceTabs || Children.count(children) > 1;
  const Container: typeof Tab["Group"] | "div" = hasTabs ? Tab.Group : "div";

  // Compute selected index based on global language first, then preferences
  const computedIndex = useMemo(() => {
    const childrenList = Children.toArray(children) as React.ReactElement<{
      title?: string;
      language?: string;
    }>[];
    // Match on the rendered tab title, which falls back to the code block's
    // language (e.g. a ```go block without a title renders as "Go").
    const panelTitles = childrenList.map((child) =>
      String(getPanelTitle(child.props ?? {})).toLowerCase()
    );

    // First priority: match global language
    const matchingKeys = SDK_TO_GUIDE_KEY[globalLanguage] || [];
    const globalMatchIndex = panelTitles.findIndex((title) =>
      matchingKeys.includes(title)
    );
    if (globalMatchIndex !== -1) {
      // If the reader's language doesn't support this feature, show a working
      // example instead: prefer TypeScript, then the first supported tab. The
      // "not available" tab stays visible for readers who click it.
      if (isUnsupportedChild(childrenList[globalMatchIndex])) {
        const isSupported = (i: number) => !isUnsupportedChild(childrenList[i]);
        const tsIndex = panelTitles.findIndex(
          (title, i) =>
            SDK_TO_GUIDE_KEY.typescript.includes(title) && isSupported(i)
        );
        if (tsIndex !== -1) return tsIndex;
        const firstSupported = childrenList.findIndex((_, i) => isSupported(i));
        return firstSupported !== -1 ? firstSupported : globalMatchIndex;
      }
      return globalMatchIndex;
    }

    // Before mount, always render the first tab so SSR and hydration agree.
    if (!hasMounted) {
      return 0;
    }

    // Second priority: localStorage currentLanguage
    if (currentLanguage) {
      const localStorageIndex = panelTitles.findIndex(
        (title) => title === currentLanguage
      );
      if (localStorageIndex !== -1) {
        return localStorageIndex;
      }
    }

    // Third priority: preferred languages from code tab selection
    const activeLanguage = [...languages].sort(
      (a, z) => preferredLanguages.indexOf(z) - preferredLanguages.indexOf(a)
    )[0];
    const preferredIndex = languages.indexOf(activeLanguage);
    return preferredIndex !== -1 ? preferredIndex : 0;
  }, [
    globalLanguage,
    hasMounted,
    currentLanguage,
    children,
    languages,
    preferredLanguages,
  ]);

  // Clicking an unsupported tab shows its note locally without changing the
  // reader's global language (which would bounce every code group back to
  // TypeScript). Any later language change clears the override.
  const [manualIndex, setManualIndex] = useState<number | null>(null);
  useEffect(() => {
    setManualIndex(null);
  }, [globalLanguage]);
  const selectedIndex = manualIndex ?? computedIndex;

  const handleChange = (newSelectedIndex: number) => {
    const childrenList = Children.toArray(children);
    if (isUnsupportedChild(childrenList[newSelectedIndex])) {
      setManualIndex(newSelectedIndex);
      return;
    }
    setManualIndex(null);
    const selectedTitle = languages[newSelectedIndex];
    // A tab's title (e.g. "Go", "Python") may map to a global SDK language.
    // When it does, update the global language store, which is the top-priority
    // signal for `selectedIndex` — otherwise the tab would immediately snap back
    // to whatever the global language already is. Also keep the per-group
    // preference in sync for code groups whose tabs aren't SDK languages.
    const sdkLanguage = GUIDE_KEY_TO_SDK[selectedTitle?.toLowerCase()];
    preventLayoutShift(() => {
      addPreferredLanguage(selectedTitle);
      if (sdkLanguage) {
        setLanguage(sdkLanguage);
      }
    });
  };

  const headerProps = hasTabs ? { selectedIndex } : {};

  // Use separate rendering paths to avoid type issues
  if (hasTabs) {
    return (
      <CodeGroupContext.Provider value={true}>
        <TabGroup
          as="div"
          ref={positionRef as React.Ref<HTMLDivElement>}
          selectedIndex={selectedIndex}
          onChange={handleChange}
          className="not-prose relative my-6 overflow-hidden rounded-md border border-subtle"
        >
          <CodeGroupHeader
            title={title}
            filename={filename}
            hasTabs={hasTabs}
            {...headerProps}
          >
            {children}
          </CodeGroupHeader>
          <CodeGroupPanels hasTabs={hasTabs} {...props}>
            {children}
          </CodeGroupPanels>
        </TabGroup>
      </CodeGroupContext.Provider>
    );
  }

  return (
    <CodeGroupContext.Provider value={true}>
      <div className="not-prose relative my-6 overflow-hidden rounded-md border border-subtle">
        <CodeGroupHeader title={title} filename={filename} hasTabs={false}>
          {children}
        </CodeGroupHeader>
        <CodeGroupPanels hasTabs={false} {...props}>
          {children}
        </CodeGroupPanels>
      </div>
    </CodeGroupContext.Provider>
  );
}

export function Code({ children, ...props }) {
  let isGrouped = useContext(CodeGroupContext);

  if (isGrouped) {
    return <code {...props} dangerouslySetInnerHTML={{ __html: children }} />;
  }

  return <code {...props}>{children}</code>;
}

export function Pre({ children, ...props }) {
  let isGrouped = useContext(CodeGroupContext);

  if (isGrouped) {
    return children;
  }

  return <CodeGroup {...props}>{children}</CodeGroup>;
}

type GuideOption = {
  key: string;
  title: string;
};

const GuideSelectorContext = createContext<{
  selected: string;
  options: GuideOption[];
}>(null);

// Map language keys to SDKLanguage
const GUIDE_KEY_TO_SDK: Record<string, SDKLanguage> = {
  typescript: "typescript",
  javascript: "typescript",
  "typescript-middleware": "typescript",
  ts: "typescript",
  python: "python",
  py: "python",
  go: "go",
};

const SDK_TO_GUIDE_KEY: Record<SDKLanguage, string[]> = {
  typescript: ["typescript", "ts", "typescript-middleware", "javascript"],
  python: ["python", "py"],
  go: ["go"],
};

export function GuideSelector({
  children,
  options = [],
}: {
  children: React.ReactNode;
  options: GuideOption[];
}) {
  const router = useRouter();
  const searchParamKey = "guide";
  const [localStorageCurrentLanguage, setLocalStorageCurrentLanguage] =
    useLocalStorage("currentLanguage", null);
  const searchParams = useSearchParams();
  const qsCurrentLanguage = searchParams.get(searchParamKey);

  const [selected, setSelected] = useState<string>(options[0].key);
  const [defaultSelected, setDefaultSelected] = useState<string>(
    options[0].key
  );

  // infer the default selected from the url or local storage
  useEffect(() => {
    if (
      options.find((o) => o.key === qsCurrentLanguage) &&
      Boolean(qsCurrentLanguage) &&
      qsCurrentLanguage !== selected
    ) {
      setSelected(qsCurrentLanguage);
      setDefaultSelected(qsCurrentLanguage);
    } else if (
      !qsCurrentLanguage &&
      // if no url param, fallback to local storage
      localStorageCurrentLanguage &&
      options.find((o) => o.key === localStorageCurrentLanguage)
    ) {
      setSelected(localStorageCurrentLanguage);
      setDefaultSelected(localStorageCurrentLanguage);
    }
  }, [qsCurrentLanguage]);

  const onChange = (newSelectedIndex) => {
    const newSelectedKey = options[newSelectedIndex].key;
    setLocalStorageCurrentLanguage(newSelectedKey);
    setSelected(newSelectedKey);
    const url = new URL(router.asPath, window.location.origin);
    url.searchParams.set(searchParamKey, newSelectedKey);
    // Replace the URL state and do use shallow to avoid refresh
    router.replace(url.toString(), null, { shallow: true, scroll: false });
  };

  return (
    <GuideSelectorContext.Provider value={{ selected, options }}>
      <TabGroup
        onChange={onChange}
        // the below fixes an old bug where the default index was not set
        defaultIndex={options.findIndex((o) => o.key === defaultSelected)}
        selectedIndex={options.findIndex((o) => o.key === selected)}
      >
        <TabList className="-mb-px flex gap-4 text-sm font-medium">
          {options.map((option, idx) => (
            <Tab
              key={`tab-${idx}`}
              className={clsx(
                "border-b py-3 transition focus:outline-none",
                option.key === selected
                  ? "border-breeze-500 text-breeze-700 dark:border-breeze-300 dark:text-breeze-300"
                  : "border-transparent text-slate-600 hover:text-breeze-600 dark:text-slate-400 dark:hover:text-breeze-300"
              )}
            >
              {option.title}
            </Tab>
          ))}
        </TabList>
      </TabGroup>
      {children}
    </GuideSelectorContext.Provider>
  );
}

export function GuideSection({
  children,
  show,
}: {
  children: React.ReactNode;
  show: string;
}) {
  let context = useContext(GuideSelectorContext);
  if (show === context.selected) {
    return <>{children}</>;
  }
  return null;
}

export function GuideTitle() {
  const context = useContext(GuideSelectorContext);
  const selectedOption = context.options.find(
    (o) => o.key === context.selected
  );
  return <>{selectedOption?.title}</>;
}

// --- LanguageSelector (SDK language-aware, no inline Tab UI) ---

const LanguageSelectorContext = createContext<{
  selected: string;
  options: GuideOption[];
}>(null);

export function LanguageSelector({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParamKey = "guide";
  const [localStorageCurrentLanguage] = useLocalStorage(
    "currentLanguage",
    null
  );
  const searchParams = useSearchParams();
  const qsCurrentLanguage = searchParams.get(searchParamKey);

  // Get the global language store
  const { language: globalLanguage, setLanguage: setGlobalLanguage } =
    useLanguageStore();

  // Derive available options from LanguageSection children's `show` props
  const options = useMemo(() => {
    const keys: string[] = [];
    Children.forEach(children, (child) => {
      if (React.isValidElement<{ show?: string }>(child) && child.props.show) {
        keys.push(child.props.show);
      }
    });
    return keys.map((key) => {
      const sdkLang = SDK_LANGUAGES.find((l) => l.id === key);
      return { key, title: sdkLang?.title ?? key };
    });
  }, [children]);

  const [selected, setSelected] = useState<string>(
    options[0]?.key ?? SDK_LANGUAGES[0].id
  );

  // Sync with global language store when it changes
  useEffect(() => {
    if (options.length === 0) return;

    // If URL has a guide param, prioritize that
    if (
      options.find((o) => o.key === qsCurrentLanguage) &&
      Boolean(qsCurrentLanguage) &&
      qsCurrentLanguage !== selected
    ) {
      setSelected(qsCurrentLanguage);
      // Also sync to global store
      const sdkLang = GUIDE_KEY_TO_SDK[qsCurrentLanguage.toLowerCase()];
      if (sdkLang) {
        setGlobalLanguage(sdkLang);
      }
      return;
    }

    // Try to match global language to available options
    const matchingKeys = SDK_TO_GUIDE_KEY[globalLanguage] || [];
    const matchingOption = options.find((o) =>
      matchingKeys.includes(o.key.toLowerCase())
    );
    if (matchingOption && matchingOption.key !== selected) {
      setSelected(matchingOption.key);
      // Update URL to reflect the change
      const url = new URL(router.asPath, window.location.origin);
      url.searchParams.set(searchParamKey, matchingOption.key);
      router.replace(url.toString(), null, { shallow: true, scroll: false });
    } else if (
      !qsCurrentLanguage &&
      !matchingOption &&
      // if no url param and no global match, fallback to local storage
      localStorageCurrentLanguage &&
      options.find((o) => o.key === localStorageCurrentLanguage)
    ) {
      setSelected(localStorageCurrentLanguage);
    }
  }, [
    qsCurrentLanguage,
    globalLanguage,
    options,
    router,
    selected,
    localStorageCurrentLanguage,
    setGlobalLanguage,
    searchParamKey,
  ]);

  return (
    <LanguageSelectorContext.Provider value={{ selected, options }}>
      {children}
    </LanguageSelectorContext.Provider>
  );
}

export function LanguageSection({
  children,
  show,
}: {
  children: React.ReactNode;
  show: string;
}) {
  let context = useContext(LanguageSelectorContext);
  if (show === context.selected) {
    return <>{children}</>;
  }
  return null;
}

export function LanguageTitle() {
  const context = useContext(LanguageSelectorContext);
  const selectedOption = context.options.find(
    (o) => o.key === context.selected
  );
  return <>{selectedOption?.title}</>;
}
