// Import SectionProvider due to the global MDX components and it's usage in Docs
import { SectionProvider } from "shared/Docs/SectionProvider";
import { FullWidthCTA } from "src/components/FullWidthCTA";

export default function LandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SectionProvider sections={[]}>
      <div className="dark -mb-36">
        {/* Temp add "dark" class above until we support dark/light mode throughout the site */}
        <main className="mx-auto max-w-[800px] prose dark:prose-invert">
          {children}
        </main>
        <FullWidthCTA
          ctaText="Read the quick start guide"
          ctaHref="/docs/quick-start"
        />
      </div>
    </SectionProvider>
  );
}
