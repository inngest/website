import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";

import Container from "src/shared/layout/Container";
import FooterCallout from "src/shared/Footer/FooterCallout";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";
import CaseStudyCard from "src/shared/CaseStudy/CaseStudyCard";
import Header from "src/components/RedesignedLanding/Header/Header";
import Footer from "src/components/RedesignedLanding/Footer";

export async function getStaticProps() {
  return {
    props: {
      designVersion: "2",
      meta: {
        title: "Customer success stories",
        description:
          "From startups to public companies, these customers chose Inngest to build reliable products.",
      },
    },
  };
}

const caseStudies: {
  href: string;
  logo: string;
  logoScale?: number;
  name: string;
  title: string;
  snippet: React.ReactNode;
  // The use cases or industry for this customer
  tags?: string[];
}[] = [
  {
    href: "/customers/soundcloud",
    logo: "/assets/customers/soundcloud-logo-white-horizontal.svg",
    name: "SoundCloud",
    title: "Streamlining dynamic video generation",
    snippet: "Building scalable video pipelines with Inngest.",
    tags: ["Workflows"],
  },
  {
    href: "/customers/otto",
    logo: "/assets/customers/otto-logo.svg",
    logoScale: 0.8,
    name: "Otto",
    title: "Leveraging multi-tenant concurrency to scale AI workflows",
    snippet:
      "How Otto uses flow control and orchestration to build AI Agents that are as easy as a spreadsheet.",
    tags: ["AI"],
  },
  {
    href: "/customers/baerskin-tactical",
    logo: "/assets/customers/baerskintactical-logo-white.svg",
    name: "BÆRSkin Tactical Supply Co.",
    logoScale: 0.8,
    title:
      "How BÆRSkin Tactical Supply Co. achieved 100% event deliverability by switching from Kafka to Inngest",
    snippet: (
      <>
        "We were losing roughly 6% of events going through Kafka.{" "}
        <strong>
          Now that we switched to Inngest, we're super confident that everything
          is working!
        </strong>
        ."
      </>
    ),
    tags: ["E-commerce"],
  },
  {
    href: "/customers/resend",
    logo: "/assets/customers/resend.svg",
    name: "Resend",
    logoScale: 0.8,
    title: "Scaling a developer email platform with serverless workflows",
    snippet: (
      <>
        "The <strong>DX and visibility</strong> with Inngest is really{" "}
        <em>incredible</em>."
      </>
    ),
    tags: ["Serverless"],
  },
  {
    href: "/customers/windmill",
    logo: "/assets/customers/windmill-logo.svg",
    name: "Windmill",
    logoScale: 0.8,
    title:
      "How Windmill's AI Agent helps manage thousands of employees using Inngest",
    snippet: (
      <>
        How Windmill integrates with 20+ productivity tools to power their AI
        Agent using Inngest.
      </>
    ),
    tags: ["AI"],
  },
  {
    href: "/customers/aomni",
    logo: "/assets/customers/aomni-logo.svg",
    name: "Aomni",
    title: "Productionizing AI-driven sales flows using serverless LLMs",
    snippet:
      "Leveraging Inngest for production-grade complex state management and LLM chaining.",
    tags: ["AI"],
  },
  {
    href: "/customers/gitbook",
    logo: "/assets/customers/gitbook-logo-white.svg",
    name: "GitBook",
    title: "Solving bi-directional data synchronization",
    snippet:
      "How the GitBook team cut sync times from hours to minutes with Inngest's concurrency management.",
    tags: ["Workflows", "Serverless"],
  },
  {
    href: "/customers/megaseo",
    logo: "/assets/customers/megaseo-logo.svg",
    name: "Mega SEO",
    logoScale: 0.6,
    title: "Powering the Future of AI-Driven Content",
    snippet: (
      <>
        "The ability to test complex workflows locally has been a game-changer,{" "}
        <strong>giving us confidence</strong> that our AI-driven processes will
        run smoothly in production."
      </>
    ),
    tags: ["AI"],
  },
  {
    href: "/customers/fey",
    logo: "/assets/customers/fey/fey-icon.svg",
    name: "Fey",
    title: "Orchestrating complex financial data pipelines",
    snippet:
      "50x faster and 50x cheaper. How Fey leverages Inngest in data-intensive processes.",
    tags: ["Workflows", "AI", "Serverless"],
  },
  {
    href: "/customers/ocoya",
    logo: "/assets/customers/ocoya.svg",
    name: "Ocoya",
    title: "Shipping e-commerce import pipelines in record time",
    snippet: (
      <>
        "We were able to <strong>simplify</strong> our development process,{" "}
        <strong>speed up our time to market</strong>, and deliver a better
        customer experience."
      </>
    ),
    tags: ["Serverless"],
  },
  {
    href: "/customers/florian-works",
    logo: "/assets/customers/florian-works-logotype.svg",
    name: "Florian Works",
    title: "Building a mission-critical workflow engine on top of Inngest",
    snippet: (
      <>
        Saved <strong>months of development time</strong> and effort building on
        Inngest's primitives.
      </>
    ),
    tags: ["Workflow Engine"],
  },
];

const featuredCompanies = [
  {
    src: "/assets/customers/tripadvisor.svg",
    name: "TripAdvisor",
    url: "https://www.tripadvisor.com/",
    scale: 1.1,
  },
  {
    src: "/assets/customers/contentful-logo-white.svg",
    name: "Contenful",
    url: "https://www.contentful.com/",
    scale: 1.1,
    type: "company",
  },
  {
    src: "/assets/customers/browser-use-white.svg",
    name: "Browser Use",
    url: "https://browser-use.com/",
    scale: 1.7,
    type: "company",
  },
];

type GridItem = {
  type: "quote" | "company";
  name: string;
  quote?: {
    text: string;
    attribution: {
      name: string;
      title: string;
    };
    avatar: string;
  };
  src?: string;
  url?: string;
  scale?: number;
};

const gridQuotes: GridItem[] = [
  {
    type: "quote",
    name: "Resend",
    quote: {
      text: `The DX and visibility with Inngest is really incredible. We able to develop functions locally easier and faster that with our previous queue. Also, Inngest's tools give us the visibility to debug issues much quicker than before.`,
      attribution: {
        name: "Bu Kinoshita",
        title: "Co-founder",
      },
      avatar: "/assets/customers/resend-bu-kinoshita.jpg",
    },
  },
  {
    type: "quote",
    name: "SoundCloud",
    quote: {
      text: `I wanted to find a solution that would let us just write the code, not manage the infrastructure around queues, concurrency, retries, error handling, prioritization... I don't think that developers should be even configuring and managing queues themselves in 2024.`,
      attribution: {
        name: "Matthew Drooker",
        title: "CTO",
      },
      avatar: "/assets/customers/soundcloud-matthew-drooker.jpg",
    },
  },
  {
    type: "quote",
    name: "Aomni",
    quote: {
      text: `For anyone who is building multi-step AI agents (such as AutoGPT type systems), I highly recommend building it on top of Inngest's job queue orchestration framework, the traceability it provides out of the box is super useful, plus you get timeouts & retries for free.`,
      attribution: {
        name: "David Zhang",
        title: "Founder",
      },
      avatar: "/assets/customers/aomni-david.jpg",
    },
  },
  {
    type: "quote",
    name: "Otto",
    quote: {
      text: `Inngest completely transformed how we handle AI orchestration at Otto. Its intuitive developer experience, built-in multi-tenant concurrency, and flow control allowed us to scale without the complexity of other tools or the need to build custom solutions. What would have taken us a month.`,
      attribution: {
        name: "Sully Omar",
        title: "Co-founder",
      },
      avatar: "/assets/customers/otto-sully.jpg",
    },
  },
  // {
  //   type: "quote",
  //   name: "NiftyKit",
  //   quote: {
  //     text: `I can't stress enough how integral Inngest has been to our operations. It's more than just "battle tested" for us—it's been a game-changer and a cornerstone of our processes.`,
  //     attribution: {
  //       name: "Robin Curbelo",
  //       title: "Engineer",
  //     },
  //     avatar: "/assets/customers/niftykit-robin-curbelo.jpg",
  //   },
  // },
];

const grid: GridItem[] = [
  {
    src: "/assets/customers/gumroad-logo.svg",
    name: "Gumroad",
    url: "https://gumroad.com/",
    scale: 1.4,
    type: "company",
  },

  {
    src: "/assets/customers/documenso-logo-white.svg",
    name: "Documenso",
    url: "https://documenso.com/",
    scale: 1.7,
    type: "company",
  },
  {
    src: "/assets/customers/day-ai-logo.svg",
    name: "Day.ai",
    url: "https://day.ai/",
    scale: 1.2,
    type: "company",
  },
  {
    src: "/assets/customers/11x-logo.svg",
    name: "11x",
    url: "https://11x.ai/",
    scale: 0.9,
    type: "company",
  },
  {
    src: "/assets/customers/leap-logo-white.svg",
    name: "Leap",
    url: "https://tryleap.ai/",
    scale: 1,
    type: "company",
  },
  {
    src: "/assets/customers/howl-logo.svg",
    name: "Howl",
    url: "https://www.planethowl.com/",
    scale: 0.9,
    type: "company",
  },
  {
    src: "/assets/customers/zamp-logo.svg",
    name: "Zamp",
    url: "https://zamp.com/",
    scale: 1,
    type: "company",
  },
  {
    src: "/assets/customers/elba-logo-white.svg",
    name: "Elba",
    url: "https://www.elba.security/",
    scale: 1,
    type: "company",
  },
  {
    src: "/assets/customers/productlane.svg",
    name: "Productlane",
    url: "https://productlane.com/",
    scale: 1.4,
    type: "company",
  },
  {
    src: "/assets/customers/secta-labs-logo.svg",
    name: "Secta.ai",
    url: "https://secta.ai/",
    type: "company",
  },
  {
    src: "/assets/customers/firstquadrant.svg",
    name: "FirstQuadrant.ai",
    url: "https://firstquadrant.ai/",
    scale: 1.2,
    type: "company",
  },
  {
    src: "/assets/customers/devjobs.svg",
    name: "DevJobs.at",
    url: "https://devjobs.at/",
    scale: 1.2,
    type: "company",
  },
  {
    src: "/assets/customers/finta-logo.png?v=1",
    name: "Finta.io",
    url: "https://www.finta.io/",
    type: "company",
  },
  {
    src: "/assets/customers/lynq-logo.svg",
    name: "Lynq.ai",
    url: "https://www.lynq.ai/",
    scale: 1,
    type: "company",
  },
  {
    src: "/assets/customers/niftykit.svg",
    name: "NiftyKit",
    url: "https://niftykit.com/",
    scale: 1,
    type: "company",
  },
  {
    src: "/assets/customers/sliderule-analytics.png",
    name: "SlideRule",
    scale: 1,
    type: "company",
  },
  {
    src: "/assets/customers/double-logo.svg",
    name: "Double",
    scale: 1,
    type: "company",
  },
  // Hide when we don't want a dangling logo at the end
  {
    src: "/assets/customers/tono-logo.png",
    name: "Tono Health",
    scale: 0.9,
    type: "company",
  },

  {
    src: "/assets/customers/awaken-tax-logo.png",
    name: "Awaken.tax",
    type: "company",
  },
];

const gridItems = [...grid];
let idx = [1, 6, 11, 16, 21];
for (const quote of gridQuotes) {
  gridItems.splice(idx.shift()!, 0, quote);
}

export default function Customers() {
  return (
    <div>
      <Header />
      <Container className="py-8">
        <div className="my-12 tracking-tight">
          <h1 className="mx-auto max-w-5xl text-center text-5xl font-semibold">
            <em>Our</em> customers deliver reliable products <br />
            for <em>their</em> customers
          </h1>
          <p className="mx-auto my-8 text-center text-lg text-subtle">
            From startups to public companies, our customers chose Inngest to
            power their products.
          </p>
        </div>
        <div className="mx-auto max-w-6xl">
          <div className="my-20 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
            {caseStudies.map((props, idx) => (
              <CaseStudyCard {...props} key={idx} />
            ))}
          </div>

          <div className="mb-4 mt-20 grid gap-4 md:mb-6 md:grid-cols-3 md:gap-6">
            {featuredCompanies.map(({ src, name, scale = 1, url }, idx) => (
              <div className="group relative flex flex-col items-center justify-items-start rounded-2xl border border-subtle p-6">
                <div className="my-10 flex h-20 items-center md:my-20 md:h-24">
                  <Image
                    key={idx}
                    src={src}
                    alt={name}
                    title={name}
                    width={240 * 0.8 * scale}
                    height={120 * 0.8 * scale}
                    className={clsx(
                      "width-auto mx-auto text-white transition-all",
                      `max-h-[${36 * scale}px]`
                    )}
                  />
                </div>
                {!!url && <VisitWebsite url={url} />}
              </div>
            ))}
          </div>

          <div className="mb-36 mt-4 grid grid-cols-2 gap-4 sm:grid-cols-2 md:mt-6 md:gap-6 lg:grid-cols-3">
            {gridItems.map(({ type, name, ...item }, idx) => {
              if (type === "quote") {
                const { quote } = item;
                if (!quote) {
                  return <></>;
                }
                return (
                  <blockquote className="col-span-2 row-span-2 mx-auto my-8 flex max-w-3xl flex-col gap-8 bg-[url(/assets/textures/wave.svg)] bg-contain bg-center bg-no-repeat px-8 sm:col-span-1">
                    <p className="relative text-lg leading-7">
                      <span className="absolute -left-4 top-1 text-2xl leading-3 text-slate-400/80">
                        &ldquo;
                      </span>
                      {quote.text}
                      <span className="ml-1 text-2xl leading-3 text-slate-400/80">
                        &rdquo;
                      </span>
                    </p>
                    <footer className="flex min-w-[180px] flex-row items-center gap-4">
                      <Image
                        src={quote.avatar}
                        alt={`Image of ${quote.attribution.name}`}
                        height="72"
                        width="72"
                        className="h-12 w-12 rounded-full"
                      />
                      <cite className="not-italic leading-8">
                        <div className="text-base text-basis">
                          {quote.attribution.name}
                        </div>
                        <div className="text-sm text-subtle">
                          {quote.attribution.title} - {name}
                        </div>
                      </cite>
                    </footer>
                  </blockquote>
                );
              }
              const { src, scale = 0.8 } = item;
              return (
                <div className="group relative flex h-full min-h-[148px] items-center rounded-2xl border border-subtle px-6 py-8">
                  {!!src && (
                    <Image
                      key={idx}
                      src={src}
                      alt={name}
                      title={name}
                      width={120 * scale}
                      height={30 * scale}
                      className={clsx(
                        "width-auto m-auto text-white transition-all",
                        `max-h-[${36 * scale}px]`
                      )}
                    />
                  )}
                  {!!item.url && <VisitWebsite url={item.url} />}
                </div>
              );
            })}
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
}

function VisitWebsite({ url }) {
  return (
    <a
      href={url}
      target="_blank"
      className="absolute bottom-2 right-2 hidden flex-row items-center gap-1 rounded-xl  bg-surfaceSubtle px-3 py-1.5 text-xs text-link hover:bg-canvasSubtle group-hover:flex"
    >
      Visit website <ArrowTopRightOnSquareIcon className="h-3" />
    </a>
  );
}
