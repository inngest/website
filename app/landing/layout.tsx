// Import SectionProvider due to the global MDX components and it's usage in Docs
import { SectionProvider } from "shared/Docs/SectionProvider";

export default function LandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SectionProvider sections={[]}>
      <div className="dark">
        {/* Temp add "dark" class above until we support dark/light mode throughout the site */}
        <main className="mx-auto max-w-[800px] prose dark:prose-invert">
          {children}
        </main>
      </div>
    </SectionProvider>
  );
}
