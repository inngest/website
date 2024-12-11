import { type MDXFileMetadata } from "src/utils/markdown";

// Slug -> Formatted title
export const BLOG_CATEGORIES = {
  "product-updates": "Product updates",
  "company-news": "Company news",
  engineering: "Engineering",
} as const;
type BlogCategory = keyof typeof BLOG_CATEGORIES;

// Front-matter for blog posts
export type BlogPost = {
  heading: string;
  subtitle: string;
  author?: string;
  image: string;
  date: string;
  humanDate: string;
  tags?: string[];

  // CTAs
  floatingCTA?: boolean;
  primaryCTA?: "sales" | "docs";

  // When true, the post will be the highlighted post on the main feed
  focus?: boolean;
  // When hidden, the post will be available on at the URL, but not in any blog feed of RSS
  hide?: boolean;
  // When featured is false, post will be hidden from main feed, but available on category pages
  featured?: boolean;
  // When included, the post will be included on the category feed
  category: BlogCategory;

  // Content gates
  teaser?: string[];
};

export type MDXBlogPost = BlogPost & MDXFileMetadata;
