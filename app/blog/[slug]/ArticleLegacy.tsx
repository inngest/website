"use client";

import Image from "next/image";
import type { MDXComponents } from "mdx/types";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { RiCalendarLine } from "@remixicon/react";

import Container from "src/shared/layout/Container";
import { Button } from "src/shared/Button";
import Tags from "src/shared/Blog/Tags";
import DiscordCTA from "src/shared/Blog/DiscordCTA";
import CTACallout from "src/shared/CTACallout";
import Blockquote from "src/shared/Blog/Blockquote";
import AutoplayVideo from "src/shared/Blog/AutoplayVideo";
import YouTube from "react-youtube-embed";
import { Code } from "src/shared/Code/CodeHike";
import { Callout, Col, Row } from "src/shared/Docs/mdx";
import ProductHunt from "src/app/launch-week/ProductHunt";
import FloatingCTA from "src/components/Blog/FloatingCTA";
import { SectionProvider } from "src/shared/Docs/SectionProvider";

// Legacy /blog/[slug] article layout, ported verbatim from the
// pages-router page so the flag-off blog keeps its exact look. Site
// chrome (Header/Footer/AnnouncementBanner) is intentionally omitted —
// app/layout.tsx renders the legacy chrome when the v1 flag is off. The
// page reads + serialises the MDX server-side and hands the compiled
// result here.

type Scope = {
  path: string;
  heading: string;
  subtitle?: string;
  showSubtitle?: boolean;
  author?: string | string[];
  image?: string;
  imageCredits?: string;
  tags?: string[];
  date?: string;
  humanDate?: string;
  dateUpdated?: string;
  primaryCTA?: "docs" | "sales" | "signUp";
  floatingCTA?: boolean;
  reading?: { text?: string };
};

const components: MDXComponents = {
  DiscordCTA,
  Button: Button as unknown as MDXComponents["Button"],
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
  "Bruno Scheufler": "",
  "Lydia Hallie": "https://x.com/lydiahallie",
  "Joe Adams": "https://www.linkedin.com/in/josephadams9/",
  "Charly Poly": "https://x.com/whereischarly",
  "Ana Filipa de Almeida": "https://www.linkedin.com/in/anafilipadealmeida/",
  "Jess Lin": "https://x.com/jesstyping",
};

export default function ArticleLegacy({
  source,
  scope,
  slug,
}: {
  source: MDXRemoteSerializeResult;
  scope: Scope;
  slug: string;
}) {
  const primaryCTA = scope.primaryCTA;

  const authors = scope.author
    ? Array.isArray(scope.author)
      ? scope.author
      : [scope.author]
    : [];

  const structuredDataAuthors = authors.map((author) => ({
    "@type": "Person",
    name: author,
    url: authorURLs.hasOwnProperty(author)
      ? authorURLs[author]
      : process.env.NEXT_PUBLIC_HOST,
  }));

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

  let dateUpdated: string | null = null;
  try {
    dateUpdated = scope.dateUpdated
      ? new Date(scope.dateUpdated).toLocaleDateString()
      : null;
  } catch {
    dateUpdated = null;
  }

  return (
    <div className="bg-stone-950 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
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
                  />
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
                  {authors.map((author, idx, arr) => (
                    <span key={author}>
                      {authorURLs[author] ? (
                        <a
                          href={authorURLs[author]}
                          target="_blank"
                          rel="noreferrer"
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
                    <RiCalendarLine className="mr-px h-3 w-3" /> {scope.humanDate}{" "}
                    {!!dateUpdated && <> (Updated: {dateUpdated})</>}
                  </span>{" "}
                  &middot; <span>{scope.reading?.text}</span>
                  <Tags tags={scope.tags} />
                </p>
              </header>
              <SectionProvider sections={[]}>
                <div className="prose-invert blog-content prose mb-20 mt-12 text-basis prose-a:font-medium prose-a:no-underline prose-a:transition-all hover:prose-a:underline prose-code:tracking-tight prose-pre:border prose-pre:border-subtle prose-img:rounded-lg">
                  <MDXRemote {...source} components={components} />
                </div>
              </SectionProvider>
              <CTAs primary={primaryCTA ?? "docs"} ctaRef={`blog-${slug}`} />
            </div>
            {scope.floatingCTA && <FloatingCTA ctaRef={`blog-${slug}`} />}
          </main>
        </article>
      </Container>
    </div>
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
      button: { href: `/contact?ref=${ctaRef}`, text: "Contact us" },
    },
    docs: {
      title: "View the documentation",
      description:
        "Dive into quick starts, guides, and examples to learn Inngest.",
      button: { href: `/docs?ref=${ctaRef}`, text: "Read the docs" },
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
