import Link from "next/link";
import Container from "../layout/Container";
import SectionHeader from "../SectionHeader";
import HomePatternsCheck from "../Icons/HomePatternsCheck";
import ArrowRight from "../Icons/ArrowRight";
import Github from "../Icons/Github";
import CopyBtn from "./CopyBtn";

import Heading from "./Heading";
import CustomerQuote from "./CustomerQuote";

export default function LocalDev() {
  const handleCopyClick = (copy) => {
    navigator.clipboard?.writeText(copy);
  };
  return (
    <Container className="mt-44 mb-44 relative z-30">
      <div>
        <Heading
          title="End-to-End Local Development"
          lede="The open source Inngest Dev Server runs on your machine for a complete
          local development experience. Get instant feedback on running jobs and
          errors like never before."
          className="mx-auto max-w-3xl text-center"
        />

        <div className="my-12 flex gap-4 flex-col md:flex-row items-center justify-center">
          <div className="bg-white/10 backdrop-blur-md flex rounded text-sm text-slate-200 shadow-lg">
            <pre className=" pl-4 pr-2 py-2">
              <code className="bg-transparent text-slate-300">
                <span>npx</span> inngest-cli dev
              </code>
            </pre>
            <div className="rounded-r flex items-center justify-center pl-2 pr-2.5">
              <CopyBtn
                btnAction={handleCopyClick}
                copy="npx inngest-cli@latest dev"
              />
            </div>
          </div>
          <Link
            href="/docs/quick-start?ref=homepage-dev-tools"
            className="rounded-md px-3 py-1.5 text-sm bg-transparent transition-all text-white border border-slate-800 hover:border-slate-600 hover:bg-slate-500/10 whitespace-nowrap"
          >
            Get Started
          </Link>
        </div>
      </div>
      <img
        src="/assets/homepage/dev-server-screenshot.png"
        alt="Inngest Dev Server Screenshot"
        className={`
          mt-14
          rounded-sm shadow-none m-auto w-screen scale-80 origin-center
          pointer-events-none
          max-w-6xl
        `}
      />

      <CustomerQuote
        quote="It's sensational - This is the best way to test a background job. I’ve never had a UI like this that I can follow and see my workflow."
        name="Garrett Tolbert - Vercel"
        avatar="/assets/customers/vercel-garrett-tolbert.jpg"
        className="max-w-lg absolute -bottom-20 left-[20%]"
      />
    </Container>

    /*
    <div className="overflow-x-hidden xl:pt-20 pb-60 -mb-60">
      <div>
        <Container className="mt-60 -mb-30 relative z-30">
          <div className="grid xl:gap-20 grid-cols-1 xl:grid-cols-3">
            <div className="xl:text-left text-center">
              <SectionHeader
                title={
                  <span className="xl:flex gap-2 items-end text-slate-200 font-medium text-2xl md:text-4xl xl:text-5xl mb-4 tracking-tighter ">
                    End-to-end local&nbsp;development
                  </span>
                }
              />
              <div
                className={`text-slate-200 max-w-md lg:max-w-xl text-sm md:text-base leading-5 md:leading-7 m-auto`}
              >
                <p>
                  Our open-source dev server runs on your machine for easy local
                  development. Get instant feedback, debugging tools, and
                  testing, no setup or code changes required.
                </p>
                <div className="flex flex-col md:flex-row items-center justify-start pb-20 pt-8 gap-8">
                  <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/30 flex rounded text-sm text-slate-200 shadow-lg">
                    <pre className=" pl-4 pr-2 py-2">
                      <code className="bg-transparent text-slate-300">
                        <span className="text-cyan-400">npx</span> inngest-cli
                        dev
                      </code>
                    </pre>
                    <div className="bg-slate-900/50 rounded-r flex items-center justify-center pl-2 pr-2.5">
                      <CopyBtn
                        btnAction={handleCopyClick}
                        copy="npx inngest-cli@latest dev"
                      />
                    </div>
                  </div>
                  <a
                    href="/docs/quick-start?ref=homepage-dev-tools"
                    className="group flex items-center gap-0.5 rounded-full text-sm font-medium pl-6 pr-5 py-2  bg-indigo-500 hover:bg-indigo-400 transition-all text-white"
                  >
                    Learn more
                    <ArrowRight className="group-hover:translate-x-1.5 relative top-px transition-transform duration-150 " />
                  </a>
                </div>
              </div>
            </div>
            <div className="col-span-2">
              <img
                src="/assets/DevUI.png"
                className={`
                  rounded-sm shadow-none m-auto w-screen relative z-10 scale-80 origin-center
                  pointer-events-none
                  max-w-[1300px]
                  xl:-ml-[200px] xl:-mt-[340px] xl:mb-[0]
                  -ml-[35px] -mt-[80px] mb-[50px]
                `}
              />
            </div>
          </div>
        </Container>
      </div>

      <div className="w-screen max-w-screen relative md:-mt-20 lg:-mt-32 xl:-mt-[400px] xl:mb-[400px] z-20 opacity-50 pointer-events-none">
        <div className=" blur-3xl w-[200px] md:w-[400px] lg:w-[500px] h-[200px] md:h-[400px] lg:h-[500px] bg-sky-500/20 absolute rounded-full left-1/2 -translate-x-[20%] translate-y-[40%] "></div>
        <div className=" blur-3xl w-[200px] md:w-[450px] lg:w-[550px] h-[200px] md:h-[450px] lg:h-[550px] bg-indigo-500/30 absolute rounded-full left-1/2 -translate-x-[100%] translate-y-[40%] "></div>
        <div className=" blur-3xl w-[200px] md:w-[300px] lg:w-[400px] h-[200px] md:h-[300px] lg:h-[400px] bg-purple-500/30 absolute rounded-full left-1/2 translate-x-[50%] translate-y-[40%] "></div>
        <div className=" blur-3xl w-[200px] md:w-[400px] lg:w-[500px] h-[200px] md:h-[400px] lg:h-[500px] bg-indigo-500/10 absolute rounded-full bottom-0 left-1/2 -translate-x-[20%] -translate-y-[62%] "></div>
        <div className=" blur-3xl w-[200px] md:w-[400px] lg:w-[550px] h-[200px] md:h-[400px] lg:h-[550px] bg-purple-500/10 absolute rounded-full bottom-0 left-1/2 -translate-x-[100%] translate-y-[50%] "></div>
        <div className=" blur-3xl w-[200px] md:w-[200px] lg:w-[400px] h-[200px] md:h-[200px] lg:h-[400px] bg-blue-500/10 absolute rounded-full bottom-0 left-1/2 translate-x-[50%] translate-y-[6%] "></div>
        <div className="overflow-x-hidden overflow-y-hidden w-screen"></div>
      </div>

      <Container className="lg:mb-40">
        <div className="bg-slate-900/70 backdrop-blur-sm -mt-40 pt-40 md:pt-32 lg:px-24 xl:px-32 rounded-xl px-8">
          <h2 className="text-white text-center font-medium pt-4 pb-8 text-2xl">
            Run Inngest locally for production parity
          </h2>

          <div className="flex flex-col xl:flex-row justify-between rounded-lg">
            <ul className="text-slate-200 text-sm mr-8">
              <li className="mb-3 flex items-center text-slate-200 xl:max-w-[300px] w-full leading-5">
                <HomePatternsCheck />
                <span className="ml-1.5">Events appear in real-time</span>
              </li>
              <li className="mb-3 flex items-center text-slate-200 xl:max-w-[300px] w-full leading-5">
                <HomePatternsCheck />
                <span className="ml-1.5">View function status at a glance</span>
              </li>
            </ul>
            <ul className="gap-2 mr-8 text-sm">
              <li className="mb-3 flex items-top text-slate-200 xl:max-w-[300px] w-full leading-5 ">
                <HomePatternsCheck />
                <span className="ml-1.5">
                  Inspect event payloads and see exactly what functions are
                  triggered
                </span>
              </li>
              <li className="mb-3 flex items-top text-slate-200 xl:max-w-[300px] w-full leading-5">
                <HomePatternsCheck />
                <span className="ml-1.5">
                  TypeScript types are automatically generated
                </span>
              </li>
            </ul>
            <ul className="gap-2 mr-8 text-sm">
              <li className="mb-3 flex items-top text-slate-200 xl:max-w-[300px] w-full leading-5 ">
                <HomePatternsCheck />
                <span className="ml-1.5">
                  Debug your functions with ease. Check step-by-step output and
                  view logs.
                </span>
              </li>
              <li className="mb-3 flex items-top text-slate-200 xl:max-w-[300px] w-full leading-5 ">
                <HomePatternsCheck />
                <span className="ml-1.5">
                  Re-run functions with one click to quickly iterate and fix
                  bugs.
                </span>
              </li>
            </ul>
          </div>
          <div className="flex items-center justify-center gap-4 pb-16 mt-8 flex-col lg:flex-row">
            <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/30 flex rounded text-sm text-slate-200 shadow-lg">
              <pre className=" pl-4 pr-4 py-2">
                <code className="bg-transparent text-slate-300">
                  <span className="text-cyan-400">npx</span> inngest-cli dev
                </code>
              </pre>
              <div className="bg-slate-900/50 rounded-r flex items-center justify-center pl-2 pr-2.5">
                <CopyBtn
                  btnAction={handleCopyClick}
                  copy="npx inngest-cli dev"
                />
              </div>
            </div>
            <a
              href="https://github.com/inngest/inngest"
              className="group inline-flex gap-2.5 items-center rounded-full text-sm font-medium pl-6 pr-5 py-2  bg-indigo-500 hover:bg-indigo-400 transition-all text-white"
            >
              View and star <Github />
            </a>
          </div>
        </div>
      </Container>
    </div>
    */
  );
}

export function DevUI() {
  const handleCopyClick = (copy) => {
    navigator.clipboard?.writeText(copy);
  };

  return (
    <div className="overflow-x-hidden xl:pt-20 pb-60 -mb-60">
      <div>
        <Container className="mt-60 -mb-30 relative z-30">
          <div className="grid xl:gap-20 grid-cols-1 xl:grid-cols-3">
            <div className="xl:text-left text-center">
              <SectionHeader
                title={
                  <span className="xl:flex gap-2 items-end text-slate-200 font-medium text-2xl md:text-4xl xl:text-5xl mb-4 tracking-tighter ">
                    End-to-end local&nbsp;development
                  </span>
                }
              />
              <div
                className={`text-slate-200 max-w-md lg:max-w-xl text-sm md:text-base leading-5 md:leading-7 m-auto`}
              >
                <p>
                  Our open-source dev server runs on your machine for easy local
                  development. Get instant feedback, debugging tools, and
                  testing, no setup or code changes required.
                </p>
                <div className="flex flex-col md:flex-row items-center justify-start pb-20 pt-8 gap-8">
                  <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/30 flex rounded text-sm text-slate-200 shadow-lg">
                    <pre className=" pl-4 pr-2 py-2">
                      <code className="bg-transparent text-slate-300">
                        <span className="text-cyan-400">npx</span> inngest-cli
                        dev
                      </code>
                    </pre>
                    <div className="bg-slate-900/50 rounded-r flex items-center justify-center pl-2 pr-2.5">
                      <CopyBtn
                        btnAction={handleCopyClick}
                        copy="npx inngest-cli@latest dev"
                      />
                    </div>
                  </div>
                  <a
                    href="/docs/quick-start?ref=homepage-dev-tools"
                    className="group flex items-center gap-0.5 rounded-full text-sm font-medium pl-6 pr-5 py-2  bg-indigo-500 hover:bg-indigo-400 transition-all text-white"
                  >
                    Learn more
                    <ArrowRight className="group-hover:translate-x-1.5 relative top-px transition-transform duration-150 " />
                  </a>
                </div>
              </div>
            </div>
            <div className="col-span-2">
              <img
                src="/assets/DevUI.png"
                className={`
                  rounded-sm shadow-none m-auto w-screen relative z-10 scale-80 origin-center
                  pointer-events-none
                  max-w-[1300px]
                  xl:-ml-[200px] xl:-mt-[340px] xl:mb-[0]
                  -ml-[35px] -mt-[80px] mb-[50px]
                `}
              />
            </div>
          </div>
        </Container>
      </div>

      <div className="w-screen max-w-screen relative md:-mt-20 lg:-mt-32 xl:-mt-[400px] xl:mb-[400px] z-20 opacity-50 pointer-events-none">
        <div className=" blur-3xl w-[200px] md:w-[400px] lg:w-[500px] h-[200px] md:h-[400px] lg:h-[500px] bg-sky-500/20 absolute rounded-full left-1/2 -translate-x-[20%] translate-y-[40%] "></div>
        <div className=" blur-3xl w-[200px] md:w-[450px] lg:w-[550px] h-[200px] md:h-[450px] lg:h-[550px] bg-indigo-500/30 absolute rounded-full left-1/2 -translate-x-[100%] translate-y-[40%] "></div>
        <div className=" blur-3xl w-[200px] md:w-[300px] lg:w-[400px] h-[200px] md:h-[300px] lg:h-[400px] bg-purple-500/30 absolute rounded-full left-1/2 translate-x-[50%] translate-y-[40%] "></div>
        <div className=" blur-3xl w-[200px] md:w-[400px] lg:w-[500px] h-[200px] md:h-[400px] lg:h-[500px] bg-indigo-500/10 absolute rounded-full bottom-0 left-1/2 -translate-x-[20%] -translate-y-[62%] "></div>
        <div className=" blur-3xl w-[200px] md:w-[400px] lg:w-[550px] h-[200px] md:h-[400px] lg:h-[550px] bg-purple-500/10 absolute rounded-full bottom-0 left-1/2 -translate-x-[100%] translate-y-[50%] "></div>
        <div className=" blur-3xl w-[200px] md:w-[200px] lg:w-[400px] h-[200px] md:h-[200px] lg:h-[400px] bg-blue-500/10 absolute rounded-full bottom-0 left-1/2 translate-x-[50%] translate-y-[6%] "></div>
        <div className="overflow-x-hidden overflow-y-hidden w-screen"></div>
      </div>

      <Container className="lg:mb-40">
        <div className="bg-slate-900/70 backdrop-blur-sm -mt-40 pt-40 md:pt-32 lg:px-24 xl:px-32 rounded-xl px-8">
          <h2 className="text-white text-center font-medium pt-4 pb-8 text-2xl">
            Run Inngest locally for production parity
          </h2>

          <div className="flex flex-col xl:flex-row justify-between rounded-lg">
            <ul className="text-slate-200 text-sm mr-8">
              <li className="mb-3 flex items-center text-slate-200 xl:max-w-[300px] w-full leading-5">
                <HomePatternsCheck />
                <span className="ml-1.5">Events appear in real-time</span>
              </li>
              <li className="mb-3 flex items-center text-slate-200 xl:max-w-[300px] w-full leading-5">
                <HomePatternsCheck />
                <span className="ml-1.5">View function status at a glance</span>
              </li>
            </ul>
            <ul className="gap-2 mr-8 text-sm">
              <li className="mb-3 flex items-top text-slate-200 xl:max-w-[300px] w-full leading-5 ">
                <HomePatternsCheck />
                <span className="ml-1.5">
                  Inspect event payloads and see exactly what functions are
                  triggered
                </span>
              </li>
              <li className="mb-3 flex items-top text-slate-200 xl:max-w-[300px] w-full leading-5">
                <HomePatternsCheck />
                <span className="ml-1.5">
                  TypeScript types are automatically generated
                </span>
              </li>
            </ul>
            <ul className="gap-2 mr-8 text-sm">
              <li className="mb-3 flex items-top text-slate-200 xl:max-w-[300px] w-full leading-5 ">
                <HomePatternsCheck />
                <span className="ml-1.5">
                  Debug your functions with ease. Check step-by-step output and
                  view logs.
                </span>
              </li>
              <li className="mb-3 flex items-top text-slate-200 xl:max-w-[300px] w-full leading-5 ">
                <HomePatternsCheck />
                <span className="ml-1.5">
                  Re-run functions with one click to quickly iterate and fix
                  bugs.
                </span>
              </li>
            </ul>
          </div>
          <div className="flex items-center justify-center gap-4 pb-16 mt-8 flex-col lg:flex-row">
            <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/30 flex rounded text-sm text-slate-200 shadow-lg">
              <pre className=" pl-4 pr-4 py-2">
                <code className="bg-transparent text-slate-300">
                  <span className="text-cyan-400">npx</span> inngest-cli dev
                </code>
              </pre>
              <div className="bg-slate-900/50 rounded-r flex items-center justify-center pl-2 pr-2.5">
                <CopyBtn
                  btnAction={handleCopyClick}
                  copy="npx inngest-cli dev"
                />
              </div>
            </div>
            <a
              href="https://github.com/inngest/inngest"
              className="group inline-flex gap-2.5 items-center rounded-full text-sm font-medium pl-6 pr-5 py-2  bg-indigo-500 hover:bg-indigo-400 transition-all text-white"
            >
              View and star <Github />
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}
