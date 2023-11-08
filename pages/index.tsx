import type { GetStaticPropsResult } from "next";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import Header from "../shared/Header";
import Hero from "../shared/Home/Hero";
import Logos from "src/shared/Home/Logos";

// import SDKOverview from "src/shared/Home/SDKOverview";
import UseCases from "src/shared/Home/UseCases";
import Features from "src/shared/Home/Features";
import LocalDev from "../shared/Home/LocalDev";
import SocialCTA from "../shared/Home/SocialCTA";
import Footer from "../shared/Footer";
import CustomerQuote from "src/shared/Home/CustomerQuote";
import SocialProof from "src/shared/Home/SocialProof";

import GetThingsShipped from "src/shared/Home/GetThingsShipped";
import RunAnywhere from "src/shared/Home/RunAnywhere";
import PlatformFeatures from "src/shared/Home/PlatformFeatures";
import PlatformFeatures2 from "src/shared/Home/PlatformFeatures2";
// import FeatureCallouts from "src/shared/Home/FeatureCallouts";
import Flexibility from "src/shared/Home/Flexibility";
import type { PageProps } from "src/shared/types";
import EnterpriseTrust from "src/shared/Home/EnterpriseTrust";

export async function getStaticProps(): Promise<
  GetStaticPropsResult<PageProps>
> {
  return {
    props: {
      designVersion: "2",
      meta: {
        title: "Build reliable products - Durable workflow engine",
        description:
          "Easily develop serverless workflows in your current codebase, without any new infrastructure. Using Inngest, your entire team can ship reliable products.",
        image: "/assets/homepage/open-graph.png",
      },
    },
  };
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

      <Hero />

      <Logos
        className="my-20 lg:my-36 mb-20 lg:mb-40 xl:mb-52"
        heading="Helping these teams deliver reliable products"
        logos={[
          {
            src: "/assets/customers/tripadvisor.svg",
            name: "TripAdvisor",
            featured: true,
          },
          {
            src: "/assets/customers/resend.svg",
            name: "Resend",
            featured: true,
            scale: 0.8,
          },

          {
            src: "/assets/customers/snaplet-dark.svg",
            name: "Snaplet",
          },
          {
            src: "/assets/customers/productlane.svg",
            name: "Productlane",
            scale: 1.3,
          },
          { src: "/assets/customers/ocoya.svg", name: "Ocoya" },
          { src: "/assets/customers/finta-logo.png?v=1", name: "Finta.io" },
        ]}
        footer={
          <div className="flex items-center">
            <Link
              href="/customers"
              className="mx-auto rounded-md font-medium px-6 py-2 bg-transparent transition-all text-white border border-slate-800 hover:border-slate-600 hover:bg-slate-500/10 whitespace-nowrap"
            >
              Read customer success stories
            </Link>
          </div>
        }
      />

      <UseCases />

      <div className="my-32 lg:my-48">
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
        {/* <CustomerQuote
          quote="We were struggling with the complexities of managing our social media and e-commerce workflows. Thanks to Inngest, we were able to simplify our development process, speed up our time to market, and deliver a better customer experience. Inngest has become an essential tool in our tech stack."
          name="Aivaras Tumas  - CEO @ Ocoya"
          avatar="/assets/customers/ocoya-aivaras-tumas.png"
          className="mx-auto max-w-2xl"
          cta={{
            href: "/customers/ocoya?ref=homepage",
            text: "Read the Case Study",
          }}
        /> */}
      </div>

      <Features />

      <div className="my-32">
        <Quote
          text="The DX and visibility with Inngest is really incredible. We are able to develop functions locally easier and faster that with our previous queue. Also, Inngest's tools give us the visibility to debug issues much quicker than before."
          attribution={{
            name: "Bu Kinoshita",
            title: "Co-founder @ Resend",
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
            title: "Director of Engineer @ Zamp",
            logo: "/assets/customers/zamp-logo.svg",
          }}
        />
      </div>

      <PlatformFeatures2 />

      {/*
        TODO
        - Move dev server callout section to it's own section again - prep for video/animation

        - Add by the numbers section w/ some data points and SLAs
        - Enterprise section for SOC2, SAML, etc.
      */}

      <div className="my-32">
        <Quote
          text="We switched from our PostgreSQL backed queue to Inngest in less than a day. Their approach is idiomatic with a great developer experience. Inngest allowed us to stop worrying about scalability and stability."
          attribution={{
            name: "Peter Pistorius",
            title: "CEO @ Snaplet",
            avatar: "/assets/customers/snaplet-peter-pistorius.png",
          }}
        />
      </div>

      <Flexibility />

      {/* <EnterpriseTrust /> */}

      {/* <GetThingsShipped /> */}

      <div className="my-32">
        <Quote
          text={`I can't stress enough how integral Inngest has been to our operations. It's more than just "battle tested" for us—it's been a game-changer and a cornerstone of our processes.`}
          attribution={{
            name: "Robin Curbelo",
            title: "Engineer @ Niftykit",
            avatar: "/assets/customers/niftykit-robin-curbelo.jpg",
          }}
        />
      </div>

      <SocialProof />

      <SocialCTA />

      <Footer />
    </div>
  );
}

function Quote({
  text,
  attribution: { name, title, avatar, logo },
  caseStudy,
}: {
  text: string;
  attribution: {
    name: string;
    title: React.ReactNode | string;
    avatar?: string;
    logo?: string;
  };
  caseStudy?: string;
}) {
  return (
    <blockquote className="mx-auto max-w-3xl px-8 md:p-16 flex flex-col md:flex-row gap-8 bg-[url(/assets/textures/wave.svg)] bg-cover bg-no-repeat">
      <p className="text-lg leading-7">
        <span className="mr-1 text-2xl leading-3 text-slate-400/80">
          &ldquo;
        </span>
        {text}
        <span className="ml-1 text-2xl leading-3 text-slate-400/80">
          &rdquo;
        </span>
      </p>
      <footer className="min-w-[180px] flex flex-col gap-4">
        {!!avatar && (
          <Image
            src={avatar}
            alt={`Image of ${name}`}
            height="72"
            width="72"
            className="rounded-full h-12 w-12 lg:h-20 lg:w-20"
          />
        )}
        {!!logo && (
          <Image
            src={logo}
            alt={`Image of ${name}`}
            height="72"
            width="128"
            className="h-12 lg:h-20"
          />
        )}
        <cite className="text-slate-300 leading-8 not-italic">
          <span className="text-lg">{name}</span>
          <br />
          <span className="text-sm">{title}</span>
        </cite>
        {!!caseStudy && (
          <Link
            href={caseStudy}
            className="text-sm text-indigo-300 hover:text-white hover:underline decoration-dotted underline-offset-4 decoration-slate-50/30"
          >
            Read the case study →
          </Link>
        )}
      </footer>
    </blockquote>
  );
}
