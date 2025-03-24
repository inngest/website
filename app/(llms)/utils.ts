import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import matter from "gray-matter";

/**
 * Configuration for the LLM docs generator
 */
const config = {
  docsDir: join(process.cwd(), "pages", "docs"),
  outputFile: join(process.cwd(), "public", "llms-full.txt"),
  // Files or directories to skip
  excludes: ["_app.tsx", "_document.tsx", ".DS_Store"],
};

/**
 * Cleans MDX content for LLM consumption
 * @param content - Raw MDX content
 * @returns Cleaned content
 */
function cleanMDXContent(content: string): string {
  return (
    content
      // Remove imports
      .replace(/import\s+.*?from\s+["'].*?["'];?\s*/g, "")
      // Remove description exports - these are extracted in the metadata
      .replace(/export\s+const description\s*=\s*["']([^"]*)["];?\s*/g, "")
      // Remove exports and const declarations
      .replace(/export\s+const.*?;?\s*/g, "")
      .replace(/const.*?=.*?;?\s*/g, "")
      // Remove title
      .replace(/#\s(.+)\n/, "")
      // Convert Buttons to Markdown links
      .replace(
        /<ButtonDeploy[^>]*href="([^"]*)"[^>]*label="([^"]*)"[^>]*\/>/g,
        "[$2]($1)"
      )
      .replace(/<Button[^>]*>(.*?)<\/Button>/g, "Button: $1")
      // Remove other JSX components
      // .replace(/<([A-Z][A-Za-z]*|[a-z]+(\s+[^>]*)?)>/g, "")
      // .replace(/<\/[^>]+>/g, "")
      // Remove image tags with a placeholder
      .replace(/<img[^>]+>/g, "[IMAGE]")
      // Remove remaining JSX expressions
      // .replace(/\{[^}]+\}/g, "")
      // Fix markdown links to be more readable
      // .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 (link: $2)")
      // Remove multiple newlines and clean up spacing
      .replace(/\n{3,}/g, "\n\n")
      // .replace(/\s+$/gm, "")
      .trim()
  );
}

/**
 * Processes an MDX file and extracts its content without frontmatter
 * @param filePath - Path to the MDX file
 * @returns Processed content with metadata
 */
function processMDXFile(filePath: string): string {
  const content = readFileSync(filePath, "utf-8");
  const relativePath = relative(config.docsDir, filePath);

  const cleanContent = cleanMDXContent(content);
  const title = content.match(/#\s(.+)\n/)?.[1];
  const description = content.match(
    /export\s+const description\s*=\s*["']([^"]*)["];?\s*/
  )?.[1];

  const metadata = [
    `# ${title}`,
    `Source: ${fullURL(relativePath)}`,
    description && `Description: ${description}`,
  ]
    .filter(Boolean)
    .join("\n");

  return `${metadata}\n\n${cleanContent}\n`;
}

function fullURL(path: string): string {
  return `${process.env.NEXT_PUBLIC_HOST}/docs/${path.replace(".mdx", "")}`;
}

/**
 * Recursively processes all MDX files in a directory
 * @param dir - Directory to process
 * @returns Array of processed file contents
 */
export function processDirectory(dir: string): string[] {
  const results: string[] = [];

  for (const file of readdirSync(dir, { withFileTypes: true })) {
    if (config.excludes.includes(file.name)) continue;

    const fullPath = join(dir, file.name);

    if (file.isDirectory()) {
      results.push(...processDirectory(fullPath));
    } else if (file.name.endsWith(".mdx")) {
      results.push(processMDXFile(fullPath));
    }
  }

  return results;
}
