import { type MDXFileMetadata } from "src/utils/markdown";

export type BlogPost = {
  heading: string;
  subtitle: string;
  author?: string;
  image: string;
  date: string;
  humanDate: string;
  tags?: string[];
  hide?: boolean;
} & MDXFileMetadata;

// Slug -> Formatted title
export const BLOG_CATEGORIES = {
  "product-updates": "Product updates",
  "company-news": "Company news",
  engineering: "Engineering",
};
