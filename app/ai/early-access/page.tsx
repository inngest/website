import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import NewsletterSignup from "src/components/NewsletterSignup";

export const metadata: Metadata = generateMetadata({
  title: "Join our AI early access program",
  description: "Get early access to new AI features first and ",
});

export default function Page() {
  return (
    <div>
      <div className="mt-12 px-6 flex items-center justify-center tracking-tight text-basis">
        <div className="pt-12 md:pt-24 rounded-md">
          <h1 className="font-bold text-5xl md:text-7xl leading-tight md:leading-tight text-center mb-4">
            AI early access program
          </h1>
          <div className="max-w-xl mx-auto mt-4 flex flex-col gap-6">
            <p className="text-lg md:text-xl">
              Be the first to get access to and stay in the loop about our
              latest AI features, including <code>step.ai</code>,{" "}
              <strong>AgentKit</strong> and more.
            </p>
            <p className="text-lg md:text-xl">
              We're building the APIs and tools with the DX you expect from
              Inngest to help you build the most reliable, production-ready AI
              applications.
            </p>
            <NewsletterSignup
              showHeader={false}
              buttonText="Register"
              tags={["ai-early-access"]}
              fields={[{ name: "USE_CASE", label: "What are you building?" }]}
            />
          </div>
        </div>
      </div>
      <img
        className="max-w-6xl w-full mx-auto"
        src="/assets/ai/early-access-isometric-ui-image.png"
      />
    </div>
  );
}
