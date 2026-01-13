import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";

interface SearchDocument {
  id: number;
  title: string;
  description: string;
  content: string;
  url: string;
  section: string;
  headings: string[];
}

const DOCS_DIR = path.join(process.cwd(), "pages/docs");
const OUTPUT_FILE = path.join(process.cwd(), "public/search-index.json");

function extractTextFromMDX(content: string): string {
  // Remove MDX imports
  let text = content.replace(/^import\s+.*$/gm, "");

  // Remove export statements
  text = text.replace(/^export\s+.*$/gm, "");

  // Remove JSX components but keep their text content
  text = text.replace(/<[^>]+>/g, " ");

  // Remove code blocks but keep inline code
  text = text.replace(/```[\s\S]*?```/g, " ");

  // Remove links but keep link text
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  // Remove images
  text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, "");

  // Remove HTML comments
  text = text.replace(/<!--[\s\S]*?-->/g, "");

  // Remove markdown formatting
  text = text.replace(/[*_~`#]/g, "");

  // Collapse whitespace
  text = text.replace(/\s+/g, " ").trim();

  return text;
}

function extractHeadings(content: string): string[] {
  const headingRegex = /^#{1,6}\s+(.+)$/gm;
  const headings: string[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    // Clean the heading text
    let heading = match[1]
      .replace(/\{[^}]*\}/g, "") // Remove {#anchor} syntax
      .replace(/[*_~`]/g, "") // Remove markdown formatting
      .trim();

    if (heading) {
      headings.push(heading);
    }
  }

  return headings;
}

function getUrlFromFilePath(filePath: string): string {
  const relativePath = path.relative(DOCS_DIR, filePath);
  const urlPath = relativePath
    .replace(/\.mdx?$/, "")
    .replace(/\/index$/, "")
    .replace(/\\/g, "/");

  return `/docs/${urlPath}`;
}

function getSectionFromPath(filePath: string): string {
  const relativePath = path.relative(DOCS_DIR, filePath);
  const parts = relativePath.split(path.sep);

  if (parts.length > 1) {
    // Capitalize and format the section name
    return parts[0]
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return "Documentation";
}

function getAllMDXFiles(dir: string): string[] {
  const files: string[] = [];

  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      files.push(...getAllMDXFiles(fullPath));
    } else if (item.name.endsWith(".mdx") || item.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files;
}

function buildSearchIndex(): void {
  console.log("Building search index...");

  const files = getAllMDXFiles(DOCS_DIR);
  console.log(`Found ${files.length} documentation files`);

  const documents: SearchDocument[] = [];

  for (let i = 0; i < files.length; i++) {
    const filePath = files[i];

    try {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data: frontmatter, content } = matter(fileContent);

      const title =
        frontmatter.title ||
        extractHeadings(content)[0] ||
        path.basename(filePath, path.extname(filePath));

      const description = frontmatter.description || "";
      const textContent = extractTextFromMDX(content);
      const headings = extractHeadings(content);
      const url = getUrlFromFilePath(filePath);
      const section = getSectionFromPath(filePath);

      documents.push({
        id: i,
        title,
        description,
        content: textContent.slice(0, 5000), // Limit content size
        url,
        section,
        headings,
      });
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error);
    }
  }

  // Write the search index
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(documents, null, 2));

  console.log(`Search index built with ${documents.length} documents`);
  console.log(`Output: ${OUTPUT_FILE}`);
}

buildSearchIndex();

