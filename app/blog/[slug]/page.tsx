import fs from "node:fs";
import path from "node:path";
import { cache } from "react";

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import matter from "gray-matter";
import readingTime from "reading-time";
import rehypeSlug from "rehype-slug";
import rehypeRaw from "rehype-raw";
import rehypeCodeTitles from "rehype-code-titles";
import remarkGfm from "remark-gfm";
import { serialize } from "next-mdx-remote/serialize";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
// @ts-ignore — codehike has no published types for the mdx entrypoint
import { remarkCodeHike, recmaCodeHike } from "codehike/mdx";

import { rehypeRemoveTwoSlashMarkup, rehypeShiki } from "@/utils/code";
// @ts-ignore — local .mjs without bundled types
import { rehypeParseCodeBlocks } from "@/mdx/rehype.mjs";

import sharp from "sharp";

import { isV1Enabled } from "@/utils/v1/routes";
import PageShell from "@/components/v1/PageShell";
import ButtonLink from "@/components/v1/ButtonLink";
import Chip from "@/components/v1/sections/shared/Chip";
import SpotlightFrame from "@/components/v1/sections/Events/SpotlightFrame";
import RegisterCue from "@/components/v1/sections/Events/RegisterCue";
import StippleCtaSection from "@/components/v1/sections/shared/StippleCtaSection";
import { SectionProvider } from "src/shared/Docs/SectionProvider";
import ArticleBody from "./ArticleBody";
import BlogToc from "./BlogToc";
import ArticleLegacy from "./ArticleLegacy";

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
        path.join(process.cwd(), "public", src),
      ).metadata();
      if (!width || !height) return fallback;
      return { width, height };
    } catch {
      return fallback;
    }
  },
);

// Canonical /blog/[slug] route. Reads + serialises the post's MDX
// server-side (shared content/blog source + the same rehype/remark
// pipeline as the legacy pages-router blog) and renders one of two
// chromes based on the v1 feature flag:
//   flag on  -> v1 typography inside PageShell (was /blog-redesign)
//   flag off -> the legacy article layout (ported from
//               pages/blog/[slug].tsx) inside the layout's legacy chrome

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
};

type RelatedPost = {
  slug: string;
  title: string;
  subtitle: string | null;
  image: string | null;
  date: string | null;
};

const chConfig = {
  components: { code: "Code" },
  syntaxHighlighting: {
    theme: "dracula-soft",
  },
};

const MDX_REHYPE_NODE_TYPES = [
  "mdxFlowExpression",
  "mdxJsxFlowElement",
  "mdxJsxTextElement",
  "mdxTextExpression",
  "mdxjsEsm",
];

// Plugin lists have noisy union types from upstream packages; cast to
// `any` so the MDXRemote options prop accepts the shape — same trick
// the legacy pages-router file used with `@ts-ignore` on `blockJS`.
const MDX_OPTIONS = {
  // codehike injects each fenced block's data as inline JS object
  // literals in the compiled source; blockJS must be false or they're
  // stripped and <Code> renders with an undefined `codeblock`. Matches
  // the live pages-router /blog/[slug] serialize call.
  blockJS: false,
  mdxOptions: {
    rehypePlugins: [
      rehypeCodeTitles,
      rehypeParseCodeBlocks,
      rehypeRemoveTwoSlashMarkup,
      rehypeShiki,
      [rehypeRaw, { passThrough: MDX_REHYPE_NODE_TYPES }],
      rehypeSlug,
    ],
    remarkPlugins: [[remarkCodeHike, chConfig], remarkGfm],
    recmaPlugins: [[recmaCodeHike, chConfig]],
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

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

  // Compile MDX server-side so the client island only ships the
  // serialised result, not the heavy mdx-bundler / rehype / remark
  // toolchain. Both chromes re-hydrate it with their own components map.
  const mdxSource = await serialize(content, {
    ...MDX_OPTIONS,
    scope: { json: JSON.stringify(scope) },
  });

  // Flag off: legacy article layout, inside the layout's legacy chrome.
  if (!isV1Enabled()) {
    return <ArticleLegacy source={mdxSource} scope={scope} slug={slug} />;
  }

  const related = loadRelated(slug);

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

  return (
    <PageShell>
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
          <ArticleSection source={mdxSource} />
          <RelatedContent posts={related} />
          <BuildBetterAgentsCta />
        </article>
      </div>
    </PageShell>
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
  // 2-col layout matching Figma (448 / 912 columns). Left rail: "BLOG
  // ARTICLE" tag + title + author·date·reading meta, vertically centred
  // against the cover. Right: the post's cover image filling the column
  // width at its native aspect ratio.
  return (
    <section className="relative mx-auto w-full max-w-[1440px] px-6 pt-[96px] sm:px-9 lg:px-8 lg:pt-[108px]">
      <div className="grid grid-cols-1 gap-x-4 gap-y-8 lg:grid-cols-[minmax(0,448fr)_minmax(0,912fr)] lg:items-center">
        <div className="flex flex-col gap-5 text-v1-frost">
          <Chip variant="solid" size="sm" className="self-start">
            Blog Article
          </Chip>
          <h1 className="font-v1Heading text-[28px] leading-[1.15] tracking-[-0.01em] text-v1-frost [text-box-edge:cap_alphabetic] [text-box-trim:trim-both] sm:text-[32px] sm:leading-[40px] sm:tracking-[-0.32px]">
            {heading}
          </h1>
          <p className="flex flex-wrap items-center gap-x-[10px] gap-y-1 text-v1-body-xs text-v1-frost/60">
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
        <HeroCover image={image} imageAlt={heading} size={heroSize} />
      </div>
    </section>
  );
}

function ArticleSection({ source }: { source: MDXRemoteSerializeResult }) {
  // Same 448 / 912 grid as the hero. Left rail holds a sticky scrollspy
  // TOC built from the article's headings; the article column carries
  // 64px inner gutters so its prose sits in a 784px measure (matching
  // the Figma content box).
  return (
    <section className="relative mx-auto w-full max-w-[1440px] px-6 pb-[96px] pt-12 text-v1-frost sm:px-9 sm:pb-[120px] sm:pt-16 lg:px-8 lg:pb-[160px] lg:pt-20">
      <div className="grid grid-cols-1 gap-x-4 lg:grid-cols-[minmax(0,448fr)_minmax(0,912fr)] lg:items-start">
        {/* Desktop-only side rail (same convention as the reference
            pages' `hidden lg:block` rails) — a TOC stacked at the foot
            of a mobile article is useless, so it's dropped < lg. */}
        <div className="hidden lg:block lg:sticky lg:top-[100px]">
          <BlogToc articleId={ARTICLE_BODY_ID} />
        </div>
        <div className="lg:px-16">
          <SectionProvider sections={[]}>
            <div
              id={ARTICLE_BODY_ID}
              className="prose prose-invert blog-content max-w-none text-v1-frost prose-headings:font-v1Heading prose-headings:font-normal prose-headings:scroll-mt-[100px] prose-headings:tracking-[-0.01em] prose-headings:text-v1-frost prose-h2:text-[26px] prose-h2:leading-[1.2] prose-h2:tracking-[-0.26px] prose-h2:mt-10 prose-h2:mb-3.5 prose-h3:text-[20px] prose-h3:leading-[1.3] prose-h3:mt-8 prose-h3:mb-2.5 prose-h4:text-[17px] prose-h4:leading-[1.4] prose-h4:mt-7 prose-h4:mb-2 prose-h5:text-[15px] prose-h5:leading-[1.4] prose-h5:mt-6 prose-h5:mb-1.5 prose-h6:text-[15px] prose-h6:leading-[1.4] prose-h6:mt-6 prose-h6:mb-1.5 prose-p:text-[16px] prose-p:leading-[24px] prose-p:my-0 prose-p:text-v1-frost prose-li:text-[16px] prose-li:leading-[24px] prose-li:my-0 prose-li:text-v1-frost prose-a:text-v1-frost prose-a:underline prose-a:underline-offset-4 prose-a:decoration-v1-frost/40 hover:prose-a:decoration-v1-frost prose-code:rounded prose-code:bg-v1-frost/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[14px] prose-code:font-mono prose-code:text-v1-accent-salmon prose-pre:rounded-[8px] prose-pre:border prose-pre:border-[rgba(124,124,124,0.35)] prose-pre:bg-v1-jetBlack prose-img:rounded-[8px] prose-img:border prose-img:border-[rgba(124,124,124,0.35)] prose-blockquote:border-v1-accent-salmon prose-blockquote:not-italic prose-blockquote:text-v1-frost"
            >
              <ArticleBody source={source} />
            </div>
          </SectionProvider>
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
        className="aspect-[2/1] w-full overflow-hidden rounded-[8px] border border-[rgba(124,124,124,0.35)] bg-[url(/assets/v1/page/.compressed/grain-bg.webp)] bg-cover bg-center"
      />
    );
  }
  return (
    <div className="overflow-hidden rounded-[8px] border border-[rgba(124,124,124,0.35)]">
      <Image
        src={image}
        alt={imageAlt}
        width={size.width}
        height={size.height}
        priority
        sizes="(min-width: 1024px) 912px, 100vw"
        className="h-auto w-full"
      />
    </div>
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
        <h2 className="text-v1-heading-sm">
          Related content
        </h2>
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
            <Link
              href={`/blog/${p.slug}`}
              className="block h-full rounded-lg"
            >
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
                  <span className="relative block aspect-[1.79] w-full overflow-hidden">
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
                    className="block aspect-[1.79] w-full bg-v1-frost/[0.04]"
                  />
                )}
                {/* Footer mirrors the Events card: gap-6 between the
                    title group and the cue, p-20, Heading/Xs title,
                    text-sm subtitle, RegisterCue link. */}
                <div className="flex flex-1 flex-col gap-6 p-5">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-v1-heading-xs w-full truncate text-v1-frost">
                      {p.title}
                    </h3>
                    {p.subtitle ? (
                      <p className="text-v1-body-xs w-full truncate text-v1-frost/60">
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
