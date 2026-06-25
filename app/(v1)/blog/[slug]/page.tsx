import fs from "node:fs";
import path from "node:path";
import { cache } from "react";

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import matter from "gray-matter";
import readingTime from "reading-time";

import sharp from "sharp";

import PageShell from "@/components/v1/PageShell";
import ButtonLink from "@/components/v1/ButtonLink";
import Chip from "@/components/v1/sections/shared/Chip";
import SpotlightFrame from "@/components/v1/sections/Events/SpotlightFrame";
import RegisterCue from "@/components/v1/sections/Events/RegisterCue";
import StippleCtaSection from "@/components/v1/sections/shared/StippleCtaSection";
import ArticleBody from "./ArticleBody";
import BlogToc, { type BlogTocItem } from "./BlogToc";
import Prose from "@/components/v1/Prose";
import { Unreleased } from "shared/Docs/Unreleased";

const ARTICLE_BODY_ID = "blog-article-body";

// Read a public-asset image's intrinsic dimensions so the hero <Image>
// can fill its column width at the asset's true aspect ratio (dynamic
// height, no layout shift). Cached per process. Falls back to 2:1 — the
// Figma cover ratio — when the file can't be measured (e.g. remote src).
const getImageSize = cache(
  async (src: string): Promise<{ width: number; height: number }> => {
    const fallback = { width: 1600, height: 800 };
    if (!src.startsWith("/")) return fallback;
    try {
      const { width, height } = await sharp(
        path.join(process.cwd(), "public", src)
      ).metadata();
      if (!width || !height) return fallback;
      return { width, height };
    } catch {
      return fallback;
    }
  }
);

// Canonical /blog/[slug] route. Reads the shared content/blog MDX and
// renders it in a server component with the same rehype/remark pipeline
// as the legacy pages-router blog, but without hydrating the whole body.

const BLOG_DIR = path.join(process.cwd(), "content/blog");

type Scope = {
  path: string;
  heading: string;
  subtitle?: string;
  showSubtitle?: boolean;
  author?: string | string[];
  authorTitle?: string;
  authorAvatar?: string;
  authorTagline?: string;
  image?: string;
  imageCredits?: string;
  tags?: string[];
  date?: string;
  dateUpdated?: string;
  humanDate?: string;
  reading?: { text: string };
  primaryCTA?: "docs" | "sales" | "signUp";
  floatingCTA?: boolean;
  // Syndicated posts point canonical at the original source.
  canonical_url?: string;
  // When set, the post is gated behind ?unreleased=<label>.
  unreleased?: string;
};

type RelatedPost = {
  slug: string;
  title: string;
  subtitle: string | null;
  image: string | null;
  date: string | null;
};

// Module-level cache of frontmatter for every post — built once per
// process via React.cache(). generateStaticParams and loadRelated both
// consume this so we don't re-parse N MDX files for every page.
type PostMeta = {
  slug: string;
  filePath: string;
  data: Record<string, unknown>;
};

const loadAllPostsMeta = cache((): PostMeta[] => {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((fname) => fname.endsWith(".md") || fname.endsWith(".mdx"))
    .map((fname): PostMeta | null => {
      try {
        const filePath = path.join(BLOG_DIR, fname);
        const { data } = matter(fs.readFileSync(filePath));
        return {
          slug: fname.replace(/\.mdx?$/, ""),
          filePath,
          data: data as Record<string, unknown>,
        };
      } catch {
        return null;
      }
    })
    .filter((p): p is PostMeta => p !== null);
});

function readBlogFile(slug: string): { content: string; data: Scope } | null {
  const meta = loadAllPostsMeta().find((p) => p.slug === slug);
  if (!meta) return null;
  const source = fs.readFileSync(meta.filePath);
  const { content, data } = matter(source);
  const rawDate = data.date as string | Date | undefined;
  const rawTags = data.tags as string | string[] | undefined;
  const scope: Scope = {
    ...(data as Scope),
    path: `/blog/${slug}`,
    reading: readingTime(content),
    humanDate: rawDate
      ? typeof rawDate === "string"
        ? new Date(rawDate).toLocaleDateString()
        : rawDate.toLocaleDateString()
      : undefined,
    tags:
      typeof rawTags === "string"
        ? rawTags.split(",").map((tag) => tag.trim())
        : rawTags,
  };
  return { content, data: scope };
}

function loadRelated(currentSlug: string): RelatedPost[] {
  return loadAllPostsMeta()
    .filter((p) => p.slug !== currentSlug)
    .map((p): RelatedPost | null => {
      const fm = p.data;
      if (fm.redirect) return null;
      if (fm.unreleased) return null;
      if (!fm.heading) return null;
      const date =
        fm.date instanceof Date
          ? fm.date.toISOString()
          : typeof fm.date === "string"
          ? fm.date
          : null;
      return {
        slug: p.slug,
        title: String(fm.heading),
        subtitle: fm.subtitle ? String(fm.subtitle) : null,
        image: fm.image ? String(fm.image) : null,
        date,
      };
    })
    .filter((p): p is RelatedPost => p !== null)
    .sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, 3);
}

const GITHUB_SLUG_ASCII_PUNCTUATION = /[\0-\x1F!-,.\/:-@\[-\^`\{-~]/g;

function cleanHeadingText(value: string): string {
  return value
    .replace(/\s+\{#[^}]+\}\s*$/, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function slugifyHeading(value: string): string {
  return value
    .toLowerCase()
    .replace(GITHUB_SLUG_ASCII_PUNCTUATION, "")
    .replace(/ /g, "-");
}

function extractArticleHeadings(content: string): BlogTocItem[] {
  const occurrences = new Map<string, number>();
  const headings: BlogTocItem[] = [];
  let inFence = false;
  let fenceMarker: string | null = null;

  for (const line of content.split("\n")) {
    const trimmed = line.trimStart();
    const fence = trimmed.match(/^(```|~~~)/)?.[1] ?? null;
    if (fence) {
      if (!inFence) {
        inFence = true;
        fenceMarker = fence;
      } else if (fence === fenceMarker) {
        inFence = false;
        fenceMarker = null;
      }
      continue;
    }
    if (inFence) continue;

    const match = line.match(/^##(?!#)\s+(.+?)\s*#*\s*$/);
    if (!match) continue;

    const text = cleanHeadingText(match[1]);
    if (!text) continue;

    const base = slugifyHeading(text) || "section";
    const count = occurrences.get(base) ?? 0;
    occurrences.set(base, count + 1);
    headings.push({
      id: count === 0 ? base : `${base}-${count}`,
      text,
    });
  }

  return headings;
}

export function generateStaticParams(): { slug: string }[] {
  return loadAllPostsMeta()
    .filter((p) => !p.data.redirect)
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = readBlogFile(slug);
  if (!post) return {};
  const scope = post.data;
  // `absolute` so the root "%s | Inngest" template doesn't append a
  // second "Inngest" after "… - Inngest Blog".
  const title = `${scope.heading} - Inngest Blog`;
  const description = scope.subtitle ?? "";
  const url = `${process.env.NEXT_PUBLIC_HOST ?? ""}${scope.path}`;
  const imageUrl = scope.image
    ? `${process.env.NEXT_PUBLIC_HOST ?? ""}${scope.image}`
    : undefined;
  return {
    title: { absolute: title },
    description,
    // Keep unreleased posts out of search; they 200 but are gated client-side.
    robots: scope.unreleased ? { index: false, follow: false } : undefined,
    // Match the legacy blog: external canonical for syndicated posts,
    // otherwise an absolute self-canonical to the post URL.
    alternates: { canonical: scope.canonical_url ?? url },
    openGraph: {
      title,
      description,
      type: "article",
      url,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      site: "@inngest",
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = readBlogFile(slug);
  if (!post) notFound();
  const { content, data: scope } = post;

  const related = loadRelated(slug);
  const tocItems = extractArticleHeadings(content);

  const authors = scope.author
    ? Array.isArray(scope.author)
      ? scope.author
      : [scope.author]
    : [];
  const dateStr = scope.humanDate ?? scope.date ?? "MM/DD/YYYY";
  const readingText = scope.reading?.text ?? "";
  const heroSize = scope.image ? await getImageSize(scope.image) : null;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: scope.heading,
    description: scope.subtitle,
    image: scope.image
      ? [`${process.env.NEXT_PUBLIC_HOST}${scope.image}`]
      : undefined,
    datePublished: scope.date,
    dateModified: scope.dateUpdated ?? scope.date,
    author:
      authors.length > 0
        ? authors.map((name) => ({ "@type": "Person", name }))
        : [
            {
              "@type": "Organization",
              name: "Inngest",
              url: process.env.NEXT_PUBLIC_HOST,
            },
          ],
  };

  const body = (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="overflow-x-clip">
        <article>
          <BlogHero
            heading={scope.heading}
            image={scope.image ?? null}
            heroSize={heroSize}
            authors={authors}
            dateStr={dateStr}
            readingText={readingText}
          />
          <ArticleSection content={content} scope={scope} tocItems={tocItems} />
          <RelatedContent posts={related} />
          <BuildBetterAgentsCta />
        </article>
      </div>
    </>
  );

  return (
    <PageShell>
      {scope.unreleased ? (
        <Unreleased label={scope.unreleased} fallback={<BlogNotFound />}>
          {body}
        </Unreleased>
      ) : (
        body
      )}
    </PageShell>
  );
}

function BlogNotFound() {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-6 pb-[160px] pt-[120px] text-center text-v1-frost sm:px-9 lg:px-8">
      <h1 className="font-v1Heading text-[28px] leading-[1.15] tracking-[-0.01em] text-v1-frost sm:text-[36px] lg:text-[44px]">
        Post not found
      </h1>
      <p className="mt-5">
        <Link
          href="/blog"
          className="text-v1-frost/70 underline motion-safe:transition-colors hover:text-v1-accent-salmon-light"
        >
          Back to the blog
        </Link>
      </p>
    </section>
  );
}

function BlogHero({
  heading,
  image,
  heroSize,
  authors,
  dateStr,
  readingText,
}: {
  heading: string;
  image: string | null;
  heroSize: { width: number; height: number } | null;
  authors: string[];
  dateStr: string;
  readingText: string;
}) {
  return (
    <section className="relative mx-auto w-full max-w-[1440px] px-6 pt-[96px] sm:px-9 lg:px-8 lg:pt-[108px]">
      <div className="overflow-hidden rounded-[8px] border border-[rgba(124,124,124,0.35)]">
        <HeroCover image={image} imageAlt={heading} size={heroSize} />
      </div>
      <div className="mt-8 flex flex-col gap-4 text-v1-frost lg:max-w-[calc(800/1248*100%)]">
        <Chip variant="solid" size="sm" className="self-start">
          Blog Article
        </Chip>
        <h1 className="font-v1Heading text-[28px] leading-[1.15] tracking-[-0.01em] text-v1-frost [text-box-edge:cap_alphabetic] [text-box-trim:trim-both] sm:text-[36px] sm:leading-[1.1] sm:tracking-[-0.36px] lg:text-[44px] lg:tracking-[-0.44px]">
          {heading}
        </h1>
        <p className="text-v1-body-xs flex flex-wrap items-center gap-x-[10px] gap-y-1 text-v1-frost/60">
          {authors.length > 0 ? (
            <>
              <span>{authors.join(", ")}</span>
              <span aria-hidden="true">•</span>
            </>
          ) : null}
          <span>{dateStr}</span>
          {readingText ? (
            <>
              <span aria-hidden="true">•</span>
              <span>{readingText}</span>
            </>
          ) : null}
        </p>
      </div>
    </section>
  );
}

function ArticleSection({
  content,
  scope,
  tocItems,
}: {
  content: string;
  scope: Scope;
  tocItems: BlogTocItem[];
}) {
  // Same 448 / 912 grid as the hero. Left rail holds a sticky scrollspy
  // TOC built from the article's headings; the article column carries
  // 64px inner gutters so its prose sits in a 784px measure (matching
  // the Figma content box).
  return (
    <section className="relative mx-auto w-full max-w-[1440px] px-6 pb-[96px] pt-12 text-v1-frost sm:px-9 sm:pb-[120px] sm:pt-16 lg:px-8 lg:pb-[160px] lg:pt-20">
      <div className="grid grid-cols-1 gap-x-12 lg:grid-cols-[minmax(0,800fr)_minmax(0,448fr)] lg:items-start">
        <div>
          <Prose id={ARTICLE_BODY_ID}>
            <ArticleBody source={content} scope={scope} />
          </Prose>
        </div>
        {/* TOC — right rail, sticky, hidden on mobile */}
        <div className="hidden lg:sticky lg:top-[100px] lg:block">
          <BlogToc items={tocItems} />
        </div>
      </div>
    </section>
  );
}

function BuildBetterAgentsCta() {
  return (
    <StippleCtaSection
      headingId="blog-build-better-agents"
      heading={
        <>
          Build better
          <br />
          agents today
        </>
      }
      body="Add Inngest to your project in minutes. Free to start, no credit card required."
      bodyClassName="max-w-[314px]"
    >
      <ButtonLink href="/sign-up?ref=blog" variant="primary" size="md">
        Create free account
      </ButtonLink>
      <ButtonLink href="/docs?ref=blog" variant="secondary" size="md">
        Quick start guide&nbsp;→
      </ButtonLink>
    </StippleCtaSection>
  );
}

function HeroCover({
  image,
  imageAlt,
  size,
}: {
  image: string | null;
  imageAlt: string;
  size: { width: number; height: number } | null;
}) {
  // Cover fills the column width; its height follows the asset's native
  // aspect ratio (no forced crop). Posts without an image fall back to a
  // 2:1 grain panel matching the Figma cover proportions.
  if (!image || !size) {
    return (
      <div
        aria-hidden="true"
        className="aspect-[2/1] w-full bg-[url(/assets/v1/page/.compressed/grain-bg.webp)] bg-cover bg-center"
      />
    );
  }
  return (
    <Image
      src={image}
      alt={imageAlt}
      width={size.width}
      height={size.height}
      priority
      sizes="(min-width: 1024px) 1360px, 100vw"
      className="h-auto w-full"
    />
  );
}

function RelatedContent({ posts }: { posts: RelatedPost[] }) {
  if (posts.length === 0) return null;
  return (
    <section
      aria-label="Related content"
      className="relative mx-auto w-full max-w-[1440px] px-6 pb-[80px] text-v1-frost sm:px-9 sm:pb-[120px] lg:px-8"
    >
      <div className="mb-8 flex items-center justify-between gap-4">
        <h2 className="text-v1-heading-sm">Related content</h2>
        <ButtonLink
          href="/blog"
          variant="secondary"
          className="hidden shrink-0 sm:inline-flex"
        >
          Back to learn center
        </ButtonLink>
      </div>
      <ul className="grid list-none grid-cols-1 gap-4 pl-0 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <li key={p.slug} className="list-none">
            {/* Link is the card root (keeps next/link soft-nav + prefetch);
                SpotlightFrame is the inner hover surface. Nesting it this
                way — rather than `asChild` — avoids cloneElement/
                Children.only, so this whole tree can render in a Server
                Component without the lazy-child RSC failure. */}
            <Link href={`/blog/${p.slug}`} className="block h-full rounded-lg">
              <SpotlightFrame
                tilt
                className="h-full"
                innerClassName="flex h-full flex-col"
              >
                {p.image ? (
                  // Optimized (AVIF/WebP, lazy, responsive) thumbnail —
                  // fill + object-cover keeps the 1.79 crop the
                  // background-image gave, but via next/image. Decorative
                  // (alt=""): the card's <h3> is the accessible link text.
                  <span className="relative block aspect-[2/1] w-full overflow-hidden">
                    <Image
                      src={p.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 422px, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </span>
                ) : (
                  <span
                    aria-hidden="true"
                    className="block aspect-[2/1] w-full bg-v1-frost/[0.04]"
                  />
                )}
                {/* Footer mirrors the Events card: gap-6 between the
                    title group and the cue, p-20, Heading/Xs title,
                    text-sm subtitle, RegisterCue link. */}
                <div className="flex flex-1 flex-col justify-between gap-6 p-5">
                  <div className="flex flex-col gap-4">
                    <h3 className="text-v1-heading-xs w-full text-v1-frost">
                      {p.title}
                    </h3>
                    {p.subtitle ? (
                      <p className="text-v1-body-xs w-full text-v1-frost/60">
                        {p.subtitle}
                      </p>
                    ) : null}
                  </div>
                  <div className="py-1">
                    <RegisterCue label="Read Article" />
                  </div>
                </div>
              </SpotlightFrame>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
