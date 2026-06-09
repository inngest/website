"use client";

import { useEffect, useState } from "react";
import ContentMenu, { type ContentMenuItem } from "@/components/v1/ContentMenu";

// Article side-rail table of contents. Thin wrapper over the shared
// v1 ContentMenu: it discovers the post's section headings from the
// rendered article DOM (rehypeSlug has already stamped stable `id`s on
// every <h2>), so the TOC works for any post without a server-side
// parse, then hands the list to ContentMenu for rendering + scroll-spy.

export default function BlogToc({ articleId }: { articleId: string }) {
  const [items, setItems] = useState<ContentMenuItem[]>([]);

  useEffect(() => {
    const root = document.getElementById(articleId);
    if (!root) return;

    const headings = Array.from(
      root.querySelectorAll<HTMLHeadingElement>("h2[id]"),
    );
    setItems(headings.map((h) => ({ id: h.id, text: h.textContent ?? "" })));
  }, [articleId]);

  return <ContentMenu items={items} />;
}
