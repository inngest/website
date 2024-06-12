import { mdxAnnotations } from "mdx-annotations";
import remarkGfm from "remark-gfm";
import { remarkCodeHike } from "@code-hike/mdx";

import * as sourceFilePath from "./plugins/sourceFilePath.mjs";

export const remarkPlugins = [
  mdxAnnotations.remark,
  [remarkCodeHike, { theme: "dark-plus" }],
  sourceFilePath.remark,
  remarkGfm,
];
