import Head from "next/head";
import Image from "next/image";
import rehypeSlug from "rehype-slug";
import rehypeRaw from "rehype-raw";
import type { MDXComponents } from "mdx/types";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import Footer from "../../shared/Footer";
import { rehypeRemoveTwoSlashMarkup, rehypeShiki } from "../../utils/code";
import { rehypeParseCodeBlocks } from "../../mdx/rehype.mjs";
import Tags from "../../shared/Blog/Tags";

// MDX Components
import DiscordCTA from "../../shared/Blog/DiscordCTA";
import Header from "src/shared/Header";
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
// import { LaunchWeekBanner } from "../index";

// @ts-ignore
import { remarkCodeHike, recmaCodeHike } from "codehike/mdx";
import { Code } from "src/shared/Code/CodeHike";
import { Callout } from "src/shared/Docs/mdx";
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
  showSubtitle?: boolean;

  author?: string;
  image?: string;
  imageCredits?: string;
  tags?: string[];

  /**
   * ISO8601
   */
  date: string;
  humanDate: string;
  dateUpdated?: string;

  primaryCTA?: "sales" | "docs";

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
  "Bruno Scheufler": "https://brunoscheufler.com",
  "Lydia Hallie": "https://x.com/lydiahallie",
  "Joe Adams": "https://www.linkedin.com/in/josephadams9/",
  "Charly Poly": "https://x.com/whereischarly",
};

export default function BlogLayout(props) {
  const scope: Scope = JSON.parse(props.post.scope.json);
  const slug = props.slug;
  const primaryCTA = scope.primaryCTA;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: scope.heading,
    description: scope.subtitle,
    image: [`${process.env.NEXT_PUBLIC_HOST}${scope.image}`],
    datePublished: scope.date,
    dateModified: scope.dateUpdated ? scope.dateUpdated : scope.date,
    author: [
      {
        "@type": scope.author ? "Person" : "Organization",
        name: scope.author || "Inngest",
        url:
          scope.author && authorURLs.hasOwnProperty(scope.author)
            ? authorURLs[scope.author]
            : process.env.NEXT_PUBLIC_HOST,
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

      <div className="font-sans">
        <Header />
        {/* <LaunchWeekBanner urlRef="blog-post-banner" /> */}
        <Container>
          <article>
            <main className="m-auto max-w-3xl pt-16">
              {scope.image && (
                <figure className="mx-auto flex flex-col items-end max-w-[768px]">
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
                      className="text-xs text-slate-400 mt-2"
                      dangerouslySetInnerHTML={{ __html: scope.imageCredits }}
                    ></figcaption>
                  )}
                </figure>
              )}
              <div className="max-w-[76ch] m-auto pt-12 lg:pt-18">
                <header className="">
                  <h1 className="text-basis font-medium text-2xl md:text-4xl xl:text-5xl mb-2 md:mb-4 tracking-tighter lg:leading-loose">
                    {scope.heading}
                  </h1>
                  {scope.showSubtitle && (
                    <p className="text-subtle text-lg font-bold mb-6 flex gap-1 items-center">
                      {scope.subtitle}
                    </p>
                  )}
                  <p className="text-subtle text-sm mt-2 flex items-center gap-2">
                    {!!scope.author ? (
                      authorURLs[scope.author] ? (
                        <>
                          <a
                            href={authorURLs[scope.author]}
                            target="_blank"
                            className="text-subtle hover:underline"
                          >
                            {scope.author}
                          </a>
                          &middot;{" "}
                        </>
                      ) : (
                        <>{scope.author} &middot; </>
                      )
                    ) : (
                      ""
                    )}
                    <span className="flex items-center gap-1">
                      <RiCalendarLine className="h-3 w-3 mr-px" />{" "}
                      {scope.humanDate}{" "}
                      {!!dateUpdated && <> (Updated: {dateUpdated})</>}
                    </span>{" "}
                    &middot; <span>{scope.reading.text}</span>
                    <Tags tags={scope.tags} />
                  </p>
                </header>
                <SectionProvider sections={[]}>
                  <div className="prose mt-12 mb-20 prose-img:rounded-lg prose-code:tracking-tight prose-pre:border prose-pre:border-subtle text-basis prose-a:no-underline hover:prose-a:underline prose-a:font-medium prose-a:transition-all prose-invert blog-content">
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
  primary: "docs" | "sales";
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
  };
  const visibleCTAs =
    primary === "sales" ? [ctas.sales, ctas.docs] : [ctas.docs, ctas.sales];
  return (
    <div className="max-w-[70ch] grid sm:grid-cols-2 gap-16 border-t-[2px] border-slate-800 pt-16 m-auto text-indigo-500">
      {visibleCTAs.map((c, idx) => (
        <div key={idx} className="flex flex-col items-start">
          <h2 className="text-basis text-xl font-medium mt-6">{c.title}</h2>
          <p className="text-subtle mb-6 mt-2 text-sm text-balance">
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
    </div>
  );
}

// This function gets called at build time to figure out which URLs
// we need to statically compile.
//
// These URLs will be treated as individual pages. getStaticProps is
// called for each URL with the slug in params.
export async function getStaticPaths() {
  const fs = require("fs");
  const paths = fs.readdirSync("./pages/blog/_posts/").map((fname) => {
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

  let filePath = `./pages/blog/_posts/${params.slug}.md`;
  if (!fs.existsSync(filePath) && fs.existsSync(filePath + "x")) {
    filePath += "x";
  }

  const source = fs.readFileSync(filePath);
  const { content, data } = matter(source);

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
      },
      designVersion: "2",
    },
  };
}
