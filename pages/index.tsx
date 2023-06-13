import React from "react";
import Header from "../shared/Header";
import Hero from "../shared/Home/Hero";
import Logos from "src/shared/Home/Logos";
import SDKOverview from "src/shared/Home/SDKOverview";

import ShipInHours from "../shared/Home/ShipInHours";
import LocalDev from "../shared/Home/LocalDev";
import OutTheBox from "../shared/Home/OutTheBox";
import FullyManaged from "../shared/Home/FullyManaged";
import SocialCTA from "../shared/Home/SocialCTA";
import Footer from "../shared/Footer";
import CustomerQuote from "src/shared/CustomerQuote";

import Patterns from "src/shared/Home/Patterns";
import GetThingsShipped from "src/shared/Home/GetThingsShipped";

export async function getStaticProps() {
  return {
    props: {
      designVersion: "2",
      meta: {
        title: "Reliable serverless background functions on any platform",
        description:
          "Inngest is an open source platform that enables developers to build amazing products by ensuring serverless functions are reliable, schedulable and event-driven.",
      },
    },
  };
}

export default function Home() {
  return (
    <div className="home font-sans bg-[#050911]">
      <div
        style={{
          backgroundImage: `radial-gradient(63.13% 57.7% at 50% 33.33%, #0F003C 0%, rgba(5, 9, 17, 0) 100%)`,
        }}
      >
        <Header />

        <Hero />
      </div>

      <Logos
        heading="Trusted by teams all over the world"
        logos={[
          { src: "/assets/customers/ocoya.svg", name: "Ocoya" },
          { src: "/assets/customers/snaplet-dark.svg", name: "Snaplet" },
          { src: "/assets/customers/ocoya.svg", name: "Ocoya" },
          { src: "/assets/customers/ocoya.svg", name: "Ocoya" },
          { src: "/assets/customers/ocoya.svg", name: "Ocoya" },
        ]}
      />

      <div
        style={{
          background: `url(/assets/textures/diagonal-cross.svg) no-repeat 0 160%`,
          backgroundSize: "cover",
        }}
      >
        <SDKOverview />

        <Logos
          heading="Use your existing framework (or no framework!)"
          logos={[
            {
              src: "/assets/brand-logos/next-js-white.svg",
              name: "Next.js",
              href: "/docs/sdk/serve?ref=homepage-frameworks#framework-next-js",
            },
            {
              src: "/assets/brand-logos/express-js-white.svg",
              name: "Express.js",
              href: "/docs/sdk/serve?ref=homepage-frameworks#framework-express",
            },
            {
              src: "/assets/brand-logos/redwoodjs-white.svg",
              name: "RedwoodJS",
              href: "/docs/sdk/serve?ref=homepage-frameworks#framework-redwood",
            },
            {
              src: "/assets/brand-logos/remix-white.svg",
              name: "Remix",
              href: "/docs/sdk/serve?ref=homepage-frameworks#framework-remix",
            },
            {
              src: "/assets/brand-logos/deno-white.svg",
              name: "Deno",
              href: "/docs/sdk/serve?ref=homepage-frameworks#framework-fresh-deno",
            },
          ]}
        />
      </div>

      <div className="">
        {/* TODO - background colors and white bar */}
        <LocalDev />
      </div>

      <CustomerQuote
        className="mt-20 md:mt-4 mb-40"
        logo="/assets/customers/ocoya.svg"
        text="At Ocoya, we were struggling with the complexities of managing our
              social media and e-commerce workflows. Thanks to Inngest, we were
              able to simplify our development process, speed up our time to
              market, and deliver a better customer experience. Inngest has
              become an essential tool in our tech stack, enabling us to focus
              on delivering a world-class product to our users."
        cta={{
          href: "/customers/ocoya?ref=homepage",
          text: "Read the case study",
        }}
      />

      <OutTheBox />

      <GetThingsShipped />

      <FullyManaged />

      <Patterns />

      {/* <Roadmap /> */}

      <SocialCTA />

      <Footer />
    </div>
  );
}
