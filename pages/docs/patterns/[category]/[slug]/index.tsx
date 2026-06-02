import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { GetStaticPaths, GetStaticProps } from "next";

import { loadMarkdownFile } from "utils/markdown";
import {
  PATTERNS,
  getPatternSections,
  getSection,
} from "../../../../../shared/Patterns/patternsData";
import {
  MarkdownRender,
} from "../../../../../shared/Patterns/MarkdownRender";
import AgentView from "../../../../../shared/Patterns/AgentView";
import { patternMarkdown } from "../../../../../shared/Patterns/markdown";
import "../../../../../shared/Patterns/patterns-docs.css";

type PatternFrontmatter = {
  title?: string;
  subtitle?: string;
  tags?: string[];
  video?: string;
};

// Turn any YouTube URL (watch, youtu.be, embed) into a privacy-enhanced embed.
function youtubeEmbedUrl(url?: string): string | null {
  if (!url) return null;
  const res = [/[?&]v=([\w-]{11})/, /youtu\.be\/([\w-]{11})/, /\/embed\/([\w-]{11})/];
  for (const re of res) {
    const m = url.match(re);
    if (m) return `https://www.youtube-nocookie.com/embed/${m[1]}`;
  }
  return null;
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: PATTERNS.map((p) => ({ params: { category: p.category, slug: p.slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps = async (ctx) => {
  const category = String(ctx.params?.category);
  const slug = String(ctx.params?.slug);
  const section = getSection(category);
  if (!section) return { notFound: true };

  const pageData = await loadMarkdownFile("shared/Patterns/_patterns", slug);
  const md = (pageData.metadata ?? {}) as PatternFrontmatter;

  const patterns = getPatternSections().find((s) => s.id === category)?.patterns ?? [];
  const i = patterns.findIndex((p) => p.slug === slug);
  const prev = i > 0 ? patterns[i - 1] : null;
  const next = i >= 0 && i < patterns.length - 1 ? patterns[i + 1] : null;

  return {
    props: {
      category,
      slug,
      title: md.title ?? slug,
      subtitle: md.subtitle ?? "",
      tags: md.tags ?? [],
      video: md.video ?? "",
      content: pageData.content,
      sectionName: section.name,
      accentHex: section.accent.hex,
      accentDeep: section.accentDeep,
      prev,
      next,
      description: md.subtitle ?? "",
      hidePageSidebar: true,
      designVersion: "2",
      meta: {
        title: md.title ? `${md.title} | Inngest patterns` : "Inngest patterns",
        description:
          md.subtitle ??
          "Architecture patterns for building reliable AI pipelines, background jobs, and event-driven workflows.",
        image: "/assets/homepage/open-graph-june-2025.png",
      },
    },
  };
};

type Props = {
  category: string;
  slug: string;
  title: string;
  subtitle: string;
  tags: string[];
  video: string;
  content: string;
  sectionName: string;
  accentHex: string;
  accentDeep: string;
  prev: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
};

export default function PatternPage({
  category,
  slug,
  title,
  subtitle,
  tags,
  video,
  content,
  sectionName,
  accentHex,
  accentDeep,
  prev,
  next,
}: Props) {
  const router = useRouter();
  const accentStyle = {
    "--accent": accentHex,
    "--accent-deep": accentDeep,
  } as React.CSSProperties;

  if (router.query.view === "agent") {
    return (
      <AgentView
        title={`/docs/patterns/${category}/${slug}.md`}
        markdown={patternMarkdown(title, subtitle, slug, tags, content)}
        mdUrl={`/docs/patterns/${category}/${slug}/md`}
      />
    );
  }

  const embedUrl = youtubeEmbedUrl(video);

  return (
    <div className="pattern-scope" style={accentStyle}>
      <div className="md-prose">
        <span className="cat-eyebrow mono">
          <span className="cat-eyebrow-dot" />
          <Link href={`/docs/patterns/${category}`} className="md-link" style={{ border: 0 }}>
            {sectionName}
          </Link>
        </span>
        <h1 className="md-h1" id="top">
          {title}
        </h1>
        {subtitle && <p className="md-p md-lead">{subtitle}</p>}
      </div>

      {embedUrl && (
        <div className="pattern-video">
          <iframe
            src={embedUrl}
            title={`${title} video`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        </div>
      )}

      <MarkdownRender source={content} />

      <div className="pat-nav">
        {prev ? (
          <Link className="pat-nav-card" href={`/docs/patterns/${category}/${prev.slug}`}>
            <span className="pat-nav-dir mono">← Previous</span>
            <span className="pat-nav-title">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            className="pat-nav-card pat-nav-card--next"
            href={`/docs/patterns/${category}/${next.slug}`}
          >
            <span className="pat-nav-dir mono">Next →</span>
            <span className="pat-nav-title">{next.title}</span>
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
