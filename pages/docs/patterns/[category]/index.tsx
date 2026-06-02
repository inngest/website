import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { GetStaticPaths, GetStaticProps } from "next";

import {
  getPatternSections,
  getSection,
} from "../../../../shared/Patterns/patternsData";
import Viz from "../../../../shared/Patterns/Viz";
import AgentView from "../../../../shared/Patterns/AgentView";
import { categoryMarkdown } from "../../../../shared/Patterns/markdown";
import "../../../../shared/Patterns/patterns-docs.css";

function Arrow({ s = 14 }: { s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M3 7 L11 7 M7 3 L11 7 L7 11" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: getPatternSections().map((s) => ({ params: { category: s.id } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps = async (ctx) => {
  const category = String(ctx.params?.category);
  const section = getSection(category);
  if (!section) return { notFound: true };
  return {
    props: {
      category,
      title: section.name,
      description: section.description,
      hidePageSidebar: true,
      designVersion: "2",
      meta: {
        title: `${section.name} patterns | Inngest`,
        description: section.description,
        image: "/assets/homepage/open-graph-june-2025.png",
      },
    },
  };
};

export default function CategoryPage({ category }: { category: string }) {
  const router = useRouter();
  const sections = getPatternSections();
  const idx = sections.findIndex((s) => s.id === category);
  const section = sections[idx];
  if (!section) return null;
  const next = idx < sections.length - 1 ? sections[idx + 1] : null;

  const accentStyle = {
    "--accent": section.accent.hex,
    "--accent-deep": section.accentDeep,
  } as React.CSSProperties;

  if (router.query.view === "agent") {
    return (
      <AgentView
        title={`/docs/patterns/${section.id}.md`}
        markdown={categoryMarkdown(section)}
        mdUrl={`/docs/patterns/${section.id}/md`}
      />
    );
  }

  return (
    <div className="pattern-scope" style={accentStyle}>
      <div className="md-prose">
        <span className="cat-eyebrow mono">
          <span className="cat-eyebrow-dot" />
          {section.number} · {section.kicker}
        </span>
        <h1 className="md-h1" id="top">
          {section.name}
        </h1>
        <p className="md-p md-lead">{section.description}</p>
      </div>

      <figure className="figure" style={{ marginTop: 28, marginBottom: 8 }}>
        <Viz id={section.viz} accent={section.accent.hex} />
      </figure>

      <div className="md-prose">
        <h2 className="md-h2" id="patterns">
          Patterns
        </h2>
      </div>
      <div className="cat-rows">
        {section.patterns.map((p, i) => (
          <Link
            key={p.slug}
            className="cat-row"
            href={`/docs/patterns/${section.id}/${p.slug}`}
          >
            <span className="cat-row-num mono">{String(i + 1).padStart(2, "0")}</span>
            <span className="cat-row-body">
              <span className="cat-row-title">{p.title}</span>
              <span className="cat-row-sub">{p.subtitle}</span>
            </span>
            <span className="cat-row-arrow">
              <Arrow />
            </span>
          </Link>
        ))}
      </div>

      {next && (
        <Link
          className="next-cat"
          href={`/docs/patterns/${next.id}`}
          style={
            {
              "--accent": next.accent.hex,
              "--accent-deep": next.accentDeep,
            } as React.CSSProperties
          }
        >
          <span className="next-cat-label mono">Next primitive →</span>
          <span className="next-cat-name">{next.name}</span>
        </Link>
      )}
    </div>
  );
}
