"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import SocialQuoteCard from "@/components/v1/sections/shared/SocialQuote";
import {
  SingleSelectDropdown,
} from "@/components/v1/sections/shared/FilterDropdowns";
import {
  COMMUNITY_SOURCE_FILTERS,
  COMMUNITY_TOPIC_FILTERS,
  matchesSourceFilter,
  matchesTopicFilter,
  sortCommunityQuotes,
  type CommunitySort,
  type CommunityTopicFilterId,
} from "@/components/v1/sections/Community/communityFilters";
import { type SocialQuote, type SocialQuoteSource } from "@/data/socialQuotes";
import { cn } from "@/utils/v1/cn";
import { reveals } from "@/utils/v1/reveals";

const SORT_OPTIONS: { value: CommunitySort; label: string }[] = [
  { value: "latest", label: "Latest" },
  { value: "oldest", label: "Oldest" },
];

const triggerClassName =
  "group/dd inline-flex items-center gap-2 font-v1Body text-[16px] font-normal normal-case tracking-normal leading-6 text-white motion-safe:transition-colors hover:text-v1-accent-salmon";

interface CommunityQuotesExplorerProps {
  quotes: SocialQuote[];
  featuredIds: string[];
}

export default function CommunityQuotesExplorer({
  quotes,
  featuredIds,
}: CommunityQuotesExplorerProps) {
  const [topic, setTopic] = useState<CommunityTopicFilterId>("all");
  const [source, setSource] = useState<"all" | SocialQuoteSource>("all");
  const [sort, setSort] = useState<CommunitySort>("latest");

  const featuredSet = useMemo(() => new Set(featuredIds), [featuredIds]);

  const pool = useMemo(
    () => quotes.filter((q) => !featuredSet.has(q.id)),
    [quotes, featuredSet],
  );

  const filtered = useMemo(() => {
    const matched = pool.filter(
      (q) => matchesTopicFilter(q, topic) && matchesSourceFilter(q, source),
    );
    return sortCommunityQuotes(matched, sort);
  }, [pool, topic, source, sort]);

  const activeFilters =
    topic !== "all" || source !== "all";

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <p className="font-v1Mono text-[12px] uppercase tracking-[0.08em] text-v1-frost/60">
            {filtered.length === pool.length
              ? `${pool.length} quotes`
              : `Showing ${filtered.length} of ${pool.length}`}
            {activeFilters ? " · filtered" : null}
          </p>
          <SingleSelectDropdown<CommunitySort>
            label="Sort by"
            trailing="arrowDropDown"
            value={sort}
            onChange={setSort}
            options={SORT_OPTIONS}
            align="right"
            triggerClassName={triggerClassName}
            iconClassName="h-6 w-6"
          />
        </div>

        <div className="flex flex-col gap-4">
          <div
            className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="tablist"
            aria-label="Filter by topic"
          >
            {COMMUNITY_TOPIC_FILTERS.map((filter) => {
              const active = topic === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTopic(filter.id)}
                  className={cn(
                    "shrink-0 rounded-full border px-4 py-2 font-v1Mono text-[12px] uppercase tracking-[0.06em] motion-safe:transition-colors",
                    active
                      ? "border-v1-accent-salmon bg-v1-accent-salmon/10 text-v1-accent-salmon"
                      : "border-v1-carbon-300/40 text-v1-frost/70 hover:border-v1-frost/30 hover:text-v1-frost",
                  )}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            <SingleSelectDropdown<"all" | SocialQuoteSource>
              label="Source"
              trailing="filter"
              value={source}
              onChange={setSource}
              options={COMMUNITY_SOURCE_FILTERS.map((f) => ({
                value: f.id,
                label: f.label,
              }))}
              triggerClassName={triggerClassName}
              iconClassName="h-6 w-6"
            />
            {activeFilters ? (
              <button
                type="button"
                onClick={() => {
                  setTopic("all");
                  setSource("all");
                }}
                className="font-v1Body text-[14px] text-v1-frost/60 underline decoration-v1-frost/30 underline-offset-4 hover:text-v1-accent-salmon hover:decoration-v1-accent-salmon"
              >
                Clear filters
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="font-v1Mono text-[14px] uppercase text-v1-frost/60">
          No quotes match these filters.
        </p>
      ) : (
        <ul className="grid list-none grid-cols-1 gap-6 pl-0 md:grid-cols-2 lg:gap-8">
          {filtered.map((quote, i) => (
            <motion.li
              key={quote.id}
              layout
              {...reveals.item(i % 6)}
              className="list-none"
            >
              <SocialQuoteCard quote={quote} refTag="community" />
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}
