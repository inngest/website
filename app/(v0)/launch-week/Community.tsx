import {
  RiDiscordFill,
  RiGithubFill,
  RiArrowRightUpLine,
  RiToolsFill,
} from "@remixicon/react";

const betaTesterLink =
  "mailto:hello@inngest.com?subject=I'd%20like%20to%20become%20an%20Inngest%20beta%20tester&body=Hi%20there%2C%0ACan%20you%20please%20add%20me%20to%20the%20Inngest%20beta%20tester%20group%3F%0A%0AMy%20Inngest%20billing%20email%20is%3A%20%3CPlease%20add%20you%20email%3E%0A%0AThanks!";

export default function Community() {
  return (
    <div className="my-10 lg:mt-20 lg:mb-12 mx-6 md:mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-basis">
      <Card
        header={
          <a
            href="https://www.inngest.com/discord"
            target="_blank"
            className="w-full bg-[#5765f2] rounded-t-lg flex items-center justify-center text-white h-[140px] lg:h-[200px] hover:opacity-80 transition-all duration-150"
          >
            <RiDiscordFill size="4em" />
          </a>
        }
      >
        <h4 className="text-xl">Join our Discord community</h4>
        <p className="flex-grow text-sm">
          Join our Discord community to ask questions, share feedback, and have
          a direct line to shaping the future of Inngest!
        </p>
        <a
          href="https://www.inngest.com/discord"
          className="rounded-full border border-contrast px-4 py-2 flex items-center gap-2 hover:bg-carbon-500/10"
          target="_blank"
        >
          <RiArrowRightUpLine className="h-4 w-4 text-subtle" /> Join the
          community
        </a>
      </Card>
      <Card
        header={
          <a
            href="https://github.com/inngest/inngest"
            target="_blank"
            className="w-full bg-[#353535] rounded flex items-center justify-center text-white h-[140px] lg:h-[200px]  hover:opacity-80 transition-all duration-150"
          >
            <RiGithubFill size="4em" />
          </a>
        }
      >
        <h4 className="text-xl">Open Source</h4>
        <p className="flex-grow text-sm">
          Inngest's core and all SDKs are open source. Explore our code bases,
          weigh in on RFCs, and contribute on GitHub.
        </p>
        <a
          href="https://github.com/inngest/inngest"
          className="rounded-full border border-contrast px-4 py-2 flex items-center gap-2 hover:bg-carbon-500/10"
          target="_blank"
        >
          <RiArrowRightUpLine className="h-4 w-4 text-subtle" /> View project on
          GitHub
        </a>
      </Card>
      <Card
        header={
          <a
            href={betaTesterLink}
            className="w-full bg-[#027A48] rounded flex items-center justify-center text-white h-[140px] lg:h-[200px]  hover:opacity-80 transition-all duration-150"
          >
            <RiToolsFill size="4em" />
          </a>
        }
      >
        <h4 className="text-xl">Enroll for beta testing</h4>
        <p className="flex-grow text-sm">
          Are you interested in becoming a beta tester and participant in user
          research sessions? Sign up below to get access to new features!
        </p>
        <a
          href={betaTesterLink}
          className="rounded-full border border-contrast px-4 py-2 flex items-center gap-2 hover:bg-carbon-500/10"
        >
          <RiArrowRightUpLine className="h-4 w-4 text-subtle" /> Become a beta
          tester
        </a>
      </Card>
    </div>
  );
}

function Card({
  header,
  children,
}: {
  header: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col rounded-lg bg-[#1F1F1F]">
      {header}
      <div className="p-4 flex flex-col gap-3 items-start">{children}</div>
    </div>
  );
}
