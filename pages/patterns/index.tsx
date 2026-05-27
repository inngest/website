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
    list.push({ slug: entry.slug, title: entry.title!, subtitle: entry.subtitle! });
    bySection.set(entry.pattern, list);
  }

  bySection.forEach((list) => list.sort((a, b) => a.title.localeCompare(b.title)));

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

export default function Patterns({ sections }: { sections: PatternSection[] }) {
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

  // Find the featured pattern's section + item for the Featured card
  const featuredSection = sections.find((s) => s.id === FEATURED_PATTERN.sectionId);
  const featuredPattern = featuredSection?.patterns.find(
    (p) => p.slug === FEATURED_PATTERN.slug
  );

  return (
    <div className="bg-canvasBase min-h-screen">
      <Header />

      <main
        className="mx-auto max-w-[1240px] px-6 md:px-14 pt-20 pb-32"
        style={{ "--patterns-gap": "80px" } as React.CSSProperties}
      >
        {/* Page header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-10">
            <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-subtle">
              Patterns
            </p>
            <PatternsViewToggle />
          </div>
          <h1 className="text-4xl md:text-6xl font-medium tracking-tight text-basis mb-6 text-balance">
            How to build with Inngest
          </h1>
          <p className="text-lg text-subtle max-w-2xl leading-relaxed">
            Production-tested patterns for AI agents, durable workflows, and the
            event-driven systems they live in. Each pattern is built on Inngest
            primitives and the guarantees they provide.
          </p>
        </div>

        {/* Featured pattern */}
        {featuredSection && featuredPattern && (
          <Featured
            featured={FEATURED_PATTERN}
            section={featuredSection}
            pattern={featuredPattern}
          />
        )}

        {/* Section grid */}
        <div className="mt-20 flex flex-col" style={{ gap: "var(--patterns-gap)" }}>
          {sections.map((section) => (
            <section key={section.id}>
              {/* Section header */}
              <div className="mb-8">
                <div className="flex items-baseline gap-3 mb-3">
                  <span
                    className={`font-mono text-[11px] tracking-[0.16em] uppercase ${section.accent.text}`}
                  >
                    {section.number}
                  </span>
                  <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-subtle">
                    {section.name}
                  </span>
                </div>
                <p className="text-xs font-mono tracking-[0.14em] uppercase text-subtle mb-4">
                  {section.kicker}
                </p>
                <p className="text-[15px] text-subtle leading-relaxed max-w-2xl">
                  {section.description}
                </p>
              </div>

              {/* Accent rule */}
              <div
                className="h-px mb-6"
                style={{
                  background: `linear-gradient(to right, ${section.accent.hex}, transparent 60%)`,
                  opacity: 0.35,
                }}
              />

              {/* Pattern list */}
              <div className="grid gap-4 md:grid-cols-2">
                {section.patterns.map((pattern) => (
                  <Link
                    key={pattern.slug}
                    href={`/patterns/${pattern.slug}`}
                    className={`group block rounded-lg border border-subtle/10 p-6 transition-colors hover:border-[rgba(${section.accent.rgb},0.3)] hover:bg-[rgba(${section.accent.rgb},0.04)]`}
                  >
                    <h3 className="text-[17px] font-medium text-basis mb-2 group-hover:text-white transition-colors">
                      {pattern.title}
                    </h3>
                    <p className="text-sm text-subtle leading-relaxed">
                      {pattern.subtitle}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
