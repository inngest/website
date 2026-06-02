import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import {
  getPatternSections,
  FEATURED_PATTERN,
  type PatternSection,
} from "../../../shared/Patterns/patternsData";
import Viz from "../../../shared/Patterns/Viz";
import AgentView from "../../../shared/Patterns/AgentView";
import { indexMarkdown } from "../../../shared/Patterns/markdown";
import "../../../shared/Patterns/patterns-docs.css";

const META_DESCRIPTION =
  "Production-tested patterns for AI agents, durable workflows, and the event-driven systems they live in.";

export async function getStaticProps() {
  return {
    props: {
      title: "Patterns",
      description: META_DESCRIPTION,
      hidePageSidebar: true,
      designVersion: "2",
      meta: {
        title: "Patterns: How to build with Inngest",
        description: META_DESCRIPTION,
        image: "/assets/homepage/open-graph-june-2025.png",
      },
    },
  };
}

function Arrow({ s = 14 }: { s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M3 7 L11 7 M7 3 L11 7 L7 11" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function scope(s: { accent: { hex: string }; accentDeep: string }) {
  return {
    "--accent": s.accent.hex,
    "--accent-deep": s.accentDeep,
  } as React.CSSProperties;
}

export default function PatternsLanding() {
  const router = useRouter();
  const sections = getPatternSections();
  const total = sections.reduce((acc, s) => acc + s.patterns.length, 0);

  if (router.query.view === "agent") {
    return (
      <AgentView
        title="/docs/patterns.md"
        markdown={indexMarkdown(sections)}
        mdUrl="/docs/patterns/md"
      />
    );
  }

  const featuredSection = sections.find((s) => s.id === FEATURED_PATTERN.category);
  const featuredPattern = featuredSection?.patterns.find(
    (p) => p.slug === FEATURED_PATTERN.slug
  );

  return (
    <div className="pattern-scope" style={scope(sections[0])}>
      <div className="md-prose">
        <h1 className="md-h1" id="top">
          Patterns
        </h1>
        <p className="md-p md-lead">
          Production-tested patterns for AI agents, durable workflows, and the
          event-driven systems they live in. Each pattern is built on Inngest
          primitives — steps, events, throttling, schedules, channels — and the
          guarantees they provide. {sections.length} primitives, {total} patterns.
        </p>
      </div>

      {featuredSection && featuredPattern && (
        <Link
          className="feat"
          href={`/docs/patterns/${featuredSection.id}/${featuredPattern.slug}`}
          style={scope(featuredSection)}
        >
          <div className="feat-body">
            <span className="feat-tag">
              <span className="feat-dot" />
              {FEATURED_PATTERN.label}
            </span>
            <span className="feat-title">{featuredPattern.title}</span>
            <span className="feat-excerpt">{FEATURED_PATTERN.excerpt}</span>
            <span className="feat-cta">
              Read the pattern <Arrow />
            </span>
          </div>
          <div className="feat-viz">
            {FEATURED_PATTERN.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={FEATURED_PATTERN.image} alt="" className="feat-img" />
            ) : (
              <Viz id={featuredSection.viz} accent={featuredSection.accent.hex} />
            )}
          </div>
        </Link>
      )}

      <div className="md-prose">
        <h2 className="md-h2" id="browse">
          Browse by primitive
        </h2>
        <p className="md-p">Pick a category to see its patterns.</p>
      </div>

      <div className="cat-grid">
        {sections.map((s: PatternSection) => (
          <Link
            key={s.id}
            className="cat-card"
            href={`/docs/patterns/${s.id}`}
            style={scope(s)}
          >
            <div className="cat-card-head">
              <span className="cat-card-num mono">{s.number}</span>
              <span className="cat-card-dot" />
            </div>
            <span className="cat-card-name">{s.name}</span>
            <span className="cat-card-kicker">{s.kicker}</span>
            <span className="cat-card-meta mono">
              {s.patterns.length} {s.patterns.length === 1 ? "pattern" : "patterns"}{" "}
              <Arrow s={12} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
