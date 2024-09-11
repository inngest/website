import { type Metadata } from "next";

import NewsletterSignup from "src/components/NewsletterSignup";

export const metadata: Metadata = {
  title: "Inngest - Launch Week #2 - September 23-27, 2024",
  description:
    "A week of exciting new feature launches and product updates from Inngest.",
};

export default function Page() {
  return (
    <>
      <div className="max-w-[1520px] mx-auto px-8 bg-[url(/assets/launch-week/2/hero-background.svg)] bg-cover">
        <header className="max-w-6xl mx-auto py-24 md:py-52 text-basis">
          <div className="lg:ml-2.5 flex items-center gap-2 uppercase text-lg md:text-2xl text-[rgb(var(--color-primary-xIntense))] font-medium">
            <span>Sept 23</span>
            <span className="h-px w-[60px] bg-[rgb(var(--color-primary-xIntense))]"></span>
            <span>Sept 30</span>
          </div>
          <h1 className="mt-3 text-6xl md:text-8xl lg:text-9xl uppercase font-medium">
            Inngest <br className="hidden sm:block" /> Launch Week #2
          </h1>
          <div className="mt-16">
            <p className="text-xl md:text-2xl">
              Join us for a week of new features and announcements starting on{" "}
              <span className="text-[rgb(var(--color-primary-moderate))]">
                September 23
              </span>
              .
            </p>
          </div>
          <div className="mt-8">
            <NewsletterSignup tags={["launch-week-sept-2024"]} />
          </div>
        </header>
      </div>
    </>
  );
}
