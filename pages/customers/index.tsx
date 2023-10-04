import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";

import Header from "src/shared/Header";
import Container from "src/shared/layout/Container";
import Footer from "src/shared/Footer";
import CTACallout from "src/shared/CTACallout";

import Button from "src/shared/legacy/Button";

export async function getStaticProps() {
  return {
    props: {
      designVersion: "2",
      meta: {
        title: "Customers",
        description: "Helping companies from startups to ",
      },
    },
  };
}

const featuredCompanies = [
  {
    src: "/assets/customers/tripadvisor.svg",
    name: "TripAdvisor",
  },
  {
    src: "/assets/customers/resend.svg",
    name: "Resend",
    scale: 0.8,
  },
  {
    src: "/assets/customers/ocoya.svg",
    name: "Ocoya",
    href: "/customers/ocoya",
  },
];

const otherCompanies = [
  {
    src: "/assets/customers/snaplet-dark.svg",
    name: "Snaplet",
    scale: 1.1,
  },
  {
    src: "/assets/customers/productlane.svg",
    name: "Productlane",
    scale: 1.4,
  },
  {
    src: "/assets/customers/firstquadrant.svg",
    name: "FirstQuadrant.ai",
    scale: 1.2,
  },
  {
    src: "/assets/customers/aomni-logo.svg",
    name: "Aomni",
    scale: 1,
  },
  {
    src: "/assets/customers/zamp-logo.svg",
    name: "Zamp",
    scale: 1,
  },
  { src: "/assets/customers/finta-logo.png?v=1", name: "Finta.io" },
  { src: "/assets/customers/secta-labs-logo.svg", name: "Secta.ai" },
  { src: "/assets/customers/devjobs.svg", name: "DevJobs.at", scale: 1.2 },
  { src: "/assets/customers/niftykit.svg", name: "NiftyKit", scale: 1 },
  { src: "/assets/customers/lynq-logo.svg", name: "Lynq.ai", scale: 1 },
  {
    src: "/assets/customers/sliderule-analytics.png",
    name: "SlideRule",
    scale: 1,
  },
  {
    src: "/assets/customers/double-logo.svg",
    name: "Double",
    scale: 1,
  },
  { src: "/assets/customers/tono-logo.png", name: "Tono Health", scale: 0.9 },
  { src: "/assets/customers/yoke-logo.svg", name: "Yoke Team", scale: 0.8 },
  {
    src: "/assets/customers/awaken-tax-logo.png",
    name: "Awaken.tax",
  },
  {
    src: "/assets/customers/florian-works-logo.svg",
    name: "Florian Works",
    scale: 0.3,
  },
];

export default function Customers() {
  return (
    <div className="pt-8">
      <Header />
      <Container className="py-8">
        <div className="my-16 tracking-tight">
          <h1 className="max-w-3xl mx-auto text-center text-5xl font-bold">
            <em>Our</em> customers, <br />
            deliver reliable products, <br />
            for <em>their</em> customers
          </h1>
          <p className="max-w-lg mx-auto my-8 text-slate-400 text-center text-lg">
            From startups to public companies, these customers chose Inngest to
            power their products.
          </p>
        </div>
        <div className="max-w-6xl mx-auto">
          <div className="my-24 grid md:grid-cols-3 gap-12">
            {featuredCompanies.map(({ src, name, href, scale = 1 }, idx) => (
              <div className="px-6 py-24 flex flex-col justify-items-start items-center">
                <Image
                  key={idx}
                  src={src}
                  alt={name}
                  title={name}
                  width={240 * scale}
                  height={120 * scale}
                  className={clsx(
                    "text-white mx-auto width-auto transition-all grayscale hover:grayscale-0",
                    `max-h-[${36 * scale}px]`
                  )}
                />
                {!!href && (
                  <Link
                    href={href}
                    className="mt-8 rounded-md px-3 py-1.5 text-sm bg-transparent transition-all text-white border border-slate-800 hover:border-slate-600 hover:bg-slate-500/10 whitespace-nowrap"
                  >
                    Read the case study →
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 mb-36 grid grid-cols-4 gap-8 gap-y-24">
            {otherCompanies.map(({ src, name, scale = 0.8 }, idx) => (
              <>
                <Image
                  key={idx}
                  src={src}
                  alt={name}
                  title={name}
                  width={120 * scale}
                  height={30 * scale}
                  className={clsx(
                    "text-white m-auto width-auto transition-all grayscale hover:grayscale-0",
                    `max-h-[${36 * scale}px]`
                  )}
                />
              </>
            ))}
          </div>
        </div>

        <CTACallout
          text="Would your engineering team benefit from faster development time and a managed queuing solution?"
          cta={{
            href: "/contact?ref=custoemrs",
            text: "Get in touch",
          }}
        />
      </Container>
      <Footer />
    </div>
  );
}
