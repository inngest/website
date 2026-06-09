export interface PostCard {
  slug: string;
  type: "BLOG" | "REPORT" | "VIDEO" | "DEMO";
  title: string;
  subtitle: string;
  date: string | null;
  tags: string[];
  image: string | null;
  /** Pre-formatted MM/DD/YYYY for the card meta. */
  prettyDate: string;
}

export type SortKey = "date-desc" | "date-asc" | "title-asc";
