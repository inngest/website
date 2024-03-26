import Link from "next/link";
import Image from "next/image";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { CheckIcon } from "@heroicons/react/20/solid";

import Container from "../layout/Container";

/**
 * NOTE - When you update hero copy also update index.tsx's getStaticProps title/description for social & SEO
 */
export default function Hero() {
  return (
    <div className="overflow-x-hidden">
      <Container
        className={`
          flex flex-col lg:flex-row gap-16 lg:gap-36 lg:items-center lg:justify-between
          font-heading overflow-y-hidden
          my-12 lg:my-24
        `}
      >
        <div
          className={`
          relative z-20
          sm:max-w-[520px] md:max-w-[600px] lg:max-w-[520px]
          shrink-0
        `}
        >
          <h1 className="pb-8 font-semibold text-4xl lg:text-5xl bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent">
            Ship reliable code, <br className="none lg:inline" />
            no extra infrastructure
          </h1>
          <div className="flex flex-col gap-6 font-normal text-base md:text-lg">
            <p>
              Develop durable functions and workflows in code <em>without</em>{" "}
              having to create queues, workers, or manage complex state.
            </p>
            <p>
              Our SDK and developer tools help you ship reliable code that
              retries on failure, in less time, without the headaches.
            </p>
            <div className="flex flex-wrap gap-4 py-4 text-base">
              <div>
                <Link
                  href="/docs?ref=homepage-hero"
                  className="group rounded-md font-medium px-6 py-2 bg-indigo-500 hover:bg-indigo-400 transition-all text-white whitespace-nowrap flex flex-row items-center"
                >
                  Read the docs{" "}
                  <ChevronRightIcon className="h-5 group-hover:translate-x-1 relative top-px transition-transform duration-150" />
                </Link>
              </div>
              <Link
                href={`${process.env.NEXT_PUBLIC_SIGNUP_URL}?ref=homepage-hero`}
                className="rounded-md font-medium px-6 py-2 transition-all text-white bg-slate-800 hover:bg-slate-600 border border-slate-800 hover:border-slate-600 hover:bg-slate-500/10 whitespace-nowrap"
              >
                Sign up for free
              </Link>
            </div>
            <div className="text-slate-300">
              <p className="mb-2">Everything you need including:</p>
              <ul className="flex flex-wrap gap-3">
                {[
                  "Observability",
                  "Logging",
                  "Flow control",
                  "Recovery tools",
                ].map((r) => (
                  <li className="flex items-center gap-2" key={r}>
                    <CheckIcon className="h-4 w-4 text-slate-400/80 shrink-0" />{" "}
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="shrink max-w-[680px]">
          <img
            src="/assets/homepage/hero/2024-mar-dev-server.png"
            alt="Inngest Dev Server"
            className={`
              shrink
              rounded-lg shadow-none border border-white/10
              pointer-events-none
            `}
          />
        </div>
      </Container>
      <Container className="flex flex-wrap lg:flex-nowrap gap-4 gap-y-8 mt-8 mb-8 lg:mb-16">
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
            scale: 1,
          },
          {
            src: "/assets/customers/leap-logo-white.svg",
            name: "Leap",
            scale: 0.8,
          },
          {
            src: "/assets/customers/snaplet-dark.svg",
            name: "Snaplet",
          },
          {
            src: "/assets/customers/zamp-logo.svg",
            name: "Zamp",
            scale: 0.9,
          },
        ].map(({ src, name, scale = 1 }, idx) => (
          <Image
            key={idx}
            src={src}
            alt={name}
            title={name}
            width={120 * scale}
            height={30 * scale}
            className={clsx(
              "m-auto width-auto transition-all grayscale opacity-80 hover:opacity-100",
              `max-h-[${36 * scale}px] col-span-2`,
              idx > 4 && "hidden xl:block"
            )}
          />
        ))}
      </Container>
    </div>
  );
}
