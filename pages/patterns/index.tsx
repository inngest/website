import { useRouter } from "next/router";

import Header from "src/components/RedesignedLanding/Header/Header";
import Footer from "../../shared/Footer";
import Container from "../../shared/layout/Container";
import { loadMarkdownFilesMetadata } from "utils/markdown";
import PATTERN_SECTIONS, {
  type PatternItem,
  type PatternSection,
} from "../../shared/Patterns/patternsData";
import Featured, {
  FEATURED_PATTERN,
} from "../../shared/Patterns/Featured";
import { indexMarkdown } from "../../shared/Patterns/markdown";
import AgentView from "../../shared/Patterns/AgentView";

// ── Page ─────────────────────────────────────────────────────────────────────

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
      title: entry.title,
      subtitle: entry.subtitle,
    });
    bySection.set(entry.pattern, list);
  }

  // Stable in-section ordering: alphabetical by title.
  bySection.forEach((list) => {
    list.sort((a, b) => a.title.localeCompare(b.title));
  });

  const sections: PatternSection[] = PATTERN_SECTIONS.flatMap((meta) => {
    const patterns = bySection.get(meta.id);
    if (!patterns || patterns.length === 0) return [];
    return [{ ...meta, patterns }];
  });

  const featuredSection = sections.find((s) => s.id === FEATURED_PATTERN.sectionId);
  const featuredPattern = featuredSection?.patterns.find(
    (p) => p.slug === FEATURED_PATTERN.slug
  );
  const featuredPayload =
    featuredSection && featuredPattern
      ? {
          featured: FEATURED_PATTERN,
          section: featuredSection,
          pattern: featuredPattern,
        }
      : null;

  return {
    props: {
      sections,
      featuredPayload,
      designVersion: "2",
      meta: {
        title: "Patterns: How to build with Inngest",
        description:
          "Production-tested patterns for AI agents, durable workflows, and the event-driven systems they live in.",
        image: "/assets/patterns/og-image-patterns.jpg",
      },
    },
  };
}

type FeaturedPayload = {
  featured: typeof FEATURED_PATTERN;
  section: PatternSection;
  pattern: PatternSection["patterns"][number];
};

export default function Patterns({
  sections,
  featuredPayload,
}: {
  sections: PatternSection[];
  featuredPayload: FeaturedPayload | null;
}) {
  const router = useRouter();
  const isAgent = router.query.view === "agent";
  const totalPatterns = sections.reduce((sum, s) => sum + s.patterns.length, 0);

  if (isAgent) {
    const md = indexMarkdown(sections, FEATURED_PATTERN);
    return (
      <div className="bg-canvasBase">
        <Header />
        <AgentView
          title="/patterns.md"
          markdown={md}
          mdUrl="/patterns/md"
        />
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-canvasBase">
      <Header />

      {/* Hero */}
      <Container className="pb-24 pt-32">
        <h1
          className="mb-10 max-w-[14ch] font-heading text-6xl font-medium tracking-tight text-basis md:text-8xl lg:text-[132px]"
          style={{ lineHeight: 0.94 }}
        >
          How to build
          <br />
          with <em className="font-normal not-italic text-cta">Inngest</em>.
        </h1>

        <p
          className="mb-20 max-w-xl text-lg leading-relaxed text-subtle"
          style={{ textWrap: "pretty" }}
        >
          Production-tested patterns for AI agents, durable workflows, and the
          event-driven systems they live in. Each pattern is built on Inngest
          primitives (steps, events, throttling, schedules, channels) and the
          guarantees they provide.
        </p>

        <div className="flex max-w-xl gap-14 border-t border-subtle pt-8">
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-4xl text-basis">{totalPatterns}</span>
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
              Patterns
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-4xl text-basis">
              {sections.length}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
              Primitives
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-4xl text-basis">3</span>
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
              Languages
            </span>
          </div>
        </div>
      </Container>

      {/* Featured pattern */}
      {featuredPayload && (
        <Featured
          featured={featuredPayload.featured}
          section={featuredPayload.section}
          pattern={featuredPayload.pattern}
        />
      )}

      <Footer />
    </div>
  );
}
