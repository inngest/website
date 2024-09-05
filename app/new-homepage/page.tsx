import { type Metadata } from "next";
import Image from "next/image";
import clsx from "clsx";

import Link from "src/components/Link";
import Command from "src/components/Command";
import { Button } from "src/shared/Button";
import Quote from "src/components/Quote";
import TabContainer from "./TabContainer";
import Container from "./Container";
import HeroScreenshot from "./HeroScreenshot";
import Heading from "./Heading";
import USPs from "./USPs";
import PlatformsLanguages from "./PlatformsLanguages";
import FlowControl from "./FlowControl";
import Enterprise from "./Enterprise";
import Observability from "./Observability";
import LocalDevelopment from "./LocalDevelopment";
import SocialProof from "./SocialProof";
import Community from "./Community";
import { FullWidthCTA } from "src/components/FullWidthCTA";

export const metadata: Metadata = {
  title: "Inngest - The modern platform for shipping fast, reliable code", // TODO - TBD
  description:
    "Inngest enables your team to develop durable functions in your current codebase with zero new infrastructure. Develop complex, long-running functions without queues, workers, or additional state management.",
};

export default function Page() {
  return (
    <div>
      <HeroScreenshot />
      <div className="my-32">
        <Heading label="APIs for all challenges" className="my-8" />
        <TabContainer />
      </div>
      <div className="my-32">
        <PlatformsLanguages />
      </div>
      <div className="my-24">
        <Quote
          text={`I wanted to find a solution that would let us just write the code, not manage the infrastructure around queues, concurrency, retries, error handling, prioritization... I don't think that developers should be even configuring and managing queues themselves in 2024.`}
          attribution={{
            name: "Matthew Drooker",
            title: <span>CTO</span>,
            logo: "/assets/customers/soundcloud-logo-white-horizontal.svg",
            avatar: "/assets/customers/soundcloud-matthew-drooker.jpg",
          }}
          caseStudy="/customers/soundcloud?ref=homepage"
        />
      </div>
      <div className="my-32">
        <USPs />
      </div>
      <div className="my-32">
        <Quote
          text="The DX and visibility with Inngest is really incredible. We are able to develop functions locally easier and faster that with our previous queue. Also, Inngest's tools give us the visibility to debug issues much quicker than before."
          attribution={{
            name: "Bu Kinoshita",
            title: "Co-founder, Resend",
            logo: "/assets/customers/resend.svg",
          }}
          caseStudy="/customers/resend?ref=homepage"
        />
      </div>
      <div className="my-32">
        <FlowControl />
      </div>
      <div className="mt-32">
        <Quote
          text="The DX and code simplicity it brings is unmatched, especially around local development. We're currently working to migrate some of our larger systems over and it’s a joy to see all the complexity it replaces, and with a much better story around partial failures and retries."
          attribution={{
            name: "Justin Cypret",
            title: "Director of Engineering, Zamp",
            avatar: "/assets/customers/zamp-justin-cypret.jpeg",
            logo: "/assets/customers/zamp-logo.svg",
          }}
        />
      </div>
      <div className="my-32">
        <Observability />
      </div>
      <div className="my-32">
        <Quote
          text={`Configuration with Inngest is really easy. When we read our code base, we can immediately understand what it is and what it does. We are going to be gradually migrating most features to Inngest.`}
          attribution={{
            name: "Johan Preynat",
            title: "Engineering Lead, GitBook",
            avatar: "/assets/customers/gitbook/johan-preynat.jpeg",
            logo: "/assets/customers/gitbook-logo-white.svg",
          }}
          caseStudy="/customers/gitbook?ref=homepage"
        />
      </div>
      <div className="my-32">
        <LocalDevelopment />
      </div>
      <div className="my-32">
        <Quote
          text={`Inngest changed how I built TypeScript applications. I can't stress enough how much I love using Inngest. The developer experience is unparalleled.`}
          attribution={{
            name: "Dieter De Mesmaeker",
            title: "CTO, Conveo",
            avatar: "/assets/customers/conveo-dieter-cto.jpeg",
            logo: "/assets/customers/conveo-logo-white.svg",
          }}
        />
      </div>
      <div className="my-32">
        <Enterprise />
      </div>
      <div className="my-32">
        <Quote
          text={`Recently we migrated a lot of our infrastructure to  reduce technical overhead and save costs. One of the key moves was going from GCP Composer (Airflow) to Inngest. This unified our backend and reduced our bill by 50x!!`}
          attribution={{
            name: "Dennis Brotzky",
            title: "CTO, Fey",
            avatar: "/assets/customers/fey/dennis-brotzky.jpg",
            logo: "/assets/customers/fey/fey-icon.svg",
          }}
          caseStudy="/customers/fey?ref=homepage"
        />
      </div>
      <SocialProof />
      <Community />
      <FullWidthCTA
        title="Ready to start building?"
        description="Build more reliable systems with fewer headaches. Get started with Inngest today."
        ctas={[
          {
            href: process.env.NEXT_PUBLIC_SIGNUP_URL,
            text: "Start building for free",
            variant: "primary",
          },
          {
            href: "/contact",
            text: "Get a demo",
            variant: "dark",
          },
        ]}
      />
    </div>
  );
}
