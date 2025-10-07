import Head from "next/head";
import Image from "next/image";
import rehypeSlug from "rehype-slug";
import rehypeRaw from "rehype-raw";
import type { MDXComponents } from "mdx/types";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import Footer from "src/components/RedesignedLanding/Footer";
import { rehypeRemoveTwoSlashMarkup, rehypeShiki } from "../../utils/code";
import { rehypeParseCodeBlocks } from "../../mdx/rehype.mjs";
import Tags from "../../shared/Blog/Tags";

// MDX Components
import DiscordCTA from "../../shared/Blog/DiscordCTA";
import Header from "src/components/RedesignedLanding/Header/Header";
import Container from "src/shared/layout/Container";
import { Button } from "src/shared/Button";
import { RiCalendarLine } from "@remixicon/react";
import CTACallout from "src/shared/CTACallout";
import Blockquote from "src/shared/Blog/Blockquote";
import AutoplayVideo from "src/shared/Blog/AutoplayVideo";
import rehypeCodeTitles from "rehype-code-titles";
import YouTube from "react-youtube-embed";
import remarkGfm from "remark-gfm";
import { SectionProvider } from "src/shared/Docs/SectionProvider";
import FloatingCTA from "src/components/Blog/FloatingCTA";

// @ts-ignore
import { remarkCodeHike, recmaCodeHike } from "codehike/mdx";
import { Code } from "src/shared/Code/CodeHike";
import { Callout, Col, Row } from "src/shared/Docs/mdx";
import ProductHunt from "src/app/launch-week/ProductHunt";

const chConfig = {
  components: { code: "Code" },
  syntaxHighlighting: {
    theme: "dracula-soft",
  },
};

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
};

type Props = {
  post: {
    compiledSource: string;
    scope: {
      json: string;
    };
  };
  meta: {
    disabled: true;
  };
};

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

  /**
   * ISO8601
   */
  date: string;
  humanDate: string;
  dateUpdated?: string;

  primaryCTA?: "sales" | "docs" | "signUp";
  floatingCTA?: boolean;

  reading: {
    text: string;
    minutes: number;
    time: number;
    words: number;
  };
};

const authorURLs = {
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
  // "Bruno Scheufler": "https://brunoscheufler.com", // removed while site is disabled
  "Lydia Hallie": "https://x.com/lydiahallie",
  "Joe Adams": "https://www.linkedin.com/in/josephadams9/",
  "Charly Poly": "https://x.com/whereischarly",
  "Ana Filipa de Almeida": "https://www.linkedin.com/in/anafilipadealmeida/",
  "Jess Lin": "https://x.com/jesstyping",
};

export default function BlogLayout(props) {
  const scope: Scope = JSON.parse(props.post.scope.json);
  const slug = props.slug;
  const primaryCTA = scope.primaryCTA;

  const structuredDataAuthors = (
    Array.isArray(scope.author) ? scope.author : [scope.author]
  ).map((author) => {
    return {
      "@type": "Person",
      name: author,
      url: authorURLs.hasOwnProperty(author)
        ? authorURLs[author]
        : process.env.NEXT_PUBLIC_HOST,
    };
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: scope.heading,
    description: scope.subtitle,
    image: [`${process.env.NEXT_PUBLIC_HOST}${scope.image}`],
    datePublished: scope.date,
    dateModified: scope.dateUpdated ? scope.dateUpdated : scope.date,
    author:
      structuredDataAuthors.length > 0
        ? structuredDataAuthors
        : [
            {
              "@type": "Organization",
              name: "Inngest",
              url: process.env.NEXT_PUBLIC_HOST,
            },
          ],
  };
  const title = `${scope.heading} - Inngest Blog`;
  let dateUpdated: string | null = null;
  try {
    dateUpdated = scope.dateUpdated
      ? new Date(scope.dateUpdated).toLocaleDateString()
      : null;
  } catch (err) {
    console.log(`Could not parse updated date: ${scope.dateUpdated}`);
  }

  const authors = scope.author
    ? Array.isArray(scope.author)
      ? scope.author
      : [scope.author]
    : [];

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={scope.subtitle}></meta>
        <meta name="title" content={scope.heading}></meta>
        <meta property="og:title" content={`${scope.heading} - Inngest Blog`} />
        <meta property="og:description" content={scope.subtitle} />
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_HOST}${scope.path}`}
        />
        {!!scope.image && (
          <meta
            property="og:image"
            content={`${process.env.NEXT_PUBLIC_HOST}${scope.image}`}
          />
        )}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@inngest" />
        <meta
          name="twitter:title"
          content={`${scope.heading} - Inngest Blog`}
        />
        <meta name="twitter:description" content={scope.subtitle} />
        {!!scope.image && (
          <meta
            name="twitter:image"
            content={`${process.env.NEXT_PUBLIC_HOST}${scope.image}`}
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        ></script>
      </Head>

      {/* <ThemeToggleButton isFloating={true} /> */}

      <div className="bg-stone-950 font-sans">
        <Header />
        <Container>
          <article>
            <main className="relative m-auto max-w-3xl py-16">
              {scope.image && (
                <figure className="mx-auto flex max-w-[768px] flex-col items-end">
                  <Image
                    className="rounded-lg shadow-lg"
                    src={scope.image}
                    alt={`Featured image for ${scope.heading} blog post`}
                    width={768}
                    height={768 / 2}
                    quality={95}
                  />
                  {scope.imageCredits && (
                    <figcaption
                      className="mt-2 text-xs text-slate-400"
                      dangerouslySetInnerHTML={{ __html: scope.imageCredits }}
                    ></figcaption>
                  )}
                </figure>
              )}
              <div className="lg:pt-18 m-auto max-w-[76ch] pt-12">
                <header className="">
                  <h1 className="mb-2 text-2xl font-medium tracking-tighter text-basis md:mb-4 md:text-4xl lg:leading-loose xl:text-5xl">
                    {scope.heading}
                  </h1>
                  {scope.showSubtitle && (
                    <p className="mb-6 flex items-center gap-1 text-lg font-bold text-subtle">
                      {scope.subtitle}
                    </p>
                  )}
                  <p className="mt-2 flex items-center gap-2 text-sm text-subtle">
                    {authors.map((author, idx) => (
                      <>
                        {idx > 0 && ", "}
                        {authorURLs[author] ? (
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
                      </>
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
                <SectionProvider sections={[]}>
                  <div className="prose-invert blog-content prose mb-20 mt-12 text-basis prose-a:font-medium prose-a:no-underline prose-a:transition-all hover:prose-a:underline prose-code:tracking-tight prose-pre:border prose-pre:border-subtle prose-img:rounded-lg">
                    {/* @ts-ignore */}
                    <MDXRemote
                      compiledSource={props.post.compiledSource}
                      scope={scope}
                      components={components}
                    />
                  </div>
                </SectionProvider>
                <CTAs primary={primaryCTA} ctaRef={`blog-${slug}`} />
              </div>
              {scope.floatingCTA && <FloatingCTA ctaRef={`blog-${slug}`} />}
            </main>
          </article>
        </Container>
        <Footer />
      </div>
    </>
  );
}

function CTAs({
  primary = "docs",
  ctaRef = "",
}: {
  primary: "docs" | "sales" | "signUp";
  ctaRef: string;
}) {
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
      {visibleCTAs.map((c, idx) => (
        <div key={idx} className="flex flex-col items-start">
          <h2 className="mt-6 text-xl font-medium text-basis">{c.title}</h2>
          <p className="mb-6 mt-2 text-balance text-sm text-subtle">
            {c.description}
          </p>
          <Button
            variant={idx === 0 ? "primary" : "outline"}
            href={c.button.href}
            arrow="right"
          >
            {c.button.text}
          </Button>
        </div>
      ))}
    </aside>
  );
}

// This function gets called at build time to figure out which URLs
// we need to statically compile.
//
// These URLs will be treated as individual pages. getStaticProps is
// called for each URL with the slug in params.
export async function getStaticPaths() {
  const fs = require("fs");
  const paths = fs.readdirSync("./content/blog/").map((fname) => {
    return `/blog/${fname.replace(/.mdx?/, "")}`;
  });
  return { paths, fallback: false };
}

// This function also gets called at build time to generate specific content.
export async function getStaticProps({ params }) {
  // These are required here as this function is not included in frontend
  // browser builds.
  const fs = require("fs");
  const readingTime = require("reading-time");
  const matter = require("gray-matter");

  let filePath = `./content/blog/${params.slug}.md`;
  if (!fs.existsSync(filePath) && fs.existsSync(filePath + "x")) {
    filePath += "x";
  }

  const source = fs.readFileSync(filePath);
  const { content, data } = matter(source);

  // Handle redirects
  if (data.redirect) {
    return {
      redirect: {
        destination: data.redirect,
        permanent: true,
      },
    };
  }

  data.path = `/blog/${params.slug}`;
  data.reading = readingTime(content);
  // Format the reading date.
  data.humanDate = data.date.toLocaleDateString();

  data.tags =
    data.tags && typeof data.tags === "string"
      ? data.tags.split(",").map((tag) => tag.trim())
      : data.tags;

  // type Post = {
  //   compiledSource: string,
  //   scope: string,
  // }
  const nodeTypes = [
    "mdxFlowExpression",
    "mdxJsxFlowElement",
    "mdxJsxTextElement",
    "mdxTextExpression",
    "mdxjsEsm",
  ];
  const post = await serialize(content, {
    scope: { json: JSON.stringify(data) },
    mdxOptions: {
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
    },
  });
  return {
    props: {
      slug: params.slug,
      post,
      meta: {
        disabled: true,
        canonical_url: data.canonical_url ? data.canonical_url : null,
      },
      designVersion: "2",
    },
  };
}
