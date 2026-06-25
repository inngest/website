export interface PostCard {
  slug: string;
  type: "BLOG" | "REPORT" | "VIDEO" | "DEMO";
  title: string;
  subtitle: string;
  date: string | null;
  tags: string[];
  image: string | null;
  /** When set, the card links here instead of /blog/[slug] (e.g. customer stories). */
  href?: string;
  /** Pre-formatted MM/DD/YYYY for the card meta. */
  prettyDate: string;
}

export type SortKey = "date-desc" | "date-asc" | "title-asc";
