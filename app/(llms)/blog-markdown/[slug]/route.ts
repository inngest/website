import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { convertMdxToMarkdown } from "@/mdx/utils/mdx-to-markdown";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const HOST = process.env.NEXT_PUBLIC_HOST ?? "https://www.inngest.com";

export const generateStaticParams = async () => {
  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .filter((f) => {
      // Skip posts that define a redirect
      const source = fs.readFileSync(path.join(BLOG_DIR, f), "utf-8");
      const { data } = matter(source);
      return !data.redirect;
    });

  return files.map((f) => ({ slug: f.replace(/\.(mdx|md)$/, "") }));
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Sanitize to prevent directory traversal
  const sanitizedSlug = slug.replace(/\.\./g, "").replace(/^\/+/, "");

  const possiblePaths = [
    path.join(BLOG_DIR, `${sanitizedSlug}.mdx`),
    path.join(BLOG_DIR, `${sanitizedSlug}.md`),
  ];

  let filePath: string | null = null;
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      filePath = p;
      break;
    }
  }

  if (!filePath) {
    return new Response("Post not found", {
      status: 404,
      statusText: "Post not found",
    });
  }

  // Ensure the resolved path stays inside the blog directory
  const resolvedPath = path.resolve(filePath);
  const resolvedBlogDir = path.resolve(BLOG_DIR);
  if (!resolvedPath.startsWith(resolvedBlogDir)) {
    return new Response("Access denied", {
      status: 403,
      statusText: "Access denied",
    });
  }

  try {
    const source = fs.readFileSync(filePath, "utf-8");
    const { content, data } = matter(source);

    // Build a clean YAML frontmatter block so agents get full metadata
    const authors = Array.isArray(data.author)
      ? data.author
      : data.author
      ? [data.author]
      : [];

    const frontmatterLines: string[] = ["---"];
    if (data.heading) frontmatterLines.push(`title: ${JSON.stringify(data.heading)}`);
    if (data.subtitle) frontmatterLines.push(`description: ${JSON.stringify(data.subtitle)}`);
    if (data.date) {
      const dateStr = data.date instanceof Date
        ? data.date.toISOString().split("T")[0]
        : String(data.date);
      frontmatterLines.push(`date: ${dateStr}`);
    }
    if (data.dateUpdated) {
      const dateUpdatedStr = data.dateUpdated instanceof Date
        ? data.dateUpdated.toISOString().split("T")[0]
        : String(data.dateUpdated);
      frontmatterLines.push(`dateUpdated: ${dateUpdatedStr}`);
    }
    if (authors.length > 0) frontmatterLines.push(`author: ${JSON.stringify(authors)}`);
    if (data.category) frontmatterLines.push(`category: ${data.category}`);
    if (data.tags) {
      const tags = typeof data.tags === "string"
        ? data.tags.split(",").map((t: string) => t.trim())
        : data.tags;
      frontmatterLines.push(`tags: ${JSON.stringify(tags)}`);
    }
    frontmatterLines.push(`url: ${HOST}/blog/${sanitizedSlug}`);
    frontmatterLines.push("---");

    const markdownBody = await convertMdxToMarkdown(content);
    const output = `${frontmatterLines.join("\n")}\n\n${markdownBody}`;

    return new Response(output, {
      headers: {
        "Content-Type": "text/markdown;charset=UTF-8",
        "Cache-Control": "s-maxage=3600, stale-while-revalidate",
        "Link": `<${HOST}/blog/${sanitizedSlug}>; rel="canonical"`,
      },
    });
  } catch (error) {
    console.error(`[blog-markdown] Failed to process post "${sanitizedSlug}":`, error);
    return new Response("Failed to read post", {
      status: 500,
      statusText: "Failed to read post",
    });
  }
}
