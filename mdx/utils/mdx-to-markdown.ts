import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMdx from "remark-mdx";
import remarkStringify from "remark-stringify";
import remarkGfm from "remark-gfm";
import { visit, SKIP } from "unist-util-visit";
import { toString } from "mdast-util-to-string";
import type { Root, RootContent, Paragraph, Text, Link, Heading, Blockquote, List, ListItem, InlineCode, Strong, PhrasingContent } from "mdast";

// Type definitions for MDX AST nodes
interface MdxJsxAttribute {
  type: "mdxJsxAttribute";
  name: string;
  value: string | { type: string; value: string } | null;
}

interface MdxJsxFlowElement {
  type: "mdxJsxFlowElement";
  name: string | null;
  attributes: MdxJsxAttribute[];
  children: RootContent[];
}

interface MdxJsxTextElement {
  type: "mdxJsxTextElement";
  name: string | null;
  attributes: MdxJsxAttribute[];
  children: RootContent[];
}

type MdxJsxElement = MdxJsxFlowElement | MdxJsxTextElement;

/**
 * Extracts attribute value from an MDX JSX element
 */
function getAttr(node: MdxJsxElement, name: string): string | null {
  const attr = node.attributes.find(
    (a): a is MdxJsxAttribute => a.type === "mdxJsxAttribute" && a.name === name
  );
  if (!attr) return null;
  if (typeof attr.value === "string") return attr.value;
  if (attr.value && typeof attr.value === "object" && "value" in attr.value) {
    return attr.value.value;
  }
  return null;
}

/**
 * Creates a text node
 */
function text(value: string): Text {
  return { type: "text", value };
}

/**
 * Creates a strong (bold) node
 */
function strong(children: PhrasingContent[]): Strong {
  return { type: "strong", children };
}

/**
 * Creates a paragraph node
 */
function paragraph(children: PhrasingContent[]): Paragraph {
  return { type: "paragraph", children };
}

/**
 * Creates a link node
 */
function link(url: string, children: (Text | InlineCode)[]): Link {
  return { type: "link", url, children };
}

/**
 * Creates a heading node
 */
function heading(depth: 1 | 2 | 3 | 4 | 5 | 6, children: Text[]): Heading {
  return { type: "heading", depth, children };
}

/**
 * Creates a blockquote node
 */
function blockquote(children: RootContent[]): Blockquote {
  return { type: "blockquote", children: children as Blockquote["children"] };
}

/**
 * Creates a list item node
 */
function listItem(children: RootContent[]): ListItem {
  return { type: "listItem", children: children as ListItem["children"] };
}

/**
 * Creates a list node
 */
function list(items: ListItem[]): List {
  return { type: "list", ordered: false, children: items };
}

/**
 * Creates an inline code node
 */
function inlineCode(value: string): InlineCode {
  return { type: "inlineCode", value };
}

/**
 * Transforms an MDX JSX element to Markdown AST nodes
 */
function transformJsxElement(node: MdxJsxElement): RootContent[] | null {
  const name = node.name;

  if (!name) {
    // Fragment - just return children
    return node.children;
  }

  // Callout components: Note, Tip, Warning, Info, Callout
  if (["Note", "Tip", "Warning", "Info", "Callout"].includes(name)) {
    const textContent = toString(node).trim();
    if (!textContent) return [];
    return [
      blockquote([
        paragraph([strong([text(`${name}:`)]), text(` ${textContent}`)])
      ])
    ];
  }

  // Card component
  if (name === "Card") {
    const href = getAttr(node, "href");
    const title = getAttr(node, "title");
    const textContent = toString(node).trim();

    if (href && textContent) {
      if (title) {
        return [paragraph([strong([text(title)]), text(": "), link(href, [text(textContent)])])];
      }
      return [paragraph([link(href, [text(textContent)])])];
    } else if (title && textContent) {
      return [paragraph([strong([text(title)]), text(`: ${textContent}`)])];
    } else if (textContent) {
      return [paragraph([text(textContent)])];
    }
    return [];
  }

  // Step component
  if (name === "Step") {
    const title = getAttr(node, "title");
    const result: RootContent[] = [];
    if (title) {
      result.push(heading(3, [text(title)]));
    }
    result.push(...node.children);
    return result;
  }

  // Property component
  if (name === "Property") {
    const propName = getAttr(node, "name");
    const propType = getAttr(node, "type");
    const textContent = toString(node).trim();

    if (propName) {
      const typeStr = propType ? ` (${propType})` : "";
      const desc = textContent ? `: ${textContent}` : "";
      return [
        list([
          listItem([
            paragraph([inlineCode(propName), text(`${typeStr}${desc}`)])
          ])
        ])
      ];
    }
    return node.children.length > 0 ? node.children : [];
  }

  // GuideSection component
  if (name === "GuideSection") {
    const show = getAttr(node, "show");
    const result: RootContent[] = [];
    if (show) {
      const label = show === "ts" ? "TypeScript" : show === "py" ? "Python" : show === "go" ? "Go" : show;
      result.push(heading(4, [text(label)]));
    }
    result.push(...node.children);
    return result;
  }

  // GuideTitle component
  if (name === "GuideTitle") {
    const textContent = toString(node).trim();
    if (textContent) {
      return [heading(3, [text(textContent)])];
    }
    return [];
  }

  // Button component with href
  if (name === "Button") {
    const href = getAttr(node, "href");
    const textContent = toString(node).trim();
    if (href && textContent) {
      return [paragraph([link(href, [text(textContent)])])];
    } else if (textContent) {
      return [paragraph([text(textContent)])];
    }
    return [];
  }

  // Accordion/AccordionGroup components
  if (name === "Accordion") {
    const title = getAttr(node, "title");
    const result: RootContent[] = [];
    if (title) {
      result.push(heading(4, [text(title)]));
    }
    result.push(...node.children);
    return result;
  }

  // Components that just extract children
  if ([
    "CardGroup", "CodeGroup", "Steps", "Properties", "Row", "Col",
    "GuideSelector", "AccordionGroup", "Tabs", "Tab"
  ].includes(name)) {
    return node.children;
  }

  // Self-closing or unknown components - check if they have children
  if (node.children && node.children.length > 0) {
    return node.children;
  }

  // Self-closing components with no meaningful content - remove
  return [];
}

/**
 * Custom remark plugin to strip MDX syntax and convert to clean Markdown
 */
function remarkStripMdx() {
  return (tree: Root) => {
    // First pass: remove import/export statements
    tree.children = tree.children.filter((node) => {
      return node.type !== "mdxjsEsm";
    });

    // Second pass: transform JSX elements
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    visit(tree as any, (node: any, index: number | undefined, parent: any) => {
      if (
        (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") &&
        parent &&
        typeof index === "number"
      ) {
        const jsxNode = node as MdxJsxElement;
        const replacement = transformJsxElement(jsxNode);

        if (replacement === null) {
          // Keep the node as-is (shouldn't happen with current logic)
          return;
        }

        if (replacement.length === 0) {
          // Remove the node
          parent.children.splice(index, 1);
          return [SKIP, index];
        }

        // Replace with transformed nodes
        parent.children.splice(index, 1, ...replacement);
        return [SKIP, index];
      }
    });

    // Third pass: clean up any remaining mdxJsxExpressionAttribute or other MDX artifacts
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    visit(tree as any, (node: any, index: number | undefined, parent: any) => {
      // Remove any nodes that might have been missed
      if (
        node.type.startsWith("mdx") &&
        parent &&
        typeof index === "number"
      ) {
        parent.children.splice(index, 1);
        return [SKIP, index];
      }
    });
  };
}

/**
 * Converts MDX content to clean Markdown using AST-based parsing.
 *
 * This function:
 * 1. Parses MDX into an AST using remark-parse and remark-mdx
 * 2. Transforms JSX components to Markdown equivalents
 * 3. Removes import/export statements
 * 4. Serializes back to clean Markdown
 */
export async function convertMdxToMarkdown(mdxContent: string): Promise<string> {
  // First, strip frontmatter manually since it's not part of MDX parsing
  let content = mdxContent;
  const frontmatterMatch = content.match(/^---[\s\S]*?---\n*/);
  if (frontmatterMatch) {
    content = content.slice(frontmatterMatch[0].length);
  }

  const processor = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(remarkGfm)
    .use(remarkStripMdx)
    .use(remarkStringify, {
      bullet: "-",
      fences: true,
      listItemIndent: "one",
    });

  const result = await processor.process(content);
  let output = String(result);

  // Clean up excessive blank lines
  output = output.replace(/\n{3,}/g, "\n\n");

  return output.trim();
}
