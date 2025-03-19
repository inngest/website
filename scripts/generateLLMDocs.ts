import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import matter from "gray-matter";

/**
 * Configuration for the LLM docs generator
 */
const config = {
  docsDir: join(process.cwd(), "pages", "docs"),
  outputFile: join(process.cwd(), "public", "llms.txt"),
  // Files or directories to skip
  excludes: ["_app.tsx", "_document.tsx", ".DS_Store"],
};

/**
 * Cleans MDX content for LLM consumption
 * @param content - Raw MDX content
 * @returns Cleaned content
 */
function cleanMDXContent(content: string): string {
  return content
    // Remove imports
    .replace(/import\s+.*?from\s+["'].*?["'];?\s*/g, "")
    // Remove exports and const declarations
    .replace(/export\s+const.*?;?\s*/g, "")
    .replace(/const.*?=.*?;?\s*/g, "")
    // Convert ButtonDeploy to readable text
    .replace(/<ButtonDeploy[^>]*href="([^"]*)"[^>]*label="([^"]*)"[^>]*\/>/g, "Link: $2 (at $1)")
    // Convert other button components
    .replace(/<Button[^>]*>(.*?)<\/Button>/g, "Button: $1")
    // Remove other JSX components
    .replace(/<([A-Z][A-Za-z]*|[a-z]+(\s+[^>]*)?)>/g, "")
    .replace(/<\/[^>]+>/g, "")
    // Remove image tags with a placeholder
    .replace(/<img[^>]+>/g, "[IMAGE]")
    // Remove remaining JSX expressions
    .replace(/\{[^}]+\}/g, "")
    // Fix markdown links to be more readable
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 (link: $2)")
    // Remove multiple newlines and clean up spacing
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\s+$/gm, "")
    .trim();
}

/**
 * Processes an MDX file and extracts its content without frontmatter
 * @param filePath - Path to the MDX file
 * @returns Processed content with metadata
 */
function processMDXFile(filePath: string): string {
  const content = readFileSync(filePath, "utf-8");
  const { content: mdxContent, data: frontMatter } = matter(content);
  const relativePath = relative(config.docsDir, filePath);
  
  const cleanContent = cleanMDXContent(mdxContent);
  
  const metadata = [
    `=== Document: ${relativePath} ===`,
    frontMatter.title && `Title: ${frontMatter.title}`,
    frontMatter.description && `Description: ${frontMatter.description}`,
  ]
    .filter(Boolean)
    .join("\n");
  
  return `${metadata}\n\n${cleanContent}\n`;
}

/**
 * Recursively processes all MDX files in a directory
 * @param dir - Directory to process
 * @returns Array of processed file contents
 */
function processDirectory(dir: string): string[] {
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

/**
 * Main function to generate the LLM docs file
 */
function main() {
  console.log("🚀 Starting LLM docs generation...");
  
  try {
    const docs = processDirectory(config.docsDir);
    const output = `# Inngest Documentation for LLMs
Generated on: ${new Date().toISOString()}
Total documents: ${docs.length}

${docs.join("\n---\n")}`;

    writeFileSync(config.outputFile, output, "utf-8");
    console.log(`✨ Successfully generated LLM docs at ${config.outputFile}`);
    console.log(`📊 Processed ${docs.length} documents`);
  } catch (error) {
    console.error("💀 Failed to generate LLM docs:", error);
    process.exit(1);
  }
}

main(); 