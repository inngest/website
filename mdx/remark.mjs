import { mdxAnnotations } from "mdx-annotations";
import remarkGfm from "remark-gfm";

import * as sourceFilePath from "./plugins/sourceFilePath.mjs";

export const remarkPlugins = [
  mdxAnnotations.remark,
  sourceFilePath.remark,
  remarkGfm,
];
