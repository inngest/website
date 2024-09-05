import Image from "next/image";
import NextLink from "next/link";

import Container from "./Container";
import Heading from "./Heading";
import {
  RiArrowRightSLine,
  RiLock2Line,
  RiLineChartFill,
  RiShieldKeyholeLine,
  RiIdCardLine,
  RiHealthBookLine, // replace with DNA in 4.3
} from "@remixicon/react";
import { Button } from "src/shared/Button";
// import Link from "src/components/Link";
import Card from "src/components/Card";

export default function Observability() {
  return (
    <Container>
      <Heading
        label="Observability + Recovery"
        title="Monitor, debug, and recover from issues"
        description={
          <>
            Run in production with confidence with observability and recovery
            tools built into Inngest. Dig into traces to debug errors, monitor
            function and system health, and recovery from incidents with
            build-in tooling.
          </>
        }
        className="my-8"
      />
      <div className="max-w-5xl mx-auto my-16 grid md:grid-cols-3 gap-4">
        <Card wrapperClassName="md:col-span-3" className="p-8">
          <Feature
            title="Debug your functions with traces"
            url="/docs/platform/monitor/inspecting-function-runs"
            img="/assets/homepage/o11y/tracing.png"
            imgSize={{ width: 1149, height: 582 }}
            description="View individual runs at every step of the way to understand why issues are happening and how to reproduce and fix them."
          />
        </Card>
        <Card>
          <Feature
            title="Full observability"
            url="/docs/platform/monitor/observability-metrics"
            img="/assets/homepage/o11y/metrics.svg"
            description="Rapidly diagnose system wide issues with metrics including volume, error rates, backlog and throughput."
          />
        </Card>
        <Card>
          <Feature
            title="Bulk function replay"
            url="/docs/platform/replay"
            img="/assets/homepage/o11y/replay.svg"
            description="Leave dead letter queues in the past. Replay failed or cancelled functions in bulk to get your system back to green."
          />
        </Card>
        <Card>
          <Feature
            title="React to urgent issues"
            url="/docs/guides/pause-functions"
            img="/assets/homepage/o11y/function-actions.png"
            description="Quickly respond to urgent issues by pausing functions or cancelling runs in bulk. Resume and replay to recover."
          />
        </Card>
      </div>
    </Container>
  );
}

const Feature = ({
  title,
  description,
  url,
  img,
  imgSize = { width: 307, height: 140 },
}) => (
  <>
    <Image
      alt={`Screenshot of ${title}`}
      className="rounded-md w-full"
      src={img}
      width={imgSize.width}
      height={imgSize.height}
    />
    <div className="flex flex-col gap-2">
      <h3 className="font-bold mt-4">
        <NextLink
          href={`${url}?ref=homepage-observability`}
          className="flex flex-row gap-2 items-center group hover:underline underline-offset-2 transition-all cursor-pointer"
        >
          {title}{" "}
          <RiArrowRightSLine className="group-hover:translate-x-1.5 relative top-px transition-transform duration-150 " />
        </NextLink>
      </h3>
      <p>{description}</p>
    </div>
  </>
);
