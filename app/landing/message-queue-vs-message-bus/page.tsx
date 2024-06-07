import type { Metadata } from "next";
// @ts-ignore - this is a valid import
import Content, { getStaticProps } from "./content.mdx";

const { props } = getStaticProps();
export const metadata: Metadata = {
  title: props.title,
  description: props.metadata.description,
};

export default function Page() {
  return <Content />;
}
