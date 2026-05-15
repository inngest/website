import type { NextApiRequest, NextApiResponse } from "next";
import { loadMarkdownFile } from "../../../../utils/markdown";
import { patternMarkdown } from "../../../../shared/Patterns/markdown";

type PatternFrontmatter = {
  title?: string;
  subtitle?: string;
  tags?: string[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const slug = Array.isArray(req.query.pattern)
    ? req.query.pattern[0]
    : req.query.pattern;
  if (!slug) {
    res.status(404).send("Not found");
    return;
  }

  try {
    const data = await loadMarkdownFile("pages/patterns/_patterns", slug);
    const metadata = (data.metadata ?? {}) as PatternFrontmatter;
    const body = (data as { content: string }).content;
    const markdown = patternMarkdown(
      metadata.title ?? slug,
      metadata.subtitle ?? "",
      slug,
      metadata.tags ?? [],
      body
    );
    res.setHeader("Content-Type", "text/markdown; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=300, s-maxage=3600");
    res.status(200).send(markdown);
  } catch {
    res.status(404).send("Pattern not found");
  }
}
