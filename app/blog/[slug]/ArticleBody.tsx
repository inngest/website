"use client";

import type { MDXComponents } from "mdx/types";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";

import ButtonLink from "@/components/v1/ButtonLink";
import DiscordCTA from "src/shared/Blog/DiscordCTA";
import CTACallout from "src/shared/CTACallout";
import Blockquote from "src/shared/Blog/Blockquote";
import AutoplayVideo from "src/shared/Blog/AutoplayVideo";
import YouTube from "react-youtube-embed";
import { Callout, Col, Row } from "src/shared/Docs/mdx";
import ProductHunt from "src/app/launch-week/ProductHunt";
import { CodeBlock } from "./CodeBlock";

// Lives in a "use client" boundary so the legacy shared/Blog/*
// components (which use React hooks without their own client
// directive) can be imported safely. The page reads + serialises
// the MDX server-side, then hands the compiled result here for
// rendering.

const components: MDXComponents = {
  // MDX posts inline <Button href=...>; route through v1 ButtonLink.
  Button: ButtonLink as unknown as MDXComponents["Button"],
  DiscordCTA,
  CTACallout,
  Blockquote,
  AutoplayVideo,
  // @ts-ignore older lib, still works
  YouTube,
  Code: CodeBlock,
  Callout,
  WorkflowKitProductOfTheDay: ProductHunt,
  Col,
  Row,
};

export default function ArticleBody({
  source,
}: {
  source: MDXRemoteSerializeResult;
}) {
  return <MDXRemote {...source} components={components} />;
}
