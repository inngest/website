"use client";

import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";

// Client island for the legacy case-study MDX body. The page serialises
// the markdown server-side and hands the compiled result here. The case
// studies are plain markdown (no custom MDX components), so no components
// map is needed.
export default function CaseStudyBody({
  source,
}: {
  source: MDXRemoteSerializeResult;
}) {
  return <MDXRemote {...source} />;
}
