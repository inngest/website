import type { PostCard, SortKey } from "@/components/v1/sections/Learn/types";

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "date-desc", label: "Newest first" },
  { key: "date-asc", label: "Oldest first" },
  { key: "title-asc", label: "A → Z" },
];

export const RESOURCE_TYPES: ("ALL" | PostCard["type"])[] = [
  "ALL",
  "BLOG",
  "REPORT",
  "VIDEO",
  "DEMO",
];
