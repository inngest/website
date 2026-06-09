import type { MDXComponents } from "mdx/types";
import { MDXRemote } from "next-mdx-remote/rsc";

import DiscordCTA from "src/shared/Blog/DiscordCTA";
import CTACallout from "src/shared/CTACallout";
import Blockquote from "src/shared/Blog/Blockquote";
import { ReportChart } from "@/components/Blog/Report/ReportChart";
import { ReportExecSummary } from "@/components/Blog/Report/ReportExecSummary";
import { ReportSectionBreak } from "@/components/Blog/Report/ReportSectionBreak";
import { ReportWhatWeAsked } from "@/components/Blog/Report/ReportWhatWeAsked";
import { CodeBlock } from "./CodeBlock";
import {
  BlogAutoplayVideo,
  BlogButton,
  BlogCallout,
  BlogCol,
  BlogProductHunt,
  BlogRow,
  BlogYouTube,
} from "./MdxComponents";
import { MdxImage } from "./MdxImage";
import { MDX_OPTIONS } from "./mdxOptions";

const components: MDXComponents = {
  // MDX posts inline <Button href=...>; keep it server-rendered.
  Button: BlogButton as unknown as MDXComponents["Button"],
  img: MdxImage,
  DiscordCTA,
  CTACallout,
  Blockquote,
  AutoplayVideo: BlogAutoplayVideo as unknown as MDXComponents["AutoplayVideo"],
  YouTube: BlogYouTube as unknown as MDXComponents["YouTube"],
  Code: CodeBlock,
  Callout: BlogCallout as unknown as MDXComponents["Callout"],
  WorkflowKitProductOfTheDay:
    BlogProductHunt as unknown as MDXComponents["WorkflowKitProductOfTheDay"],
  Col: BlogCol as unknown as MDXComponents["Col"],
  Row: BlogRow as unknown as MDXComponents["Row"],
  // Report posts (e.g. the AI-in-Production report) embed these.
  ReportChart,
  ReportExecSummary,
  ReportSectionBreak,
  ReportWhatWeAsked,
};

export default async function ArticleBody({
  source,
  scope,
}: {
  source: string;
  scope: Record<string, unknown>;
}) {
  return (
    <MDXRemote
      source={source}
      options={{
        ...MDX_OPTIONS,
        scope: { json: JSON.stringify(scope) },
      }}
      components={components}
    />
  );
}
