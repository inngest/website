import type { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

import { h1, h2, h3, h4, a, code, pre } from "./shared/Docs/mdx";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1,
    h2,
    h3,
    h4,
    a,
    img: (props) => (
      <Zoom wrapElement="span" zoomMargin={25}>
        <Image
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: "100%", height: "auto" }}
          className="rounded"
          {...(props as ImageProps)}
        />
      </Zoom>
    ),
    code,
    pre,
    ...components,
  };
}
