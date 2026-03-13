import { serialize } from "next-mdx-remote/serialize";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

import { rehypeParseCodeBlocks } from "src/mdx/rehype.mjs";
import { rehypeRemoveTwoSlashMarkup, rehypeShiki } from "src/utils/code";

export type MDXFileMetadata = {
  slug: string;
  reading: {
    text: string;
    minutes: number;
    time: number;
    words: number;
  };
  [key: string]: any;
};

/**
 * A generic method to load and parse mdx files in a given directory
 * @param dir
 */
export async function loadMarkdownFilesMetadata<T>(
  dir: string
): Promise<(T & MDXFileMetadata)[]> {
  const fs = require("node:fs");
  const path = require("node:path");
  const matter = require("gray-matter");
  const readingTime = require("reading-time");

  const baseDir = path.join(process.cwd(), dir);

  // Iterate all files in the directory, then parse the markdown.
  const mdxFilenames = fs
    .readdirSync(baseDir)
    .filter(
      (f) =>
        f.endsWith(".md") || f.endsWith(".mdx")
    );
  const filesMetadata: (T & MDXFileMetadata)[] = [];
  for (const filename of mdxFilenames) {
    try {
      const filePath = path.join(baseDir, filename);
      const source = fs.readFileSync(filePath, "utf8");

      const { data, content } = matter(source);
      data.reading = readingTime(content);
      data.slug = filename.replace(/.mdx?$/, "");
      if (data.date) {
        if (typeof data.date === "string") {
          data.humanDate = new Date(data.date).toLocaleDateString();
        } else {
          data.humanDate = data.date.toLocaleDateString
            ? data.date.toLocaleDateString()
            : String(data.date);
        }
      }
      if (data.tags) {
        data.tags =
          typeof data.tags === "string"
            ? data.tags.split(",").map((t: string) => t.trim())
            : data.tags;
      }
      // Require a slug so we can link to the file, but allow entries
      // without a date (e.g. changelog files where dates come from exports
      // instead of frontmatter).
      if (!data.slug) continue;
      filesMetadata.push(data as T & MDXFileMetadata);
    } catch (err) {
      // Skip files that fail to parse so one bad file doesn't break the list
      console.warn(`[loadMarkdownFilesMetadata] Skipped ${filename}:`, err instanceof Error ? err.message : err);
    }
  }

  const sortedMetadata = filesMetadata.sort((a, b) => {
    const aStr = a.date != null ? String(a.date) : "";
    const bStr = b.date != null ? String(b.date) : "";
    return bStr.localeCompare(aStr);
  });
  return sortedMetadata;
}

export type MDXContent<T> = {
  content: string;
  headings: Heading[];
  compiledSource: string;
  metadata: T;
};

/**
 * A generic method to load and parse an mdx file
 * @param dir
 */
export async function loadMarkdownFile<T>(
  dir: string,
  slug: string
): Promise<MDXContent<T>> {
  const path = require("node:path");
  const fs = require("node:fs");
  const matter = require("gray-matter");
  const sourceFilename = path.join(dir, `${slug}.mdx`);
  const source = fs.readFileSync(sourceFilename, "utf8");
  const { content, data } = matter(source);

  const serializedContent = await serialize(content, {
    mdxOptions: {
      rehypePlugins: [
        rehypeParseCodeBlocks,
        rehypeRemoveTwoSlashMarkup,
        rehypeShiki,
        rehypeSlug,
        rehypeAutolinkHeadings,
      ],
    },
  });

  return {
    metadata: data,
    content,
    headings: getHeadingsAsArray(content),
    ...serializedContent,
  };
}

// Backcompat with the above way of loading and rendering markdown
// This can be removed when everything is ported to the new @next/mdx setup like /docs
export type Heading = {
  order: number;
  title: string;
  slug: string;
  subheadings: [{ title: string; slug: string }];
};

export type Headings = {
  [title: string]: Heading;
};

export const getHeadings = (content: string): Headings => {
  // Get headers for table of contents.
  const headings = {};
  let h2 = null; // store the current heading we're in
  let order = 0;

  (content.match(/^###? (.*)/gm) || ([] as string[])).forEach((heading) => {
    const title = heading.replace(/^###? /, "");
    if (heading.indexOf("## ") === 0) {
      h2 = title;
      headings[title] = { title, slug: toSlug(title), subheadings: [], order };
      order++;
      return;
    }
    // add this subheading to the current heading list.
    (headings[h2]?.subheadings || []).push({ title, slug: toSlug(title) });
  });
  return headings;
};

export const getHeadingsAsArray = (content: string): Heading[] => {
  const headingsObj = getHeadings(content);
  return Object.keys(headingsObj)
    .map((key) => headingsObj[key])
    .sort((a, b) => a.order - b.order);
};

const toSlug = (s: string) => {
  s = s.replace(/[^a-zA-Z0-9 :]/g, "");
  // rehype's `rehypeSlug` plugin converts "foo: one"  to "foo--one", and doesn't
  // remove multple slashes.  It does convert multiple spaces to just one slash.
  s = s.replace(/ +/g, "-");
  s = s.replace(/[:&]/g, "-");
  s = s.replace(/--/g, "-");
  return s.toLowerCase();
};
