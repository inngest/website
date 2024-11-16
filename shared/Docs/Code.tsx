"use client";

import React, {
  Children,
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/router";
import { Tab } from "@headlessui/react";
import clsx from "clsx";
import create from "zustand";

import { Tag } from "./Tag";

const languageNames = {
  js: "JavaScript",
  ts: "TypeScript",
  javascript: "JavaScript",
  typescript: "TypeScript",
  php: "PHP",
  python: "Python",
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
        "absolute top-1.5 right-1.5 overflow-hidden rounded-md py-1 px-2 text-xs font-medium border border-muted",
        "bg-surfaceBase hover:bg-canvasSubtle hover:border-contrast"
      )}
      onClick={() => {
        window.navigator.clipboard.writeText(code).then(() => {
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
      className={`flex h-10 px-4 items-center gap-2
        border-b border-b-subtle rounded-t-md
        bg-surfaceBase
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
      {/* Uses absolute positioning for now with CodeGroup container */}
      <CopyButton code={child.props.code ?? code} />
      <div>
        <pre className="overflow-x-auto px-6 py-5 text-xs text-basis leading-relaxed">
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
      px-4 flex min-h-[calc(theme(spacing.10)+1px)] flex-wrap items-center gap-x-4
      bg-surfaceBase rounded-t-md
      border-b border-b-subtle rounded-t-md
      text-basis
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
                  ? "border-breeze-500 text-link"
                  : "border-transparent text-basis hover:text-link"
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
      <Tab.Panels>
        {Children.map(children, (child) => (
          <Tab.Panel>
            <CodePanel {...props}>{child}</CodePanel>
          </Tab.Panel>
        ))}
      </Tab.Panels>
    );
  }

  return <CodePanel {...props}>{children}</CodePanel>;
}

function usePreventLayoutShift() {
  let positionRef = useRef<HTMLElement>();
  let rafRef = useRef<number>();

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
        let newTop = positionRef.current.getBoundingClientRect().top;
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
  let languages = Children.map<string, any>(children, (child) =>
    getPanelTitle(child.props)
  );
  let tabGroupProps = useTabGroupProps(languages);
  let hasTabs = forceTabs || Children.count(children) > 1;
  let Container: typeof Tab["Group"] | "div" = hasTabs ? Tab.Group : "div";
  let containerProps = hasTabs ? tabGroupProps : {};
  let headerProps = hasTabs
    ? { selectedIndex: tabGroupProps.selectedIndex }
    : {};

  return (
    <CodeGroupContext.Provider value={true}>
      <Container
        {...containerProps}
        // relative used for absolute positioning of CopyButton
        className="not-prose my-6 overflow-hidden rounded-md border border-subtle relative"
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
      </Container>
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

export function GuideSelector({
  children,
  options = [],
}: {
  children: React.ReactNode;
  options: GuideOption[];
}) {
  const router = useRouter();
  const searchParamKey = "guide";
  const [selected, setSelected] = useState<string>(options[0].key);

  useEffect(() => {
    const urlSelected = Array.isArray(router.query[searchParamKey])
      ? router.query[searchParamKey][0]
      : router.query[searchParamKey];
    const isValidOption = options.find((o) => o.key === urlSelected);
    if (isValidOption && Boolean(urlSelected) && urlSelected !== selected) {
      setSelected(urlSelected);
    }
  }, [router, selected]);

  const onChange = (newSelectedIndex) => {
    const newSelectedKey = options[newSelectedIndex].key;
    setSelected(newSelectedKey);
    const url = new URL(router.asPath, window.location.origin);
    url.searchParams.set(searchParamKey, newSelectedKey);
    // Replace the URL state and do use shallow to avoid refresh
    router.replace(url.toString(), null, { shallow: true, scroll: false });
  };

  return (
    <GuideSelectorContext.Provider value={{ selected, options }}>
      <Tab.Group onChange={onChange}>
        <Tab.List className="-mb-px flex gap-4 text-sm font-medium">
          {options.map((option, idx) => (
            <Tab
              key={idx}
              className={clsx(
                "border-b py-3 transition focus:outline-none",
                option.key === selected
                  ? "border-breeze-500 text-breeze-700 dark:text-breeze-300 dark:border-breeze-300"
                  : "border-transparent text-slate-600 hover:text-breeze-600 dark:text-slate-400 dark:hover:text-breeze-300"
              )}
            >
              {option.title}
            </Tab>
          ))}
        </Tab.List>
      </Tab.Group>
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
