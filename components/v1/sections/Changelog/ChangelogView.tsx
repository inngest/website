import ContentMenu, {
  type ContentMenuGroup,
} from "@/components/v1/ContentMenu";
import { SectionProvider } from "shared/Docs/SectionProvider";
import { Unreleased } from "shared/Docs/Unreleased";
import TrackChangelogView from "@/app/_changelog/TrackChangelogView";
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
    // Two-column changelog: an 800px content column (title + entries) on
    // the left, beside a 448px sticky content-menu rail on the right, 52px
    // apart. Top padding clears the fixed header (~76px) and matches the
    // design's 80px frame inset (76 + 80 = 156 on desktop).
    <section className="mx-auto w-full max-w-[1440px] px-6 pb-20 pt-24 text-v1-frost sm:px-9 sm:pt-[120px] lg:px-[70px] lg:pb-40 lg:pt-[172px]">
      {/* Explicit grid placement: title spans the top of the left
          column (row 1); the entry list and the sticky rail share row 2,
          so the rail's top aligns with the first entry — not the title. */}
      <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-[minmax(0,800fr)_minmax(0,448fr)] lg:items-start lg:gap-x-[52px]">
        {/* Title — over the content (left column, row 1). */}
        <header className="flex flex-col gap-5 lg:col-start-1 lg:row-start-1">
          <h1 className="text-v1-display-sm uppercase leading-[1.25] text-white [font-size:clamp(2.5rem,5.4vw,4rem)]">
            Changelog
          </h1>
          <p className="text-v1-body-xs text-white">
            Updates &amp; improvements to Inngest
          </p>
        </header>

        {/* Entry column — 44px between entries (left column, row 2). */}
        <SectionProvider sections={[]}>
          <div className="flex flex-col gap-11 lg:col-start-1 lg:row-start-2">
            {entries.map((item, idx) => {
              const key = `${idx}-${item.slug}`;
              // A gated entry is hidden on the server and revealed client-side
              // only when ?unreleased includes its label.
              return item.metadata.unreleased ? (
                <Unreleased key={key} label={item.metadata.unreleased}>
                  <EntryArticle item={item} />
                </Unreleased>
              ) : (
                <EntryArticle key={key} item={item} />
              );
            })}
          </div>
        </SectionProvider>

        {/* Right rail — sticky content menu, aligned to the entries (row
            2). Desktop-only: a section list stacked atop a mobile
            changelog is just noise. The card caps its height and scrolls
            internally so a long changelog can't outgrow the viewport. */}
        <div className="hidden lg:col-start-2 lg:row-start-2 lg:block lg:sticky lg:top-[100px]">
          <ContentMenu
            groups={menuGroups}
            ariaLabel="Changelog entries"
            className="max-h-[calc(100vh-220px)] overflow-y-auto"
          />
        </div>
      </div>

      <TrackChangelogView date={entries[0]?.metadata?.date} />
    </section>
  );
}
