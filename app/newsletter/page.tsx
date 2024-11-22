import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import NewsletterSignup from "src/components/NewsletterSignup";

export const metadata: Metadata = generateMetadata({
  title: "Newsletter signup",
  description:
    "Get the latest product updates about Inngest delivered to your inbox.",
});

export default async function Page() {
  return (
    <div className="py-8 pb-48 text-basis text-basis">
      <div className="my-12 tracking-tight flex items-center justify-center">
        <div className="py-12 md:py-24 rounded-md">
          <h1 className="font-bold text-5xl md:text-7xl leading-tight md:leading-tight text-center mb-4">
            Stay in the loop
          </h1>
          <p className="my-12 text-lg md:text-xl">
            Be the first to hear about new features, beta releases, and other
            important updates.
          </p>

          <NewsletterSignup tagsFromSearchParams={true} />
        </div>
      </div>
    </div>
  );
}
