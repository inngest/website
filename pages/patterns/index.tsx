import { useEffect } from "react";
import { useRouter } from "next/router";

import { loadMarkdownFilesMetadata } from "utils/markdown";
import PATTERN_SECTIONS, {
  type PatternItem,
  type PatternSection,
} from "../../shared/Patterns/patternsData";
import { FEATURED_PATTERN } from "../../shared/Patterns/Featured";
import { indexMarkdown } from "../../shared/Patterns/markdown";
import Header from "src/components/RedesignedLanding/Header/Header";
import Footer from "src/components/RedesignedLanding/Footer";
import AgentView from "../../shared/Patterns/AgentView";

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

  useEffect(() => {
    if (!isAgent) {
      router.replace("/patterns/flash-sales-and-bursty-workflows");
    }
  }, [isAgent, router]);

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

  return null;
}
