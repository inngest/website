import type { NextApiRequest, NextApiResponse } from "next";
import { getPatternSections } from "../../../../../shared/Patterns/patternsData";
import { categoryMarkdown } from "../../../../../shared/Patterns/markdown";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const category = Array.isArray(req.query.category)
    ? req.query.category[0]
    : req.query.category;
  const section = getPatternSections().find((s) => s.id === category);
  if (!section) {
    res.status(404).send("Not found");
    return;
  }
  res.setHeader("Content-Type", "text/markdown; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=3600");
  res.status(200).send(categoryMarkdown(section));
}
