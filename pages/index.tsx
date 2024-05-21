import type { GetStaticPropsResult } from "next";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import Header from "../shared/Header";
import Hero from "../shared/Home/Hero";
import Logos from "src/shared/Home/Logos";

import UseCases from "src/shared/Home/UseCases";
import Features from "src/shared/Home/Features";
import LocalDev from "../shared/Home/LocalDev";
import SocialCTA from "../shared/Home/SocialCTA";
import Footer from "../shared/Footer";
import Quote from "src/shared/Home/Quote";
import SocialProof from "src/shared/Home/SocialProof";

import PlatformFeatures2 from "src/shared/Home/PlatformFeatures2";
import Flexibility from "src/shared/Home/Flexibility";
import type { PageProps } from "src/shared/types";
import PageBanner from "../shared/legacy/PageBanner";
import { RocketLaunchIcon } from "@heroicons/react/24/outline";

export async function getStaticProps(): Promise<
  GetStaticPropsResult<PageProps>
> {
  return {
    props: {
      designVersion: "2",
      meta: {
        title: "Ship reliable products",
        description:
          "Inngest enables your team to develop durable functions in your current codebase with zero new infrastructure. Develop complex, long-running functions without queues, workers, or additional state management.",
        image: "/assets/homepage/open-graph.png",
      },
    },
  };
}

export function LaunchWeekBanner({ urlRef = "homepage-banner" }) {
  return (
    <PageBanner
      href={`/blog/announcing-funding-from-a16z?ref=${urlRef}`}
      className="mt-px"
    >
      <RocketLaunchIcon className="inline-flex h-7 sm:h-5 mr-1" />
      <span className="shrink">
        We've just raised $6.1M{" "}
        <span className="font-normal inline-flex">
          {" "}
          in new funding led by a16z.
        </span>
      </span>
    </PageBanner>
  );
}

export default function Home() {
  return (
    <div
      className="home font-sans bg-slate-1000"
      style={{
        backgroundImage: `radial-gradient(circle at center -20%, #0e0821 0%, rgba(5, 9, 17, 0) 1500px)`,
        backgroundSize: "100% 1500px",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Header />

      {/* <LaunchWeekBanner /> */}

      <Hero />

      <UseCases />

      {/* <div className="my-24">
        <Quote
          text={`Inngest is an essential partner to Vercel's frontend cloud offering. It extends Vercel's DX and serverless operational model to a notoriously challenging yet crucial part of the stack: backend workflows and asynchronous process coordination.`}
          attribution={{
            name: "Guillermo Rauch",
            title: (
              <span>
                <span className="text-white">▲</span> CEO of Vercel
              </span>
            ),
            avatar: "/assets/about/guillermo-rauch-avatar.jpg",
          }}
        />
      </div> */}

      <div className="my-24">
        <Quote
          text={`I wanted to find a solution that would let us just write the code, not manage the infrastructure around queues, concurrency, retries, error handling, prioritization... I don't think that developers should be even configuring and managing queues themselves in 2024.`}
          attribution={{
            name: "Matthew Drooker",
            title: <span>CTO of SoundCloud</span>,
            logo: "/assets/customers/soundcloud-logo-white-horizontal.svg",
            avatar: "/assets/customers/soundcloud-matthew-drooker.jpg",
          }}
          caseStudy="/customers/soundcloud?ref=homepage"
        />
      </div>

      <Features />

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

      <LocalDev className="mb-24" />

      <div className="mt-32 mb-48">
        <Quote
          text="The DX and code simplicity it brings is unmatched, especially around local development. We're currently working to migrate some of our larger systems over and it’s a joy to see all the complexity it replaces, and with a much better story around partial failures and retries."
          attribution={{
            name: "Justin Cypret",
            title: "Director of Engineering, Zamp",
            logo: "/assets/customers/zamp-logo.svg",
          }}
        />
      </div>

      <PlatformFeatures2 />

      <div className="my-32">
        <Quote
          text={`Configuration with Inngest is really easy. When we read our code base, we can immediately understand what it is and what it does. We are going to be gradually migrating most features to Inngest.`}
          attribution={{
            name: "Johan Preynat",
            title: "Engineering Lead, GitBook",
            avatar: "/assets/customers/gitbook/johan-preynat.jpeg",
          }}
          caseStudy="/customers/gitbook?ref=homepage"
        />
      </div>

      <Flexibility />

      {/* <EnterpriseTrust /> */}

      <div className="my-32">
        <Quote
          text="We switched from our PostgreSQL backed queue to Inngest in less than a day. Their approach is idiomatic with a great developer experience. Inngest allowed us to stop worrying about scalability and stability."
          attribution={{
            name: "Peter Pistorius",
            title: "CEO, Snaplet",
            avatar: "/assets/customers/snaplet-peter-pistorius.png",
          }}
        />
      </div>

      <SocialProof />

      <SocialCTA />

      <Footer />
    </div>
  );
}
