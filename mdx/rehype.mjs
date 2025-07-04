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

            // Check if we need to load the content from a file
            const isContentInFile = parts.length === 1 && parts[0].startsWith("!path=")

            if (isContentInFile) {
              const loadRelativePath = parts[0].slice("!path=".length);

              // The path may be suffixed with a line range (e.g.
              // `!path=snippets/py/example.py#L8-L13`)
              const [loadPath, lines] = path.join(process.cwd(), loadRelativePath).split("#")

              let fileContent = readFileSync(loadPath, "utf-8");

              if (lines) {
                const [startStr, endStr] = lines.replaceAll("L", "").split("-");
                const start = parseInt(startStr, 10);
                const end = parseInt(endStr, 10);

                // Only use the specified line range
                fileContent = fileContent.split("\n").slice(start - 1, end).join("\n");
              }

              node.children = [
                {
                  type: "text",
                  value: fileContent,
                },
              ];
            }
          }
        }
      }
    });
  };
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
