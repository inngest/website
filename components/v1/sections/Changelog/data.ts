import { type ContentMenuGroup } from "@/components/v1/ContentMenu";
import {
  loadMarkdownFilesMetadata,
  type MDXFileMetadata,
} from "src/utils/markdown";
import { loadPost, type ChangelogEntry } from "@/app/changelog/helpers";

// A changelog entry's directory metadata, plus the `metadata`/`Content`
// fields hydrated from its MDX module (loosely typed via the index
// signature on MDXFileMetadata, as the page relied on before).
export type ChangelogItem = ChangelogEntry & MDXFileMetadata;

// Each entry's <article> carries this DOM id; the left content menu
// links/scroll-spies against the same ids.
export const entryId = (slug: string) => `changelog-${slug}`;

// Load every changelog entry, hydrate its MDX content, and return them
// newest-first.
export async function loadChangelogEntries(): Promise<ChangelogItem[]> {
  const data = await loadMarkdownFilesMetadata<ChangelogEntry>(
    "content/changelog"
  );

  // Hydrate each entry's MDX module in parallel — these are independent
  // dynamic imports, so awaiting them in series would be an O(n) waterfall.
  await Promise.all(
    data.map(async (item) => {
      const { Post, metadata } = await loadPost(item.slug);
      item.metadata = metadata;
      item.Content = Post;
    })
  );

  // Newest-first; subtracting timestamps keeps equal dates stable (a plain
  // ?-1:1 comparator never returns 0, so same-day entries could reorder).
  return data.sort(
    (a, b) =>
      new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()
  );
}

// Group the menu by month ("May 2026"), newest first, mirroring the entry
// order. `T00:00:00` forces a local-time parse of the YYYY-MM-DD dates so
// an entry never slips into the previous month in negative timezones.
// Entries are already sorted by date desc, so same-month entries are
// contiguous and a single pass buckets them correctly.
export function buildMenuGroups(
  entries: ChangelogItem[]
): ContentMenuGroup[] {
  const monthLabel = (date: string) =>
    new Date(
      date.length === 10 ? `${date}T00:00:00` : date
    ).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const menuGroups: ContentMenuGroup[] = [];
  for (const item of entries) {
    const label = monthLabel(item.metadata.date);
    const entry = { id: entryId(item.slug), text: item.metadata.title };
    const last = menuGroups[menuGroups.length - 1];
    if (last && last.label === label) {
      last.items.push(entry);
    } else {
      menuGroups.push({
        id: `changelog-month-${label.toLowerCase().replace(/\s+/g, "-")}`,
        label,
        items: [entry],
      });
    }
  }
  return menuGroups;
}
