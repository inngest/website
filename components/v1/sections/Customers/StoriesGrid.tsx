"use client";

import { useState } from "react";
import { motion } from "motion/react";
import StoryCard from "@/components/v1/sections/shared/StoryCard";
import {
  CategoryDropdown,
  SortByDropdown,
  type Category,
  type SortOption,
} from "@/components/v1/sections/Customers/Dropdowns";
import { STORIES, STORY_HREF } from "@/components/v1/sections/Customers/data";
import { reveals } from "@/utils/v1/reveals";

export default function StoriesGrid() {
  const [categories, setCategories] = useState<Set<Category>>(
    () => new Set<Category>(["ALL"])
  );
  const [sort, setSort] = useState<SortOption>("LATEST");

  // Filter: ALL keeps every story; otherwise a story matches if any of
  // its tags overlaps the selected categories (tags are uppercased to
  // match the CATEGORY_OPTIONS casing).
  const visible = STORIES.filter((s) => {
    if (categories.has("ALL")) return true;
    return s.tags.some((t) => categories.has(t.toUpperCase() as Category));
  });

  // Sort: LATEST preserves source order (newest-first by convention),
  // ALPHABETICAL sorts by brand wordmark.
  const sorted =
    sort === "ALPHABETICAL"
      ? [...visible].sort((a, b) =>
          a.brand.localeCompare(b.brand, undefined, { sensitivity: "base" })
        )
      : visible;

  return (
    <section
      aria-labelledby="customers-stories-heading"
      className="relative mx-auto w-full max-w-[1440px] px-6 pb-20 pt-4 text-v1-frost sm:pb-[100px] sm:pt-6 lg:px-8 lg:pb-40 lg:pt-8"
    >
      <h2
        id="customers-stories-heading"
        className="text-v1-heading-sm mb-6 text-v1-frost sm:mb-8"
      >
        Customer stories
      </h2>
      <div className="mb-8 flex items-center gap-8 sm:mb-10">
        <CategoryDropdown selected={categories} onChange={setCategories} />
        <SortByDropdown selected={sort} onChange={setSort} />
      </div>
      {sorted.length === 0 ? (
        <p className="font-v1Mono text-[14px] uppercase text-v1-frost/60">
          No stories match the selected categories.
        </p>
      ) : (
        <ul className="grid list-none grid-cols-1 gap-6 pl-0 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((s, i) => (
            <motion.li key={s.id} {...reveals.item(i)} className="list-none">
              <StoryCard
                href={STORY_HREF(s.id)}
                logo={s.logo}
                brand={s.brand}
                tags={s.tags}
                title={s.title}
                body={s.body}
              />
            </motion.li>
          ))}
        </ul>
      )}
    </section>
  );
}
