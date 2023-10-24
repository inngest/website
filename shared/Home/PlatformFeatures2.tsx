import Link from "next/link";
import Container from "../layout/Container";
import clsx from "clsx";

import Heading from "./Heading";
import CopyBtn from "./CopyBtn";

export default function PlatformFeatures() {
  const handleCopyClick = (copy) => {
    navigator.clipboard?.writeText(copy);
  };
  return (
    <Container className="my-44 tracking-tight">
      <Heading
        title="Re-imagined DX from Local to Prod"
        lede={
          <>
            Building and testing code that runs in the background is a pain.
            <br className="hidden md:block" /> Streamline your developer
            workflow from local dev to production.
          </>
        }
        className="mx-auto max-w-3xl text-center"
      />

      <div className="my-24 mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:col-span-2 rounded-2xl overflow-hidden xl:min-h-[420px] px-8 pt-12 lg:pt-0 lg:px-16 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-[40%_1fr] gap-8 md:gap-8 lg:gap-24 items-center bg-[url(/assets/pricing/table-bg.png)] bg-center bg-[height:130%]">
          <div className="md:pb-8 lg:py-12 lg:pb-12">
            <p className="text-2xl font-semibold mb-5">Inngest Dev Server</p>
            <p className="text-lg mb-7 font-medium text-slate-300">
              Our open source Dev Server runs on your machine for a complete
              local development experience, with production parity. Get instant
              feedback on your work and deploy to prod with full confidence.
              There are no containers or extra local database to run - Just one
              command:
            </p>
            <div className="bg-white/10 backdrop-blur-md inline-flex rounded text-sm text-slate-200 shadow-lg">
              <pre className=" pl-4 pr-2 py-2">
                <code className="bg-transparent font-bold text-slate-300">
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
          </div>

          <div className="flex flex-col justify-end h-full md:pt-8">
            <img
              src="/assets/homepage/dev-server-screenshot.jpg"
              alt="Inngest Dev Server Screenshot"
              className={`
              w-full
                max-w-full md:min-w-[420px] xl:min-w-[520px] -mb-1
                rounded-md drop-shadow-sm m-auto origin-center
                pointer-events-none
                max-w-6xl
              `}
            />
          </div>
        </div>

        <div className="grid grid-rows-[auto_1fr] rounded-lg gap-8 md:gap-10 overflow-hidden bg-gradient-to-b	from-amber-400/20 to-rose-400/20">
          <div className="pt-11 px-8 md:px-10">
            <p className="text-2xl font-semibold mb-5">
              Branch Environments for every deploy
            </p>
            <p className="text-lg mb-7 font-medium text-slate-300">
              Test your entire application end-to-end with an Inngest
              environment for every development branch that you deploy, without
              any extra work.
            </p>
            <a
              href="/docs/platform/environments"
              className="mt-4 font-medium text-slate-200 hover:text-white hover:underline decoration-dotted underline-offset-4 decoration-slate-50/30"
            >
              Learn more →
            </a>
          </div>
          <div className="flex flex-col justify-end h-full pl-10">
            <img
              src="/assets/homepage/branch-envs-screenshot.png"
              alt="Branch environments"
              className="rounded-tl-xl"
            />
          </div>
        </div>

        <div className="grid grid-rows-[auto_1fr] rounded-lg gap-8 md:gap-10 overflow-hidden bg-gradient-to-br from-blue-400/20 to-orange-200/20">
          <div className="pt-11 px-8 md:px-10">
            <p className="text-2xl font-semibold mb-5">Observability</p>
            <p className="text-lg mb-7 font-medium text-slate-300">
              Quickly diagnose system wide issues with built in metrics. View
              backlogs and spikes in failures for every single function. There
              is no need for instrumenting your code for metrics or battling
              some Cloudwatch dashboard.
            </p>
            {/* <a
              href="/docs/platform/environments"
              className="mt-4 font-medium text-slate-200 hover:text-white hover:underline decoration-dotted underline-offset-4 decoration-slate-50/30"
            >
              Learn more →
            </a> */}
          </div>
          <div className="flex flex-col justify-end h-full pl-10">
            <img
              src="/assets/homepage/branch-envs-screenshot.png"
              alt="Branch environments"
              className="rounded-tl-xl"
            />
          </div>
        </div>
      </div>
    </Container>
  );
}
