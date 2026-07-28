import fs from "node:fs";
import path from "node:path";
import { cache } from "react";

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import GithubSlugger from "github-slugger";
import matter from "gray-matter";
import readingTime from "reading-time";

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
import { getFullURL } from "src/utils/social";
import {
  ReportHero,
  ReportLayoutShell,
  ReportTableOfContents,
  ReportMobileContentsBar,
} from "@/components/Blog/Report";

const ARTICLE_BODY_ID = "blog-article-body";

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
  // When true, swaps the generic hero/sidebar layout for the wider,
  // dedicated report shell (ReportHero, left-rail TOC, full-bleed sections).
  reportLayout?: boolean;
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

function cleanHeadingText(value: string): string {
  return value
    .replace(/\s+\{#[^}]+\}\s*$/, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// The TOC ids must match the heading ids `rehype-slug` writes into the
// rendered article (see mdxOptions.ts), or the links scroll nowhere. So
// use the same slugger `rehype-slug` uses (github-slugger) and feed it
// *every* heading level in document order — the slugger's duplicate
// counter is shared across the whole document, so skipping the h3s here
// would desync the suffixes on repeated headings.
function extractArticleHeadings(content: string): BlogTocItem[] {
  const slugger = new GithubSlugger();
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

    const match = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (!match) continue;

    const text = cleanHeadingText(match[2]);
    if (!text) continue;

    const id = slugger.slug(text);
    if (match[1].length !== 2) continue;

    headings.push({ id, text });
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
  // `getFullURL` leaves an already-absolute URL (e.g. a cdn.inngest.com
  // image) untouched and only prepends the host to relative /assets paths,
  // so social scrapers get a valid og:image either way.
  const imageUrl = scope.image ? getFullURL(scope.image) : undefined;
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

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: scope.heading,
    description: scope.subtitle,
    image: scope.image ? [getFullURL(scope.image)] : undefined,
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
          {scope.reportLayout ? (
            <ReportArticleSection
              content={content}
              scope={scope}
              authors={authors}
              dateStr={dateStr}
              readingText={readingText}
            />
          ) : (
            <>
              <BlogHero
                heading={scope.heading}
                authors={authors}
                dateStr={dateStr}
                readingText={readingText}
              />
              <ArticleSection
                content={content}
                scope={scope}
                tocItems={tocItems}
              />
            </>
          )}
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
          className="text-v1-frost/70 underline hover:text-v1-accent-salmon-light motion-safe:transition-colors"
        >
          Back to the blog
        </Link>
      </p>
    </section>
  );
}

function BlogHero({
  heading,
  authors,
  dateStr,
  readingText,
}: {
  heading: string;
  authors: string[];
  dateStr: string;
  readingText: string;
}) {
  // LCP experiment: the cover image used to run full-bleed above the
  // title at up to ~1360px wide — the near-certain mobile LCP candidate
  // flagged in Search Console. A condensed side-by-side thumbnail was
  // tried here first but didn't resolve cleanly, so this drops the cover
  // from the post page entirely rather than continuing to tune it. The
  // image is untouched everywhere else it's used for: /blog index cards
  // (components/v1/sections/Learn/ResourceCard.tsx), Open Graph/Twitter
  // meta (generateMetadata above), and the BlogPosting structured data.
  return (
    <section className="relative mx-auto w-full max-w-[1440px] px-6 pt-[96px] sm:px-9 lg:px-8 lg:pt-[108px]">
      <div className="flex flex-col gap-4 text-v1-frost lg:max-w-[calc(800/1248*100%)]">
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

function ReportArticleSection({
  content,
  scope,
  authors,
  dateStr,
  readingText,
}: {
  content: string;
  scope: Scope;
  authors: string[];
  dateStr: string;
  readingText: string;
}) {
  // Dedicated report shell: a slim left-rail TOC (13rem) instead of the
  // generic 800/448 grid, so the report's full-bleed sections (exec
  // summary, section breaks, charts) get the full content width rather
  // than being squeezed by an (often empty) sidebar column.
  return (
    <section className="relative mx-auto w-full max-w-[1440px] px-6 pb-[96px] pt-[96px] text-v1-frost sm:px-9 sm:pb-[120px] lg:px-8 lg:pt-[108px]">
      <ReportLayoutShell toc={<ReportTableOfContents />}>
        <>
          <ReportHero
            author={authors}
            date={dateStr}
            readingTime={readingText}
          />
          <ReportMobileContentsBar />
          <Prose id={ARTICLE_BODY_ID} className="report-prose max-w-none">
            <ArticleBody source={content} scope={scope} />
          </Prose>
        </>
      </ReportLayoutShell>
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
