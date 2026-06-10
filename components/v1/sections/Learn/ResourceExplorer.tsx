"use client";

import {
  MultiSelectDropdown,
  SingleSelectDropdown,
} from "@/components/v1/sections/shared/FilterDropdowns";
import ResourceCard from "@/components/v1/sections/Learn/ResourceCard";
import { RESOURCE_TYPES, SORT_OPTIONS } from "@/components/v1/sections/Learn/data";
import { useLearnFilters } from "@/components/v1/sections/Learn/useLearnFilters";
import type { PostCard, SortKey } from "@/components/v1/sections/Learn/types";

// Filter triggers render as Body/Lg (CircularXX 18/27, sentence case,
// not the uppercase-mono default); Sort By is Body/Small (16/24). 8px
// label→icon gap, 24px icons, salmon on hover.
const FILTER_TRIGGER =
  "group/dd inline-flex items-center gap-2 text-v1-body-lg text-v1-frost motion-safe:transition-colors hover:text-v1-accent-salmon";
const SORT_TRIGGER =
  "group/dd inline-flex items-center gap-2 text-v1-body-sm text-v1-frost motion-safe:transition-colors hover:text-v1-accent-salmon";

export default function ResourceExplorer({ posts }: { posts: PostCard[] }) {
  const {
    search,
    setSearch,
    resourceTypes,
    setResourceTypes,
    topic,
    setTopic,
    sort,
    setSort,
    allTopics,
    filtered,
  } = useLearnFilters(posts);

  return (
    // max-w-[1440px] + px-6/sm:px-8 matches the AI page sections.
    <section className="relative mx-auto w-full max-w-[1440px] px-6 pb-[100px] pt-[110px] text-v1-frost sm:px-8 sm:pb-[120px] sm:pt-[130px] lg:pb-[182px] lg:pt-40">
      {/* Display/Md: Whyte Inktrap 80px, leading 1.25, tracking
          -0.01em, uppercase, white. text-v1-display-sm carries the
          cross-browser cap-trim; size/leading are overridden to the
          Display/Md spec and clamp down on mobile (same pattern as the
          Sales/Contact form heroes). */}
      <h1 className="text-center font-v1Display text-v1-display-sm uppercase leading-[1.25] tracking-[-0.01em] text-white [font-size:clamp(2.75rem,7.5vw,5rem)] lg:whitespace-nowrap">
        Resources
      </h1>

      <label className="relative mx-auto mt-[42px] flex h-[56px] w-full max-w-[700px] items-center gap-[10px] rounded-[4px] border border-solid border-v1-strong/35 bg-v1-surfaceBase p-4 focus-within:border-v1-frost/30">
        <span className="sr-only">
          Search articles, videos, demos, and more
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none shrink-0 text-v1-frost/50"
        >
          <SearchIcon />
        </span>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search articles, videos, demos, and more"
          className="h-full w-full min-w-0 bg-transparent font-v1Body text-[16px] leading-[24px] text-v1-frost outline-none placeholder:text-v1-frost/50"
        />
      </label>

      <div className="mt-20 flex flex-wrap items-center justify-between gap-y-4 py-6 sm:mt-24 lg:mt-[110px]">
        <div className="flex items-center gap-5 sm:gap-[44px]">
          <MultiSelectDropdown
            label="Resource Type"
            trailing="arrowWide"
            triggerClassName={FILTER_TRIGGER}
            iconVariant="large"
            values={resourceTypes}
            onChange={(v) => setResourceTypes(v as PostCard["type"][])}
            allValue="ALL"
            options={RESOURCE_TYPES.map((t) => ({
              value: t,
              label: t === "ALL" ? "All" : t,
            }))}
          />
          <div className="hidden min-[380px]:block">
            <SingleSelectDropdown
              label="Topics"
              trailing="filter"
              triggerClassName={FILTER_TRIGGER}
              iconVariant="large"
              value={topic}
              onChange={setTopic}
              options={allTopics.map((t) => ({
                value: t,
                label: t === "ALL" ? "All" : t,
              }))}
            />
          </div>
        </div>
        <SingleSelectDropdown
          label="Sort By"
          trailing="arrowDropDown"
          triggerClassName={SORT_TRIGGER}
          iconVariant="large"
          value={sort}
          onChange={(v) => setSort(v as SortKey)}
          options={SORT_OPTIONS.map((s) => ({
            value: s.key,
            label: s.label,
          }))}
          align="right"
        />
      </div>

      <ul className="grid list-none grid-cols-1 gap-5 pl-0 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <li key={p.slug} className="list-none">
            <ResourceCard post={p} />
          </li>
        ))}
      </ul>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-v1-frost/55">
          No content matches your filters.
        </p>
      ) : null}
    </section>
  );
}

// lucide/search at 24px.
function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
