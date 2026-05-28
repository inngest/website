import Link from "next/link";
import { useRouter } from "next/router";

import { loadMarkdownFilesMetadata } from "utils/markdown";
import PATTERN_SECTIONS, {
  type PatternItem,
  type PatternSection,
} from "../../shared/Patterns/patternsData";
import Featured, { FEATURED_PATTERN } from "../../shared/Patterns/Featured";
import { indexMarkdown } from "../../shared/Patterns/markdown";
import Header from "src/components/RedesignedLanding/Header/Header";
import Footer from "src/components/RedesignedLanding/Footer";
import AgentView from "../../shared/Patterns/AgentView";
import PatternsViewToggle from "../../shared/Patterns/PatternsViewToggle";

import "../../shared/Patterns/patternsHub.css";

type PatternFrontmatter = {
  title?: string;
  subtitle?: string;
  pattern?: string;
};

export async function getStaticProps() {
  const entries = await loadMarkdownFilesMetadata<PatternFrontmatter>(
    "pages/patterns/_patterns"
  );

  const bySection = new Map<string, PatternItem[]>();
  for (const entry of entries) {
    if (!entry.pattern || !entry.title || !entry.subtitle) continue;
    const list = bySection.get(entry.pattern) ?? [];
    list.push({
      slug: entry.slug,
      title: entry.title!,
      subtitle: entry.subtitle!,
    });
    bySection.set(entry.pattern, list);
  }

  bySection.forEach((list) =>
    list.sort((a, b) => a.title.localeCompare(b.title))
  );

  const sections: PatternSection[] = PATTERN_SECTIONS.flatMap((meta) => {
    const patterns = bySection.get(meta.id);
    if (!patterns || patterns.length === 0) return [];
    return [{ ...meta, patterns }];
  });

  return {
    props: {
      sections,
      designVersion: "2",
      meta: {
        title: "Patterns: How to build with Inngest",
        description:
          "Production-tested patterns for AI agents, durable workflows, and the event-driven systems they live in.",
        image: "/assets/homepage/open-graph-june-2025.png",
      },
    },
  };
}

export default function Patterns({
  sections,
}: {
  sections: PatternSection[];
}) {
  const router = useRouter();
  const isAgent = router.query.view === "agent";

  if (isAgent) {
    const md = indexMarkdown(sections, FEATURED_PATTERN);
    return (
      <div className="bg-canvasBase">
        <Header />
        <AgentView title="/patterns.md" markdown={md} mdUrl="/patterns/md" />
        <Footer />
      </div>
    );
  }

  const featuredSection = sections.find(
    (s) => s.id === FEATURED_PATTERN.sectionId
  );
  const featuredPattern = featuredSection?.patterns.find(
    (p) => p.slug === FEATURED_PATTERN.slug
  );

  return (
    <div className="patterns-hub bg-canvasBase min-h-screen">
      <Header />

      <div className="page">
        <div className="hub-toolbar">
          <PatternsViewToggle />
        </div>

        <section className="hero">
          <div className="hero-meta">
            <span className="hero-meta-item">PATTERNS · v0.1</span>
            <span className="hero-meta-sep">·</span>
            <span className="hero-meta-item">UPDATED MAY 2026</span>
          </div>
          <h1 className="hero-title">
            How to build with{" "}
            <span className="hero-title-soft">Inngest</span>.
          </h1>
          <p className="hero-sub">
            Production-tested patterns for AI agents, durable workflows, and
            the event-driven systems they live in. Each pattern is built on
            Inngest primitives — steps, events, throttling, schedules,
            channels — and the guarantees they provide.
          </p>
        </section>

        {featuredSection && featuredPattern && (
          <Featured
            featured={FEATURED_PATTERN}
            section={featuredSection}
            pattern={featuredPattern}
          />
        )}

        <main className="sections">
          {sections.map((section, i) => (
            <SectionBlock
              key={section.id}
              section={section}
              featured={i === 0}
            />
          ))}
        </main>
      </div>

      <Footer />
    </div>
  );
}

function SectionBlock({
  section,
  featured,
}: {
  section: PatternSection;
  featured: boolean;
}) {
  return (
    <section
      className={`section ${featured ? "section--featured" : ""}`}
      id={`section-${section.id}`}
      style={
        {
          "--accent": section.accent.hex,
          "--accent-rgb": section.accent.rgb,
        } as React.CSSProperties
      }
    >
      <div className="section-rule">
        <span className="section-rule-label">
          <span className="section-rule-num">{section.number}</span>
          <span className="section-rule-name">{section.name}</span>
        </span>
        <span className="section-rule-line" />
        <span className="section-rule-meta">
          {section.patterns.length}{" "}
          {section.patterns.length === 1 ? "pattern" : "patterns"}
        </span>
      </div>

      <div
        className={`section-body ${
          featured ? "section-body--featured" : ""
        }`}
      >
        <header className="section-header">
          <h2 className="section-title">{section.name}</h2>
          <p className="section-desc">{section.description}</p>
        </header>

        <div className="section-list">
          {section.patterns.map((pattern) => (
            <Link
              key={pattern.slug}
              href={`/patterns/${pattern.slug}`}
              className="pattern-row"
            >
              <span className="pattern-row-inner">
                <span className="pattern-row-title">{pattern.title}</span>
                <span className="pattern-row-subtitle">
                  {pattern.subtitle}
                </span>
              </span>
              <span className="pattern-row-arrow" aria-hidden>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M3 7 L11 7 M7 3 L11 7 L7 11"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
