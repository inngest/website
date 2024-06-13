import type { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";

import { h1, h2, h3, h4, a, code, pre } from "./shared/Docs/mdx";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1,
    h2,
    h3,
    h4,
    a,
    // img: (props) => (
    //   <Image
    //     sizes="100vw"
    //     style={{ width: "100%", height: "auto" }}
    //     {...(props as ImageProps)}
    //   />
    // ),
    code,
    pre,
    ...components,
  };
}
