import { ComposableAbout, type ComposableAboutProps } from "./about";
import { ComposableCaseStudy } from "./content";
import { ComposableHeader } from "./header";
import { BaerskinLogo } from "./header";
import { getRandomPatterns } from "./patterns";

// Interfaces for the complete page structure
interface Requirement {
  label: string;
  description: string;
}

interface QuoteBlock {
  quote: string;
  author: string;
  company: string;
  highlightedWords?: string[];
}

interface NumberedSection {
  number: string;
  text: string;
  highlightedText?: string;
}

type ContentBlock =
  | { type: "paragraph"; content: string; imagePath?: string }
  | {
      type: "requirements";
      requirements: Requirement[];
      imagePath?: string;
    }
  | { type: "quote"; quote: QuoteBlock; imagePath?: string }
  | { type: "label"; content: string; imagePath?: string }
  | { type: "numbered"; numbered: NumberedSection; imagePath?: string }
  | {
      type: "cta";
      ctaText: string;
      ctaDescription?: string;
      imagePath?: string;
    };

interface ContentSectionData {
  id: string;
  title: string;
  header: string;
  contentBlocks: ContentBlock[];
  image?: React.ReactNode;
}

interface ComposableCaseStudyProps {
  intro: {
    title: string;
    logo: React.ReactNode;
  };
  sections: ContentSectionData[];
  footer: {
    title: string;
    subtitle: string;
    ctaText: string;
  };
}

interface InfoBlockData {
  header: string;
  description: string;
}

interface CompanyDetailsData {
  website: {
    prefix: string;
    url: string;
  };
  logo: React.ReactNode;
  description: string;
}

interface BackgroundPatterns {
  left: React.ReactNode;
  right: React.ReactNode;
}

interface ComposableHeaderProps {
  title: string;
  highlightedText?: string;
  subtitle: string;
  backgroundPatterns: BackgroundPatterns;
  infoBlocks: InfoBlockData[];
  companyDetails: CompanyDetailsData;
  backgroundColor?: string;
}

interface CaseStudyPageProps {
  header: ComposableHeaderProps;
  about: ComposableAboutProps;
  content: ComposableCaseStudyProps;
}

// Default Baerskin data
const randomPatterns = getRandomPatterns();
const BAERSKIN_PAGE_DATA: CaseStudyPageProps = {
  header: {
    title: "How BÆRSkin Tactical Supply Co. achieved ",
    highlightedText: "100% event deliverability",
    subtitle: " by switching from Kafka to Inngest.",
    backgroundColor: "#E2E2E2",
    backgroundPatterns: {
      left: <randomPatterns.left />,
      right: <randomPatterns.right />,
    },
    infoBlocks: [
      {
        header: "Case Study:",
        description: "BÆRSkin Tactical Supply Co.",
      },
      {
        header: "Use Cases:",
        description: "Analytics + Operational Data Processing",
      },
      {
        header: "Industry:",
        description: "E-Commerce",
      },
      {
        header: "Employees:",
        description: "20—100",
      },
    ],
    companyDetails: {
      website: {
        prefix: "[www]",
        url: "baerskintactical.com",
      },
      logo: <BaerskinLogo />,
      description:
        "Data-driven e-commerce platform powering 17 brand operating in 19 countries across the world.",
    },
  },
  about: {
    testimonial: {
      quote:
        "We figured out we were losing roughly 6% of events going through Kafka with customers complaining they didn't get their order confirmation emails. But it was super hard to tackle. Now that we switched to Inngest, we're super confident that everything is working as what I'll call tip top shape.",
      highlightedParts: [
        "we were losing roughly 6% of events going through Kafka",
        "Now that we switched to Inngest, we're super confident that everything is working",
      ],
      author: "Gus Fune → CEO",
      title: "CEO",
      company: "[ BÆRSkin Tactical Supply Co. ]",
      image: "/assets/customers/baerskin/gusDither.png",
      imageAlt: "Gus Fune, CEO",
    },
    cta: {
      primaryText: "Interested in Inngest?",
      secondaryText: "Talk to an Inngest product expert today.",
      buttonText: "Get in touch [+]",
    },
    backgroundColor: "stone-800",
  },
  content: {
    intro: {
      title:
        "BÆRSkin Tactical Supply Co. adopted a unique approach to e-commerce, taking data-driven decisions to target niche markets worldwide. This strategy is backed by the choice to build an in-house e-commerce platform, bringing them complete flexibility and control of the shopping experience compared to solutions like Shopify.",
      logo: <BaerskinLogo />,
    },
    sections: [
      {
        id: "first",
        title: "BUILDING IN-HOUSE E-COMMERCE PLATFORM",
        header:
          "BÆRSkin Tactical Supply Co. adopted a unique approach to e-commerce, taking data-driven decisions to target niche markets worldwide. This strategy is backed by the choice to build an in-house e-commerce platform, bringing them complete flexibility and control of the shopping experience compared to solutions like Shopify.",
        contentBlocks: [
          {
            type: "quote",
            quote: {
              author: "Gus Fune → CTO",
              company: "[ BÆRSkin Tactical Supply Co. ]",
              quote:
                "We ended up developing our own E commerce platform in house. So we didn't use Shopify or anything like that because we wantto keep control of a few elements that they don't allow us to controllike checkout",
              highlightedWords: ["control", "checkout"],
            },
          },
          {
            type: "paragraph",
            content:
              "BÆRSkin Tactical Supply Co. is built as a multi-cloud and multi-region event-driven system, composed of analytics systems used internally to make data-driven decisions, as well as operational data processing that powers core e-commerce features, such as order processing and logistics. \n\n In late 2024, Gus and his team started to face issues with their recent Kafka replatforming (migrating an existing application without major rewrites).",
          },
        ],
      },
      {
        id: "second",
        title: "THE KAFKA REPLATFORMING FAILURE: 6% EVENT LOSS",
        header:
          "BÆRSkin Tactical Supply Co. adopted Kafka in late 2023 to power their analytics and order processing systems. As the replatforming progressed, they realized that some events were dropped, resulting in customers' complaints about missing orders.",
        contentBlocks: [
          {
            type: "paragraph",
            content:
              "Events dropped by Kafka, combined with its lack of native production tooling, made it hard for the engineering team to identify the root cause and impact on customers. Facing this challenge, Gus started to research a new technology to replace Kafka, matching the following requirements:",
          },
          {
            type: "requirements",
            requirements: [
              {
                label: "Reliability:",
                description:
                  "Events should be delivered reliably and can be replayed in case of processing issues. Producing and consuming events should be scalable without requiring extra infrastructure work.",
              },
              {
                label: "Event-driven:",
                description:
                  "The researched solution needs to match BÆRSkin Tactical Supply Co.' event-driven architecture.",
              },
              {
                label: "Observability:",
                description:
                  "Events and their associated processing should be easily monitored with metrics and alerts.",
              },
              {
                label: "Monitoring & Recovery tooling:",
                description:
                  "Events should be delivered reliably and can be replayed in case of processing issues. Producing and consuming events should be scalable without requiring extra infrastructure work.",
              },
            ],
          },
          {
            type: "paragraph",
            content:
              "Compared to other solutions like Temporal, Inngest stood out as a promising candidate with the added value of its great DX and Bun support, which is the primary runtime of BÆRSkin Tactical Supply Co.'s codebase.",
          },
        ],
      },
      {
        id: "third",
        title:
          "CHOOSING INNGEST: A RELIABLE EVENT-DRIVEN WORKFLOW ENGINE, COMING WITH ESSENTIAL PRODUCTION TOOLS",
        header:
          "BÆRSkin Tactical Supply Co. adopted a unique approach to e-commerce, taking data-driven decisions to target niche markets worldwide. This strategy is backed by the choice to build an in-house e-commerce platform, bringing them complete flexibility and control of the shopping experience compared to solutions like Shopify.",
        contentBlocks: [
          {
            type: "requirements",
            requirements: [
              {
                label: "Beyond Reliability:",
                description:
                  "( observability / monitoring / recovery tools ) Beyond solving the reliability issues faced with Kafka, replatforming to Inngest brought a set of new advantages in operating their operational data and analytics processing in production. ",
              },
            ],
          },
          {
            type: "quote",
            quote: {
              author: "Gus Fune → CTO",
              company: "[ BÆRSkin Tactical Supply Co. ]",
              quote:
                "The reliable transportation of events and making sure the replayability, being able to monitor how things are going, and catch things before they become a problem. Those are super important for us.",
            },
          },
          {
            type: "label",
            content:
              "Using Inngest, Gus's team got access to ready-to-use monitoring dashboards, production recovery tools such as Replays  [↙]",
            imagePath: "/assets/customers/baerskin/baerskinImage.png",
          },
        ],
      },
      {
        id: "fourth",
        title:
          "Achieving 10x performance improvements on their logistics system",
        header:
          "Once the initial reliability issue was resolved by replatforming to Inngest, Gus and his team began exploring ways to expand Inngest to address other challenges they faced with their logistics system.",
        contentBlocks: [
          {
            type: "paragraph",
            content:
              "BÆRSkin Tactical Supply Co.'s logistics system faced a recurring challenge during Black Friday and Cyber Monday, a well-known challenge for most E-Commerce actors. The large number of orders concentrated during this short period was putting a lot of pressure on their database-based queuing system (utilizing Postgres's SKIP LOCKED design), which failed to process orders and initiate shipments in a reasonable timeframe. \n\n While short-term solutions such as drastically upscaling their infrastructure helped, Gus and his team started a PoC to evaluate the performance of their logistics system once powered by Inngest. Again, the results were there.",
          },
          {
            type: "quote",
            quote: {
              author: "Gus Fune → CTO",
              company: "[ BÆRSkin Tactical Supply Co. ]",
              quote:
                "The preliminary results show that from 40 orders per minute we managed to increase to 500 orders per minute to process in the new system. So this is probably the biggest gain we've seen in the new system.",
            },
          },
        ],
      },
      {
        id: "fifth",
        title: "INNGEST FOR E-COMMERCE",
        header:
          "For BÆRSkin Tactical Supply Co., what started as a replatforming effort to address Kafka reliability issues ultimately evolved into a modernization of their analytical and operational data processing, resulting in significant gains in processing performance (a 10x faster logistics system) and operational productivity (through production tools like Replay).",
        contentBlocks: [
          {
            type: "paragraph",
            content:
              "BÆRSkin Tactical Supply Co.'s logistics system faced a recurring challenge during Black Friday and Cyber Monday, a well-known challenge for most E-Commerce actors. The large number of orders concentrated during this short period was putting a lot of pressure on their database-based queuing system (utilizing Postgres's SKIP LOCKED design), which failed to process orders and initiate shipments in a reasonable timeframe. \n\n Finally, where alternatives like Kafka, AWS SQS, or Temporal require significant investment in infrastructure, monitoring, and production tools, Inngest comes with a fully managed and auto-scaled service that provides essential production monitoring and recovery tools.",
          },
          {
            type: "paragraph",
            content:
              "If you're interested in learning how Inngest can help your team? → Reach out to us to chat with an expert.",
          },
          {
            type: "cta",
            ctaText: "Read more [↗]",
            ctaDescription: "Want to learn more about Inngest for e-commerce?",
          },
        ],
      },
    ],
    footer: {
      title: "Interested in Inngest?",
      subtitle: "Check out other customer success stories",
      ctaText: "Get in touch [+]",
    },
  },
};

// Composable case study page component
function CaseStudyPage({ header, about, content }: CaseStudyPageProps) {
  return (
    <>
      <ComposableHeader {...header} />
      <ComposableAbout {...about} />
      <ComposableCaseStudy {...content} />
    </>
  );
}

// Default export for Baerskin page
export default function BaerskinTacticalPage() {
  return <CaseStudyPage {...BAERSKIN_PAGE_DATA} />;
}

// Export types and components for reuse
export type {
  CaseStudyPageProps,
  ComposableHeaderProps,
  ComposableAboutProps,
  ComposableCaseStudyProps,
  ContentSectionData,
  ContentBlock,
  InfoBlockData,
  CompanyDetailsData,
};
