"use client";

import * as Content from "./content.mdx";

// console.log(Content.frontmatter);

export default function Page() {
  console.log("title?", Content.title, Content.meta);
  return <Content.default />;
}
