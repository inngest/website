import Link from "next/link";

import { formatDate } from "src/utils/date";
import { getChangelogURL } from "@/app/changelog/helpers";
import {
  BODY,
  CLOUD,
  mdxComponents,
} from "@/components/v1/sections/Changelog/mdxConfig";
import {
  entryId,
  type ChangelogItem,
} from "@/components/v1/sections/Changelog/data";

// A single changelog entry — date over title, then
// the MDX body. The DOM id matches the content menu's scroll-spy target.
export default function EntryArticle({ item }: { item: ChangelogItem }) {
  return (
    <article
      id={entryId(item.slug)}
      className="flex scroll-mt-[100px] flex-col gap-8"
    >
      {/* Entry header — date over title, 16px apart.
          CircularXX Mono 12/24 cloud date; Heading/Sm title. */}
      <header className="flex flex-col gap-4">
        <p className={`font-v1Mono text-[12px] leading-6 ${CLOUD}`}>
          {formatDate(item.metadata.date)}
        </p>
        <h2 className="text-v1-heading-sm text-white">
          <Link
            href={getChangelogURL(item.slug, true)}
            className="motion-safe:transition-colors hover:text-v1-accent-salmon-light"
          >
            {item.metadata.title}
          </Link>
        </h2>
      </header>
      <div className={BODY}>
        <item.Content components={mdxComponents} />
      </div>
    </article>
  );
}
