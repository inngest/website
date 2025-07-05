import { slugifyWithCounter } from "@sindresorhus/slugify";
import * as acorn from "acorn";
import { toString } from "mdast-util-to-string";
import { mdxAnnotations } from "mdx-annotations";
import rehypeCodeTitles from "rehype-code-titles";
import rehypeMdxTitle from "rehype-mdx-title";
import shiki from "shiki";
import { visit } from "unist-util-visit";
import { readFileSync } from "node:fs";
import path from "node:path";

import * as sourceFilePath from "./plugins/sourceFilePath.mjs";

export function rehypeParseCodeBlocks() {
  return (tree) => {
    visit(tree, "element", (node, _nodeIndex, parentNode) => {
      if (node.tagName === "code" && node.properties.className) {
        // Set the language for the code block
        parentNode.properties.language = node.properties.className[0]?.replace(
          /^language-/,
          ""
        );

        if (node.children[0]) {
          let value = node.children[0].value;
          if (typeof value === "string") {
            const parts = value.trim().split("\n");

            // Snippet references are single-line code blocks that start with
            // `!snippet:path=`. For example:
            // ```py
            // !snippet:path=snippets/py/path/to/file.py
            // ```
            const isSnippetRef =
              parts.length === 1 && parts[0].startsWith("!snippet:path=");

            if (isSnippetRef) {
              // This is a snippet reference, so we need to load the content
              // from that referenced file

              const snippetRelPath = parts[0].slice("!snippet:path=".length);

              const fileContent = readFileSync(
                path.join(process.cwd(), snippetRelPath),
                "utf-8"
              );

              node.children = [
                {
                  type: "text",
                  value: formatCode(fileContent),
                },
              ];
            }
          }
        }
      }
    });
  };
}

// Format a code file's content
function formatCode(content) {
  console.log("formatCode");
  let sourceLines = content.split("\n");

  let parsedLines = [];
  for (let i = 0; i < sourceLines.length; i++) {
    const line = sourceLines[i];
    if (i > 0 && line.trim() === "" && sourceLines[i - 1].trim() === "") {
      // This is a sequential empty line, so we must exclude it. In other words,
      // both this line and the previous line are empty
      continue;
    }

    if (line.trim() === "# !snippet:start") {
      // There's a start marker, so we must exclude all previous lines
      parsedLines = [];
      continue;
    } else if (line.trim() === "# !snippet:end") {
      // There's an end marker, so we must exclude all subsequent lines
      break;
    }
    parsedLines.push(line);
  }

  // Remove leading whitespace lines
  for (let line of parsedLines) {
    if (line.trim() !== "") {
      break;
    }
    parsedLines.shift();
  }

  // Remove trailing whitespace lines
  for (let i = parsedLines.length - 1; i >= 0; i--) {
    if (parsedLines[i].trim() !== "") {
      break;
    }
    parsedLines.pop();
  }

  // Use this to trim left whitespace if necessary. This will prevent codeblocks
  // where everything is indented (e.g. code in a function)
  const leftWhitespaceToTrim = parsedLines[0].match(/^\s*/)?.[0];

  parsedLines = parsedLines.map((line) => {
    if (line.startsWith(leftWhitespaceToTrim)) {
      return line.substring(leftWhitespaceToTrim.length);
    }
    return line;
  });

  return parsedLines.join("\n");
}

let highlighter;

export function rehypeShiki() {
  return async (tree) => {
    highlighter =
      highlighter ?? (await shiki.getHighlighter({ theme: "css-variables" }));

    visit(tree, "element", (node) => {
      if (node.tagName === "pre" && node.children[0]?.tagName === "code") {
        let codeNode = node.children[0];
        let textNode = codeNode.children[0];

        node.properties.code = textNode.value;

        if (node.properties.language) {
          let tokens = highlighter.codeToThemedTokens(
            textNode.value,
            node.properties.language
          );

          textNode.value = shiki.renderToHtml(tokens, {
            elements: {
              pre: ({ children }) => children,
              code: ({ children }) => children,
              line: ({ children }) => `<span>${children}</span>`,
            },
          });
        }
      }
    });
  };
}

const tagsToAddIds = ["h1", "h2", "h3", "h4"];
const tagsToIncludeInSectionIndex = ["h1", "h2", "h3"];
function rehypeSlugify() {
  return (tree) => {
    let slugify = slugifyWithCounter();
    visit(tree, "element", (node) => {
      if (tagsToAddIds.includes(node.tagName) && !node.properties.id) {
        node.properties.id = slugify(toString(node));
      }
    });
  };
}

function rehypeAddMDXExports(getExports) {
  return (tree) => {
    let exports = Object.entries(getExports(tree));

    for (let [name, value] of exports) {
      for (let node of tree.children) {
        if (
          node.type === "mdxjsEsm" &&
          new RegExp(`export\\s+const\\s+${name}\\s*=`).test(node.value)
        ) {
          return;
        }
      }

      let exportStr = `export const ${name} = ${value}`;

      tree.children.push({
        type: "mdxjsEsm",
        value: exportStr,
        data: {
          estree: acorn.parse(exportStr, {
            sourceType: "module",
            ecmaVersion: "latest",
          }),
        },
      });
    }
  };
}

function getSections(node) {
  let sections = [];

  for (let child of node.children ?? []) {
    if (
      child.type === "element" &&
      tagsToIncludeInSectionIndex.includes(child.tagName)
    ) {
      sections.push(`{
        title: ${JSON.stringify(toString(child))},
        id: ${JSON.stringify(child.properties.id)},
        ...${child.properties.annotation}
      }`);
    } else if (child.children) {
      sections.push(...getSections(child));
    }
  }

  return sections;
}

export const rehypePlugins = [
  mdxAnnotations.rehype,
  rehypeCodeTitles,
  rehypeParseCodeBlocks,
  rehypeShiki,
  rehypeSlugify,
  rehypeMdxTitle,
  [
    rehypeAddMDXExports,
    (tree) => ({
      sections: `[${getSections(tree).join()}]`,
    }),
  ],
  sourceFilePath.rehype,
];
