"use client";

import { useMemo, useState } from "react";
import type { PostCard, SortKey } from "@/components/v1/sections/Learn/types";

// Owns the resource-explorer search/filter/sort state and derives the
// visible, sorted post list plus the topic options. Kept out of the view
// so ResourceExplorer stays presentational.
export function useLearnFilters(posts: PostCard[]) {
  const [search, setSearch] = useState("");
  // Empty array = "All". Otherwise the set of specific types to show.
  const [resourceTypes, setResourceTypes] = useState<PostCard["type"][]>([]);
  const [topic, setTopic] = useState<"ALL" | string>("ALL");
  const [sort, setSort] = useState<SortKey>("date-desc");

  const allTopics = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return ["ALL", ...Array.from(set).sort()];
  }, [posts]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return posts
      .filter((p) => {
        if (resourceTypes.length > 0 && !resourceTypes.includes(p.type))
          return false;
        if (topic !== "ALL" && !p.tags.includes(topic)) return false;
        if (q) {
          const haystack = `${p.title} ${p.subtitle} ${p.tags.join(" ")}`.toLowerCase();
          if (!haystack.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sort === "title-asc") return a.title.localeCompare(b.title);
        const aT = a.date ? new Date(a.date).getTime() : 0;
        const bT = b.date ? new Date(b.date).getTime() : 0;
        return sort === "date-asc" ? aT - bT : bT - aT;
      });
  }, [posts, search, resourceTypes, topic, sort]);

  return {
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
  };
}
