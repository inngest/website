import {
  createContext,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/router";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import clsx from "clsx";

import { useIsInsideMobileNavigation } from "./MobileNavigation";
import { useMobileNavigationStore } from "./MobileNavigation";

interface SearchDocument {
  id: number;
  title: string;
  description: string;
  content: string;
  url: string;
  section: string;
  headings: string[];
}

interface SearchResult {
  id: number;
  title: string;
  description: string;
  url: string;
  section: string;
  snippet: string;
  score: number;
}

// Global state for documents
let documents: SearchDocument[] = [];
let indexLoaded = false;

async function loadSearchIndex(): Promise<void> {
  if (indexLoaded) return;

  try {
    const response = await fetch("/search-index.json");
    documents = await response.json();
    indexLoaded = true;
  } catch (error) {
    console.error("Failed to load search index:", error);
  }
}

// Scoring weights for different match locations
const SCORE_WEIGHTS = {
  title: 100,
  headings: 50,
  description: 25,
  content: 10,
};

function scoreDocument(doc: SearchDocument, query: string): number {
  const lowerQuery = query.toLowerCase();
  let score = 0;

  // Title match (highest priority)
  if (doc.title.toLowerCase().includes(lowerQuery)) {
    score += SCORE_WEIGHTS.title;
    // Bonus for exact match or starts with
    if (doc.title.toLowerCase().startsWith(lowerQuery)) {
      score += 50;
    }
    if (doc.title.toLowerCase() === lowerQuery) {
      score += 100;
    }
  }

  // Headings match
  for (const heading of doc.headings) {
    if (heading.toLowerCase().includes(lowerQuery)) {
      score += SCORE_WEIGHTS.headings;
      break; // Only count once
    }
  }

  // Description match
  if (doc.description.toLowerCase().includes(lowerQuery)) {
    score += SCORE_WEIGHTS.description;
  }

  // Content match
  if (doc.content.toLowerCase().includes(lowerQuery)) {
    score += SCORE_WEIGHTS.content;
    // Count occurrences (up to 5 bonus points)
    const matches = doc.content.toLowerCase().split(lowerQuery).length - 1;
    score += Math.min(matches, 5);
  }

  return score;
}

function createSnippet(content: string, query: string): string {
  const lowerContent = content.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerContent.indexOf(lowerQuery);

  if (index === -1) {
    return content.slice(0, 150) + "...";
  }

  const start = Math.max(0, index - 50);
  const end = Math.min(content.length, index + query.length + 100);

  let snippet = content.slice(start, end);
  if (start > 0) snippet = "..." + snippet;
  if (end < content.length) snippet = snippet + "...";

  return snippet;
}

function highlightMatch(text: string, query: string): string {
  if (!query) return text;

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  return text.replace(
    regex,
    '<mark class="bg-transparent text-breeze-600 dark:text-breeze-300 font-medium">$1</mark>'
  );
}

async function performSearch(query: string): Promise<SearchResult[]> {
  if (!query || query.length < 2) return [];

  await loadSearchIndex();

  // Score all documents
  const scoredDocs = documents
    .map((doc) => ({
      doc,
      score: scoreDocument(doc, query),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  return scoredDocs.map(({ doc, score }) => ({
    id: doc.id,
    title: doc.title,
    description: doc.description,
    url: doc.url,
    section: doc.section,
    snippet: createSnippet(doc.content, query),
    score,
  }));
}

function SearchIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12.01 12a4.25 4.25 0 1 0-6.02-6 4.25 4.25 0 0 0 6.02 6Zm0 0 3.24 3.25"
      />
    </svg>
  );
}

function NoResultsIcon(props: React.ComponentPropsWithoutRef<"svg">) {
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

function LoadingIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <circle cx="10" cy="10" r="5.5" strokeLinejoin="round" />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.5 10a5.5 5.5 0 1 0-5.5 5.5"
      />
    </svg>
  );
}

function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="group relative flex h-12">
      <SearchIcon className="pointer-events-none absolute left-3 top-0 h-full w-5 stroke-slate-500" />
      <input
        ref={inputRef}
        className={clsx(
          "flex-auto appearance-none bg-transparent pl-10 text-slate-900 outline-none placeholder:text-slate-500 focus:w-full focus:flex-none dark:text-white sm:text-sm",
          "[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden [&::-webkit-search-results-button]:hidden [&::-webkit-search-results-decoration]:hidden"
        )}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search documentation..."
        type="search"
        aria-label="Search documentation"
      />
      <kbd className="hidden sm:flex items-center gap-1 px-2 text-xs text-slate-400">
        <kbd className="font-sans">Esc</kbd>
      </kbd>
    </div>
  );
}

function SearchResultItem({
  result,
  query,
  isSelected,
  onClick,
}: {
  result: SearchResult;
  query: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <li
      className={clsx(
        "group cursor-pointer rounded-lg px-4 py-3 transition-colors",
        isSelected
          ? "bg-slate-100 dark:bg-slate-800"
          : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
        <span>{result.section}</span>
      </div>
      <h3
        className="text-sm font-medium text-slate-900 dark:text-white"
        dangerouslySetInnerHTML={{ __html: highlightMatch(result.title, query) }}
      />
      {result.description && (
        <p
          className="mt-1 text-xs text-slate-600 dark:text-slate-400 line-clamp-1"
          dangerouslySetInnerHTML={{
            __html: highlightMatch(result.description, query),
          }}
        />
      )}
      <p
        className="mt-1 text-xs text-slate-500 dark:text-slate-500 line-clamp-2"
        dangerouslySetInnerHTML={{ __html: highlightMatch(result.snippet, query) }}
      />
    </li>
  );
}

function SearchResults({
  results,
  query,
  isLoading,
  selectedIndex,
  onSelect,
}: {
  results: SearchResult[];
  query: string;
  isLoading: boolean;
  selectedIndex: number;
  onSelect: (url: string) => void;
}) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingIcon className="h-6 w-6 animate-spin stroke-slate-400" />
      </div>
    );
  }

  if (query.length > 0 && results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-500 dark:text-slate-400">
        <NoResultsIcon className="h-8 w-8 stroke-current mb-3" />
        <p className="text-sm">No results found for "{query}"</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-500 dark:text-slate-400">
        <SearchIcon className="h-8 w-8 stroke-current mb-3" />
        <p className="text-sm">Start typing to search...</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-slate-100 dark:divide-slate-800">
      {results.map((result, index) => (
        <SearchResultItem
          key={result.id}
          result={result}
          query={query}
          isSelected={index === selectedIndex}
          onClick={() => onSelect(result.url)}
        />
      ))}
    </ul>
  );
}

function SearchDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Debounced search
  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    const timeoutId = setTimeout(async () => {
      const searchResults = await performSearch(query);
      setResults(searchResults);
      setIsLoading(false);
      setSelectedIndex(0);
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelect = useCallback(
    (url: string) => {
      router.push(url);
      onClose();
      setQuery("");
    },
    [router, onClose]
  );

  // Keyboard navigation for arrow keys and enter
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault();
        handleSelect(results[selectedIndex].url);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, results, selectedIndex, handleSelect]);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
    }
  }, [open]);

  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={onClose} className="fixed inset-0 z-50">
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto px-4 py-4 sm:py-20 sm:px-6 md:py-32 lg:px-8 lg:py-[15vh]">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="mx-auto max-w-xl transform divide-y divide-slate-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-slate-900/10 dark:divide-slate-800 dark:bg-slate-900 dark:ring-slate-800">
              <SearchInput value={query} onChange={setQuery} />
              <div className="max-h-[60vh] overflow-y-auto">
                <SearchResults
                  results={results}
                  query={query}
                  isLoading={isLoading}
                  selectedIndex={selectedIndex}
                  onSelect={handleSelect}
                />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}

// =============================================================================
// GLOBAL SEARCH STATE - Single listener to prevent duplicates
// =============================================================================

interface SearchContextType {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const SearchContext = createContext<SearchContextType | null>(null);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  // Single global CMD+K listener
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <SearchContext.Provider
      value={{
        open,
        onOpen: () => setOpen(true),
        onClose: () => setOpen(false),
      }}
    >
      {children}
      <SearchDialog open={open} onClose={() => setOpen(false)} />
    </SearchContext.Provider>
  );
}

function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    // Fallback for when not wrapped in provider
    const [open, setOpen] = useState(false);
    return {
      open,
      onOpen: () => setOpen(true),
      onClose: () => setOpen(false),
      hasProvider: false,
    };
  }
  return { ...context, hasProvider: true };
}

// =============================================================================
// EXPORTED COMPONENTS
// =============================================================================

export function FlexSearch() {
  const { onOpen, hasProvider } = useSearch();
  const [localOpen, setLocalOpen] = useState(false);
  const isInsideMobileNavigation = useIsInsideMobileNavigation();
  const { close: closeMobileNav } = useMobileNavigationStore();

  // Local CMD+K listener only if no provider
  useEffect(() => {
    if (hasProvider) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setLocalOpen(true);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [hasProvider]);

  const handleOpen = () => {
    if (isInsideMobileNavigation) {
      closeMobileNav();
    }
    if (hasProvider) {
      onOpen();
    } else {
      setLocalOpen(true);
    }
  };

  return (
    <>
      <button
        type="button"
        className="group flex h-6 w-6 items-center justify-center sm:justify-start md:h-auto md:w-80 md:flex-none md:rounded-lg md:py-2.5 md:pl-4 md:pr-3.5 md:text-sm md:ring-1 md:ring-slate-200 md:hover:ring-slate-300 dark:md:bg-slate-800/75 dark:md:ring-inset dark:md:ring-white/5 dark:md:hover:bg-slate-700/40 dark:md:hover:ring-slate-500 lg:w-96"
        onClick={handleOpen}
      >
        <SearchIcon className="h-5 w-5 flex-none fill-slate-400 group-hover:fill-slate-500 dark:fill-slate-500 md:group-hover:fill-slate-400" />
        <span className="sr-only md:not-sr-only md:ml-2 md:text-slate-500 md:dark:text-slate-400">
          Search...
        </span>
        <kbd className="ml-auto hidden font-medium text-slate-400 dark:text-slate-500 md:block">
          <kbd className="font-sans">⌘</kbd>
          <kbd className="font-sans">K</kbd>
        </kbd>
      </button>
      {!hasProvider && (
        <SearchDialog open={localOpen} onClose={() => setLocalOpen(false)} />
      )}
    </>
  );
}

export function FlexMobileSearch() {
  const { onOpen, hasProvider } = useSearch();
  const [localOpen, setLocalOpen] = useState(false);
  const { close: closeMobileNav } = useMobileNavigationStore();

  const handleOpen = () => {
    closeMobileNav();
    if (hasProvider) {
      onOpen();
    } else {
      setLocalOpen(true);
    }
  };

  return (
    <div className="block lg:hidden flex-auto mb-4">
      <button
        type="button"
        className="flex w-full items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
        onClick={handleOpen}
      >
        <SearchIcon className="h-5 w-5" />
        <span>Search...</span>
      </button>
      {!hasProvider && (
        <SearchDialog open={localOpen} onClose={() => setLocalOpen(false)} />
      )}
    </div>
  );
}

export function FlexHeaderSearchIcon() {
  const { onOpen, hasProvider } = useSearch();
  const [localOpen, setLocalOpen] = useState(false);

  const handleOpen = () => {
    if (hasProvider) {
      onOpen();
    } else {
      setLocalOpen(true);
    }
  };

  return (
    <>
      <button
        type="button"
        className="flex h-6 w-6 items-center justify-center rounded-md transition hover:bg-slate-900/5 dark:hover:bg-white/5"
        aria-label="Search documentation"
        onClick={handleOpen}
      >
        <SearchIcon className="h-5 w-5 stroke-slate-900 dark:stroke-white" />
      </button>
      {!hasProvider && (
        <SearchDialog open={localOpen} onClose={() => setLocalOpen(false)} />
      )}
    </>
  );
}
