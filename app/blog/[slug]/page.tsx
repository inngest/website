import fs from "node:fs";
import path from "node:path";
import {
  cache,
  type HTMLAttributes,
  type ImgHTMLAttributes,
  type ReactNode,
} from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import type { MDXComponents } from "mdx/types";
import { compile, type CompileOptions } from "@mdx-js/mdx";
import * as jsxRuntime from "react/jsx-runtime";
import matter from "gray-matter";
import readingTime from "reading-time";
import rehypeSlug from "rehype-slug";
import rehypeRaw from "rehype-raw";
import rehypeCodeTitles from "rehype-code-titles";
import remarkGfm from "remark-gfm";
import clsx from "clsx";
import { remove } from "unist-util-remove";
import { RiCalendarLine } from "@remixicon/react";

import Container from "src/shared/layout/Container";
import { Button } from "src/shared/Button";
import Tags from "src/shared/Blog/Tags";
import DiscordCTA from "src/shared/Blog/DiscordCTA";
import CTACallout from "src/shared/CTACallout";
import Blockquote from "src/shared/Blog/Blockquote";
import AutoplayVideo from "src/shared/Blog/AutoplayVideo";
import FloatingCTA from "src/components/Blog/FloatingCTA";
import { Code } from "src/shared/Code/CodeHike";
import ProductHunt from "src/app/launch-week/ProductHunt";
import { formatShortLocaleDate } from "src/utils/date";
import { getFullURL } from "src/utils/social";
import { rehypeRemoveTwoSlashMarkup, rehypeShiki } from "src/utils/code";
import { rehypeParseCodeBlocks } from "src/mdx/rehype.mjs";

// @ts-ignore this package is older, but it works
import { remarkCodeHike, recmaCodeHike } from "codehike/mdx";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const SITE_ORIGIN = process.env.NEXT_PUBLIC_HOST ?? "https://www.inngest.com";

export const dynamic = "force-static";
export const dynamicParams = true;
export const runtime = "nodejs";

const chConfig = {
  components: { code: "Code" },
  syntaxHighlighting: {
    theme: "dracula-soft",
  },
};

type CTA = "docs" | "sales" | "signUp" | "report2026";

type Scope = {
  path: string;
  heading: string;
  subtitle?: string;
  canonical_url?: string;
  showSubtitle?: boolean;
  author?: string | string[];
  image?: string;
  imageCredits?: string;
  tags?: string[];
  date: string;
  humanDate: string;
  dateUpdated?: string;
  primaryCTA?: CTA;
  floatingCTA?: boolean;
  category?: string;
  reading: {
    text: string;
    minutes: number;
    time: number;
    words: number;
  };
};

type BlogPost = {
  slug: string;
  source: string;
  scope: Scope;
};

type PageProps = {
  params: Promise<{ slug: string }>;
};

const authorURLs: Record<string, string> = {
  "Dan Farrelly": "https://twitter.com/djfarrelly",
  "Tony Holdstock-Brown": "https://twitter.com/itstonyhb",
  "Jack Williams": "https://twitter.com/atticjack",
  "Igor Gassmann": "https://twitter.com/i_gassmann",
  "Darwin Wu": "https://twitter.com/67darwin",
  "Joel Hooks": "https://twitter.com/jhooks",
  "Sylwia Vargas": "https://twitter.com/sylwiavargas",
  "Taylor Facen": "https://twitter.com/ItsTayFay",
  "Igor Samokhovets": "https://twitter.com/IgorSamokhovets",
  "Dave Kiss": "https://twitter.com/davekiss",
  "Bruno Scheufler": "https://brunoscheufler.com",
  "Lydia Hallie": "https://x.com/lydiahallie",
  "Joe Adams": "https://www.linkedin.com/in/josephadams9/",
  "Charly Poly": "https://x.com/whereischarly",
  "Ana Filipa de Almeida": "https://www.linkedin.com/in/anafilipadealmeida/",
  "Jess Lin": "https://x.com/jesstyping",
};

const nodeTypes = [
  "mdxFlowExpression",
  "mdxJsxFlowElement",
  "mdxJsxTextElement",
  "mdxTextExpression",
  "mdxjsEsm",
];

const mdxOptions = {
  rehypePlugins: [
    rehypeCodeTitles,
    rehypeParseCodeBlocks,
    rehypeRemoveTwoSlashMarkup,
    rehypeShiki,
    [rehypeRaw, { passThrough: nodeTypes }],
    rehypeSlug,
  ],
  remarkPlugins: [[remarkCodeHike, chConfig], remarkGfm],
  recmaPlugins: [[recmaCodeHike, chConfig]],
} as Pick<CompileOptions, "rehypePlugins" | "remarkPlugins" | "recmaPlugins">;

const components: MDXComponents = {
  DiscordCTA,
  Button,
  CTACallout,
  Blockquote,
  AutoplayVideo,
  // @ts-ignore this package is older, but it works
  YouTube,
  Code,
  Callout,
  WorkflowKitProductOfTheDay: ProductHunt,
  Col,
  Row,
  img: MdxImage,
};

function readImageDimensions(filePath: string) {
  const buffer = fs.readFileSync(filePath);

  if (buffer.subarray(0, 8).equals(Buffer.from("89504e470d0a1a0a", "hex"))) {
    return {
      width: buffer.readUInt32BE(16),
      height: buffer.readUInt32BE(20),
    };
  }

  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset < buffer.length) {
      if (buffer[offset] !== 0xff) {
        offset += 1;
        continue;
      }

      const marker = buffer[offset + 1];
      if (marker === 0xda || marker === 0xd9) break;

      const length = buffer.readUInt16BE(offset + 2);
      if (
        marker !== undefined &&
        ((marker >= 0xc0 && marker <= 0xc3) ||
          (marker >= 0xc5 && marker <= 0xc7) ||
          (marker >= 0xc9 && marker <= 0xcb) ||
          (marker >= 0xcd && marker <= 0xcf))
      ) {
        return {
          height: buffer.readUInt16BE(offset + 5),
          width: buffer.readUInt16BE(offset + 7),
        };
      }

      offset += 2 + length;
    }
  }

  if (
    buffer.subarray(0, 6).toString("ascii") === "GIF87a" ||
    buffer.subarray(0, 6).toString("ascii") === "GIF89a"
  ) {
    return {
      width: buffer.readUInt16LE(6),
      height: buffer.readUInt16LE(8),
    };
  }

  return null;
}

const getLocalImageDimensions = cache((src: string) => {
  const pathname = decodeURIComponent(src.split(/[?#]/)[0] ?? "");
  if (!pathname.startsWith("/")) return null;

  const publicDir = path.join(process.cwd(), "public");
  const filePath = path.resolve(publicDir, pathname.slice(1));
  if (
    filePath !== publicDir &&
    (!filePath.startsWith(`${publicDir}${path.sep}`) ||
      !fs.existsSync(filePath))
  ) {
    return null;
  }

  try {
    return readImageDimensions(filePath);
  } catch {
    return null;
  }
});

function MdxImage({
  alt = "",
  className,
  height: _height,
  loading,
  src,
  title,
  width: _width,
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  if (typeof src !== "string") return null;

  const dimensions = getLocalImageDimensions(src);
  if (!dimensions) {
    return (
      <img
        {...props}
        alt={alt}
        className={className}
        decoding="async"
        loading={loading ?? "lazy"}
        src={src}
        title={title}
      />
    );
  }

  return (
    <Image
      alt={alt}
      className={className}
      height={dimensions.height}
      loading={loading}
      sizes="(min-width: 848px) 744px, (min-width: 768px) calc(100vw - 80px), calc(100vw - 48px)"
      src={src}
      title={title}
      width={dimensions.width}
      quality={95}
    />
  );
}

function Callout({
  variant = "default",
  children,
}: {
  variant?: "default" | "info" | "warning" | "tip";
  children: ReactNode;
}) {
  return (
    <div
      className={clsx(
        "my-6 rounded-lg p-6 [&>:first-child]:mt-0 [&>:last-child]:mb-0 [&_a]:decoration-current",
        (variant === "default" || variant === "info") &&
          "bg-info text-info dark:bg-info/50 dark:text-info",
        variant === "warning" &&
          "bg-warning text-warning dark:bg-warning/50 dark:text-warning",
        variant === "tip" &&
          "bg-success text-success dark:bg-success/50 dark:text-success"
      )}
    >
      {children}
    </div>
  );
}

function Row({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 grid grid-cols-1 items-start gap-x-12 gap-y-10 xl:max-w-none xl:grid-cols-2 [&>:first-child]:mt-0 [&>:last-child]:mb-0">
      {children}
    </div>
  );
}

function Col({
  children,
  sticky = false,
}: {
  children: ReactNode;
  sticky?: boolean;
}) {
  return (
    <div
      className={clsx(
        "[&>:first-child]:mt-0 [&>:last-child]:mb-0",
        sticky && "xl:sticky xl:top-24"
      )}
    >
      {children}
    </div>
  );
}

function getYouTubeEmbedId(id: string): string {
  const urlParts = id.split("/");
  const lastPart = urlParts[urlParts.length - 1] ?? id;

  return lastPart
    .replace(/^watch\?v=/, "")
    .split("?v=")
    .pop()
    .split("?")[0]
    .split("&")[0];
}

function getYouTubePadding(option: string): string {
  if (option.includes("%")) return option;
  if (option === "widescreen") return "56.25%";
  if (option === "standard") return "75%";
  if (option.includes(":")) {
    const [width, height] = option.split(":").map(Number);
    return `${(height / width) * 100}%`;
  }
  return option;
}

function YouTube({
  appendSrc = "",
  aspectRatio = "56.25%",
  id,
  prependSrc = "https://www.youtube.com/embed/",
  width = 560,
  height = width,
  ...props
}: Omit<HTMLAttributes<HTMLDivElement>, "id"> & {
  appendSrc?: string;
  aspectRatio?: string;
  height?: number | string;
  id: string;
  prependSrc?: string;
  width?: number | string;
}) {
  const embedLink = `${prependSrc}${getYouTubeEmbedId(id)}${appendSrc}`;

  return (
    <div
      style={{
        position: "relative",
        paddingBottom: getYouTubePadding(aspectRatio),
        width: "100%",
        height: 0,
      }}
      {...props}
    >
      <iframe
        width={width}
        height={height}
        src={embedLink}
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}

function hasAuthorURL(author: string): author is keyof typeof authorURLs {
  return Object.prototype.hasOwnProperty.call(authorURLs, author);
}

function toDateString(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString().split("T")[0];
  }
  return value ? String(value) : "";
}

function toAuthors(author: Scope["author"]): string[] {
  if (!author) return [];
  return Array.isArray(author) ? author : [author];
}

function toTags(tags: unknown): string[] | undefined {
  if (typeof tags === "string") {
    return tags.split(",").map((tag) => tag.trim());
  }
  return Array.isArray(tags) ? tags : undefined;
}

function findPostPath(slug: string): string | null {
  if (!/^[A-Za-z0-9._-]+$/.test(slug)) {
    return null;
  }

  for (const extension of ["md", "mdx"]) {
    const filePath = path.join(BLOG_DIR, `${slug}.${extension}`);
    const resolvedPath = path.resolve(filePath);

    if (
      resolvedPath.startsWith(path.resolve(BLOG_DIR)) &&
      fs.existsSync(resolvedPath)
    ) {
      return resolvedPath;
    }
  }

  return null;
}

function removeImportsExportsPlugin() {
  return (tree) => remove(tree, "mdxjsEsm");
}

async function renderMdx(source: string, scope: Scope) {
  const compiled = await compile(source, {
    ...mdxOptions,
    remarkPlugins: [
      ...(mdxOptions.remarkPlugins ?? []),
      removeImportsExportsPlugin,
    ],
    outputFormat: "function-body",
    providerImportSource: undefined,
    development: false,
  });

  const fullScope = {
    opts: jsxRuntime,
    frontmatter: scope,
    ...scope,
  };
  const keys = Object.keys(fullScope);
  const values = Object.values(fullScope);
  const hydrateFn = Reflect.construct(Function, keys.concat(String(compiled)));
  const Content = hydrateFn.apply(hydrateFn, values).default;

  return <Content components={components} />;
}

const getBlogPost = cache((slug: string): BlogPost => {
  const filePath = findPostPath(slug);
  if (!filePath) {
    notFound();
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const { content, data } = matter(raw);

  if (data.redirect) {
    redirect(String(data.redirect));
  }

  const date = toDateString(data.date);
  const dateUpdated = data.dateUpdated
    ? toDateString(data.dateUpdated)
    : undefined;

  const scope = {
    ...data,
    path: `/blog/${slug}`,
    date,
    dateUpdated,
    humanDate: date ? formatShortLocaleDate(date) : "",
    tags: toTags(data.tags),
    reading: readingTime(content),
  } as Scope;

  return {
    slug,
    source: content,
    scope,
  };
});

export function generateStaticParams() {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((filename) => filename.endsWith(".md") || filename.endsWith(".mdx"))
    .filter((filename) => {
      const source = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
      const { data } = matter(source);
      return !data.redirect;
    })
    .map((filename) => ({
      slug: filename.replace(/\.mdx?$/, ""),
    }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { scope } = getBlogPost(slug);
  const title = `${scope.heading} - Inngest Blog`;
  const postPath = scope.path;
  const postUrl = getFullURL(postPath);
  const image = scope.image ? getFullURL(scope.image) : undefined;
  const authors = toAuthors(scope.author);

  return {
    title: {
      absolute: title,
    },
    description: scope.subtitle,
    alternates: {
      canonical: scope.canonical_url ?? postPath,
      types: {
        "text/markdown": `/blog/${slug}.md`,
      },
    },
    authors: authors.map((name) => ({ name })),
    openGraph: {
      title,
      description: scope.subtitle,
      type: "article",
      url: postUrl,
      ...(image && { images: [image] }),
      publishedTime: scope.date,
      modifiedTime: scope.dateUpdated ?? scope.date,
      authors,
      ...(scope.category && { section: scope.category }),
      ...(scope.tags && { tags: scope.tags }),
    },
    twitter: {
      card: "summary_large_image",
      site: "@inngest",
      title,
      description: scope.subtitle,
      ...(image && { images: [image] }),
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const { source, scope } = getBlogPost(slug);
  const mdxContent = await renderMdx(source, scope);
  const primaryCTA = scope.primaryCTA ?? "docs";
  const authors = toAuthors(scope.author);
  const postUrl = `${SITE_ORIGIN}${scope.path}`;

  let dateUpdated: string | null = null;
  try {
    dateUpdated = scope.dateUpdated
      ? formatShortLocaleDate(scope.dateUpdated)
      : null;
  } catch (err) {
    console.log(`Could not parse updated date: ${scope.dateUpdated}`);
  }

  const structuredDataAuthors = authors.map((author) => ({
    "@type": "Person",
    name: author,
    url: hasAuthorURL(author) ? authorURLs[author] : SITE_ORIGIN,
  }));

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: scope.heading,
    description: scope.subtitle,
    ...(scope.image && { image: [`${SITE_ORIGIN}${scope.image}`] }),
    datePublished: scope.date,
    dateModified: scope.dateUpdated ?? scope.date,
    url: postUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Inngest",
      url: SITE_ORIGIN,
    },
    ...(scope.category && { articleSection: scope.category }),
    ...(scope.tags &&
      scope.tags.length > 0 && { keywords: scope.tags.join(", ") }),
    author:
      structuredDataAuthors.length > 0
        ? structuredDataAuthors
        : [
            {
              "@type": "Organization",
              name: "Inngest",
              url: SITE_ORIGIN,
            },
          ],
  };

  return (
    <div className="bg-stone-950 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <Container>
        <article>
          <div className="relative m-auto max-w-3xl py-16">
            {scope.image && (
              <figure className="mx-auto flex max-w-[768px] flex-col items-end">
                <Image
                  className="rounded-lg"
                  src={scope.image}
                  alt={`Featured image for ${scope.heading} blog post`}
                  width={768}
                  height={768 / 2}
                  quality={75}
                  sizes="(min-width: 848px) 768px, (min-width: 768px) calc(100vw - 80px), calc(100vw - 48px)"
                  priority
                />
                {scope.imageCredits && (
                  <figcaption
                    className="mt-2 text-xs text-slate-400"
                    dangerouslySetInnerHTML={{ __html: scope.imageCredits }}
                  />
                )}
              </figure>
            )}
            <div className="lg:pt-18 m-auto max-w-[76ch] pt-12">
              <header>
                <h1 className="mb-2 text-2xl font-medium tracking-tighter text-basis md:mb-4 md:text-4xl lg:leading-loose xl:text-5xl">
                  {scope.heading}
                </h1>
                {scope.showSubtitle && (
                  <p className="mb-6 flex items-center gap-1 text-lg font-bold text-subtle">
                    {scope.subtitle}
                  </p>
                )}
                <p className="mt-2 flex items-center gap-2 text-sm text-subtle">
                  {authors.map((author, idx, arr) => (
                    <span key={author}>
                      {hasAuthorURL(author) ? (
                        <a
                          href={authorURLs[author]}
                          target="_blank"
                          className="text-subtle hover:underline"
                        >
                          {author}
                        </a>
                      ) : (
                        <>{author}</>
                      )}
                      {idx < arr.length - 1 && ", "}
                    </span>
                  ))}
                  {authors.length > 0 && <>&middot; </>}
                  <span className="flex items-center gap-1">
                    <RiCalendarLine className="mr-px h-3 w-3" />{" "}
                    {scope.humanDate}{" "}
                    {!!dateUpdated && <> (Updated: {dateUpdated})</>}
                  </span>{" "}
                  &middot; <span>{scope.reading.text}</span>
                  <Tags tags={scope.tags} />
                </p>
              </header>
              <div className="prose-invert blog-content prose mb-20 mt-12 text-basis prose-a:font-medium prose-a:no-underline prose-a:transition-all hover:prose-a:underline prose-code:tracking-tight prose-pre:border prose-pre:border-subtle prose-img:rounded-lg">
                {mdxContent}
              </div>
              <CTAs primary={primaryCTA} ctaRef={`blog-${slug}`} />
            </div>
            {scope.floatingCTA && <FloatingCTA ctaRef={`blog-${slug}`} />}
          </div>
        </article>
      </Container>
    </div>
  );
}

function CTAs({
  primary = "docs",
  ctaRef = "",
}: {
  primary: CTA;
  ctaRef: string;
}) {
  if (primary === "report2026") {
    return (
      <aside className="m-auto max-w-[70ch] border-t-[2px] border-stone-700 pt-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
          <div className="flex flex-col items-start">
            <h2 className="mt-0 text-xl font-medium text-basis">
              AI in Production: The 2026 Benchmark Report
            </h2>
            <p className="mb-6 mt-2 text-sm text-subtle">
              We surveyed 130 backend, full-stack, and AI engineers to find out
              how teams are actually running AI in production, and what's
              holding them back.
            </p>
            <Button
              variant="primary"
              size="sm"
              href={`https://www.inngest.com/content/ai-in-production-report-2026?ref=${ctaRef}`}
              arrow="right"
            >
              View Key Findings
            </Button>
          </div>
          <div className="flex-shrink-0">
            <Image
              src="/assets/blog/ai-in-production-report-2026-card/featured-image/featured-image.png"
              alt="AI in Production: The 2026 Benchmark Report"
              width={220}
              height={165}
              quality={75}
              className="rounded-lg"
            />
          </div>
        </div>
      </aside>
    );
  }

  const ctas = {
    sales: {
      title: "Chat with a solutions expert",
      description:
        "Connect with us to see if Inngest fits your queuing and orchestration needs.",
      button: {
        href: `/contact?ref=${ctaRef}`,
        text: "Contact us",
      },
    },
    docs: {
      title: "View the documentation",
      description:
        "Dive into quick starts, guides, and examples to learn Inngest.",
      button: {
        href: `/docs?ref=${ctaRef}`,
        text: "Read the docs",
      },
    },
    signUp: {
      title: "Get started with Inngest",
      description:
        "Sign up for free and start building reliable workflows today.",
      button: {
        href: `${process.env.NEXT_PUBLIC_SIGNUP_URL}?ref=${ctaRef}`,
        text: "Start for free",
      },
    },
  };

  const visibleCTAs =
    primary === "sales" ? [ctas.sales, ctas.signUp] : [ctas.signUp, ctas.sales];

  return (
    <aside className="m-auto grid max-w-[70ch] gap-16 border-t-[2px] border-stone-700 pt-8 text-indigo-500 sm:grid-cols-2">
      {visibleCTAs.map((cta, idx) => (
        <div key={cta.title} className="flex flex-col items-start">
          <h2 className="mt-6 text-xl font-medium text-basis">{cta.title}</h2>
          <p className="mb-6 mt-2 text-balance text-sm text-subtle">
            {cta.description}
          </p>
          <Button
            variant={idx === 0 ? "primary" : "outline"}
            href={cta.button.href}
            arrow="right"
          >
            {cta.button.text}
          </Button>
        </div>
      ))}
    </aside>
  );
}
