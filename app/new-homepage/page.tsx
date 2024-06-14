import { type Metadata } from "next";
import Image from "next/image";
import clsx from "clsx";

import Link from "src/components/Link";
import Command from "src/components/Command";
import { Button } from "src/shared/Button";
import Github from "src/shared/Icons/Github";
import TabContainer from "./TabContainer";
import Container from "./Container";
import Heading from "./Heading";

export const metadata: Metadata = {
  title: "Inngest - The modern platform for shipping fast, reliable code", // TODO - TBD
  description:
    "Inngest enables your team to develop durable functions in your current codebase with zero new infrastructure. Develop complex, long-running functions without queues, workers, or additional state management.",
};

export default function Page() {
  return (
    <div className="font-circular no-antialiasing">
      {/* Hero */}
      <div
        // negative margin to match layout.tsx's horizontal margin - px-6 md:px-10 lg:px-20
        // TODO - fix for wide screens
        className={`
        w-[calc(100%+48px)] md:w-[calc(100%+80px)] lg:w-[calc(100%+160px)] -mx-6 md:-mx-10 lg:-mx-20
        bg-[url(/assets/textures/blob-background-1.png)]
        bg-cover bg-no-repeat bg-bottom
        text-body text-center
      `}
      >
        <Container>
          <header className="pt-36 pb-28">
            <h1 className="font-bold text-6xl leading-tight">
              The modern platform for <br className="hidden lg:inline" />
              shipping fast, reliable code
            </h1>
            <p className="max-w-5xl mt-16 mx-auto text-xl leading-normal">
              <strong>
                Develop and ship durable functions in minutes, without managing
                infrastructure, queues, or state.
              </strong>
              <br className="hidden lg:inline" />
              Inngest's SDKs let you easily write transactional code that
              automatically retries for reliability —{" "}
              <br className="hidden lg:inline" />
              on serverless, servers, or the edge.
            </p>
            <div className="mt-8 flex flex-col items-center gap-8">
              <Button
                variant="dark"
                size="lg"
                href={`${process.env.NEXT_PUBLIC_SIGNUP_URL}?ref=homepage-hero`}
              >
                Start building for free
              </Button>
              <Link
                href="/docs?ref=homepage-hero"
                className="p-2 font-semibold text-white hover:text-slate-50"
              >
                Read the docs
              </Link>
            </div>
          </header>
          <div className="flex flex-col gap-6 items-center pb-8">
            <span className="p-[1px] bg-carbon-0 w-96"></span>
            <p className="text-sm">
              Trusted by modern software companies at scale worldwide:
            </p>
            <div className="flex flex-wrap lg:flex-nowrap gap-x-8 gap-y-8">
              {[
                {
                  src: "/assets/customers/soundcloud-logo-white-horizontal.svg",
                  name: "SoundCloud",
                  scale: 1.5,
                },
                {
                  src: "/assets/customers/tripadvisor.svg",
                  name: "TripAdvisor",
                  scale: 1.4,
                },
                {
                  src: "/assets/customers/gitbook-logo-white.svg",
                  name: "Gitbook",
                  scale: 1.3,
                },
                {
                  src: "/assets/customers/resend.svg",
                  name: "Resend",
                  scale: 0.9,
                },
                {
                  src: "/assets/customers/leap-logo-white.svg",
                  name: "Leap",
                  scale: 0.8,
                },
                {
                  src: "/assets/customers/snaplet-dark.svg",
                  name: "Snaplet",
                  sacle: 0.9,
                },
                {
                  src: "/assets/customers/zamp-logo.svg",
                  name: "Zamp",
                  scale: 0.7,
                },
              ].map(({ src, name, scale = 1 }, idx) => (
                <Image
                  key={idx}
                  src={src}
                  alt={name}
                  title={name}
                  width={120 * 0.9 * scale}
                  height={30 * 0.9 * scale}
                  className={clsx(
                    "m-auto width-auto transition-all grayscale",
                    `max-h-[${36 * scale}px] col-span-2`,
                    idx > 4 && "hidden xl:block"
                  )}
                />
              ))}
            </div>
          </div>
        </Container>
      </div>

      <div className="my-32">
        <Heading label="APIs for all challenges" className="my-8" />
        <TabContainer />
      </div>
    </div>
  );
}
