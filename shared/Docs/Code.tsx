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
import { useLanguageStore, type SDKLanguage } from "./LanguageStore";

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

function getPanelTitle({ title, language }) {
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

function CopyButton({ code }) {
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
  let child = Children.only<any>(children);

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

function CodeGroupHeader({
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
        <h3
          className={clsx(
            "mr-auto text-xs font-semibold text-basis",
            !!filename && "font-mono"
          )}
        >
          {filename ? <code>{heading}</code> : heading}
        </h3>
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
  const { language: globalLanguage } = useLanguageStore();
  const { preferredLanguages, addPreferredLanguage } = usePreferredLanguageStore();
  const { positionRef, preventLayoutShift } = usePreventLayoutShift();
  
  const hasTabs = forceTabs || Children.count(children) > 1;
  const Container: typeof Tab["Group"] | "div" = hasTabs ? Tab.Group : "div";

  // Compute selected index based on global language first, then preferences
  const selectedIndex = useMemo(() => {
    const childrenList: React.ReactElement<{ title: string }>[] =
      Children.toArray(children) as React.ReactElement<{ title: string }>[];
    
    // First priority: match global language
    const matchingKeys = SDK_TO_GUIDE_KEY[globalLanguage] || [];
    const globalMatchIndex = childrenList.findIndex((child) =>
      matchingKeys.some((key) => child.props?.title?.toLowerCase() === key)
    );
    if (globalMatchIndex !== -1) {
      return globalMatchIndex;
    }
    
    // Second priority: localStorage currentLanguage
    if (currentLanguage) {
      const localStorageIndex = childrenList.findIndex(
        (child) => child.props?.title?.toLowerCase() === currentLanguage
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
  }, [globalLanguage, currentLanguage, children, languages, preferredLanguages]);

  const handleChange = (newSelectedIndex: number) => {
    preventLayoutShift(() =>
      addPreferredLanguage(languages[newSelectedIndex])
    );
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
        <CodeGroupHeader
          title={title}
          filename={filename}
          hasTabs={false}
        >
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

// Map GuideSelector keys to SDKLanguage
const GUIDE_KEY_TO_SDK: Record<string, SDKLanguage> = {
  typescript: "typescript",
  ts: "typescript",
  python: "python",
  py: "python",
  go: "go",
};

const SDK_TO_GUIDE_KEY: Record<SDKLanguage, string[]> = {
  typescript: ["typescript", "ts"],
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
  
  // Get the global language store
  const { language: globalLanguage, setLanguage: setGlobalLanguage } = useLanguageStore();

  const [selected, setSelected] = useState<string>(options[0].key);

  // Sync with global language store when it changes
  useEffect(() => {
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
  }, [qsCurrentLanguage, globalLanguage, options, router, selected, localStorageCurrentLanguage, setGlobalLanguage, searchParamKey]);

  // The Tab.List UI is intentionally hidden since there's now a global 
  // language selector in the sidebar navigation. The GuideSelector still
  // manages the selected state for GuideSection children.
  return (
    <GuideSelectorContext.Provider value={{ selected, options }}>
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
