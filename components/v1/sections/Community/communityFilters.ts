import { type SocialQuote, type SocialQuoteSource } from "@/data/socialQuotes";

/** High-level topic buckets for the community filter bar. */
export const COMMUNITY_TOPIC_FILTERS = [
  { id: "all", label: "All topics" },
  {
    id: "ai",
    label: "AI & agents",
    tags: ["ai", "agents", "rag"],
  },
  {
    id: "background-jobs",
    label: "Background jobs",
    tags: ["background-jobs", "queues", "bullmq"],
  },
  { id: "temporal", label: "vs Temporal", tags: ["temporal"] },
  { id: "observability", label: "Observability", tags: ["observability"] },
  { id: "vercel", label: "Vercel & serverless", tags: ["vercel"] },
  {
    id: "durable-execution",
    label: "Durable execution",
    tags: ["durable-execution"],
  },
  {
    id: "self-host",
    label: "Self-hosting",
    tags: ["self-host", "trigger-dev"],
  },
] as const;

export type CommunityTopicFilterId =
  (typeof COMMUNITY_TOPIC_FILTERS)[number]["id"];

export const COMMUNITY_SOURCE_FILTERS: {
  id: "all" | SocialQuoteSource;
  label: string;
}[] = [
  { id: "all", label: "All sources" },
  { id: "x", label: "X" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "reddit", label: "Reddit" },
];

export type CommunitySort = "latest" | "oldest";

export function matchesTopicFilter(
  quote: SocialQuote,
  topicId: CommunityTopicFilterId,
): boolean {
  if (topicId === "all") return true;
  const bucket = COMMUNITY_TOPIC_FILTERS.find((f) => f.id === topicId);
  if (!bucket || !("tags" in bucket)) return true;
  return bucket.tags.some((tag) => quote.tags.includes(tag));
}

export function matchesSourceFilter(
  quote: SocialQuote,
  sourceId: "all" | SocialQuoteSource,
): boolean {
  if (sourceId === "all") return true;
  return quote.source === sourceId;
}

export function sortCommunityQuotes(
  quotes: SocialQuote[],
  sort: CommunitySort,
): SocialQuote[] {
  const sorted = [...quotes].sort((a, b) => {
    const aTime = new Date(a.sortDate ?? a.date).getTime();
    const bTime = new Date(b.sortDate ?? b.date).getTime();
    return bTime - aTime;
  });
  return sort === "latest" ? sorted : sorted.reverse();
}
