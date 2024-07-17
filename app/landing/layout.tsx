import type { Metadata } from "next";
// Import SectionProvider due to the global MDX components and it's usage in Docs
import { SectionProvider } from "shared/Docs/SectionProvider";
import { FullWidthCTA } from "src/components/FullWidthCTA";

export const metadata: Metadata = {
  // Prevent Google from indexing landing pages which may have
  // duplicate and/or temporary content
  robots: "noindex",
};

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
          ctaHref="/docs/getting-started/nextjs-quick-start"
        />
      </div>
    </SectionProvider>
  );
}
