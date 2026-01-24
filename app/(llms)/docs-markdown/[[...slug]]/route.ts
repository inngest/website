import fs from "node:fs";
import path from "node:path";
import { formatSnippetFileContent } from "@/mdx/utils/snippet.mjs";
import { convertMdxToMarkdown } from "@/mdx/utils/mdx-to-markdown";

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
    const processedContent = await convertMdxToMarkdown(contentWithMarkdownURLs);

    // Return as plain text for easy copying. Disable caching so this always runs
    // dynamically and returns fresh content from the docs.
    return new Response(processedContent, {
      headers: { "Content-Type": "text/markdown;charset=UTF-8" },
    });
  } catch (error) {
    console.error("Failed to process document:", error);
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
