"use client";
import { useState } from "react";
import clsx from "clsx";

import Container from "./Container";
import Heading from "./Heading";
import Card from "src/components/Card";
import { RiAddLine, RiSubtractLine } from "@remixicon/react";

export default function USPs() {
  return (
    <Container>
      <Heading
        label="Effortless development"
        title="Made for modern engineering teams"
        description={
          <>
            We've built Inngest to enable every developer to build reliable,
            scalable systems with less effort, more confidence, and fewer
            headaches.
          </>
        }
        className="my-8"
      />
      <p></p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 mx-6 sm:mx-auto">
        <USP
          // title="SDKs for writing reliable, fault-tolerant code"
          title="Write reliable, fault-tolerant code with ease"
          image={{
            src: "/assets/homepage/usp-apis-for-reliability.svg",
            alt: "Inngest SDK APIs",
          }}
        >
          <p>
            Use our SDK primitives to write code that automatically retries on
            error, runs in parallel, sleeps for days, or waits for additional
            input.
          </p>
          <p className="text-balance">
            It's durable execution, built for <em>every developer</em>.
          </p>
        </USP>
        <USP
          title="Flow control for resilient systems"
          image={{
            src: "/assets/homepage/usp-flow-control.svg",
            alt: "Flow control graphic and methods",
          }}
        >
          <p>
            Flow Control is essential for building resilient systems with
            durable execution. Configure <em>how</em> and <em>when</em> you
          </p>
          <p>
            Throttle, multi-tenant concurrency controls, prioritization, rate
            limiting, batching, and more in a line of code.
          </p>
        </USP>
        <USP
          title="Local development that developers love"
          image={{
            src: "/assets/homepage/usp-local-dev.svg",
            alt: "Local development starts with one command",
          }}
        >
          <p>
            Our open source Dev Server spins up an Inngest environment on your
            machine in a single command, with a UI to test and debug functions
            faster and easier then ever before.
          </p>
          <p>No more battling clunky local setups for queues and workers.</p>
        </USP>
      </div>
    </Container>
  );
}

function USP({
  title,
  image: { src, alt },
  children,
}: {
  title: string;
  image: { src: string; alt: string };
  children: React.ReactNode;
}) {
  const [showText, setShowText] = useState(false);

  function onClick() {
    setShowText(!showText);
  }
  return (
    <div className="group cursor-pointer" onClick={onClick}>
      <Card
        variant="subtle"
        className="px-7 py-8 flex flex-col justify-between"
      >
        <div className="relative">
          <img
            src={src}
            alt={alt}
            className={clsx("transition-all", showText && "opacity-30")}
          />
          <div
            className={clsx(
              `flex flex-col gap-4 absolute top-0 left-0 transition-all text-base sm:text-lg text-basis/90`,
              showText ? "opacity-100" : "opacity-0"
            )}
          >
            {children}
          </div>
        </div>
        <div className="flex flex-row items-end">
          <h3 className="font-semibold text-xl sm:text-2xl text-balance">
            {title}
          </h3>
          <button
            className="flex shrink-0 items-center justify-center text-basis group-hover:text-primary-intense transition-all rounded-full border border-subtle group-hover:border-muted h-10 w-10 text-center"
            title="Learn more"
          >
            {showText ? (
              <RiSubtractLine className="h-8" />
            ) : (
              <RiAddLine className="h-8" />
            )}
          </button>
        </div>
      </Card>
    </div>
  );
}
