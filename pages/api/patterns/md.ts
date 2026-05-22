import type { NextApiRequest, NextApiResponse } from "next";
import { loadMarkdownFilesMetadata } from "../../../utils/markdown";
import PATTERN_SECTIONS, {
  type PatternItem,
  type PatternSection,
} from "../../../shared/Patterns/patternsData";
import { FEATURED_PATTERN } from "../../../shared/Patterns/featuredPattern";
import { indexMarkdown } from "../../../shared/Patterns/markdown";

type PatternFrontmatter = {
  title?: string;
  subtitle?: string;
  pattern?: string;
};

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
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
  bySection.forEach((list) =>
    list.sort((a, b) => a.title.localeCompare(b.title))
  );

  const sections: PatternSection[] = PATTERN_SECTIONS.flatMap((meta) => {
    const patterns = bySection.get(meta.id);
    if (!patterns || patterns.length === 0) return [];
    return [{ ...meta, patterns }];
  });

  res.setHeader("Content-Type", "text/markdown; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=3600");
  res.status(200).send(indexMarkdown(sections, FEATURED_PATTERN));
}
