"use client";

import { useMemo, useState } from "react";
import EventCard from "@/components/v1/sections/Events/EventCard";
import {
  ALL_EVENTS,
  LOCATIONS,
  SORTS,
  TOPICS,
  sortEventsByDate,
  type Sort,
} from "@/components/v1/sections/Events/data";
import {
  MultiSelectDropdown,
  SingleSelectDropdown,
} from "@/components/v1/sections/shared/FilterDropdowns";

export default function AllEvents() {
  const [locations, setLocations] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [sort, setSort] = useState<Sort>("DATE");

  // Empty selection list === "ALL" (treat as no filter applied).
  const filtered = useMemo(() => {
    const filteredByLocation = ALL_EVENTS.filter((e) =>
      locations.length === 0 ? true : locations.includes(e.location),
    );
    const filteredByTopic = filteredByLocation.filter((e) =>
      topics.length === 0
        ? true
        : e.topics.some((t) => topics.includes(t)),
    );
    const sorted = [...filteredByTopic];
    if (sort === "ALPHABETICAL") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      return sorted;
    }
    return sortEventsByDate(sorted);
  }, [locations, topics, sort]);

  // Filter triggers render at Body/Lg (18px CircularXX regular, mixed
  // case) for Location/Topics and Body/Small (16px, line-height 24) for
  // Sort By. The shared dropdown primitive defaults to a small uppercase
  // Label style, so override.
  const triggerBase =
    "group/dd inline-flex items-center gap-2 font-v1Body font-normal normal-case tracking-normal text-white motion-safe:transition-colors hover:text-v1-accent-salmon";
  const filterTrigger = `${triggerBase} text-[18px] leading-[1.5]`;
  const sortTrigger = `${triggerBase} text-[16px] leading-6`;

  return (
    <section
      aria-labelledby="all-events-heading"
      className="relative mx-auto w-full max-w-[1280px] px-6 pb-20 text-v1-frost sm:px-9 sm:pb-[120px] lg:px-8 lg:pb-40"
    >
      <div className="flex flex-col gap-8">
        <h2
          id="all-events-heading"
          // Heading/Md — 32px Whyte regular, leading 40, tracking -0.32px.
          className="font-v1Heading text-[32px] font-normal leading-[40px] tracking-[-0.32px] text-white"
        >
          All Events
        </h2>

        <div className="isolate flex flex-col gap-6">
          {/* Filter row — no chrome. Location + Topics on the left
              (gap-44px), Sort By pinned to the right. */}
          <div className="z-[2] flex flex-wrap items-center justify-between gap-y-4">
            <div className="flex flex-wrap items-center gap-x-11 gap-y-4">
              <MultiSelectDropdown
                label="Location"
                trailing="arrowWide"
                values={locations}
                onChange={setLocations}
                // An "All" toggle is pinned at the top — the dropdown
                // primitive treats this value as a clear-all.
                allValue="__ALL__"
                options={[
                  { value: "__ALL__", label: "All" },
                  ...LOCATIONS.map((l) => ({ value: l, label: l })),
                ]}
                triggerClassName={filterTrigger}
                iconClassName="h-6 w-6"
                panelVariant="events"
              />
              <MultiSelectDropdown
                label="Type"
                trailing="filter"
                values={topics}
                onChange={setTopics}
                allValue="__ALL__"
                options={[
                  { value: "__ALL__", label: "All" },
                  ...TOPICS.map((t) => ({
                    value: t,
                    label: t,
                  })),
                ]}
                triggerClassName={filterTrigger}
                iconClassName="h-6 w-6"
                panelVariant="events"
              />
            </div>
            <SingleSelectDropdown<Sort>
              label="Sort By"
              trailing="arrowDropDown"
              value={sort}
              onChange={setSort}
              options={SORTS.map((s) => ({ value: s, label: s }))}
              align="right"
              triggerClassName={sortTrigger}
              iconClassName="h-6 w-6"
            />
          </div>

          {/* Grid — 3 cols at lg, 2 at sm, 1 at base. */}
          <ul className="z-[1] grid list-none grid-cols-1 gap-6 pl-0 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((ev) => (
              <li key={ev.id} className="list-none">
                <EventCard ev={ev} newTab={ev.href.startsWith("http")} />
              </li>
            ))}
          </ul>
          {filtered.length === 0 && (
            <p className="mt-6 text-center text-[14px] text-v1-frost/55">
              No events match your filters.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
