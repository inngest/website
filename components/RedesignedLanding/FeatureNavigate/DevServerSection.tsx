"use client";

import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { useRef, useEffect } from "react";
import { useInView } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./Card";
import { Button } from "../Button";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import DevServerAnimation from "./Lottie/DevServerAnimation.json";

export default function DevServerSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  const inView = useInView(wrapperRef, { amount: 0.3, once: true });

  // Start the animation exactly once.
  useEffect(() => {
    if (inView) lottieRef.current?.play();
  }, [inView]);

  return (
    <div className="mx-auto my-20 flex max-w-7xl flex-col items-center md:my-40 xl:flex-row">
      <Card className="dev-card-anchor order-1 mb-8 flex h-full max-w-2xl flex-col justify-center rounded-none border-none bg-stone-950 sm:order-2 md:mb-0 xl:order-1">
        <CardHeader className="pl-6 pr-6 pt-16 md:pl-10">
          <CardTitle className="max-w-md font-whyte text-3xl font-light">
            Debug fast with instant Traces
          </CardTitle>
        </CardHeader>
        <CardContent className="max-w-md pb-4 pl-6 pr-6 font-circular text-base font-normal text-stone-300 md:pl-10 md:pr-6">
          Structured logs and real-time traces – including every prompt /
          response pair – with one CLI command.
        </CardContent>
        <CardFooter className="pl-6 pr-6 md:pl-10 md:pr-6">
          <Button variant="outline" asChild>
            <Link href="https://www.inngest.com/docs/platform/monitor/traces">
              Start using Traces <ArrowRightIcon className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
      <div className="devsvg-anchor relative z-30 order-1 flex flex-col items-center xl:order-2">
        <h2 className="devserver-anchor z-30 text-center font-circular text-xs font-light md:text-sm">
          INSTANT DEVELOPMENT ENVIRONMENT
        </h2>
        <div ref={wrapperRef}>
          <Lottie
            lottieRef={lottieRef}
            animationData={DevServerAnimation}
            autoplay={false}
            loop={false}
          />
        </div>
      </div>
    </div>
  );
}
