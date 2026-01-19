import fs from "node:fs";
import path from "node:path";
import { formatSnippetFileContent } from "@/mdx/utils/snippet.mjs";

/**
 * Recursively finds all markdown files in the pages/docs directory
 * and returns their paths relative to /docs as a flat array.
 */
function getAllDocPaths(): string[] {
  const docsDir = path.join(process.cwd(), "pages", "docs");
  const paths: string[] = [];

  function walkDir(currentDir: string, relativePath: string = "") {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      const relativeFilePath = relativePath ? `${relativePath}/${entry.name}` : entry.name;

      if (entry.isDirectory()) {
        // Recursively walk subdirectories
        walkDir(fullPath, relativeFilePath);
      } else if (entry.isFile()) {
        // Check if it's a markdown file
        if (entry.name.endsWith(".mdx") || entry.name.endsWith(".md")) {
          // Handle index files - use the directory path
          if (entry.name === "index.mdx" || entry.name === "index.md") {
            const docPath = relativePath || "";
            paths.push(docPath);
          } else {
            // Remove the file extension and use the full relative path
            const nameWithoutExt = entry.name.replace(/\.(mdx|md)$/, "");
            const docPath = relativePath
              ? `${relativePath}/${nameWithoutExt}`
              : nameWithoutExt;
            paths.push(docPath);
          }
        }
      }
    }
  }

  walkDir(docsDir);
  return paths.sort();
}

export const generateStaticParams = async () => {
  const docPaths = getAllDocPaths();
  return docPaths.map((path) => ({
    slug: path.split("/").filter(Boolean),
  }));
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug: slugArray = [] } = await params;
  const docPath = slugArray.join("/");

  if (!docPath || typeof docPath !== "string") {
    return new Response("Missing 'path' query parameter", { status: 400 });
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
    return new Response("Document not found", { status: 404, statusText: "Document not found" });
  }

  // Verify the resolved path is still within the docs directory (security check)
  const resolvedPath = path.resolve(filePath);
  const docsDir = path.resolve(process.cwd(), "pages", "docs");
  if (!resolvedPath.startsWith(docsDir)) {
    return new Response("Access denied", { status: 403, statusText: "Access denied" });
  }

  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const contentWithSnippets = inlineSnippets(content);
    const contentWithMarkdownURLs = convertDocsURLsToMarkdownURLs(contentWithSnippets);
    const processedContent = stripMdxToText(contentWithMarkdownURLs);

    // Return as plain text for easy copying. Disable caching so this always runs
    // dynamically and returns fresh content from the docs.
    return new Response(processedContent, {
      headers: { "Content-Type": "text/markdown;charset=UTF-8" },
    });
  } catch (error) {
    return new Response("Failed to read document", { status: 500, statusText: "Failed to read document" });
  }
}


/**
 * Replaces snippet references in fenced code blocks with their actual content.
 * Looks for patterns like:
 * ```py
 * !snippet:path=snippets/py/path/to/file.py
 * ```
 */
function inlineSnippets(content: string): string {
  const snippetCodeBlockRegex = /```(\w+)?([^\n]*)\n!snippet:path=([^\n]+)\n```/g;

  return content.replace(snippetCodeBlockRegex, (match, language, attrs, snippetPath) => {
    const trimmedPath = snippetPath.trim();
    const fullPath = path.join(process.cwd(), trimmedPath);

    try {
      const fileContent = fs.readFileSync(fullPath, "utf-8");
      const formattedContent = formatSnippetFileContent(fileContent);
      return `\`\`\`${language || ""}${attrs || ""}\n${formattedContent}\n\`\`\``;
    } catch (error) {
      console.error(`Failed to load snippet: ${trimmedPath}`, error);
      return `\`\`\`${language || ""}\n// Failed to load snippet: ${trimmedPath}\n\`\`\``;
    }
  });
}

function convertDocsURLsToMarkdownURLs(content: string): string {
  return content.replace(/(\/docs\/[^)]+)/g, (match, p1) => {
    return p1.replace(`/docs`, `/docs-markdown`);
  });
}

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
