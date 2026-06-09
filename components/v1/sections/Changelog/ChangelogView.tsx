import ContentMenu, {
  type ContentMenuGroup,
} from "@/components/v1/ContentMenu";
import { SectionProvider } from "shared/Docs/SectionProvider";
import TrackChangelogView from "@/app/changelog/TrackChangelogView";
import EntryArticle from "@/components/v1/sections/Changelog/EntryArticle";
import { type ChangelogItem } from "@/components/v1/sections/Changelog/data";

export default function ChangelogView({
  entries,
  menuGroups,
}: {
  entries: ChangelogItem[];
  menuGroups: ContentMenuGroup[];
}) {
  return (
    // Two-column changelog: a 448px left rail
    // (title + sticky content menu) beside an 800px entry column, 52px
    // apart. Top padding clears the fixed header (~76px) and matches the
    // design's 80px frame inset (76 + 80 = 156 on desktop).
    <section className="mx-auto w-full max-w-[1440px] px-6 pb-20 pt-24 text-v1-frost sm:px-9 sm:pt-[120px] lg:px-[70px] lg:pb-40 lg:pt-[172px]">
      <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-[minmax(0,448fr)_minmax(0,800fr)] lg:items-start lg:gap-x-[52px]">
        {/* Left rail — sticks below the fixed header on scroll. */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-[100px]">
          <header className="flex flex-col gap-5">
            <h1 className="text-v1-display-sm uppercase leading-[1.25] text-white [font-size:clamp(2.5rem,5.4vw,4rem)]">
              Changelog
            </h1>
            <p className="text-v1-body-xs text-white">
              Updates &amp; improvements to Inngest
            </p>
          </header>

          {/* Content menu. Desktop-only — a section list
              stacked atop a mobile changelog is just noise. The card caps
              its height and scrolls internally so a long changelog can't
              outgrow the viewport. */}
          <div className="hidden lg:block">
            <ContentMenu
              groups={menuGroups}
              ariaLabel="Changelog entries"
              className="max-h-[calc(100vh-220px)] overflow-y-auto"
            />
          </div>
        </div>

        {/* Entry column — 44px between entries; the first
            entry sits ~100px below the title to line up with the menu
            card. */}
        <SectionProvider sections={[]}>
          <div className="flex flex-col gap-11 lg:pt-[100px]">
            {entries.map((item, idx) => (
              <EntryArticle key={`${idx}-${item.slug}`} item={item} />
            ))}
          </div>
        </SectionProvider>
      </div>

      <TrackChangelogView date={entries[0]?.metadata?.date} />
    </section>
  );
}
