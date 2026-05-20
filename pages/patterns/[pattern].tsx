import React from "react";
import { GetStaticProps, GetStaticPaths } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

import Header from "../../shared/Header";
import Footer from "../../shared/Footer";
import {
  loadMarkdownFile,
  loadMarkdownFilesMetadata,
} from "utils/markdown";
import { patternMarkdown } from "../../shared/Patterns/markdown";
import { MarkdownRender, extractMdHeadings } from "../../shared/Patterns/MarkdownRender";
import AgentView from "../../shared/Patterns/AgentView";
import PATTERN_SECTIONS, {
  type PatternItem,
  type PatternSectionMeta,
} from "../../shared/Patterns/patternsData";
import "../../shared/Patterns/pattern-page.css";

type PatternFrontmatter = {
  title?: string;
  subtitle?: string;
  pattern?: string;
  tags?: string[];
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const slug = Array.isArray(ctx?.params?.pattern)
    ? ctx?.params?.pattern[0]
    : ctx?.params?.pattern;

  const pageData = await loadMarkdownFile("pages/patterns/_patterns", slug);
  const metadata = (pageData.metadata ?? {}) as PatternFrontmatter;
  const sectionId = metadata.pattern ?? "";

  // Load siblings for prev/next and position label.
  const allEntries = await loadMarkdownFilesMetadata<PatternFrontmatter>(
    "pages/patterns/_patterns"
  );
  const sectionPatterns: PatternItem[] = allEntries
    .filter((e) => e.pattern === sectionId && e.title && e.subtitle)
    .map((e) => ({ slug: e.slug, title: e.title!, subtitle: e.subtitle! }))
    .sort((a, b) => a.title.localeCompare(b.title));

  const section = PATTERN_SECTIONS.find((s) => s.id === sectionId) ?? null;

  return {
    props: {
      slug: slug ?? "",
      title: metadata.title ?? "",
      subtitle: metadata.subtitle ?? "",
      tags: metadata.tags ?? [],
      content: pageData.content,
      section,
      sectionPatterns,
      designVersion: "2",
      meta: {
        title: metadata.title
          ? `${metadata.title} | Inngest patterns`
          : "Patterns: How to build with Inngest",
        description:
          metadata.subtitle ??
          "Architecture patterns for building reliable AI pipelines, background jobs, and event-driven workflows",
        image: "/assets/homepage/open-graph-june-2025.png",
      },
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const entries = await loadMarkdownFilesMetadata<PatternFrontmatter>(
    "pages/patterns/_patterns"
  );
  const paths = entries.map((e) => ({ params: { pattern: e.slug } }));
  return { paths, fallback: false };
};

type Props = {
  slug: string;
  title: string;
  subtitle: string;
  tags: string[];
  content: string;
  section: PatternSectionMeta | null;
  sectionPatterns: PatternItem[];
};

export default function PatternDetailPage({
  slug,
  title,
  subtitle,
  tags,
  content,
  section,
  sectionPatterns,
}: Props) {
  const router = useRouter();
  const isAgent = router.query.view === "agent";

  const accentStyle = section
    ? ({
        "--accent": section.accent.hex,
        "--accent-rgb": section.accent.rgb,
      } as React.CSSProperties)
    : undefined;

  if (isAgent) {
    return (
      <div className="relative page page--pattern" style={accentStyle}>
        <Header />
        <AgentView
          title={`/patterns/${slug}.md`}
          markdown={patternMarkdown(title, subtitle, slug, tags, content)}
          mdUrl={`/patterns/${slug}/md`}
        />
        <Footer />
      </div>
    );
  }

  const idxInSection = sectionPatterns.findIndex((p) => p.slug === slug);
  const prev = idxInSection > 0 ? sectionPatterns[idxInSection - 1] : null;
  const next =
    idxInSection < sectionPatterns.length - 1
      ? sectionPatterns[idxInSection + 1]
      : null;
  const positionLabel =
    sectionPatterns.length > 0
      ? `${String(idxInSection + 1).padStart(2, "0")} / ${String(sectionPatterns.length).padStart(2, "0")}`
      : "";
  const headings = extractMdHeadings(content);

  return (
    <div className="relative page page--pattern" style={accentStyle}>
      <Header />

      {/* Hero */}
      <section className="pattern-hero">
        <div className="pp-breadcrumb">
          <Link href="/patterns" className="pp-breadcrumb-link">
            Patterns
          </Link>
          {section && (
            <>
              <span className="pp-breadcrumb-sep">/</span>
              <span className="pp-breadcrumb-link">{section.name}</span>
            </>
          )}
          <span className="pp-breadcrumb-sep">/</span>
          <span className="pp-breadcrumb-current">{title}</span>
        </div>

        <div className="pattern-hero-grid">
          {section && (
            <div className="pattern-hero-meta">
              <span className="pattern-hero-section">
                <span className="pattern-hero-section-num">{section.number}</span>
                <span className="pattern-hero-section-name">{section.name}</span>
              </span>
              {positionLabel && (
                <span className="pattern-hero-position">{positionLabel}</span>
              )}
            </div>
          )}
          <div className="pattern-hero-body">
            {section && (
              <p className="pattern-hero-kicker">{section.kicker}</p>
            )}
            <h1 className="pattern-hero-title">{title}</h1>
            <p className="pattern-hero-sub">{subtitle}</p>
            {tags.length > 0 && (
              <div className="pattern-hero-tags">
                {tags.map((t) => (
                  <span key={t} className="pattern-hero-tag">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Article + TOC */}
      <section className="pattern-article">
        <article className="pattern-article-body">
          <MarkdownRender source={content} />
        </article>

        {headings.length > 0 && (
          <aside className="pattern-toc">
            <div className="pattern-toc-inner">
              <span className="pattern-toc-label">On this page</span>
              <ol className="pattern-toc-list">
                {headings.map((h, i) => (
                  <li key={h.slug}>
                    <a
                      href={`#${h.slug}`}
                      className="pattern-toc-link"
                      onClick={(e) => {
                        e.preventDefault();
                        document
                          .getElementById(h.slug)
                          ?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                    >
                      <span className="pattern-toc-num">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{h.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
              <div className="pattern-toc-meta">
                <Link href="/patterns" className="pattern-toc-back">
                  ← All Patterns
                </Link>
              </div>
            </div>
          </aside>
        )}
      </section>

      {/* Prev / Next */}
      {(prev || next) && (
        <section className="pattern-nav">
          <div className="pattern-nav-grid">
            {prev ? (
              <Link
                href={`/patterns/${prev.slug}`}
                className="pattern-nav-card pattern-nav-card--prev"
              >
                <span className="pattern-nav-direction">← Previous pattern</span>
                <span className="pattern-nav-title">{prev.title}</span>
                <span className="pattern-nav-subtitle">{prev.subtitle}</span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/patterns/${next.slug}`}
                className="pattern-nav-card pattern-nav-card--next"
              >
                <span className="pattern-nav-direction">Next pattern →</span>
                <span className="pattern-nav-title">{next.title}</span>
                <span className="pattern-nav-subtitle">{next.subtitle}</span>
              </Link>
            ) : (
              <span />
            )}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
