import type { MDXComponents } from "mdx/types";
import * as docsComponents from "./shared/Docs/mdx";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // h1: ({ children }) => <h1 style={{ fontSize: '100px' }}>{children}</h1>,
    ...docsComponents,
    ...components,
  };
}
