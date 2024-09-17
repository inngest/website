import {
  forwardRef,
  Fragment,
  MutableRefObject,
  ReactElement,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/router";
import {
  createAutocomplete,
  AutocompleteApi,
} from "@algolia/autocomplete-core";
import { getAlgoliaResults } from "@algolia/autocomplete-preset-algolia";
import { Dialog, Transition } from "@headlessui/react";
import algoliasearch from "algoliasearch/lite";
import clsx from "clsx";

import PythonIcon from "src/shared/Icons/Python";
import TypeScriptIcon from "src/shared/Icons/TypeScript";

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_DOCSEARCH_APP_ID,
  process.env.NEXT_PUBLIC_DOCSEARCH_API_KEY
);

type AutocompleteItem = {
  url: string;
  query: string;
  [key: string]: any;
};
type AutocompleteState = {
  status?: string;
  isOpen?: boolean;
  query?: string;
  collections?: any[];
};

function useAutocomplete() {
  let id = useId();
  let router = useRouter();
  let [autocompleteState, setAutocompleteState] = useState<AutocompleteState>(
    {}
  );

  let [autocomplete] = useState(() =>
    createAutocomplete<AutocompleteItem>({
      id,
      placeholder: "Find something...",
      defaultActiveItemId: 0,
      onStateChange({ state }) {
        setAutocompleteState(state);
      },
      shouldPanelOpen({ state }) {
        return state.query !== "";
      },
      navigator: {
        navigate({ itemUrl }) {
          autocomplete.setIsOpen(true);
          router.push(itemUrl);
        },
      },
      getSources() {
        return [
          {
            sourceId: "documentation",
            getItemInputValue({ item }) {
              return item.query;
            },
            getItemUrl({ item }) {
              let url = new URL(item.url);
              return `${url.pathname}${url.hash}`;
            },
            onSelect({ itemUrl }) {
              router.push(itemUrl);
            },
            getItems({ query }) {
              return getAlgoliaResults({
                searchClient,
                queries: [
                  {
                    query,
                    indexName: process.env.NEXT_PUBLIC_DOCSEARCH_INDEX_NAME,
                    params: {
                      hitsPerPage: 6,
                      highlightPreTag:
                        '<mark class="underline bg-transparent text-breeze-600 dark:text-breeze-300">',
                      highlightPostTag: "</mark>",
                    },
                  },
                ],
              });
            },
          },
        ];
      },
    })
  );

  return { autocomplete, autocompleteState };
}

type Result = {
  type: string;
  hierarchy: {
    [key: string]: any;
  };
  _highlightResult: {
    hierarchy: {
      [key: string]: any;
    };
  };
};

function resolveResult(result: Result): {
  titleHtml: string;
  hierarchyHtml: string[];
} {
  let allLevels = Object.keys(result.hierarchy);
  let hierarchy = Object.entries(result._highlightResult.hierarchy).filter(
    ([, { value }]) => Boolean(value)
  );
  let levels = hierarchy.map(([level]) => level);

  let level =
    result.type === "content"
      ? levels.pop()
      : levels
          .filter(
            (level) =>
              allLevels.indexOf(level) <= allLevels.indexOf(result.type)
          )
          .pop();

  return {
    titleHtml: result._highlightResult.hierarchy[level].value,
    hierarchyHtml: hierarchy
      .slice(0, levels.indexOf(level))
      .map(([, { value }]) => value),
  };
}

function SearchIcon(props) {
  return (
    <svg
      {...props}
      width="19"
      height="18"
      viewBox="0 0 19 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.5131 12.1165L16.4041 15.0068L15.449 15.9619L12.5586 13.0709C11.4832 13.933 10.1455 14.402 8.76714 14.4C5.41374 14.4 2.69214 11.6784 2.69214 8.325C2.69214 4.9716 5.41374 2.25 8.76714 2.25C12.1205 2.25 14.8421 4.9716 14.8421 8.325C14.8441 9.70335 14.3752 11.041 13.5131 12.1165ZM12.159 11.6156C13.0157 10.7347 13.4941 9.55379 13.4921 8.325C13.4921 5.7141 11.3774 3.6 8.76714 3.6C6.15624 3.6 4.04214 5.7141 4.04214 8.325C4.04214 10.9352 6.15624 13.05 8.76714 13.05C9.99593 13.0519 11.1768 12.5735 12.0578 11.7169L12.159 11.6156Z"
        strokeWidth={0}
        className="fill-carbon-700 dark:fill-carbon-400 stroke-carbon-700 dark:stroke-carbon-400"
      />
    </svg>
  );
}

function NoResultsIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12.01 12a4.237 4.237 0 0 0 1.24-3c0-.62-.132-1.207-.37-1.738M12.01 12A4.237 4.237 0 0 1 9 13.25c-.635 0-1.237-.14-1.777-.388M12.01 12l3.24 3.25m-3.715-9.661a4.25 4.25 0 0 0-5.975 5.908M4.5 15.5l11-11"
      />
    </svg>
  );
}

function LoadingIcon(props) {
  let id = useId();

  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <circle cx="10" cy="10" r="5.5" strokeLinejoin="round" />
      <path
        stroke={`url(#${id})`}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.5 10a5.5 5.5 0 1 0-5.5 5.5"
      />
      <defs>
        <linearGradient
          id={id}
          x1="13"
          x2="9.5"
          y1="9"
          y2="15"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="currentColor" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function getSDKLanguage(result): string | null {
  switch (result.sdkLanguage) {
    case "typescript":
      return "TypeScript";
    case "python":
      return "Python";
    default:
      return null;
  }
}
function getSDKLanguageIcon(result): React.ElementType | null {
  switch (result.sdkLanguage) {
    case "typescript":
      return TypeScriptIcon;
    case "python":
      return PythonIcon;
    default:
      return null;
  }
}

function SearchResult({ result, resultIndex, autocomplete }) {
  let id = useId();
  let { titleHtml, hierarchyHtml } = resolveResult(result);

  const sdkLanguage = getSDKLanguage(result);
  const SdkLanguageIcon = getSDKLanguageIcon(result);

  return (
    <li
      className={clsx(
        "group block relative cursor-default px-4 py-3 aria-selected:bg-breeze-0 dark:aria-selected:bg-carbon-800",
        resultIndex > 0 && "border-t border-carbon-100 dark:border-carbon-800"
      )}
      aria-labelledby={`${id}-hierarchy ${id}-title`}
      {...autocomplete.getItemProps({
        item: result,
      })}
    >
      <div
        id={`${id}-title`}
        aria-hidden="true"
        className="text-sm font-medium text-carbon-900 group-aria-selected:text-breeze-600 dark:group-aria-selected:text-breeze-300 dark:text-white"
        dangerouslySetInnerHTML={{ __html: titleHtml }}
      />
      {SdkLanguageIcon && (
        <span className="absolute px-1.5 top-3 right-2">
          <SdkLanguageIcon className="w-5 h-5 text-carbon-400" size={6} />
        </span>
      )}

      {result?._snippetResult?.content?.matchLevel === "full" ? (
        <div
          id={`${id}-snippet`}
          aria-hidden="true"
          className="mt-1 truncate whitespace-nowrap text-2xs text-carbon-500"
          dangerouslySetInnerHTML={{
            __html: result?._snippetResult?.content?.value,
          }}
        />
      ) : (
        hierarchyHtml.length > 0 && (
          <div
            id={`${id}-hierarchy`}
            aria-hidden="true"
            className="mt-1 truncate whitespace-nowrap text-2xs text-carbon-500"
          >
            {hierarchyHtml.map((item, itemIndex, items) => (
              <Fragment key={itemIndex}>
                <span dangerouslySetInnerHTML={{ __html: item }} />
                <span
                  className={
                    itemIndex === items.length - 1
                      ? "sr-only"
                      : "mx-2 text-breeze-600 dark:text-breeze-300"
                  }
                >
                  /
                </span>
              </Fragment>
            ))}
          </div>
        )
      )}
    </li>
  );
}

function SearchResults({ autocomplete, query, results }) {
  if (results.length === 0) {
    return (
      <div className="p-6 text-center">
        <NoResultsIcon className="mx-auto h-5 w-5 stroke-carbon-900 dark:stroke-carbon-600" />
        <p className="mt-2 text-xs text-carbon-700 dark:text-carbon-400">
          Nothing found for{" "}
          <strong className="break-words font-semibold text-carbon-900 dark:text-white">
            &lsquo;{query}&rsquo;
          </strong>
          . Please try again.
        </p>
      </div>
    );
  }

  return (
    <ul role="list" {...autocomplete.getListProps()}>
      {results.map((result, resultIndex) => (
        <SearchResult
          key={result.objectID}
          result={result}
          resultIndex={resultIndex}
          autocomplete={autocomplete}
        />
      ))}
    </ul>
  );
}

type SearchInputProps = {
  autocomplete: AutocompleteApi<
    AutocompleteItem,
    Event,
    MouseEvent,
    KeyboardEvent
  >;
  autocompleteState: AutocompleteState;
  onClose: () => void;
};

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput(
    { autocomplete, autocompleteState, onClose }: SearchInputProps,
    inputRef
  ) {
    // Modified to fix ts
    let inputProps = autocomplete.getInputProps({} as any);

    return (
      <div className="group relative flex h-12">
        <SearchIcon className="pointer-events-none absolute left-3 top-0 h-full w-5 stroke-slate-500" />
        {/* @ts-ignore */}
        <input
          ref={inputRef}
          className={clsx(
            "flex-auto appearance-none bg-transparent pl-10 text-slate-900 outline-none placeholder:text-carbon-600 focus:w-full focus:flex-none dark:text-white sm:text-sm [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden [&::-webkit-search-results-button]:hidden [&::-webkit-search-results-decoration]:hidden",
            autocompleteState.status === "stalled" ? "pr-11" : "pr-4"
          )}
          {...inputProps}
          onKeyDown={(event) => {
            if (
              event.key === "Escape" &&
              !autocompleteState.isOpen &&
              autocompleteState.query === ""
            ) {
              onClose();
            } else {
              // @ts-ignore
              inputProps.onKeyDown(event);
            }
          }}
        />
        {autocompleteState.status === "stalled" && (
          <div className="absolute inset-y-0 right-3 flex items-center">
            <LoadingIcon className="h-5 w-5 animate-spin stroke-slate-200 text-slate-900 dark:stroke-slate-800 dark:text-breeze-400" />
          </div>
        )}
      </div>
    );
  }
);

function SearchDialog({
  open,
  setOpen,
  className,
  enableShortcutKey,
}: SearchDialogProps) {
  let router = useRouter();
  let formRef = useRef();
  let panelRef = useRef();
  let inputRef = useRef<HTMLInputElement>();
  let { autocomplete, autocompleteState } = useAutocomplete();

  useEffect(() => {
    if (!open) {
      return;
    }

    function onRouteChange() {
      setOpen(false);
    }

    router.events.on("routeChangeStart", onRouteChange);
    router.events.on("hashChangeStart", onRouteChange);

    return () => {
      router.events.off("routeChangeStart", onRouteChange);
      router.events.off("hashChangeStart", onRouteChange);
    };
  }, [open, setOpen, router]);

  useEffect(() => {
    if (open || enableShortcutKey === false) {
      return;
    }

    function onKeyDown(event) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen(true);
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, setOpen, enableShortcutKey]);

  function onClose(open) {
    setOpen(open);
  }

  // Remove duplicate results at the top
  const filteredResults = autocompleteState.collections?.[0]?.items.reduce(
    (results, item) => {
      // Find any existing results that for the same URL and Level heirarchy
      const existing = results.find(
        (result) => result.url_without_anchor === item.url_without_anchor
      );
      // ex. "lvl1"
      if (existing && existing.type === item.type) {
        return results;
      }
      return [...results, item];
    },
    []
  );

  return (
    <Transition.Root
      show={open}
      as={Fragment}
      afterLeave={() => autocomplete.setQuery("")}
    >
      <Dialog
        onClose={onClose}
        className={clsx("fixed inset-0 z-50", className)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-carbon-400/40 backdrop-blur-sm dark:bg-black/40" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto px-4 py-4 sm:py-20 sm:px-6 md:py-32 lg:px-8 lg:py-[15vh]">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto overflow-hidden rounded-lg bg-carbon-50 shadow-xl ring-1 ring-carbon-900/7.5 dark:bg-carbon-900 dark:ring-carbon-800 sm:max-w-xl">
              <div {...autocomplete.getRootProps({})}>
                {/* @ts-ignore */}
                <form
                  ref={formRef}
                  {...autocomplete.getFormProps({
                    inputElement: inputRef.current,
                  })}
                >
                  <SearchInput
                    ref={inputRef}
                    autocomplete={autocomplete}
                    autocompleteState={autocompleteState}
                    onClose={() => setOpen(false)}
                  />
                  {/* @ts-ignore */}
                  <div
                    ref={panelRef}
                    className="border-t border-slate-200 bg-white empty:hidden dark:border-slate-100/5 dark:bg-white/2.5"
                    {...autocomplete.getPanelProps({})}
                  >
                    {autocompleteState.isOpen && (
                      <>
                        <SearchResults
                          autocomplete={autocomplete}
                          query={autocompleteState.query}
                          results={filteredResults}
                        />
                      </>
                    )}
                  </div>
                </form>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

type SearchButtonProps = {
  ref: MutableRefObject<HTMLButtonElement>;
  onClick: () => void;
};
type SearchDialogProps = {
  open: boolean;
  setOpen: (boolean) => void;
  className?: string;
  enableShortcutKey?: boolean;
};
type SearchProps = {
  buttonProps: SearchButtonProps;
  dialogProps: SearchDialogProps;
};

function useSearchProps(): SearchProps {
  let buttonRef = useRef<HTMLButtonElement>();
  let [open, setOpen] = useState(false);

  return {
    buttonProps: {
      ref: buttonRef,
      onClick() {
        setOpen(true);
      },
    },
    dialogProps: {
      open,
      setOpen(newOpenState) {
        setOpen(newOpenState);
      },
    },
  };
}

function SearchButton({ shortcutKey = null, ...buttonProps }) {
  return (
    <button
      type="button"
      className="flex h-8 w-full items-center gap-2 rounded bg-white pl-2 pr-3 text-sm text-carbon-300 ring-1 ring-carbon-200 transition hover:ring-carbon-300 dark:bg-white/5 dark:text-carbon-600 dark:ring-inset hover:dark:ring-carbon-600 dark:ring-carbon-700 dark:hover:carbon-300 focus:outline-none"
      {...buttonProps}
    >
      <SearchIcon className="h-5 w-5" />
      Search...
      {shortcutKey ? (
        <kbd className="ml-auto text-xs font-sans text-carbon-600 dark:text-carbon-100 ring-1 ring-carbon-200 transition dark:bg-white/5 dark:ring-inset dark:ring-carbon-700">
          {shortcutKey}
        </kbd>
      ) : null}
    </button>
  );
}

/* Search input button in desktop mode */
export function Search() {
  let [shortcutKey, setShortcutKey] = useState<string>();
  let { buttonProps, dialogProps } = useSearchProps();

  useEffect(() => {
    setShortcutKey(
      /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform) ? "⌘K" : "Ctrl+K"
    );
  }, []);

  return (
    <div className="hidden lg:block lg:max-w-sm lg:flex-auto">
      <SearchButton {...buttonProps} shortcutKey={shortcutKey} />
      <SearchDialog
        className="hidden lg:block"
        enableShortcutKey={true}
        {...dialogProps}
      />
    </div>
  );
}

/* Search input button in mobile sidebar */
export function MobileSearch() {
  let { buttonProps, dialogProps } = useSearchProps();
  return (
    <div className="block lg:hidden flex-auto mb-4">
      <SearchButton {...buttonProps} />
      <SearchDialog
        className="block"
        enableShortcutKey={false}
        {...dialogProps}
      />
    </div>
  );
}

/* Search icon */
export function HeaderSearchIcon() {
  let { buttonProps, dialogProps } = useSearchProps();

  return (
    <div className="contents lg:hidden">
      <button
        type="button"
        className="flex h-6 w-6 items-center justify-center rounded-md transition hover:bg-carbon-900/5 dark:hover:bg-white/5 lg:hidden focus:[&:not(:focus-visible)]:outline-none"
        aria-label="Find something..."
        {...buttonProps}
      >
        <SearchIcon className="h-5 w-5 stroke-slate-900 dark:stroke-white" />
      </button>
      <SearchDialog className="lg:hidden" {...dialogProps} />
    </div>
  );
}
