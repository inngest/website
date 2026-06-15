import "server-only";
import fs from "node:fs";
import path from "node:path";
import { cache } from "react";

import type { Metadata } from "next";
import matter from "gray-matter";
import readingTime from "reading-time";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { serialize } from "next-mdx-remote/serialize";

import CustomerStory, {
  type CustomerStoryData,
  type RelatedStory,
} from "@/components/v1/pages/CustomerStory";
import {
  STORIES,
  STORY_HREF,
  LOGO_HEIGHT,
} from "@/components/v1/sections/Customers/data";

// Shared customer-story content layer. Reads content/customers/{slug}.mdx
// and exposes the helpers used by the dynamic /customers/[slug] route to
// render the v1 CustomerStory.

const DIR = path.join(process.cwd(), "content/customers");

type Quote = {
  text?: string;
  attribution?: { name?: string; title?: string };
  avatar?: string;
};

export type Frontmatter = {
  title: string;
  companyName: string;
  logo: string;
  logoScale?: number;
  quote?: Quote;
  companyDescription: string;
  companyURL?: string;
  companyEmployees?: string;
  companyIndustry?: string;
  companyUseCase?: string;
  ogImage?: string;
};

export const listCustomerSlugs = cache((): string[] => {
  try {
    return fs
      .readdirSync(DIR)
      .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
      .map((f) => f.replace(/\.mdx?$/, ""));
  } catch {
    return [];
  }
});

// Cached per request so generateMetadata (customerMetadata) and the page
// render (renderV1Story) parse each MDX file once, not twice.
const readStudy = cache(
  (slug: string): { content: string; data: Frontmatter } | null => {
    for (const ext of [".mdx", ".md"]) {
      const fp = path.join(DIR, `${slug}${ext}`);
      if (fs.existsSync(fp)) {
        const { content, data } = matter(fs.readFileSync(fp));
        return { content, data: data as Frontmatter };
      }
    }
    return null;
  },
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MDX_OPTIONS = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug],
  },
} as any;

function serializeStudy(content: string) {
  return serialize(content, MDX_OPTIONS);
}

export function customerMetadata(slug: string): Metadata {
  const post = readStudy(slug);
  if (!post) return {};
  const { data } = post;
  const host = process.env.NEXT_PUBLIC_HOST ?? "";
  const metaTitle = `Customer story - ${data.companyName}`;
  const image = data.ogImage ? `${host}${data.ogImage}` : undefined;
  return {
    title: { absolute: metaTitle },
    description: data.title,
    alternates: { canonical: `${host}/customers/${slug}` },
    openGraph: {
      title: metaTitle,
      description: data.title,
      type: "article",
      url: `${host}/customers/${slug}`,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      site: "@inngest",
      title: metaTitle,
      description: data.title,
      images: image ? [image] : undefined,
    },
  };
}

function buildStoryData(data: Frontmatter, content: string): CustomerStoryData {
  const role = [data.quote?.attribution?.title, data.companyName]
    .filter(Boolean)
    .join(", ");
  return {
    tag: "Customer story",
    title: data.title,
    author: data.quote?.attribution?.name,
    readTime: readingTime(content).text,
    portrait: data.quote?.avatar,
    pullQuote: data.quote?.text,
    pullQuoteAuthor: data.quote?.attribution?.name,
    pullQuoteRole: role || undefined,
    brandLogo: data.logo,
    brandLogoAlt: data.companyName,
    cardHeadline: data.companyDescription,
    brandSiteLabel: data.companyURL?.replace(/^https?:\/\//, ""),
    brandSiteHref: data.companyURL,
    meta: [
      data.companyEmployees && {
        key: "Employees",
        value: data.companyEmployees,
      },
      data.companyIndustry && { key: "Industry", value: data.companyIndustry },
      data.companyUseCase && { key: "Use Case", value: data.companyUseCase },
    ].filter(Boolean) as { key: string; value: string }[],
  };
}

function buildRelated(slug: string): RelatedStory[] {
  return STORIES.filter((s) => s.id !== slug)
    .slice(0, 3)
    .map((s) => ({
      logo: s.logo,
      logoAlt: s.brand,
      logoHeight: LOGO_HEIGHT,
      tags: s.tags,
      title: s.title,
      body: s.body,
      href: STORY_HREF(s.id),
    }));
}

// Renders the v1 CustomerStory for a slug, or null if the study is
// missing. Server component returns JSX (CustomerStory is a client island
// that re-hydrates the serialised MDX).
export async function renderV1Story(slug: string) {
  const post = readStudy(slug);
  if (!post) return null;
  const source = await serializeStudy(post.content);
  return (
    <CustomerStory
      story={buildStoryData(post.data, post.content)}
      source={source}
      related={buildRelated(slug)}
    />
  );
}
