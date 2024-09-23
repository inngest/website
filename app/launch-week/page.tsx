import { type Metadata } from "next";
import { RiRocket2Line } from "@remixicon/react";

import NewsletterSignup from "src/components/NewsletterSignup";
import { generateMetadata } from "src/utils/social";
import Community from "./Community";

export const metadata: Metadata = generateMetadata({
  title: "Launch Week II - September 23-27, 2024",
  description:
    "A week of exciting new feature launches and product updates from Inngest.",
  image: "/assets/launch-week/2/open-graph.png?v=3",
});

export default function Page() {
  return (
    <>
      {/* @ts-ignore */}
      <style global="true">{`
        /* Hide the page banner on this page*/
        .page-banner {
          display: none;
        }
      `}</style>
      <div className="max-w-[1520px] mx-auto px-8 bg-[url(/assets/launch-week/2/hero-background-animated.svg)] bg-contain bg-no-repeat bg-top">
        <header className="max-w-6xl mx-auto py-24 md:py-52 text-basis">
          <div className="lg:ml-2.5 flex items-center gap-2 uppercase text-lg md:text-2xl text-[rgb(var(--color-primary-xIntense))] font-medium">
            <span>Sept 23</span>
            <span className="h-px w-[60px] bg-[rgb(var(--color-primary-xIntense))]"></span>
            <span>Sept 27</span>
          </div>
          <h1 className="mt-3 text-6xl md:text-8xl lg:text-9xl uppercase font-medium">
            Inngest <br className="hidden sm:block" /> Launch Week{" "}
            <span className="text-[rgb(var(--color-primary-intense))]">II</span>
          </h1>
          {/* <div className="mt-16">
            <p className="text-xl md:text-2xl drop-shadow">
              Join us for a week of new features and announcements starting on{" "}
              <span className="text-[rgb(var(--color-primary-moderate))]">
                September 23
              </span>
              .
            </p>
          </div>
          <div className="mt-8">
            <NewsletterSignup tags={["launch-week-sept-2024"]} />
          </div> */}
        </header>
        <div className="max-w-6xl mx-auto mb-6 md:mb-24 flex flex-col gap-16">
          <Day day={1} title="Self-hosting" date="Monday, September 23rd">
            <Card
              title="Announcing self-hosting"
              image="/assets/launch-week/2/monday-graphic.svg"
              href="/blog/inngest-1-0-announcing-self-hosting-support?ref=launch-week-2"
            >
              <p>
                With our 1.0 open-source self-hosting release, Inngest offers
                greater flexibility for developers. Deploy with a single
                command, no specific environment required.
              </p>
              <p>
                Ideal for staging, CI/CD testing, or basic setups. Start Inngest
                on your server in seconds, bringing durable execution to your
                infrastructure.
              </p>
            </Card>
          </Day>

          {/* Upcoming days */}
          <div className="relative">
            {/* Upcoming day */}
            <div className="p-px rounded-lg bg-gradient-to-bl from-[#686868] via-[#545454] to-[#292929] relative z-50">
              <div
                className="p-6 py-12 md:py-28 flex items-center justify-center gap-4 rounded-lg"
                style={{
                  background: `url(/assets/launch-week/2/coming-soon-bg.svg), linear-gradient(211deg, rgba(176, 176, 176, 0.50) -57.05%, rgba(0, 0, 0, 0.40) 45.09%), #1A1A1A;`,
                  backgroundSize: `contain, 100% 100%, 100% 100%`,
                  backgroundRepeat: `no-repeat, no-repeat, no-repeat`,
                  backgroundPosition: `right, center, center`,
                }}
              >
                <div className="flex flex-col items-center gap-4 text-center">
                  <RiRocket2Line className="text-basis h-10 w-10 rotate-45" />
                  <h2 className="text-4xl text-basis font-book">
                    Coming up next...
                  </h2>
                  <p className="text-subtle text-sm">Tuesday, September 24th</p>
                  <div className="mt-8">
                    <NewsletterSignup
                      showHeader={false}
                      tags={["launch-week-sept-2024"]}
                      buttonText="Notify me"
                    />
                  </div>
                </div>
              </div>
            </div>
            {[
              "Wednesday, September 23rd",
              "Thursday, September 24th",
              "Friday, September 25th",
            ].map((day, idx) => (
              <div
                key={idx}
                className="relative p-px rounded-lg bg-gradient-to-bl from-[#686868] via-[#545454] to-[#292929]"
                style={{
                  top: `${-2 * (idx + 1)}rem`,
                  margin: `0 ${(idx + 1) * 2.5}%`,
                  zIndex: 40 - idx * 10,
                }}
              >
                <div
                  className="bg-[#1A1A1A] rounded-lg pt-10 pb-2 text-center text-muted"
                  style={{
                    // background: `linear-gradient(211deg, rgba(176, 176, 176, 0.50) -57.05%, rgba(0, 0, 0, 0.40) 45.09%), #1A1A1A;`,
                    backgroundSize: `contain, 100% 100%, 100% 100%`,
                    backgroundRepeat: `no-repeat, no-repeat, no-repeat`,
                    backgroundPosition: `right, center, center`,
                  }}
                >
                  <span style={{ fontSize: `${1 - 0.05 * (idx + 1)}em` }}>
                    {day}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto mb-24 md:mb-48">
          <Community />
        </div>
      </div>
    </>
  );
}

function Day({
  day,
  title,
  date,
  children,
}: {
  day: number;
  title: string;
  date: string;
  children: React.ReactNode;
}) {
  return (
    <div className="text-basis">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <p className="text-primary-intense font-medium">Day #{day}</p>
          <h2 className="text-4xl font-book">{title}</h2>
        </div>
        <p className="text-muted">{date}</p>
      </div>
      <div className="mt-8 lg:min-h-[496px] flex">{children}</div>
    </div>
  );
}

function Card({
  title,
  image,
  href,
  children,
}: {
  title: string;
  image: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a href={href} className="group flex flex-grow">
      <div className="flex p-px rounded-lg bg-gradient-to-bl from-[#686868] via-[#545454] to-[#292929]">
        <div
          className="flex flex-col md:flex-row gap-6 items-center md:items-start rounded-lg p-6 flex-grow"
          style={{
            background: `url(/assets/launch-week/2/monday-bg.svg), linear-gradient(211deg, rgba(176, 176, 176, 0.50) -57.05%, rgba(0, 0, 0, 0.40) 45.09%), #1A1A1A;`,
            backgroundSize: `contain, 100% 100%, 100% 100%`,
            backgroundRepeat: `no-repeat, no-repeat, no-repeat`,
            backgroundPosition: `right, center, center`,
          }}
        >
          <div className="md:max-w-80 xl:w-80 flex flex-col gap-4">
            <h3 className="flex items-center gap-2 text-basis text-xl">
              {title}
              <ArrowIcon />
            </h3>
            <div className="flex flex-col gap-6 text-subtle transition-all group-hover:text-basis text-sm">
              {children}
            </div>
            <p className="text-primary-intense text-sm group-hover:underline">
              Read the announcement
            </p>
          </div>
          <img
            src={image}
            alt={title}
            className="my-auto sm:max-w-[80%] md:max-w-[50%] lg:max-w-[68%]"
          />
        </div>
      </div>
    </a>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12Z"
        stroke="#B0B0B0"
      />
      <path
        d="M14.8157 11.3251L11.195 7.70445L12.1495 6.75L17.3996 12.0001L12.1495 17.2503L11.195 16.2958L14.8157 12.6751H6.59961V11.3251H14.8157Z"
        fill="#F6F6F6"
      />
    </svg>
  );
}
