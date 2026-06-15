import rehypeCodeTitles from "rehype-code-titles";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
// @ts-ignore - codehike has no published types for the mdx entrypoint
import { recmaCodeHike, remarkCodeHike } from "codehike/mdx";

import { rehypeRemoveTwoSlashMarkup, rehypeShiki } from "@/utils/code";
// @ts-ignore - local .mjs without bundled types
import { rehypeParseCodeBlocks } from "@/mdx/rehype.mjs";

const chConfig = {
  components: { code: "Code" },
  syntaxHighlighting: {
    theme: "dracula-soft",
  },
};

const MDX_REHYPE_NODE_TYPES = [
  "mdxFlowExpression",
  "mdxJsxFlowElement",
  "mdxJsxTextElement",
  "mdxTextExpression",
  "mdxjsEsm",
];

// Plugin lists have noisy union types from upstream packages; cast to
// `any` so next-mdx-remote accepts the shape. codehike injects fenced
// block data as inline JS object literals, so `blockJS` must stay false.
export const MDX_OPTIONS = {
  blockJS: false,
  mdxOptions: {
    rehypePlugins: [
      rehypeCodeTitles,
      rehypeParseCodeBlocks,
      rehypeRemoveTwoSlashMarkup,
      rehypeShiki,
      [rehypeRaw, { passThrough: MDX_REHYPE_NODE_TYPES }],
      rehypeSlug,
    ],
    remarkPlugins: [[remarkCodeHike, chConfig], remarkGfm],
    recmaPlugins: [[recmaCodeHike, chConfig]],
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;
