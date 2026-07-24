import PageShell from "@/components/v1/PageShell";
import LogoMarquee from "@/components/v1/sections/Home/LogoMarquee";
import ChangelogView from "@/components/v1/sections/Changelog/ChangelogView";
import {
  loadChangelogEntries,
  buildMenuGroups,
} from "@/components/v1/sections/Changelog/data";

export default async function Changelog() {
  const entries = await loadChangelogEntries();
  const menuGroups = buildMenuGroups(entries);

  return (
    <PageShell>
      <div className="overflow-x-clip">
        <ChangelogView entries={entries} menuGroups={menuGroups} />
      </div>

      {/* Closing stippled "Inngest" lockup above the footer, shared with
          the Home/Privacy/Events pages. */}
      <LogoMarquee />
    </PageShell>
  );
}
