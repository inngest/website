import type { NextApiRequest, NextApiResponse } from "next";
import fs from "node:fs";
import path from "node:path";

// Force this API route to run as a Node.js serverless function (not edge, not static).
// Required for fs.readFileSync and to prevent static/edge optimization.
export const config = {
  runtime: "nodejs",
  api: {
    responseLimit: false,
  },
};

/**
 * Strips MDX-specific syntax and returns clean markdown text suitable for LLMs.
 * Removes imports, exports, JSX components, and frontmatter while preserving
 * the actual content text.
 */
function stripMdxToText(content: string): string {
  let result = content;

  // Remove frontmatter (--- ... ---)
  result = result.replace(/^---[\s\S]*?---\n*/m, "");

  // Remove import statements
  result = result.replace(/^import\s+.*?(?:from\s+)?['"].*?['"];?\s*$/gm, "");
  result = result.replace(/^import\s*\{[\s\S]*?\}\s*from\s*['"].*?['"];?\s*$/gm, "");
  result = result.replace(/^import\s+[\s\S]*?from\s*['"].*?['"];?\s*$/gm, "");

  // Remove export statements (but keep the content if it's a default export with content)
  result = result.replace(/^export\s+default\s+function.*$/gm, "");
  result = result.replace(/^export\s+(?:const|let|var|function|class)\s+\w+.*$/gm, "");
  result = result.replace(/^export\s*\{[^}]*\}\s*;?\s*$/gm, "");

  // Remove self-closing JSX components like <Component /> or <Component attr="value" />
  result = result.replace(/<[A-Z][a-zA-Z0-9]*(?:\s+[^>]*)?\s*\/>/g, "");

  // Handle common documentation components by extracting their text content
  // <Note>content</Note>, <Tip>content</Tip>, <Warning>content</Warning>, <Info>content</Info>
  result = result.replace(
    /<(Note|Tip|Warning|Info|Callout)[^>]*>([\s\S]*?)<\/\1>/gi,
    (_, tag, content) => `> **${tag}:** ${content.trim()}\n`
  );

  // <CodeGroup>...</CodeGroup> - keep inner content
  result = result.replace(/<CodeGroup[^>]*>([\s\S]*?)<\/CodeGroup>/gi, "$1");

  // <Steps>...</Steps> and <Step>...</Step> - keep inner content
  result = result.replace(/<Steps[^>]*>([\s\S]*?)<\/Steps>/gi, "$1");
  result = result.replace(/<Step[^>]*(?:\s+title="([^"]*)")?[^>]*>([\s\S]*?)<\/Step>/gi, (_, title, content) => {
    return title ? `### ${title}\n${content.trim()}\n` : content.trim() + "\n";
  });

  // <Card>...</Card> and <CardGroup>...</CardGroup>
  result = result.replace(/<CardGroup[^>]*>([\s\S]*?)<\/CardGroup>/gi, "$1");
  result = result.replace(/<Card[^>]*(?:\s+title="([^"]*)")?[^>]*>([\s\S]*?)<\/Card>/gi, (_, title, content) => {
    return title ? `**${title}**\n${content.trim()}\n` : content.trim() + "\n";
  });

  // <Properties>...</Properties> and <Property>...</Property>
  result = result.replace(/<Properties[^>]*>([\s\S]*?)<\/Properties>/gi, "$1");
  result = result.replace(
    /<Property\s+name="([^"]*)"(?:\s+type="([^"]*)")?[^>]*>([\s\S]*?)<\/Property>/gi,
    (_, name, type, content) => {
      const typeStr = type ? ` (${type})` : "";
      return `- \`${name}\`${typeStr}: ${content.trim()}\n`;
    }
  );

  // <GuideSelector>...</GuideSelector> and <GuideSection>...</GuideSection>
  result = result.replace(/<GuideSelector[^>]*>([\s\S]*?)<\/GuideSelector>/gi, "$1");
  result = result.replace(/<GuideSection[^>]*>([\s\S]*?)<\/GuideSection>/gi, "$1");
  result = result.replace(/<GuideTitle[^>]*>([\s\S]*?)<\/GuideTitle>/gi, "### $1\n");

  // <Row>...</Row> and <Col>...</Col>
  result = result.replace(/<Row[^>]*>([\s\S]*?)<\/Row>/gi, "$1");
  result = result.replace(/<Col[^>]*>([\s\S]*?)<\/Col>/gi, "$1");

  // <Button>...</Button> - extract text
  result = result.replace(/<Button[^>]*>([\s\S]*?)<\/Button>/gi, "$1");

  // <a> tags - convert to markdown links if they have href
  result = result.replace(/<a\s+href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, "[$2]($1)");

  // Remove remaining JSX opening/closing tags (generic cleanup)
  // This catches things like <YouTube ... /> or other custom components
  result = result.replace(/<[A-Z][a-zA-Z0-9]*[^>]*>([\s\S]*?)<\/[A-Z][a-zA-Z0-9]*>/g, "$1");

  // Remove any remaining self-closing tags
  result = result.replace(/<[A-Z][a-zA-Z0-9]*[^>]*\/>/g, "");

  // Remove JSX expressions like {variable} but keep content in template literals
  result = result.replace(/\{`([^`]*)`\}/g, "$1");

  // Clean up excessive blank lines (more than 2 consecutive)
  result = result.replace(/\n{3,}/g, "\n\n");

  // Trim leading/trailing whitespace
  result = result.trim();

  return result;
}


export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { path: docPath, raw } = req.query;

  if (!docPath || typeof docPath !== "string") {
    return res.status(400).json({ error: "Missing 'path' query parameter" });
  }

  // Sanitize the path to prevent directory traversal
  const sanitizedPath = docPath
    .replace(/^\/docs\/?/, "") // Remove leading /docs/
    .replace(/\.\./g, "") // Remove any ..
    .replace(/^\/+/, ""); // Remove leading slashes

  // Try to find the MDX file
  const possiblePaths = [
    path.join(process.cwd(), "pages", "docs", `${sanitizedPath}.mdx`),
    path.join(process.cwd(), "pages", "docs", `${sanitizedPath}/index.mdx`),
    path.join(process.cwd(), "pages", "docs", `${sanitizedPath}.md`),
  ];

  let filePath: string | null = null;
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      filePath = p;
      break;
    }
  }

  if (!filePath) {
    return res.status(404).json({ error: "Document not found", path: docPath });
  }

  // Verify the resolved path is still within the docs directory (security check)
  const resolvedPath = path.resolve(filePath);
  const docsDir = path.resolve(process.cwd(), "pages", "docs");
  if (!resolvedPath.startsWith(docsDir)) {
    return res.status(403).json({ error: "Access denied" });
  }

  try {
    const content = fs.readFileSync(filePath, "utf-8");

    // If raw=true, return unprocessed content; otherwise strip MDX
    const processedContent = raw === "true" ? content : stripMdxToText(content);

    // Return as plain text for easy copying. Disable caching so this always runs
    // dynamically and returns fresh content from the docs.
    res.setHeader("Content-Type", "text/markdown;charset=UTF-8");
    res.setHeader(
      "Cache-Control",
      "private, no-cache, no-store, max-age=0, must-revalidate"
    );
    return res.status(200).send(processedContent);
  } catch (error) {
    return res.status(500).json({ error: "Failed to read document" });
  }
}
