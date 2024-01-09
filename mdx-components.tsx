import type { MDXComponents } from "mdx/types";
import * as docsComponents from "./shared/Docs/mdx";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...docsComponents,
    ...components,
  };
}
