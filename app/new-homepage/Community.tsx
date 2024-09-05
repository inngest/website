import { RiDiscordFill, RiGithubFill } from "@remixicon/react";
import Container from "./Container";
import Card from "src/components/Card";
import { Button } from "src/shared/Button";

export default function Community() {
  return (
    <div>
      <Container className="my-10 lg:mt-20 lg:mb-12 flex flex-col md:flex-row gap-8 lg:gap-12 text-basis">
        <Card
          wrapperClassName="w-full lg:w-1/2"
          className="flex-col gap-4 items-start"
          variant="subtle"
        >
          <a
            href="https://www.inngest.com/discord"
            className="w-full bg-[#5765f2] rounded flex items-center justify-center text-white h-[140px] lg:h-[200px] hover:opacity-80 transition-all duration-150"
          >
            <RiDiscordFill size="4em" />
          </a>
          <h4 className="mt-2 text-lg font-bold">Join our Discord community</h4>
          <p className="flex-grow">
            Join our Discord community to ask questions, share feedback, and
            have a direct line to shaping the future of Inngest!
          </p>
          <Button
            href="https://www.inngest.com/discord"
            variant="primary"
            target="_blank"
          >
            Join the community
          </Button>
        </Card>
        <Card
          wrapperClassName="w-full lg:w-1/2"
          className="flex-col gap-4 items-start"
          variant="subtle"
        >
          <a
            href="https://github.com/inngest/inngest"
            className="w-full bg-slate-800 rounded flex items-center justify-center text-white h-[140px] lg:h-[200px]  hover:opacity-80 transition-all duration-150"
          >
            <RiGithubFill size="4em" />
          </a>
          <h4 className="mt-2 text-lg font-bold">Open Source</h4>
          <p className="flex-grow">
            Inngest's core and all SDKs are open source. Explore our code bases,
            weigh in on RFCs, and contribute on GitHub.
          </p>
          <Button
            href="https://github.com/inngest/inngest"
            variant="primary"
            target="_blank"
          >
            View project on GitHub
          </Button>
        </Card>
      </Container>
    </div>
  );
}
