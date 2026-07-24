"use client";

import ContentMenu, { type ContentMenuItem } from "@/components/v1/ContentMenu";

export type BlogTocItem = ContentMenuItem;

export default function BlogToc({ items }: { items: BlogTocItem[] }) {
  return <ContentMenu items={items} />;
}
