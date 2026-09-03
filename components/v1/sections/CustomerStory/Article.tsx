"use client";

import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";

import Chip from "@/components/v1/sections/shared/Chip";
import type { CustomerStoryData } from "@/components/v1/sections/CustomerStory/types";
import Prose from "@/components/v1/Prose";

export default function Article({
  story,
  source,
}: {
  story: CustomerStoryData;
  source: MDXRemoteSerializeResult;
}) {
  // Meta line: author + reading time (case studies carry no publish
  // date, so that item is omitted rather than fabricated).
  const meta = [story.author, story.readTime].filter(Boolean) as string[];
  return (
    <div className="flex flex-col gap-12 lg:col-span-2 lg:gap-16 lg:px-16">
      {/* Header block (162:17500) */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-start gap-3">
          <Chip variant="gradient" size="sm">
            {story.tag}
          </Chip>
          {story.pill && (
            <p
              className="inline-flex max-w-full items-center gap-2.5 rounded-r-md bg-v1-accent-blue py-2.5 pl-6 pr-4 text-v1-body-sm text-white shadow-[0_0_0_1px_rgb(var(--color-v1-accent-blue)),0_8px_24px_-8px_rgb(var(--color-v1-accent-blue)/0.7)] [clip-path:polygon(0_50%,16px_0,100%_0,100%_100%,16px_100%)] sm:gap-3 sm:py-3 sm:pl-7 sm:pr-5 sm:text-v1-body-md"
              role="note"
            >
              <span
                aria-hidden="true"
                className="size-1.5 shrink-0 rounded-full bg-white sm:size-2"
              />
              <span className="shrink-0 font-v1Label text-[11px] uppercase tracking-[0.08em] text-white/80 sm:text-[12px]">
                Note
              </span>
              <span aria-hidden="true" className="text-white/50">
                ·
              </span>
              <span className="min-w-0 font-medium">{story.pill}</span>
            </p>
          )}
        </div>
        <h1
          id="customer-story-heading"
          className="text-v1-heading-md-cap max-w-[749px] text-white"
        >
          {story.title}
        </h1>
        {meta.length > 0 && (
          <p className="text-v1-body-sm text-white">
            {meta.map((item, i) => (
              <span key={item}>
                {i > 0 && (
                  <span aria-hidden="true" className="mx-[10px]">
                    •
                  </span>
                )}
                {item}
              </span>
            ))}
          </p>
        )}
      </div>

      {/* Profile + pull quote (162:17509) — only when the study carries a
          quote (florian-works has none). */}
      {story.pullQuote && (
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:gap-[62px]">
          {story.portrait && (
            <div className="h-[227.973px] w-[201.74px] shrink-0 overflow-hidden">
              <img
                src={story.portrait}
                alt={story.pullQuoteAuthor ?? ""}
                className="h-full w-full object-cover grayscale"
              />
            </div>
          )}
          <div className="flex flex-1 flex-col gap-[32.864px]">
            <p className="text-v1-heading-xs text-v1-frost">
              {story.pullQuote}
            </p>
            {(story.pullQuoteAuthor || story.pullQuoteRole) && (
              <div className="text-v1-body-sm text-white">
                {story.pullQuoteAuthor && <p>{story.pullQuoteAuthor}</p>}
                {story.pullQuoteRole && <p>{story.pullQuoteRole}</p>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Body block (162:17515) — the real MDX article in v1 prose. */}
      <Prose className="[&_video]:my-6 [&_video]:block [&_video]:w-full [&_video]:rounded [&_video]:bg-[#141414]">
        <MDXRemote {...source} />
      </Prose>
    </div>
  );
}
