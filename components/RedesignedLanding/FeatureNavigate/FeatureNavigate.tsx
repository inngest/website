"use client";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
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
import Lines from "./Lines";
import animationData from "./Lottie/observability.json";
import MediumLines from "./MediumLines";
import MobileDeploySVG from "./MoblieDeploySVG";
import { useRef, useEffect } from "react";
import { useInView } from "framer-motion";
import GridBackground from "../GridBackground";
import Link from "next/link";

export default function FeatureNavigate() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const inView = useInView(wrapperRef, { amount: 0.3, once: true });

  useEffect(() => {
    if (inView) {
      lottieRef.current?.play();
    }
  }, [inView]);

  return (
    <>
      <div className="feature-nav-container relative bg-stone-950">
        {/* <GridBackground /> */}
        <div className="mx-auto w-full max-w-7xl">
          <h1 className="mt-20 w-full pl-8 font-whyteInktrap text-4xl font-normal md:text-5xl xl:pl-0">
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
                Production ready from day 1
              </h1>
              <p className="max-w-lg font-circular text-lg font-light text-stone-200">
                Go from local prototype to production application with
                fault-tolerance and full observability for servers or serverless
                deployments.
              </p>
            </div>
            <div className="mx-auto flex max-w-screen-2xl flex-col pb-12 pt-12 md:flex-row md:justify-end md:pb-32 md:pt-20">
              <div className="order-2 hidden sm:order-1 md:block">
                <DeploySVG />
              </div>
              <div className="order-2 block sm:order-1 md:hidden">
                <MobileDeploySVG />
              </div>

              <Card className="order-1 mt-8 flex h-full max-w-xs flex-col justify-center rounded-none border-none bg-stone-900 sm:order-2 md:ml-8 md:mt-0">
                <CardHeader className="pt-0">
                  <CardTitle className="font-whyte text-3xl font-light">
                    Ship anywhere
                  </CardTitle>
                </CardHeader>
                <CardContent className="max-w-2xl font-circular text-base font-normal text-stone-300">
                  <p className="text-balance font-sans text-base font-normal leading-[26.24px] tracking-[-0.304px] text-stone-300">
                    Deploy Inngest workflows to your favorite cloud provider in
                    one click
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="bg-stone-900" variant="outline" asChild>
                    <Link href="/docs/platform/deployment?ref=homepage-deploy">
                      Read Documentation <ArrowRightIcon />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="mx-auto flex max-w-5xl flex-col items-start pb-12 pt-12 md:pb-0 md:pt-32">
              <div className="flex w-fit flex-col items-start">
                <FaultToleranceSVG />
                <Card className="flex h-full max-w-sm flex-col justify-center rounded-none border-none bg-stone-900 sm:order-1 md:z-0 md:self-end xl:self-start">
                  <CardHeader className="pl-6 xl:pl-0">
                    <CardTitle className="font-whyte text-3xl font-light">
                      Fault tolerance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="max-w-2xl pl-6 font-circular text-base font-normal text-stone-300 xl:pl-0">
                    <p className="text-balance font-sans text-base font-normal leading-[26.24px] tracking-[-0.304px] text-stone-300">
                      Automatically retry on error for reliable AI applications
                    </p>
                  </CardContent>
                  <CardFooter className="pl-6 xl:pl-0">
                    <Button className="bg-stone-900" variant="outline" asChild>
                      <Link href="/docs/guides/error-handling?ref=homepage-fault-tolerance">
                        Read Documentation <ArrowRightIcon />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
            <div className="mx-auto flex max-w-lg flex-col pt-12 md:max-w-5xl md:items-end md:pt-0">
              <div className="flex flex-col items-start">
                <div ref={wrapperRef}>
                  <Lottie
                    lottieRef={lottieRef}
                    animationData={animationData}
                    className="observability-anchor"
                    loop={false}
                    autoplay={false}
                  />
                </div>
                <Card className="mt-8 flex h-full max-w-sm flex-col justify-center rounded-none border-none bg-stone-900 sm:order-1">
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
                    <Button className="bg-stone-900" variant="outline" asChild>
                      <Link href="/docs/platform/monitor/observability-metrics?ref=homepage-observability">
                        Read Documentation <ArrowRightIcon />
                      </Link>
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
