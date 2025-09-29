import Image from "next/image";
import { ComposableAbout } from "../_shared/ComposableAbout";
import { ComposableCaseStudy } from "../_shared/ComposableCaseStudy";
import { ComposableHeader } from "../_shared/ComposableHeader";
import { Pattern3, Pattern7 } from "../_shared/patterns";

function DayAILogo() {
  return (
    <Image
      src="/assets/customers/day-ai/day-ai-logo.png"
      alt="Day AI"
      width={275}
      height={39}
      className="h-auto w-auto"
    />
  );
}

const pageData = {
  header: {
    title: "How Day AI built a CRM that can reason using Inngest ",
    highlightedText: "built a CRM that can reason",
    subtitle: " using Inngest.",
    backgroundColor: "#fafaf9",
    backgroundPatterns: {
      left: <Pattern3 />,
      right: <Pattern7 />,
    },
    infoBlocks: [
      {
        header: "Case Study:",
        description: "Day AI",
      },
      {
        header: "Use Cases:",
        description: "CRM, AI Agents",
      },
      {
        header: "Industry:",
        description: "SaaS / AI Agents",
      },
      {
        header: "Employees:",
        description: "2-100",
      },
    ],
    companyDetails: {
      website: {
        prefix: "[www]",
        url: "day.ai",
      },
      logo: <DayAILogo />,
      description: "The CRM for AI Native Companies",
    },
  },
  about: {
    testimonial: {
      quote:
        "Day AI is a complex network of LLMs, data processing, and 3rd party services. Every component in the system needs to wake up at the right times, run for long periods of time, and react intelligently to behavior in other components. Inngest is like the nervous system for all of that, it makes things reliable by default so we can focus on building",
      highlightedParts: [
        "complex network of LLMs",
        "it makes things reliable by default",
      ],
      author: "Erik Munson → Founding Engineer",
      title: "Founding Engineer",
      company: "[ Day AI ]",
      image: "/assets/customers/day-ai/eric-dither.png",
      imageAlt: "Erik Munson, Founding Engineer",
    },
    cta: {
      primaryText: "Interested in Inngest?",
      secondaryText: "Talk to an Inngest product expert today.",
      buttonText: "Get in touch [+]",
    },
  },
  content: {
    intro: {
      title:
        "Day AI is a Sequoia-backed startup building a new kind of CRM: an AI-native system of record that you can talk to like your most helpful colleague. Day AI automatically curates a high-resolution, real-time view of your business's ground truth, materialized directly from your customer conversations in platforms like Google Workspace, Zoom, and Slack. \n\n Their founding engineer, Erik Munson, has a 10-year track record working with orchestration at scale at HubSpot and Netflix.",
      logo: <DayAILogo />,
    },
    sections: [
      {
        id: "first",
        title:
          "Integrating with companies' tool suite through Inngest's event-driven architecture",
        header:
          "Day AI's revolutionary take on CRM starts at its first layer — the integration layer.",
        contentBlocks: [
          {
            id: "first-paragraph-1",
            type: "paragraph" as const,
            content:
              "The integration layer powers Day AI's system of record by connecting directly to all the systems where customer conversations happen. This includes productivity software like Google Workspace, Zoom, and Slack, along with third-party services like Recall.ai to record meetings and Mux to process video.",
          },
          {
            id: "first-paragraph-2",
            type: "paragraph" as const,
            content:
              "Technically, this translates into a system handling a large number of webhooks (with spikes during working hours) while interacting with multiple stateful external services:",
            label:
              "Handling webhooks at scale and managing external state with Inngest events [↙]",
            imagePath: "/assets/customers/day-ai/diagram.png",
          },
          {
            id: "first-quote-1",
            type: "quote" as const,
            quote: {
              author: "Max Shaw → Founding Engineer",
              company: "[ Day AI ]",
              quote:
                "Inngest choreographs these services, acting as the orchestration hub that coordinates everything. We use a vendor API for meeting bots that sends a bot to a meeting at a specific time. Inngest handles everything else - processing incoming calendar events, figuring out what to do with the bots, tracking their current state, and more. It's like the nervous system for our entire operation, using our database state and communicating with third-party systems. Everything is ultimately triggered by webhooks from various sources",
            },
          },
          {
            id: "first-quote-2",
            type: "quote" as const,
            quote: {
              author: "Max Shaw → Founding Engineer",
              company: "[ Day AI ]",
              quote:
                "For this part of the system, “wait for events” makes our work much easier because we can start a process with many steps, pause it, and then continue when something happens in another part of the system. We can have one process start work, then wait for a completely different process on another computer to finish its task before continuing, it's like magic!",
              label:
                "This integration system depends significantly on Inngest's event-driven architecture, converting incoming webhooksinto events and coordinating external services through workflow synchronization with awaitable events [↙]",
            },
          },
          {
            id: "first-paragraph-3",
            type: "paragraph" as const,
            content:
              "On top of Inngest's native event-driven support comes its durable component, enabling any workflow to retry and resume from its last checkpoint upon failure. \n\n Erik and his team heavily rely on workflow durability to build complex and long-running workflows which require a carefully ordered and orchestrated approach to ensure reliability, as seen in their meeting recording workflows, which interact with their meeting bot and video providers, along with a constellation of LLM jobs that consume incoming meeting data. \n\n Another Inngest feature that saves Erik and his team's time is Events Replay, which helps them recover from intermittent failures that happen in such systems:",
            label:
              "Day AI's reliability layer: Inngest durable workflows and events replay [↙]",
          },
          {
            id: "first-quote-3",
            type: "quote" as const,
            quote: {
              author: "Max Shaw → Founding Engineer",
              company: "[ Day AI ]",
              quote:
                "Every system eventually has incidents. Issues with webhook processing? Just replay it, and the rest of the system works like magic. What's satisfying about Inngest's replay feature is how ridiculously good it is. Because workflows trigger other workflows through events, you can see exactly where in the chain something broke. You just go to that spot, click replay, and the whole system resumes. That never gets old for me",
            },
          },
        ],
      },
      {
        id: "second",
        title:
          "Tackling the complexity of operating hundreds of workflows with Flow Control",
        header:
          "Day AI's second layer converts incoming data into a comprehensive, structured record system. As customer conversations flow in, LLMs autonomously reason over the new data, relevant existing data, and context about your business processes to decide which records to create and update in the CRM.",
        contentBlocks: [
          {
            id: "second-paragraph-1",
            type: "paragraph" as const,
            content:
              "Once more, Inngest addresses another challenge: handling large volumes of data to process without reaching third-party rate limits, overloading databases, or suffering from the unpredictable system behavior that can arise from using LLM APIs at scale.",
          },
          {
            id: "second-quote-1",
            type: "quote" as const,
            quote: {
              author: "Max Shaw → Founding Engineer",
              company: "[ Day AI ]",
              quote:
                "We had problems with just managing the complexity of the flows. There are so many different things that play off of each other and create unexpected emergent behavior. In a complicated event-driven system, things can take on a life of their own - you get overloaded in one component, or components are spamming each other. A big advantage is being able to debounce, throttle, and set concurrency on different parts of the system. We can have everything flow into one choke point with a debounce, which reduces unpredictability because we know that point will flow in a specific way no matter what gets thrown at it",
            },
            imagePath: "/assets/customers/day-ai/diagram2.png",
          },
          {
            id: "second-label-1",
            type: "label" as const,
            content:
              "Day AI fully utilizes Inngest Flow Control to guarantee their CRM data pipeline functions correctly, regardless of input volume or external disruptions [↙]",
          },
          {
            id: "second-requirements-1",
            type: "requirements" as const,
            requirements: [
              {
                label: "Debouncing:",
                description:
                  "Prevents processing duplicate information and overwhelming downstream components during spikes, saving on LLM costs and speeding up overall processing.",
              },
              {
                label: "Concurrency control:",
                description:
                  "Key to managing 3rd party API rate limits and keeping output data correct by preventing race conditions between competing jobs.",
              },
              {
                label: "Multi-tenancy:",
                description:
                  "Distribute the execution of workflows evenly to prevent situations where a spike of emails or meetings in a single organization slows down the overall user experience.",
              },
            ],
          },
        ],
      },
      {
        id: "third",
        title: "Using Inngest to reliably put AI Agents in users' hands",
        header:
          "Building on their robust context capture and enrichment workflows, Day AI has created AI assistants with distinct identities that users can personalize.",
        contentBlocks: [
          {
            id: "third-paragraph-1",
            type: "paragraph" as const,
            content:
              "These assistants aren't just generic chatbots - they're configurable agents that can be tailored to match your preferred communication style and problem-solving approach. What makes these assistants particularly powerful is their access to Day AI's comprehensive data and tool ecosystem. They can analyze CRM data, draft emails in your style, manage schedules, and even perform regular tasks like sending morning briefings - all running reliably in the background thanks to Inngest's orchestration capabilities.",
            imagePath: "/assets/customers/day-ai/assistants.png",
          },
          {
            id: "third-numbered-1",
            type: "numbered" as const,
            numbered: {
              number: "1",
              text: "Waking up AI workflows reliably -> based on users' prompts",
            },
          },
          {
            id: "third-numbered-2",
            type: "numbered" as const,
            numbered: {
              number: "2",
              text: "Running AI workflows for very long periods -> to perform multiple tool calls and reasoning",
            },
          },
          {
            id: "third-quote-1",
            type: "quote" as const,
            quote: {
              author: "Max Shaw → Founding Engineer",
              company: "[ Day AI ]",
              quote:
                "It means that we can effortlessly have these things running in the background, doing work at the time horizons and level of sophistication that a person would. They can sit there and do stuff without us worrying about the mechanics. That kind of behavior is typically very hard to orchestrate, but for us it was a no-brainer to use Inngest and be done with it",
              label:
                "By leveraging Inngest's event-driven architecture and its durable workflows, Day AI has successfully shipped its first Assistants to users with complete confidence [↙]",
            },
          },
        ],
      },
      {
        id: "fourth",
        title: "Building AI products with Inngest",
        header:
          "Building effective AI products requires a strong foundation of data and agentic workflows. Day AI demonstrates how context engineering—the careful orchestration of data collection, processing, and enrichment—is critical to creating AI systems that provide real value.",
        contentBlocks: [
          {
            id: "fourth-paragraph-1",
            type: "paragraph" as const,
            content:
              "By providing a single platform that handles both the data foundation and AI execution layers, Inngest enables companies to build sophisticated AI products with confidence. Day AI's experience shows how this unified approach simplifies development while ensuring reliability at scale.",
          },
          {
            id: "fourth-paragraph-2",
            type: "paragraph" as const,
            content:
              "Ready to build your own AI products with Inngest? → Book a call with our experts today to learn how we can help you orchestrate reliable, scalable AI workflows for your business.",
          },
          {
            id: "fourth-cta-1",
            type: "cta" as const,
            ctaText: "Read more [↗]",
            ctaDescription: "Check out other customer success stories",
          },
        ],
      },
    ],
    footer: {
      title: "Interested in Inngest?",
      subtitle: "Talk to an Inngest product expert today.",
      ctaText: "Get in touch [+]",
    },
  },
};

export default function DayAIPage() {
  return (
    <>
      <ComposableHeader {...pageData.header} />
      <ComposableAbout {...pageData.about} />
      <ComposableCaseStudy {...pageData.content} />
    </>
  );
}
