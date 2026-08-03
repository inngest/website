import fs from "node:fs";
import path from "node:path";
import { formatSnippetFileContent } from "@/mdx/utils/snippet.mjs";
import { convertMdxToMarkdown } from "@/mdx/utils/mdx-to-markdown";
import {
  permanentRedirects,
  resolveDocsPath,
  splitDocsSuffix,
} from "@/redirects.mjs";

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
      const relativeFilePath = relativePath
        ? `${relativePath}/${entry.name}`
        : entry.name;

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

/**
 * Resolves a docs slug to a file on disk, or null when nothing backs it.
 */
function findDocFile(slug: string): string | null {
  const docsDir = path.join(process.cwd(), "pages", "docs");

  // An empty slug is /docs-markdown itself, which is backed by pages/docs/index.mdx.
  const candidates = slug
    ? [
        path.join(docsDir, `${slug}.mdx`),
        path.join(docsDir, slug, "index.mdx"),
        path.join(docsDir, `${slug}.md`),
      ]
    : [path.join(docsDir, "index.mdx"), path.join(docsDir, "index.md")];

  return candidates.find((p) => fs.existsSync(p)) ?? null;
}

export const generateStaticParams = async () => {
  const docPaths = getAllDocPaths();

  // Prerender the redirect sources too. They resolve to real files at request
  // time either way, but without this every crawler hitting a moved URL pays
  // for a dynamic invocation and a cache MISS.
  const redirectedPaths = permanentRedirects
    .map(([source]: [string, string]) => source)
    .filter((source: string) => source.startsWith("/docs/"))
    .map((source: string) =>
      source.replace(/^\/docs\/?/, "").replace(/\/$/, "")
    )
    .filter((slug: string) => slug && !docPaths.includes(slug))
    .filter(
      (slug: string) =>
        findDocFile(splitDocsSuffix(resolveDocsPath(slug))[0]) !== null
    );

  return Array.from(new Set(docPaths.concat(redirectedPaths))).map(
    (docPath) => ({
      slug: docPath.split("/").filter(Boolean),
    })
  );
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug: slugArray = [] } = await params;
  const docPath = slugArray.join("/");

  // An empty slug is legitimate: it is /docs-markdown, the docs index. This
  // used to 400 ("Missing 'path' query parameter" — there is no such param),
  // which broke the entry point agents reach for first.

  // Sanitize the path to prevent directory traversal
  const sanitizedPath = docPath
    .replace(/^\/docs\/?/, "") // Remove leading /docs/
    .replace(/\.\./g, "") // Remove any ..
    .replace(/^\/+/, ""); // Remove leading slashes

  // Resolve in two passes: the slug as requested, then the slug the HTML site
  // would have redirected/rewritten it to. Docs move often, and links to their
  // old URLs survive both in our own MDX and in whatever agents indexed
  // earlier; without this pass every one of those is a hard 404 here even
  // though /docs/<slug> serves fine.
  let filePath = findDocFile(sanitizedPath);

  if (!filePath) {
    // A destination can carry a #fragment, which is not part of the file path.
    const [redirected] = splitDocsSuffix(resolveDocsPath(sanitizedPath));
    if (redirected !== sanitizedPath) {
      filePath = findDocFile(redirected);
    }
  }

  if (!filePath) {
    return new Response("Document not found", {
      status: 404,
      statusText: "Document not found",
    });
  }

  // Verify the resolved path is still within the docs directory (security check)
  const resolvedPath = path.resolve(filePath);
  const docsDir = path.resolve(process.cwd(), "pages", "docs");
  if (!resolvedPath.startsWith(docsDir)) {
    return new Response("Access denied", {
      status: 403,
      statusText: "Access denied",
    });
  }

  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const contentWithSnippets = inlineSnippets(content);
    const contentWithMarkdownURLs =
      convertDocsURLsToMarkdownURLs(contentWithSnippets);
    const processedContent = await convertMdxToMarkdown(
      contentWithMarkdownURLs
    );

    // No canonical Link header here on purpose: middleware.ts emits one for
    // every request, so setting a second produced two rel="canonical" values.
    // They disagreed whenever a redirect destination carried a #fragment
    // (/docs/frameworks/express → ...serving-inngest-functions#framework-express),
    // and conflicting canonicals are ignored wholesale by crawlers. Middleware
    // owns it: it resolves the same redirects and always names the production
    // origin, which is what a canonical has to point at from a preview deploy.
    const headers = new Headers({
      "Content-Type": "text/markdown;charset=UTF-8",
    });
    // Block traditional search engines from indexing the LLM markdown mirror pages
    // to prevent duplicate content issues. AI crawlers are still welcome.
    headers.append("X-Robots-Tag", "googlebot: noindex, nofollow");
    headers.append("X-Robots-Tag", "bingbot: noindex, nofollow");

    return new Response(processedContent, { headers });
  } catch (error) {
    console.error("Failed to process document:", error);
    return new Response("Failed to read document", {
      status: 500,
      statusText: "Failed to read document",
    });
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
  const snippetCodeBlockRegex =
    /```(\w+)?([^\n]*)\n!snippet:path=([^\n]+)\n```/g;

  return content.replace(
    snippetCodeBlockRegex,
    (match, language, attrs, snippetPath) => {
      const trimmedPath = snippetPath.trim();
      const fullPath = path.join(process.cwd(), trimmedPath);

      try {
        const fileContent = fs.readFileSync(fullPath, "utf-8");
        const formattedContent = formatSnippetFileContent(fileContent);
        return `\`\`\`${language || ""}${
          attrs || ""
        }\n${formattedContent}\n\`\`\``;
      } catch (error) {
        console.error(`Failed to load snippet: ${trimmedPath}`, error);
        return `\`\`\`${
          language || ""
        }\n// Failed to load snippet: ${trimmedPath}\n\`\`\``;
      }
    }
  );
}

/**
 * Points every internal /docs link at the markdown mirror, resolving stale
 * links through the redirect table on the way.
 *
 * Resolving here is what actually stops the 404s: a doc linking to a URL that
 * has since moved would otherwise emit /docs-markdown/<old-path>, which has no
 * file behind it. On the HTML site the same link just 308s and nobody notices.
 *
 * The match deliberately does not start mid-URL — `(?<![\w:/])` keeps external
 * links whose own paths contain /docs/ (api-docs.inngest.com/docs/..., GitHub
 * blob URLs) from being rewritten to point at us.
 */
function convertDocsURLsToMarkdownURLs(content: string): string {
  // (?![\w-]) stops "/docs-markdown" in already-converted content from matching
  // the bare "/docs" branch and becoming "/docs-markdown-markdown".
  return content.replace(
    /(?<![\w:/])\/docs(?![\w-])(?:\/[^\s)"'\]]*)?/g,
    (match) => {
      // Trailing sentence punctuation is not part of the URL.
      const [, url, trailing] = match.match(
        /^(.*?)([.,;:!?]*)$/
      ) as RegExpMatchArray;

      const slug = url.replace(/^\/docs\/?/, "");
      const resolved = slug ? resolveDocsPath(slug) : "";

      return `/docs-markdown${resolved ? `/${resolved}` : ""}${trailing}`;
    }
  );
}
