"use client";

import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { useRef, useEffect } from "react";
import { useInView } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
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
          <CardTitle className="font-whyte text-3xl font-light">
            Instant, local step-by-step debugging
          </CardTitle>
        </CardHeader>
        <CardContent className="max-w-lg pb-16 pl-6 pr-6 font-circular text-base font-normal text-stone-300 md:pl-10 md:pr-6">
          Structured logs and real-time traces – including every prompt /
          response pair – with one CLI command.
        </CardContent>
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
