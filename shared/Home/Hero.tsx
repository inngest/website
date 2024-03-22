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
          flex flex-col lg:flex-row gap-16 lg:items-center
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
        <div className="shrink">
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
    </div>
  );
}
