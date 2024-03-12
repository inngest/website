import Link from "next/link";
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
          flex-col
          font-heading font-['IBM Plex Sans']
          overflow-y-hidden
        `}
      >
        <div
          className={`
          relative z-20
          max-w-[520px] md:max-w-[420px] lg:max-w-[520px]
          mt-12 md:mt-24 mb-12
          md:pb-12 lg:pb-36 xl:pb-48
        `}
        >
          <h1 className="pb-8 font-semibold text-3xl md:text-4xl lg:text-5xl bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent">
            Ship reliable products
          </h1>
          <div className="flex flex-col gap-6 font-normal text-base md:text-lg">
            <p>
              Inngest enables you to develop durable functions in your current
              codebase with <em>zero</em> new infrastructure.
            </p>
            <p>
              Develop complex, long-running functions without queues, workers,
              or additional state management.
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
            <div className="sm:max-w-[320px] xl:max-w-none text-slate-300">
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
        <div
          className={`
            flex-col relative md:absolute top-0 right-0 z-10
            flex justify-end items-start
            w-full
            md:w-[calc(100%-420px-5rem)] lg:w-[calc(100%-520px-8rem)]
            max-w-[920px]
            mt-12 md:mt-24
            md:translate-y-[5%] lg:translate-y-[-1%] xl:translate-y-[-4%]
          `}
          style={{}}
        >
          <video
            src="/assets/homepage/hero/dev-server-mar-2024-pop-open.mp4"
            muted
            autoPlay
            loop
            className={`
              relative z-10 self-end
              w-[90%] xl:w-4/5
              mr-1
              origin-top-right
              rounded-lg shadow-none border border-white/10
              pointer-events-none`}
          />
          <img
            src="/assets/homepage/hero/agent-function.png"
            alt="Inngest Function"
            className={`
              relative XX-top-12 XXXsm:-top-3 XXXlg:-top-12
              left-0 z-20
              translate-y-[-20%] sm:translate-y-[-20%] lg:translate-y-[-40%]
              w-[42%] md:w-3/5 lg:w-1/2 max-w-3xl min-w-[300px] sm:min-w-0
              rounded-lg shadow-sm border border-white/10`}
          />
        </div>
      </Container>
    </div>
  );
}
