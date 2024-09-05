import Container from "./Container";
import Heading from "./Heading";
import Command from "src/components/Command";
import { Button } from "src/shared/Button";
import Feature from "src/components/Feature";

const features = [
  {
    title: (
      <>
        Visual debugging in <em>real-time</em>
      </>
    ),
    description:
      "No more parsing terminal logs. Watch your functions execute step-by-step in your browser.",
  },
  {
    title: "Single binary, zero dependencies",
    description:
      "One command to install and run. No external services, databases, or dependencies.",
  },
  {
    title: "Iterate faster",
    description:
      "Replay functions in one click for a faster feedback loop than ever before.",
  },
];

export default function LocalDevelopment() {
  return (
    <Container>
      <Heading
        label="Local Development"
        title="Unparalleled local development workflow"
        description={
          <>
            Our open source Dev Server runs on your machine for a complete local
            development experience, with production parity. Get instant feedback
            on your work and deploy to prod with full confidence.
          </>
        }
        className="my-8"
      />
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <Command command="npx inngest-cli@latest dev" />
        <Button
          href="/docs/local-development?ref=homepage-dev-tools"
          variant="secondaryV2"
          size="md"
        >
          Learn about our local development tooling
        </Button>
      </div>
      <video
        src="/assets/homepage/video/2024-09-dev-server-4k.mp4"
        autoPlay
        loop
        muted
        className={`
          mt-14 w-full
          rounded-lg m-auto scale-80 origin-center
          pointer-events-none
          max-w-8xl
          border border-subtle
          shadow-[0_0_220px_16px_rgba(20,284,286,0.2)]
        `}
      />
      <div className="my-12 mx-6 md:mx-auto max-w-6xl grid sm:grid-cols-3 gap-x-10 gap-y-10">
        {features.map(({ title, description }, idx) => (
          <Feature title={title} description={description} key={idx} />
        ))}
      </div>
    </Container>
  );
}
