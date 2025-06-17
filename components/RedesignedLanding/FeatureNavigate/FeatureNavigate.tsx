"use client";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { Button } from "src/components/RedesignedLanding/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "src/components/RedesignedLanding/FeatureNavigate/Card";
import CodeBlockSwitcher from "src/components/RedesignedLanding/FeatureNavigate/CodeBlockSwitcher";
import DevServerSection from "src/components/RedesignedLanding/FeatureNavigate/DevServerSection";
import Terminal from "src/components/RedesignedLanding/FeatureNavigate/Terminal";
import DeploySVG from "./DeploySVG";
import FaultToleranceSVG from "./FaultToleranceSVG";
import FullObservabilitySVG from "./ObservabilitySVG";
import Lines from "./Lines";
import MobileDeploySVG from "./MoblieDeploySVG";
import MediumLines from "./MediumLines";

export default function FeatureNavigate() {
  return (
    <>
      <div className="feature-nav-container relative bg-stone-950">
        <div className="mx-auto w-full max-w-7xl">
          <h1 className="ml-2 mt-20 w-full font-whyteInktrap text-4xl font-normal sm:ml-0 md:text-5xl">
            Start locally,
            <br />
            <span className="feature-h1-anchor font-whyte">
              with your stack.
            </span>
          </h1>
        </div>
        <div className="mx-auto w-full px-10 sm:px-6 md:px-8">
          <CodeBlockSwitcher />
          <div className="xl:-ml-36">
            <Terminal />
          </div>
          <DevServerSection />
        </div>
        <div className="bg-stone-900 py-20 md:py-40">
          <div className="px-10 sm:px-6 md:px-8">
            <div className="relative z-30 mx-auto max-w-5xl bg-stone-900 md:z-0">
              <h1 className="mb-2 font-whyte text-4xl font-light">
                Ship at the speed of AI
              </h1>
              <p className="max-w-sm font-circular text-lg font-light text-stone-200">
                it amet, consectetur adipiscing elit. Duis mollis maximus
                pretium. Vestibulum faucibus tellus nec justo bibendum, vehicula
                finibus nisl iaculis. Sed molestie imperdiet metus ac laoreet.
              </p>
            </div>
            <div className="mx-auto flex max-w-screen-2xl flex-col pb-12 pt-12 md:flex-row md:justify-end md:pb-32 md:pt-20">
              <div className="hidden md:block">
                <DeploySVG />
              </div>
              <div className="block md:hidden">
                <MobileDeploySVG />
              </div>

              <Card className="mt-8 flex h-full max-w-xs flex-col justify-center rounded-none border-none bg-stone-900 md:ml-8 md:mt-0">
                <CardHeader className="pt-0">
                  <CardTitle className="font-whyte text-3xl font-light">
                    Deploy anywhere
                  </CardTitle>
                </CardHeader>
                <CardContent className="max-w-2xl font-circular text-base font-normal text-stone-300">
                  <p className="font-sans text-base font-normal leading-[26.24px] tracking-[-0.304px] text-stone-300">
                    Deploy your Inngest workflows on your favorite cloud
                    provider in one click
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="bg-stone-900" variant="outline">
                    Read Documentation <ArrowRightIcon />
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="mx-auto flex max-w-5xl flex-col items-start pb-12 pt-12 md:pb-0 md:pt-32">
              <div className="flex w-fit flex-col items-start">
                <FaultToleranceSVG />
                <Card className="flex h-full max-w-sm flex-col justify-center rounded-none border-none bg-stone-900 md:z-0 md:self-end xl:self-start">
                  <CardHeader className="pl-6 xl:pl-0">
                    <CardTitle className="font-whyte text-3xl font-light">
                      Fault tolerance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="max-w-2xl pl-6 font-circular text-base font-normal text-stone-300 xl:pl-0">
                    <p className="font-sans text-base font-normal leading-[26.24px] tracking-[-0.304px] text-stone-300">
                      Fault-tolerant AI app from day one with automatic retries
                      and flow control
                    </p>
                  </CardContent>
                  <CardFooter className="pl-6 xl:pl-0">
                    <Button className="bg-stone-900" variant="outline">
                      Read Documentation <ArrowRightIcon />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
            <div className="mx-auto flex max-w-5xl flex-col items-end pt-12 md:pt-0">
              <div className="flex flex-col items-start">
                <FullObservabilitySVG />
                <Card className="mt-8 flex h-full max-w-sm flex-col justify-center rounded-none border-none bg-stone-900">
                  <CardHeader className="pl-6 md:pl-0">
                    <CardTitle className="font-whyte text-3xl font-light">
                      Full observability
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="max-w-2xl pl-6 font-circular text-base font-normal text-stone-300 md:pl-0">
                    <p className="font-sans text-base font-normal leading-[26.24px] tracking-[-0.304px] text-stone-300">
                      Get full visibility over our AI workflows, and Agents with
                      live traces and metrics
                    </p>
                  </CardContent>
                  <CardFooter className="pl-6 md:pl-0">
                    <Button className="bg-stone-900" variant="outline">
                      Read Documentation <ArrowRightIcon />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>{" "}
        </div>
        <Lines />
        <MediumLines />
      </div>
    </>
  );
}
