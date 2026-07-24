// Shared shapes for the customer-story template. Built server-side in
// app/customers/_story.tsx from content/customers/{slug}.mdx frontmatter
// and consumed by the CustomerStory section components.

export interface CustomerStoryData {
  tag: string;
  title: string;
  author?: string;
  readTime?: string;
  portrait?: string;
  pullQuote?: string;
  pullQuoteAuthor?: string;
  pullQuoteRole?: string;
  // Info card
  brandLogo: string;
  brandLogoAlt: string;
  cardHeadline: string;
  brandSiteLabel?: string;
  brandSiteHref?: string;
  meta: { key: string; value: string }[];
}

export interface RelatedStory {
  logo: string;
  logoAlt: string;
  logoHeight?: number;
  tags: string[];
  title: string;
  body: string;
  href: string;
}
